import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, isNull } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { geofences } from '../database/schemas';
import { MapsService } from '../maps/maps.service';
import { CreateGeofenceDto } from './dto/create-geofence.dto';
import { UpdateGeofenceDto } from './dto/update-geofence.dto';

@Injectable()
export class GeofencesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mapsService: MapsService,
  ) {}

  async create(createGeofenceDto: CreateGeofenceDto) {
    const db = this.databaseService.getDb();

    const values: any = {
      name: createGeofenceDto.name,
      description: createGeofenceDto.description,
      type: createGeofenceDto.type,
      city: createGeofenceDto.city,
      state: createGeofenceDto.state,
      neighborhood: createGeofenceDto.neighborhood,
      color: createGeofenceDto.color,
      tags: createGeofenceDto.tags,
      notes: createGeofenceDto.notes,
    };

    if (createGeofenceDto.type === 'CIRCLE') {
      values.centerLatitude = createGeofenceDto.centerLatitude?.toString();
      values.centerLongitude = createGeofenceDto.centerLongitude?.toString();
      values.radiusKm = createGeofenceDto.radiusKm?.toString();
    } else if (createGeofenceDto.type === 'POLYGON') {
      values.polygon = createGeofenceDto.polygon;
    }

    const [geofence] = await db.insert(geofences).values(values).returning();

    return this.formatGeofence(geofence);
  }

  async findAll() {
    const db = this.databaseService.getDb();

    const results = await db
      .select()
      .from(geofences)
      .where(isNull(geofences.deletedAt))
      .orderBy(geofences.createdAt);

    return results.map(this.formatGeofence);
  }

  async findOne(id: string) {
    const db = this.databaseService.getDb();

    const [geofence] = await db
      .select()
      .from(geofences)
      .where(and(eq(geofences.id, id), isNull(geofences.deletedAt)));

    if (!geofence) {
      throw new NotFoundException(`Geofence with ID ${id} not found`);
    }

    return this.formatGeofence(geofence);
  }

  async update(id: string, updateGeofenceDto: UpdateGeofenceDto) {
    const db = this.databaseService.getDb();

    // Check if exists
    await this.findOne(id);

    const values: any = {
      ...updateGeofenceDto,
      updatedAt: new Date(),
    };

    if (updateGeofenceDto.centerLatitude !== undefined) {
      values.centerLatitude = updateGeofenceDto.centerLatitude.toString();
    }
    if (updateGeofenceDto.centerLongitude !== undefined) {
      values.centerLongitude = updateGeofenceDto.centerLongitude.toString();
    }
    if (updateGeofenceDto.radiusKm !== undefined) {
      values.radiusKm = updateGeofenceDto.radiusKm.toString();
    }

    const [geofence] = await db
      .update(geofences)
      .set(values)
      .where(eq(geofences.id, id))
      .returning();

    return this.formatGeofence(geofence);
  }

  async remove(id: string) {
    const db = this.databaseService.getDb();

    // Check if exists
    await this.findOne(id);

    // Soft delete
    await db.update(geofences).set({ deletedAt: new Date() }).where(eq(geofences.id, id));

    return { message: 'Geofence deleted successfully' };
  }

  /**
   * Check if a point is within a geofence
   */
  async checkPoint(geofenceId: string, latitude: number, longitude: number) {
    const geofence = await this.findOne(geofenceId);

    let isInside = false;

    if (
      geofence.type === 'CIRCLE' &&
      geofence.centerLatitude !== null &&
      geofence.centerLongitude !== null &&
      geofence.radiusKm !== null
    ) {
      isInside = this.mapsService.isPointInCircle(
        latitude,
        longitude,
        geofence.centerLatitude,
        geofence.centerLongitude,
        geofence.radiusKm,
      );
    } else if (geofence.type === 'POLYGON' && geofence.polygon) {
      isInside = this.mapsService.isPointInPolygon(
        latitude,
        longitude,
        geofence.polygon as Array<{ lat: number; lng: number }>,
      );
    }

    return {
      geofenceId: geofence.id,
      geofenceName: geofence.name,
      isInside,
    };
  }

  /**
   * Find all geofences that contain a point
   */
  async findGeofencesContainingPoint(latitude: number, longitude: number) {
    const allGeofences = await this.findAll();
    const containingGeofences = [];

    for (const geofence of allGeofences) {
      let isInside = false;

      if (
        geofence.type === 'CIRCLE' &&
        geofence.centerLatitude !== null &&
        geofence.centerLongitude !== null &&
        geofence.radiusKm !== null
      ) {
        isInside = this.mapsService.isPointInCircle(
          latitude,
          longitude,
          geofence.centerLatitude,
          geofence.centerLongitude,
          geofence.radiusKm,
        );
      } else if (geofence.type === 'POLYGON' && geofence.polygon) {
        isInside = this.mapsService.isPointInPolygon(
          latitude,
          longitude,
          geofence.polygon as Array<{ lat: number; lng: number }>,
        );
      }

      if (isInside) {
        containingGeofences.push(geofence);
      }
    }

    return containingGeofences;
  }

  /**
   * Format geofence data - convert string coordinates back to numbers
   */
  private formatGeofence<T extends Record<string, any>>(
    geofence: T,
  ): T & {
    centerLatitude: number | null;
    centerLongitude: number | null;
    radiusKm: number | null;
  } {
    return {
      ...geofence,
      centerLatitude: geofence.centerLatitude ? parseFloat(geofence.centerLatitude) : null,
      centerLongitude: geofence.centerLongitude ? parseFloat(geofence.centerLongitude) : null,
      radiusKm: geofence.radiusKm ? parseFloat(geofence.radiusKm) : null,
    };
  }
}
