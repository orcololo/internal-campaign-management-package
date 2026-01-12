import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Header,
  StreamableFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VotersService } from './voters.service';
import { CreateVoterDto } from './dto/create-voter.dto';
import { UpdateVoterDto } from './dto/update-voter.dto';
import { QueryVotersDto } from './dto/query-voters.dto';
import { ImportVotersDto } from './dto/import-voters.dto';
import { BulkDeleteDto, BulkUpdateDto } from './dto/bulk-operations.dto';
import {
  CreateReferralDto,
  ReferralStatsDto,
  ReferralCodeDto,
  QueryReferralsDto,
} from './dto/referral.dto';
import { Roles, UserRole } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Voters')
@Controller('voters')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class VotersController {
  constructor(private readonly votersService: VotersService) {}

  @Post()
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Create a new voter' })
  @ApiResponse({ status: 201, description: 'Voter created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  create(@Body() createVoterDto: CreateVoterDto) {
    return this.votersService.create(createVoterDto);
  }

  @Get()
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA, UserRole.ESCRITORIO)
  @ApiOperation({ summary: 'Get all voters with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of voters' })
  findAll(@Query() query: QueryVotersDto) {
    return this.votersService.findAll(query);
  }

  @Get('statistics')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Get voter statistics and analytics' })
  @ApiResponse({ status: 200, description: 'Returns voter statistics' })
  getStatistics() {
    return this.votersService.getStatistics();
  }

  @Get(':id')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA, UserRole.ESCRITORIO)
  @ApiOperation({ summary: 'Get a voter by ID' })
  @ApiParam({ name: 'id', description: 'Voter UUID' })
  @ApiResponse({ status: 200, description: 'Returns the voter' })
  @ApiResponse({ status: 404, description: 'Voter not found' })
  findOne(@Param('id') id: string) {
    return this.votersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Update a voter' })
  @ApiParam({ name: 'id', description: 'Voter UUID' })
  @ApiResponse({ status: 200, description: 'Voter updated successfully' })
  @ApiResponse({ status: 404, description: 'Voter not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  update(@Param('id') id: string, @Body() updateVoterDto: UpdateVoterDto) {
    return this.votersService.update(id, updateVoterDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA)
  @ApiOperation({ summary: 'Delete a voter (soft delete)' })
  @ApiParam({ name: 'id', description: 'Voter UUID' })
  @ApiResponse({ status: 200, description: 'Voter deleted successfully' })
  @ApiResponse({ status: 404, description: 'Voter not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  remove(@Param('id') id: string) {
    return this.votersService.remove(id);
  }

  // Bulk operations

  @Post('bulk/delete')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA)
  @ApiOperation({ summary: 'Bulk delete voters (soft delete)' })
  @ApiResponse({ status: 200, description: 'Returns bulk delete results' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  bulkDelete(@Body() bulkDeleteDto: BulkDeleteDto) {
    return this.votersService.bulkDelete(bulkDeleteDto.ids);
  }

  @Patch('bulk/update')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Bulk update voters' })
  @ApiResponse({ status: 200, description: 'Returns bulk update results' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  bulkUpdate(@Body() bulkUpdateDto: BulkUpdateDto) {
    return this.votersService.bulkUpdate(bulkUpdateDto.updates);
  }

  // Location-based endpoints

  @Post(':id/geocode')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Geocode voter address and update coordinates' })
  @ApiParam({ name: 'id', description: 'Voter UUID' })
  @ApiResponse({ status: 200, description: 'Voter geocoded successfully' })
  @ApiResponse({ status: 404, description: 'Voter not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  geocode(@Param('id') id: string) {
    return this.votersService.geocodeVoter(id);
  }

  @Get('location/nearby')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA, UserRole.ESCRITORIO)
  @ApiOperation({ summary: 'Find voters near a location' })
  @ApiQuery({ name: 'lat', description: 'Latitude', example: -23.5505 })
  @ApiQuery({ name: 'lng', description: 'Longitude', example: -46.6333 })
  @ApiQuery({ name: 'radius', description: 'Radius in kilometers', example: 5 })
  @ApiQuery({ name: 'limit', description: 'Max results', example: 50, required: false })
  @ApiResponse({ status: 200, description: 'Returns voters near location' })
  findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius: string,
    @Query('limit') limit?: string,
  ) {
    return this.votersService.findNearLocation(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius),
      limit ? parseInt(limit) : 50,
    );
  }

  @Post('location/geofence')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Find voters within a geofence' })
  @ApiResponse({ status: 200, description: 'Returns voters in geofence' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  findInGeofence(
    @Body()
    body: {
      type: 'CIRCLE' | 'POLYGON';
      data: CircleGeofenceData | PolygonGeofenceData;
    },
  ) {
    return this.votersService.findInGeofence(body.type, body.data);
  }

  @Post('location/group-by-proximity')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Group voters by proximity to multiple locations' })
  @ApiResponse({ status: 200, description: 'Returns voters grouped by location' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  groupByProximity(
    @Body()
    body: {
      locations: Array<{ name: string; lat: number; lng: number }>;
      maxDistanceKm?: number;
    },
  ) {
    return this.votersService.groupByProximity(body.locations, body.maxDistanceKm || 5);
  }

  @Post('location/batch-geocode')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA)
  @ApiOperation({ summary: 'Batch geocode voters missing coordinates' })
  @ApiQuery({ name: 'limit', description: 'Max voters to geocode', example: 10, required: false })
  @ApiResponse({ status: 200, description: 'Returns geocoding results' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  batchGeocode(@Query('limit') limit?: string) {
    return this.votersService.batchGeocodeVoters(limit ? parseInt(limit) : 10);
  }

  // Import/Export endpoints

  @Post('import/csv')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import voters from CSV file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV file upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        skipDuplicates: {
          type: 'boolean',
          default: true,
        },
        autoGeocode: {
          type: 'boolean',
          default: false,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Returns import results' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid CSV format' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async importCsv(@UploadedFile() file: Express.Multer.File, @Body() importDto: ImportVotersDto) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const csvContent = file.buffer.toString('utf-8');
    return this.votersService.importFromCsv(
      csvContent,
      importDto.skipDuplicates !== false,
      importDto.autoGeocode === true,
    );
  }

  @Get('export/csv')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA, UserRole.ESCRITORIO)
  @ApiOperation({ summary: 'Export voters to CSV file' })
  @ApiResponse({ status: 200, description: 'Returns CSV file' })
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="voters.csv"')
  async exportCsv(@Query() query: QueryVotersDto) {
    const csv = await this.votersService.exportToCsv(query);
    return new StreamableFile(Buffer.from(csv, 'utf-8'));
  }

  // ==================== REFERRAL SYSTEM ====================

  @Get(':id/referrals')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA, UserRole.ESCRITORIO)
  @ApiOperation({ summary: 'Get list of voters referred by this voter' })
  @ApiParam({ name: 'id', description: 'Voter UUID' })
  @ApiResponse({ status: 200, description: 'Returns list of referred voters with pagination' })
  @ApiResponse({ status: 404, description: 'Voter not found' })
  async getReferrals(@Param('id') id: string, @Query() query: QueryReferralsDto) {
    return this.votersService.getReferrals(id, query.page, query.perPage, query.supportLevel);
  }

  @Get(':id/referral-stats')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA, UserRole.ESCRITORIO)
  @ApiOperation({ summary: 'Get referral statistics for a voter' })
  @ApiParam({ name: 'id', description: 'Voter UUID' })
  @ApiResponse({
    status: 200,
    description: 'Returns referral statistics',
    type: ReferralStatsDto,
  })
  @ApiResponse({ status: 404, description: 'Voter not found' })
  async getReferralStats(@Param('id') id: string): Promise<ReferralStatsDto> {
    return this.votersService.getReferralStats(id);
  }

  @Post(':id/referral-code')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Generate or retrieve referral code for a voter' })
  @ApiParam({ name: 'id', description: 'Voter UUID' })
  @ApiResponse({
    status: 200,
    description: 'Returns referral code and URL',
    type: ReferralCodeDto,
  })
  @ApiResponse({ status: 404, description: 'Voter not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async generateReferralCode(@Param('id') id: string): Promise<ReferralCodeDto> {
    const code = await this.votersService.generateReferralCode(id);

    // Generate full URL (you can configure this via environment variable)
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const referralUrl = `${baseUrl}/cadastro?ref=${code}`;

    return {
      referralCode: code,
      referralUrl,
    };
  }

  @Post('register-referral')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register new voter via referral code (public endpoint)',
    description: 'Used when someone clicks on a referral link and signs up',
  })
  @ApiResponse({ status: 201, description: 'Voter created via referral successfully' })
  @ApiResponse({ status: 404, description: 'Invalid referral code' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async registerReferral(@Body() dto: CreateReferralDto) {
    const { referralCode, ...voterData } = dto;
    return this.votersService.registerReferral(referralCode, voterData);
  }
}

interface CircleGeofenceData {
  centerLat: number;
  centerLng: number;
  radiusKm: number;
}

interface PolygonGeofenceData {
  polygon: Array<{ lat: number; lng: number }>;
}
