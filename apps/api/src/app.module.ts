import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { VotersModule } from './voters/voters.module';
import { MapsModule } from './maps/maps.module';
import { GeofencesModule } from './geofences/geofences.module';
import { CalendarModule } from './calendar/calendar.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ReportsModule } from './reports/reports.module';
import { AuditModule } from './audit/audit.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CommonModule,
    DatabaseModule,
    MapsModule,
    GeofencesModule,
    VotersModule,
    CalendarModule,
    AnalyticsModule,
    ReportsModule,
    AuditModule,
    NotificationsModule,
    MessagingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
