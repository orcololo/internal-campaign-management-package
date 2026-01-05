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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GeofencesService } from './geofences.service';
import { CreateGeofenceDto } from './dto/create-geofence.dto';
import { UpdateGeofenceDto } from './dto/update-geofence.dto';

@ApiTags('Geofences')
@Controller('geofences')
export class GeofencesController {
  constructor(private readonly geofencesService: GeofencesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new geofence' })
  @ApiResponse({ status: 201, description: 'Geofence created successfully' })
  create(@Body() createGeofenceDto: CreateGeofenceDto) {
    return this.geofencesService.create(createGeofenceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all geofences' })
  @ApiResponse({ status: 200, description: 'Returns all geofences' })
  findAll() {
    return this.geofencesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a geofence by ID' })
  @ApiParam({ name: 'id', description: 'Geofence UUID' })
  @ApiResponse({ status: 200, description: 'Returns the geofence' })
  @ApiResponse({ status: 404, description: 'Geofence not found' })
  findOne(@Param('id') id: string) {
    return this.geofencesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a geofence' })
  @ApiParam({ name: 'id', description: 'Geofence UUID' })
  @ApiResponse({ status: 200, description: 'Geofence updated successfully' })
  @ApiResponse({ status: 404, description: 'Geofence not found' })
  update(@Param('id') id: string, @Body() updateGeofenceDto: UpdateGeofenceDto) {
    return this.geofencesService.update(id, updateGeofenceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a geofence (soft delete)' })
  @ApiParam({ name: 'id', description: 'Geofence UUID' })
  @ApiResponse({ status: 200, description: 'Geofence deleted successfully' })
  @ApiResponse({ status: 404, description: 'Geofence not found' })
  remove(@Param('id') id: string) {
    return this.geofencesService.remove(id);
  }

  @Get(':id/check-point')
  @ApiOperation({ summary: 'Check if a point is within a geofence' })
  @ApiParam({ name: 'id', description: 'Geofence UUID' })
  @ApiQuery({ name: 'lat', description: 'Latitude', example: -23.5505 })
  @ApiQuery({ name: 'lng', description: 'Longitude', example: -46.6333 })
  @ApiResponse({ status: 200, description: 'Returns whether point is inside geofence' })
  checkPoint(
    @Param('id') id: string,
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    return this.geofencesService.checkPoint(id, parseFloat(lat), parseFloat(lng));
  }

  @Get('find-by-point/location')
  @ApiOperation({ summary: 'Find all geofences containing a point' })
  @ApiQuery({ name: 'lat', description: 'Latitude', example: -23.5505 })
  @ApiQuery({ name: 'lng', description: 'Longitude', example: -46.6333 })
  @ApiResponse({ status: 200, description: 'Returns geofences containing the point' })
  findByPoint(@Query('lat') lat: string, @Query('lng') lng: string) {
    return this.geofencesService.findGeofencesContainingPoint(
      parseFloat(lat),
      parseFloat(lng),
    );
  }
}
