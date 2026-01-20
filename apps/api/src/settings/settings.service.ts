import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, isNull } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { settings } from '../database/schemas';

@Injectable()
export class SettingsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    const db = this.databaseService.getDb();
    // In a real app, we would filter by current user
    return db.select().from(settings);
  }

  async findOne(key: string) {
    const db = this.databaseService.getDb();
    const [setting] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key));

    if (!setting) {
      // Return null or default if not found
      return null;
    }
    return setting;
  }

  async update(key: string, value: any) {
    const db = this.databaseService.getDb();
    
    // Check if exists
    const existing = await this.findOne(key);

    if (existing) {
      const [updated] = await db
        .update(settings)
        .set({ value, updatedAt: new Date() })
        .where(eq(settings.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new
      const [created] = await db
        .insert(settings)
        .values({
            key,
            value,
            // userId: ... (would need context)
        })
        .returning();
      return created;
    }
  }
}
