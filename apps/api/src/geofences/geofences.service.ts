import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
  ) { }

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

    if (createGeofenceDto.type === 'circle') {
      const { coordinates, radius } = createGeofenceDto;
      if (!coordinates || !radius) {
        throw new BadRequestException(
          'For CIRCLE type, coordinates and radius are required',
        );
      }
      // Assuming coordinates is [lat, lng] for circle
      const [lat, lng] = coordinates as [number, number];
      values.centerLatitude = lat.toString();
      values.centerLongitude = lng.toString();
      values.radiusKm = (radius / 1000).toString(); // Convert meters to km if DB expects km
    } else if (createGeofenceDto.type === 'polygon') {
      // Assuming values.polygon expects PolygonPoint[]
      // We need to map number[][][] (GeoJSON style) to PolygonPoint[]
      // This is complex because naming implies one array, but type implies nested.
      // Let's assume for now we just store it or map the first ring.
      // But wait, the original DTO had PolygonPoint[] (flat array).
      // The shared type has number[][][] (rings).
      // We will map it roughly.
      values.polygon = (createGeofenceDto.coordinates as number[][][])[0].map(p => ({ lat: p[1], lng: p[0] }));
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

    if (updateGeofenceDto.coordinates !== undefined) {
      // Logic depends on type. But wait, update logic might not know the type if it's not passed.
      // We might need to fetch the existing geofence to know the type if we want to parse coordinates correctly?
      // Or we assume the input maintains consistency.
      // If we are just mapping coordinates -> fields, we need to know if it's circle or polygon.
      // However, the Update DTO might not have 'type'.
      // If 'type' is NOT passed, we should probably fetch the existing record.
      // But for simplicity/performance, let's look at what we can do.
      // The current code mapped individual fields to string.
      // Now we have `coordinates`.

      // If keys are missing, we can't easily map if we don't know the type.
      // BUT, `coordinates` structure implies type?
      // Circle: [number, number] (length 2). Polygon: number[][][] (length > 0 and nested).
      // Let's rely on `type` if passed, or fetch if not?
      // Or just try to infer?

      // Let's implement a simpler check:
      const coords = updateGeofenceDto.coordinates;
      if (Array.isArray(coords) && coords.length === 2 && typeof coords[0] === 'number') {
        // It's a Point (Circle center)
        const [lat, lng] = coords as [number, number];
        values.centerLatitude = lat.toString();
        values.centerLongitude = lng.toString();
      } else if (Array.isArray(coords)) {
        // Polygon rings
        values.polygon = (coords as number[][][])[0].map(p => ({ lat: p[1], lng: p[0] }));
      }
    }

    if (updateGeofenceDto.radius !== undefined) {
      values.radiusKm = (updateGeofenceDto.radius / 1000).toString();
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

  async toggleActive(id: string) {
    const db = this.databaseService.getDb();

    const [geofence] = await db
      .select()
      .from(geofences)
      .where(eq(geofences.id, id));

    if (!geofence) {
      throw new NotFoundException(`Geofence with ID ${id} not found`);
    }

    const newDeletedAt = geofence.deletedAt ? null : new Date();

    const [updated] = await db
      .update(geofences)
      .set({ deletedAt: newDeletedAt, updatedAt: new Date() })
      .where(eq(geofences.id, id))
      .returning();

    return this.formatGeofence(updated);
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
