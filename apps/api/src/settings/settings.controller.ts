import { Controller, Get, Patch, Param, Body, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all settings' })
  findAll() {
    return this.settingsService.findAll();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get specific setting value' })
  @ApiParam({ name: 'key', description: 'Setting key' })
  findOne(@Param('key') key: string) {
    return this.settingsService.findOne(key);
  }

  @Patch(':key')
  @ApiOperation({ summary: 'Update specific setting' })
  @ApiParam({ name: 'key', description: 'Setting key' })
  update(@Param('key') key: string, @Body() body: { value: any }) {
    return this.settingsService.update(key, body.value);
  }

  @Post('reset')
  @ApiOperation({ summary: 'Reset to defaults' })
  reset() {
    // Implementation for reset would typically delete all custom settings
    // or reset them to hardcoded defaults.
    return { message: 'Not implemented yet' };
  }
}
