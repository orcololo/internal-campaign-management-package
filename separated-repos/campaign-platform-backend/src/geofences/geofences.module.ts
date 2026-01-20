import { Module } from '@nestjs/common';
import { GeofencesService } from './geofences.service';
import { GeofencesController } from './geofences.controller';
import { MapsModule } from '../maps/maps.module';

@Module({
  imports: [MapsModule],
  controllers: [GeofencesController],
  providers: [GeofencesService],
  exports: [GeofencesService],
})
export class GeofencesModule {}
