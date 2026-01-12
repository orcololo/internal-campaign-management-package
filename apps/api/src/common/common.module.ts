import { Module, Global } from '@nestjs/common';
import { MockAuthService } from './mock-auth.service';
import { ViaCepService } from './services/viacep.service';

/**
 * Common Module
 *
 * Provides shared services like MockAuthService and ViaCepService that are used across multiple modules.
 * Marked as @Global so it's available everywhere without explicit imports.
 */
@Global()
@Module({
  providers: [MockAuthService, ViaCepService],
  exports: [MockAuthService, ViaCepService],
})
export class CommonModule {}
