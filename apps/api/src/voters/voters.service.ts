import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, and, isNull, ilike, or, sql, isNotNull, asc, desc } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { voters } from '../database/schemas';
import { MapsService } from '../maps/maps.service';
import { ViaCepService } from '../common/services/viacep.service';
import { CreateVoterDto } from './dto/create-voter.dto';
import { UpdateVoterDto } from './dto/update-voter.dto';
import { QueryVotersDto } from './dto/query-voters.dto';
import { ImportResult } from './dto/import-voters.dto';
import * as Papa from 'papaparse';

@Injectable()
export class VotersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mapsService: MapsService,
    private readonly viaCepService: ViaCepService,
  ) { }

  async create(createVoterDto: CreateVoterDto) {
    const db = this.databaseService.getDb();

    // Auto-geocode if ZIP code and address number are provided but no coordinates
    if (
      createVoterDto.zipCode &&
      createVoterDto.addressNumber &&
      !createVoterDto.latitude &&
      !createVoterDto.longitude
    ) {
      await this.autoGeocodeFromCep(createVoterDto);
    }

    const values = this.prepareVoterForSave(createVoterDto);

    const [voter] = await db
      .insert(voters)
      .values(values as any)
      .returning();

    return this.formatVoter(voter);
  }

  async findAll(query: QueryVotersDto) {
    const db = this.databaseService.getDb();
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [isNull(voters.deletedAt)];

    // Search by name or CPF
    if (query.search) {
      const searchCondition = or(
        ilike(voters.name, `%${query.search}%`),
        ilike(voters.cpf, `%${query.search}%`),
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    // Location filters
    if (query.city) {
      conditions.push(eq(voters.city, query.city));
    }
    if (query.state) {
      conditions.push(eq(voters.state, query.state));
    }
    if (query.neighborhood) {
      conditions.push(eq(voters.neighborhood, query.neighborhood));
    }

    // Electoral filters
    if (query.electoralZone) {
      conditions.push(eq(voters.electoralZone, query.electoralZone));
    }
    if (query.electoralSection) {
      conditions.push(eq(voters.electoralSection, query.electoralSection));
    }

    // Demographic filters
    if (query.gender) {
      conditions.push(eq(voters.gender, query.gender as any));
    }
    if (query.educationLevel) {
      conditions.push(eq(voters.educationLevel, query.educationLevel as any));
    }
    if (query.incomeLevel) {
      conditions.push(eq(voters.incomeLevel, query.incomeLevel as any));
    }
    if (query.maritalStatus) {
      conditions.push(eq(voters.maritalStatus, query.maritalStatus as any));
    }

    // Political filters
    if (query.supportLevel) {
      conditions.push(eq(voters.supportLevel, query.supportLevel as any));
    }
    if (query.occupation) {
      conditions.push(ilike(voters.occupation, `%${query.occupation}%`));
    }
    if (query.religion) {
      conditions.push(ilike(voters.religion, `%${query.religion}%`));
    }

    // Contact filters
    if (query.hasWhatsapp) {
      conditions.push(eq(voters.hasWhatsapp, query.hasWhatsapp));
    }

    // Determine sort field and order
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    // Map sortBy to actual column
    const sortColumn =
      {
        name: voters.name,
        email: voters.email,
        city: voters.city,
        state: voters.state,
        supportLevel: voters.supportLevel,
        createdAt: voters.createdAt,
        updatedAt: voters.updatedAt,
      }[sortBy] || voters.createdAt;

    // Get total count and paginated results in parallel
    const [countResult, results] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(voters)
        .where(and(...conditions)),
      db
        .select()
        .from(voters)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset)
        .orderBy(sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn)),
    ]);

    const [{ count }] = countResult;

    return {
      data: results.map(this.formatVoter),
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findOne(id: string) {
    const db = this.databaseService.getDb();

    const [voter] = await db
      .select()
      .from(voters)
      .where(and(eq(voters.id, id), isNull(voters.deletedAt)));

    if (!voter) {
      throw new NotFoundException(`Voter with ID ${id} not found`);
    }

    return this.formatVoter(voter);
  }

  async update(id: string, updateVoterDto: UpdateVoterDto) {
    const db = this.databaseService.getDb();

    // Check if voter exists
    await this.findOne(id);

    // Auto-geocode if address information is provided but coordinates are not
    if (
      updateVoterDto.zipCode &&
      updateVoterDto.addressNumber &&
      !updateVoterDto.latitude &&
      !updateVoterDto.longitude
    ) {
      await this.autoGeocodeFromCep(updateVoterDto);
    }

    const values = {
      ...this.prepareVoterForSave(updateVoterDto),
      updatedAt: new Date(),
    };

    const [voter] = await db
      .update(voters)
      .set(values as any)
      .where(eq(voters.id, id))
      .returning();

    return this.formatVoter(voter);
  }

  async remove(id: string) {
    const db = this.databaseService.getDb();

    // Check if voter exists
    await this.findOne(id);

    // Soft delete
    await db
      .update(voters)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(voters.id, id));

    return { message: 'Voter deleted successfully' };
  }

  /**
   * Geocode voter address and update coordinates
   */
  async geocodeVoter(id: string) {
    const voter = await this.findOne(id);

    // Build address string
    const addressParts = [
      voter.address,
      voter.addressNumber,
      voter.neighborhood,
      voter.city,
      voter.state,
      voter.zipCode,
    ].filter(Boolean);

    if (addressParts.length === 0) {
      throw new BadRequestException('Voter has no address to geocode');
    }

    const fullAddress = addressParts.join(', ');
    const geocodingResult = await this.mapsService.geocodeAddress(fullAddress);

    if (!geocodingResult) {
      throw new BadRequestException('Could not geocode address');
    }

    // Update voter with coordinates
    return this.update(id, {
      latitude: geocodingResult.latitude,
      longitude: geocodingResult.longitude,
    });
  }

  /**
   * Find voters near a location (within radius)
   */
  async findNearLocation(latitude: number, longitude: number, radiusKm: number, limit = 50) {
    const db = this.databaseService.getDb();

    // Get all voters with coordinates
    const allVoters = await db
      .select()
      .from(voters)
      .where(
        and(isNull(voters.deletedAt), isNotNull(voters.latitude), isNotNull(voters.longitude)),
      );

    // Filter by distance and calculate distance for each
    const votersWithDistance = allVoters
      .map((voter) => {
        const voterLat = parseFloat(voter.latitude as string);
        const voterLng = parseFloat(voter.longitude as string);
        const distance = this.mapsService.calculateDistance(
          latitude,
          longitude,
          voterLat,
          voterLng,
        );

        return {
          ...this.formatVoter(voter),
          distance,
        };
      })
      .filter((voter) => voter.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    return {
      centerPoint: { latitude, longitude },
      radiusKm,
      total: votersWithDistance.length,
      voters: votersWithDistance,
    };
  }

  /**
   * Find voters within a geofence
   */
  async findInGeofence(
    geofenceType: 'CIRCLE' | 'POLYGON',
    geofenceData: CircleGeofenceData | PolygonGeofenceData,
  ) {
    const db = this.databaseService.getDb();

    // Get all voters with coordinates
    const allVoters = await db
      .select()
      .from(voters)
      .where(
        and(isNull(voters.deletedAt), isNotNull(voters.latitude), isNotNull(voters.longitude)),
      );

    // Filter by geofence
    const votersInGeofence = allVoters.filter((voter) => {
      const voterLat = parseFloat(voter.latitude as string);
      const voterLng = parseFloat(voter.longitude as string);

      if (geofenceType === 'CIRCLE') {
        const circleData = geofenceData as CircleGeofenceData;
        return this.mapsService.isPointInCircle(
          voterLat,
          voterLng,
          circleData.centerLat,
          circleData.centerLng,
          circleData.radiusKm,
        );
      } else if (geofenceType === 'POLYGON') {
        const polygonData = geofenceData as PolygonGeofenceData;
        return this.mapsService.isPointInPolygon(voterLat, voterLng, polygonData.polygon);
      }

      return false;
    });

    return {
      geofenceType,
      total: votersInGeofence.length,
      voters: votersInGeofence.map(this.formatVoter),
    };
  }

  /**
   * Get voters grouped by proximity to multiple locations
   */
  async groupByProximity(
    locations: Array<{ name: string; lat: number; lng: number }>,
    maxDistanceKm = 5,
  ) {
    const db = this.databaseService.getDb();

    // Get all voters with coordinates
    const allVoters = await db
      .select()
      .from(voters)
      .where(
        and(isNull(voters.deletedAt), isNotNull(voters.latitude), isNotNull(voters.longitude)),
      );

    const groupedVoters = locations.map((location) => {
      const nearby = allVoters
        .map((voter) => {
          const voterLat = parseFloat(voter.latitude as string);
          const voterLng = parseFloat(voter.longitude as string);
          const distance = this.mapsService.calculateDistance(
            location.lat,
            location.lng,
            voterLat,
            voterLng,
          );

          return { voter: this.formatVoter(voter), distance };
        })
        .filter((item) => item.distance <= maxDistanceKm)
        .sort((a, b) => a.distance - b.distance);

      return {
        location: location.name,
        coordinates: { lat: location.lat, lng: location.lng },
        count: nearby.length,
        voters: nearby,
      };
    });

    return groupedVoters;
  }

  /**
   * Batch geocode all voters missing coordinates
   */
  async batchGeocodeVoters(limit = 10) {
    const db = this.databaseService.getDb();

    // Find voters without coordinates but with address
    const votersToGeocode = await db
      .select()
      .from(voters)
      .where(and(isNull(voters.deletedAt), isNull(voters.latitude), isNotNull(voters.address)))
      .limit(limit);

    const results = {
      total: votersToGeocode.length,
      success: 0,
      failed: 0,
      details: [] as any[],
    };

    for (const voter of votersToGeocode) {
      try {
        await this.geocodeVoter(voter.id);
        results.success++;
        results.details.push({ id: voter.id, status: 'success' });
      } catch (error) {
        results.failed++;
        results.details.push({
          id: voter.id,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Get voter statistics and analytics
   */
  async getStatistics() {
    const db = this.databaseService.getDb();

    // Get all active voters
    const allVoters = await db.select().from(voters).where(isNull(voters.deletedAt));

    // Calculate statistics
    const stats = {
      total: allVoters.length,

      byGender: this.groupBy(allVoters, 'gender'),

      byEducationLevel: this.groupBy(allVoters, 'educationLevel'),

      byIncomeLevel: this.groupBy(allVoters, 'incomeLevel'),

      byMaritalStatus: this.groupBy(allVoters, 'maritalStatus'),

      bySupportLevel: this.groupBy(allVoters, 'supportLevel'),

      byCity: this.groupBy(allVoters, 'city'),

      byNeighborhood: this.groupBy(allVoters, 'neighborhood'),

      byElectoralZone: this.groupBy(allVoters, 'electoralZone'),

      contact: {
        withEmail: allVoters.filter((v) => v.email).length,
        withPhone: allVoters.filter((v) => v.phone).length,
        withWhatsapp: allVoters.filter((v) => v.hasWhatsapp === 'SIM').length,
      },

      location: {
        withCoordinates: allVoters.filter((v) => v.latitude && v.longitude).length,
        withoutCoordinates: allVoters.filter((v) => !v.latitude || !v.longitude).length,
      },

      age: this.calculateAgeStats(allVoters),

      recentlyAdded: {
        last7Days: allVoters.filter((v) => {
          const daysDiff = (Date.now() - new Date(v.createdAt).getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7;
        }).length,
        last30Days: allVoters.filter((v) => {
          const daysDiff = (Date.now() - new Date(v.createdAt).getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 30;
        }).length,
      },
    };

    return stats;
  }

  /**
   * Helper: Group voters by a field
   */
  private groupBy<T extends Record<string, any>>(
    voters: T[],
    field: keyof T,
  ): Record<string, number> {
    return voters.reduce(
      (acc, voter) => {
        const value = voter[field] || 'NOT_SPECIFIED';
        acc[value as string] = (acc[value as string] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  /**
   * Helper: Calculate age statistics
   */
  private calculateAgeStats<T extends { dateOfBirth?: string | null }>(voters: T[]) {
    const votersWithAge = voters.filter((v) => v.dateOfBirth);

    if (votersWithAge.length === 0) {
      return {
        averageAge: null,
        ageRanges: {},
      };
    }

    const ages = votersWithAge.map((v) => {
      const birthDate = new Date(v.dateOfBirth!);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    });

    const averageAge = Math.round(ages.reduce((a, b) => a + b, 0) / ages.length);

    const ageRanges = {
      '16-24': ages.filter((age) => age >= 16 && age <= 24).length,
      '25-34': ages.filter((age) => age >= 25 && age <= 34).length,
      '35-44': ages.filter((age) => age >= 35 && age <= 44).length,
      '45-59': ages.filter((age) => age >= 45 && age <= 59).length,
      '60+': ages.filter((age) => age >= 60).length,
    };

    return {
      averageAge,
      ageRanges,
      withAgeData: votersWithAge.length,
    };
  }

  /**
   * Bulk delete voters (soft delete)
   */
  async bulkDelete(ids: string[]) {
    const db = this.databaseService.getDb();

    const result = {
      requested: ids.length,
      deleted: 0,
      notFound: [] as string[],
    };

    for (const id of ids) {
      try {
        const [voter] = await db
          .select()
          .from(voters)
          .where(and(eq(voters.id, id), isNull(voters.deletedAt)));

        if (!voter) {
          result.notFound.push(id);
          continue;
        }

        await db.update(voters).set({ deletedAt: new Date() }).where(eq(voters.id, id));

        result.deleted++;
      } catch (error) {
        result.notFound.push(id);
      }
    }

    return result;
  }

  /**
   * Bulk update voters
   */
  async bulkUpdate(updates: Array<{ id: string; data: Partial<UpdateVoterDto> }>) {
    const db = this.databaseService.getDb();

    const result = {
      requested: updates.length,
      updated: 0,
      failed: [] as Array<{ id: string; error: string }>,
    };

    for (const update of updates) {
      try {
        // Check if voter exists
        const [voter] = await db
          .select()
          .from(voters)
          .where(and(eq(voters.id, update.id), isNull(voters.deletedAt)));

        if (!voter) {
          result.failed.push({ id: update.id, error: 'Voter not found' });
          continue;
        }

        const values = {
          ...this.prepareVoterForSave(update.data),
          updatedAt: new Date(),
        };

        await db
          .update(voters)
          .set(values as any)
          .where(eq(voters.id, update.id));

        result.updated++;
      } catch (error) {
        result.failed.push({
          id: update.id,
          error: error.message || 'Unknown error',
        });
      }
    }

    return result;
  }

  /**
   * Import voters from CSV file
   */
  async importFromCsv(
    csvContent: string,
    skipDuplicates = true,
    autoGeocode = false,
  ): Promise<ImportResult> {
    const db = this.databaseService.getDb();

    const result: ImportResult = {
      total: 0,
      imported: 0,
      skipped: 0,
      failed: 0,
      errors: [],
    };

    // Parse CSV
    const parsed = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Normalize header names
        const headerMap: Record<string, string> = {
          nome: 'name',
          'nome completo': 'name',
          cpf: 'cpf',
          'data de nascimento': 'dateOfBirth',
          data_nascimento: 'dateOfBirth',
          sexo: 'gender',
          genero: 'gender',
          telefone: 'phone',
          celular: 'phone',
          whatsapp: 'whatsapp',
          email: 'email',
          'e-mail': 'email',
          endereco: 'address',
          endereço: 'address',
          numero: 'addressNumber',
          número: 'addressNumber',
          complemento: 'addressComplement',
          bairro: 'neighborhood',
          cidade: 'city',
          estado: 'state',
          uf: 'state',
          cep: 'zipCode',
          latitude: 'latitude',
          longitude: 'longitude',
          'titulo eleitoral': 'electoralTitle',
          titulo: 'electoralTitle',
          zona: 'electoralZone',
          'zona eleitoral': 'electoralZone',
          secao: 'electoralSection',
          seção: 'electoralSection',
          'local de votacao': 'votingLocation',
          'local de votação': 'votingLocation',
          escolaridade: 'educationLevel',
          profissao: 'occupation',
          profissão: 'occupation',
          ocupacao: 'occupation',
          ocupação: 'occupation',
          renda: 'incomeLevel',
          'estado civil': 'maritalStatus',
          religiao: 'religion',
          religião: 'religion',
          etnia: 'ethnicity',
          facebook: 'facebook',
          instagram: 'instagram',
          twitter: 'twitter',
          'nivel de apoio': 'supportLevel',
          'nível de apoio': 'supportLevel',
          apoio: 'supportLevel',
          partido: 'politicalParty',
          'partido politico': 'politicalParty',
          'histórico de votação': 'votingHistory',
          historico: 'votingHistory',
          'membros familia': 'familyMembers',
          'membros da família': 'familyMembers',
          'tem whatsapp': 'hasWhatsapp',
          'contato preferido': 'preferredContact',
          notas: 'notes',
          observacoes: 'notes',
          observações: 'notes',
          tags: 'tags',
        };

        const normalized = header.toLowerCase().trim();
        return headerMap[normalized] || header;
      },
    });

    if (parsed.errors.length > 0) {
      throw new BadRequestException(`CSV parsing failed: ${parsed.errors[0].message}`);
    }

    result.total = parsed.data.length;

    // Process each row
    for (let i = 0; i < parsed.data.length; i++) {
      const row = parsed.data[i] as any;

      try {
        // Skip if name is missing
        if (!row.name || row.name.trim() === '') {
          result.skipped++;
          result.errors.push({
            row: i + 1,
            data: row,
            error: 'Name is required',
          });
          continue;
        }

        // Check for duplicate CPF if skipDuplicates is true
        if (skipDuplicates && row.cpf) {
          const [existing] = await db
            .select()
            .from(voters)
            .where(and(eq(voters.cpf, row.cpf), isNull(voters.deletedAt)))
            .limit(1);

          if (existing) {
            result.skipped++;
            result.errors.push({
              row: i + 1,
              data: row,
              error: `Duplicate CPF: ${row.cpf}`,
            });
            continue;
          }
        }

        // Map CSV row to CreateVoterDto
        const voterDto: Partial<CreateVoterDto> = {
          name: row.name?.trim(),
          cpf: row.cpf?.trim() || undefined,
          dateOfBirth: row.dateOfBirth || undefined,
          gender: this.mapGender(row.gender),
          phone: row.phone?.trim() || undefined,
          whatsapp: row.whatsapp?.trim() || undefined,
          email: row.email?.trim() || undefined,
          address: row.address?.trim() || undefined,
          addressNumber: row.addressNumber?.trim() || undefined,
          addressComplement: row.addressComplement?.trim() || undefined,
          neighborhood: row.neighborhood?.trim() || undefined,
          city: row.city?.trim() || undefined,
          state: row.state?.trim().toUpperCase() || undefined,
          zipCode: row.zipCode?.trim() || undefined,
          latitude: row.latitude ? parseFloat(row.latitude) : undefined,
          longitude: row.longitude ? parseFloat(row.longitude) : undefined,
          electoralTitle: row.electoralTitle?.trim() || undefined,
          electoralZone: row.electoralZone?.trim() || undefined,
          electoralSection: row.electoralSection?.trim() || undefined,
          votingLocation: row.votingLocation?.trim() || undefined,
          educationLevel: this.mapEducationLevel(row.educationLevel),
          occupation: row.occupation?.trim() || undefined,
          incomeLevel: this.mapIncomeLevel(row.incomeLevel),
          maritalStatus: this.mapMaritalStatus(row.maritalStatus),
          religion: row.religion?.trim() || undefined,
          ethnicity: row.ethnicity?.trim() || undefined,
          facebook: row.facebook?.trim() || undefined,
          instagram: row.instagram?.trim() || undefined,
          twitter: row.twitter?.trim() || undefined,
          supportLevel: this.mapSupportLevel(row.supportLevel),
          politicalParty: row.politicalParty?.trim() || undefined,
          votingHistory: row.votingHistory?.trim() || undefined,
          familyMembers: row.familyMembers ? parseInt(row.familyMembers) : undefined,
          hasWhatsapp: row.hasWhatsapp?.toUpperCase() === 'SIM',
          preferredContact: row.preferredContact?.toUpperCase() || undefined,
          notes: row.notes?.trim() || undefined,
          tags: row.tags?.trim() || undefined,
        };

        // Create voter
        await this.create(voterDto as CreateVoterDto);
        result.imported++;

        // Auto-geocode if requested and address is present
        if (autoGeocode && voterDto.address) {
          try {
            // This will be done asynchronously after import
            // For now, just log it
          } catch (geocodeError) {
            // Ignore geocoding errors during import
          }
        }
      } catch (error) {
        result.failed++;
        result.errors.push({
          row: i + 1,
          data: row,
          error: error.message || 'Unknown error',
        });
      }
    }

    return result;
  }

  /**
   * Export voters to CSV format
   */
  async exportToCsv(query: QueryVotersDto): Promise<string> {
    // Get all voters matching query (without pagination)
    const { data } = await this.findAll({ ...query, limit: 10000, page: 1 });

    // Convert to CSV
    const csv = Papa.unparse(data, {
      header: true,
      columns: [
        'id',
        'name',
        'cpf',
        'dateOfBirth',
        'gender',
        'phone',
        'whatsapp',
        'email',
        'address',
        'addressNumber',
        'addressComplement',
        'neighborhood',
        'city',
        'state',
        'zipCode',
        'latitude',
        'longitude',
        'electoralTitle',
        'electoralZone',
        'electoralSection',
        'votingLocation',
        'educationLevel',
        'occupation',
        'incomeLevel',
        'maritalStatus',
        'religion',
        'ethnicity',
        'supportLevel',
        'politicalParty',
        'hasWhatsapp',
        'preferredContact',
        'notes',
        'tags',
      ],
    });

    return csv;
  }

  // Helper methods for mapping CSV values to enum values
  private mapGender(value?: string): string | undefined {
    if (!value) return undefined;
    const normalized = value.toUpperCase().trim();
    const mapping: Record<string, string> = {
      M: 'MASCULINO',
      MASCULINO: 'MASCULINO',
      MALE: 'MASCULINO',
      F: 'FEMININO',
      FEMININO: 'FEMININO',
      FEMALE: 'FEMININO',
      OUTRO: 'OUTRO',
      OTHER: 'OUTRO',
    };
    return mapping[normalized] || 'NAO_INFORMADO';
  }

  private mapEducationLevel(value?: string): string | undefined {
    if (!value) return undefined;
    const normalized = value.toUpperCase().trim();
    const mapping: Record<string, string> = {
      'FUNDAMENTAL INCOMPLETO': 'FUNDAMENTAL_INCOMPLETO',
      'FUNDAMENTAL COMPLETO': 'FUNDAMENTAL_COMPLETO',
      'MEDIO INCOMPLETO': 'MEDIO_INCOMPLETO',
      'MEDIO COMPLETO': 'MEDIO_COMPLETO',
      'SUPERIOR INCOMPLETO': 'SUPERIOR_INCOMPLETO',
      'SUPERIOR COMPLETO': 'SUPERIOR_COMPLETO',
      'POS GRADUACAO': 'POS_GRADUACAO',
      'PÓS GRADUAÇÃO': 'POS_GRADUACAO',
    };
    return mapping[normalized] || 'NAO_INFORMADO';
  }

  private mapIncomeLevel(value?: string): string | undefined {
    if (!value) return undefined;
    const normalized = value.toUpperCase().trim();
    const mapping: Record<string, string> = {
      'ATE 1 SALARIO': 'ATE_1_SALARIO',
      'DE 1 A 2 SALARIOS': 'DE_1_A_2_SALARIOS',
      'DE 2 A 5 SALARIOS': 'DE_2_A_5_SALARIOS',
      'DE 5 A 10 SALARIOS': 'DE_5_A_10_SALARIOS',
      'ACIMA 10 SALARIOS': 'ACIMA_10_SALARIOS',
    };
    return mapping[normalized] || 'NAO_INFORMADO';
  }

  private mapMaritalStatus(value?: string): string | undefined {
    if (!value) return undefined;
    const normalized = value.toUpperCase().trim();
    const mapping: Record<string, string> = {
      SOLTEIRO: 'SOLTEIRO',
      CASADO: 'CASADO',
      DIVORCIADO: 'DIVORCIADO',
      VIUVO: 'VIUVO',
      VIÚVO: 'VIUVO',
      'UNIAO ESTAVEL': 'UNIAO_ESTAVEL',
      'UNIÃO ESTÁVEL': 'UNIAO_ESTAVEL',
    };
    return mapping[normalized] || 'NAO_INFORMADO';
  }

  private mapSupportLevel(value?: string): string | undefined {
    if (!value) return undefined;
    const normalized = value.toUpperCase().trim();
    const mapping: Record<string, string> = {
      'MUITO FAVORAVEL': 'MUITO_FAVORAVEL',
      'MUITO FAVORÁVEL': 'MUITO_FAVORAVEL',
      FAVORAVEL: 'FAVORAVEL',
      FAVORÁVEL: 'FAVORAVEL',
      NEUTRO: 'NEUTRO',
      DESFAVORAVEL: 'DESFAVORAVEL',
      DESFAVORÁVEL: 'DESFAVORAVEL',
      'MUITO DESFAVORAVEL': 'MUITO_DESFAVORAVEL',
      'MUITO DESFAVORÁVEL': 'MUITO_DESFAVORAVEL',
    };
    return mapping[normalized] || 'NAO_DEFINIDO';
  }

  /**
   * Format voter data - convert string coordinates back to numbers
   */
  private formatVoter<T extends Record<string, any>>(voter: T): any {
    // Parse JSON fields
    const parseJsonField = (field: any): any => {
      if (!field) return null;
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return field;
        }
      }
      return field;
    };

    return {
      ...voter,
      // Convert numeric coordinates to numbers
      latitude: voter.latitude ? parseFloat(voter.latitude) : null,
      longitude: voter.longitude ? parseFloat(voter.longitude) : null,
      // Keep 'SIM'/'NAO' as strings - frontend will handle conversion if needed
      // Parse JSON text fields
      tags: parseJsonField(voter.tags),
      topIssues: parseJsonField(voter.topIssues),
      issuePositions: parseJsonField(voter.issuePositions),
      eventAttendance: parseJsonField(voter.eventAttendance),
      donationHistory: parseJsonField(voter.donationHistory),
      seasonalActivity: parseJsonField(voter.seasonalActivity),
      contentPreference: parseJsonField(voter.contentPreference),
      bestContactDay: parseJsonField(voter.bestContactDay),
    };
  }

  /**
   * Auto-geocode voter address using ViaCEP and Google Maps
   * Mutates the DTO to add address details and coordinates
   */
  private async autoGeocodeFromCep(dto: CreateVoterDto | UpdateVoterDto): Promise<void> {
    if (!dto.zipCode) return;

    try {
      // Get address data from ViaCEP
      const viaCepData = await this.viaCepService.getAddressFromCep(dto.zipCode);

      if (!viaCepData) {
        console.log(`[AutoGeocode] ViaCEP data not found for CEP: ${dto.zipCode}`);
        return;
      }

      // Fill in address details from ViaCEP if not provided
      if (!dto.address && viaCepData.logradouro) {
        dto.address = viaCepData.logradouro;
      }
      if (!dto.neighborhood && viaCepData.bairro) {
        dto.neighborhood = viaCepData.bairro;
      }
      if (!dto.city && viaCepData.localidade) {
        dto.city = viaCepData.localidade;
      }
      if (!dto.state && viaCepData.uf) {
        dto.state = viaCepData.uf;
      }

      // Build full address for geocoding
      const fullAddress = this.viaCepService.buildFullAddress(viaCepData, dto.addressNumber);

      console.log(`[AutoGeocode] Geocoding address: ${fullAddress}`);

      // Get coordinates from Google Maps
      const geocodeResult = await this.mapsService.geocodeAddress(fullAddress);

      if (geocodeResult) {
        dto.latitude = geocodeResult.latitude;
        dto.longitude = geocodeResult.longitude;
        console.log(
          `[AutoGeocode] Coordinates obtained: ${geocodeResult.latitude}, ${geocodeResult.longitude}`,
        );
      } else {
        console.log(`[AutoGeocode] Failed to geocode address: ${fullAddress}`);
      }
    } catch (error) {
      console.error('[AutoGeocode] Error during auto-geocoding:', error.message);
      // Don't throw - geocoding failure shouldn't block voter creation
    }
  }

  // ==================== REFERRAL SYSTEM ====================

  /**
   * Generate or retrieve referral code for a voter
   */
  async generateReferralCode(voterId: string): Promise<string> {
    const db = this.databaseService.getDb();
    const voter = await this.findOne(voterId);

    // If voter already has a code, return it
    if (voter.referralCode) {
      return voter.referralCode;
    }

    // Generate new unique code
    const code = await this.createUniqueReferralCode(voter.name);

    // Update voter with new code
    await db.update(voters).set({ referralCode: code }).where(eq(voters.id, voterId));

    return code;
  }

  /**
   * Get list of voters referred by this voter
   */
  async getReferrals(voterId: string, page = 1, perPage = 20, supportLevel?: string) {
    const db = this.databaseService.getDb();
    const offset = (page - 1) * perPage;

    // Build conditions
    const conditions = [eq(voters.referredBy, voterId), isNull(voters.deletedAt)];

    if (supportLevel) {
      conditions.push(eq(voters.supportLevel, supportLevel as any));
    }

    // Get referrals
    const referrals = await db
      .select()
      .from(voters)
      .where(and(...conditions))
      .limit(perPage)
      .offset(offset)
      .orderBy(voters.referralDate);

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(voters)
      .where(and(...conditions));

    return {
      data: referrals.map((v) => this.formatVoter(v)),
      meta: {
        total: count,
        page,
        perPage,
        totalPages: Math.ceil(count / perPage),
      },
    };
  }

  /**
   * Get referral statistics for a voter
   */
  async getReferralStats(voterId: string) {
    const db = this.databaseService.getDb();

    // Get all referrals (including deleted for total count)
    const allReferrals = await db.select().from(voters).where(eq(voters.referredBy, voterId));

    // Get active referrals only
    const activeReferrals = allReferrals.filter((r) => !r.deletedAt);

    // Calculate this month's referrals
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthReferrals = activeReferrals.filter(
      (r) => r.referralDate && new Date(r.referralDate) >= firstDayOfMonth,
    );

    // Group by support level
    const byLevel = activeReferrals.reduce(
      (acc, r) => {
        const level = r.supportLevel || 'NAO_DEFINIDO';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total: allReferrals.length,
      active: activeReferrals.length,
      thisMonth: thisMonthReferrals.length,
      byLevel,
    };
  }

  /**
   * Register a new voter via referral code
   */
  async registerReferral(referralCode: string, data: any) {
    const db = this.databaseService.getDb();

    // Find the referrer by code
    const [referrer] = await db
      .select()
      .from(voters)
      .where(and(eq(voters.referralCode, referralCode), isNull(voters.deletedAt)));

    if (!referrer) {
      throw new NotFoundException('Invalid referral code');
    }

    // Generate referral code for new voter
    const newReferralCode = await this.createUniqueReferralCode(data.name);

    // Create new voter with referral information
    const [newVoter] = await db
      .insert(voters)
      .values({
        ...data,
        referralCode: newReferralCode,
        referredBy: referrer.id,
        referralDate: new Date(),
      } as any)
      .returning();

    // Increment referrer's count
    await db
      .update(voters)
      .set({
        referredVoters: sql`COALESCE(${voters.referredVoters}, 0) + 1`,
      })
      .where(eq(voters.id, referrer.id));

    return {
      ...this.formatVoter(newVoter),
      referrerName: referrer.name,
    };
  }

  /**
   * Create a unique referral code
   * Format: FIRSTNAME-LASTNAME-RANDOM (e.g., JOAO-SILVA-AB12CD)
   */
  private async createUniqueReferralCode(name: string): Promise<string> {
    const db = this.databaseService.getDb();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      // Create slug from name
      const slug = name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .substring(0, 15)
        .toUpperCase()
        .replace(/[^A-Z\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Generate random suffix (6 characters)
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      const code = `${slug}-${random}`;

      // Check if code already exists
      const [existing] = await db
        .select({ id: voters.id })
        .from(voters)
        .where(eq(voters.referralCode, code))
        .limit(1);

      if (!existing) {
        return code;
      }

      attempts++;
    }

    // Fallback: use UUID if all attempts failed
    const uuid = crypto.randomUUID().substring(0, 12).toUpperCase();
    return `USER-${uuid}`;
  }

  /**
   * Prepare voter data for saving to database
   * Handles stringification of JSON fields and boolean conversions
   */
  private prepareVoterForSave(
    dto: Partial<CreateVoterDto> | Partial<UpdateVoterDto>,
  ): Record<string, any> {
    const values: any = { ...dto };

    // Convert numeric coordinates to strings (schema expectation)
    if (values.latitude !== undefined) values.latitude = values.latitude?.toString() ?? null;
    if (values.longitude !== undefined) values.longitude = values.longitude?.toString() ?? null;

    // Convert booleans to SIM/NAO
    if (typeof values.hasWhatsapp === 'boolean') {
      values.hasWhatsapp = values.hasWhatsapp ? 'SIM' : 'NAO';
    }
    if (typeof values.vehicleOwnership === 'boolean') {
      values.vehicleOwnership = values.vehicleOwnership ? 'SIM' : 'NAO';
    }

    // Stringify JSON fields if they are objects/arrays
    const jsonFields = [
      'tags',
      'topIssues',
      'issuePositions',
      'seasonalActivity',
      'eventAttendance',
      'donationHistory',
      'contentPreference',
      'bestContactDay',
    ];

    for (const field of jsonFields) {
      if (values[field] && typeof values[field] !== 'string') {
        values[field] = JSON.stringify(values[field]);
      }
    }

    return values;
  }
}

interface CircleGeofenceData {
  centerLat: number;
  centerLng: number;
  radiusKm: number;
}

interface PolygonGeofenceData {
  polygon: Array<{ lat: number; lng: number }>;
}
