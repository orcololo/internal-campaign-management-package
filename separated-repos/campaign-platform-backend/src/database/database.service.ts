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
      ssl: {
        rejectUnauthorized: false, // Required for Supabase
      },
    });

    this.db = drizzle(this.client);

    console.log('✅ Database connected successfully');
  }

  async onModuleDestroy() {
    await this.client.end();
    console.log('🔌 Database connection closed');
  }

  private getConnectionString(): string {
    // First, try to use the full connection URL (recommended for Supabase)
    const connectionUrl = this.configService.get('POSTGRES_URL');

    if (connectionUrl) {
      console.log('📡 Using POSTGRES_URL connection string');
      return connectionUrl;
    }

    // Fallback to individual connection parameters
    const host = this.configService.get('POSTGRES_HOST', 'localhost');
    const port = this.configService.get('DB_PORT', '5432');
    const user = this.configService.get('DB_USER', 'postgres');
    const password = this.configService.get('POSTGRES_PASSWORD', 'postgres');
    const database = this.configService.get('POSTGRES_DATABASE', 'postgres');

    console.log('📡 Using individual connection parameters');
    return `postgres://${user}:${password}@${host}:${port}/${database}?sslmode=require`;
  }

  getDb(): PostgresJsDatabase {
    return this.db;
  }
}
