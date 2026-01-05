import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { VotersModule } from './voters/voters.module';
import { MapsModule } from './maps/maps.module';
import { GeofencesModule } from './geofences/geofences.module';
import { CalendarModule } from './calendar/calendar.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    MapsModule,
    GeofencesModule,
    VotersModule,
    CalendarModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
