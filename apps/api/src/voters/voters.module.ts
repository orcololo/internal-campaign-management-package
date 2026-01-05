import { Module } from '@nestjs/common';
import { VotersService } from './voters.service';
import { VotersController } from './voters.controller';
import { MapsModule } from '../maps/maps.module';

@Module({
  imports: [MapsModule],
  controllers: [VotersController],
  providers: [VotersService],
  exports: [VotersService],
})
export class VotersModule {}
