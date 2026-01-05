import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';

// Use require for CommonJS module
const postgres = require('postgres');

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: any;
  public db: PostgresJsDatabase;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const connectionString = this.getConnectionString();

    this.client = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    this.db = drizzle(this.client);

    console.log('✅ Database connected successfully');
  }

  async onModuleDestroy() {
    await this.client.end();
    console.log('🔌 Database connection closed');
  }

  private getConnectionString(): string {
    const host = this.configService.get('DB_HOST', 'localhost');
    const port = this.configService.get('DB_PORT', '5432');
    const user = this.configService.get('DB_USER', 'postgres');
    const password = this.configService.get('DB_PASSWORD', 'postgres');
    const database = this.configService.get('DB_NAME', 'campaign_platform');

    return `postgres://${user}:${password}@${host}:${port}/${database}`;
  }

  getDb(): PostgresJsDatabase {
    return this.db;
  }
}
