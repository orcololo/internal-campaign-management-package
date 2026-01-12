import { Module, Global } from '@nestjs/common';
import { MockAuthService } from './mock-auth.service';

/**
 * Common Module
 * 
 * Provides shared services like MockAuthService that are used across multiple modules.
 * Marked as @Global so it's available everywhere without explicit imports.
 */
@Global()
@Module({
  providers: [MockAuthService],
  exports: [MockAuthService],
})
export class CommonModule {}
