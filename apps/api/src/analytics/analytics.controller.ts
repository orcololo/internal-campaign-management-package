import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Roles, UserRole } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Get comprehensive campaign overview' })
  @ApiResponse({ status: 200, description: 'Returns campaign overview analytics' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  getCampaignOverview() {
    return this.analyticsService.getCampaignOverview();
  }

  @Get('voters')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Get voter analytics' })
  @ApiResponse({ status: 200, description: 'Returns voter analytics and demographics' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  getVoterAnalytics() {
    return this.analyticsService.getVoterAnalytics();
  }

  @Get('events')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Get event analytics' })
  @ApiResponse({ status: 200, description: 'Returns event analytics' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  getEventAnalytics() {
    return this.analyticsService.getEventAnalytics();
  }

  @Get('canvassing')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Get canvassing analytics' })
  @ApiResponse({ status: 200, description: 'Returns canvassing analytics and performance metrics' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  getCanvassingAnalytics() {
    return this.analyticsService.getCanvassingAnalytics();
  }

  @Get('geographic-heatmap')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Get geographic heatmap data for voters' })
  @ApiResponse({ status: 200, description: 'Returns geographic heatmap data with coordinates' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  getGeographicHeatmap() {
    return this.analyticsService.getGeographicHeatmap();
  }

  @Get('time-series')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Get time series data for a specific metric' })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date (YYYY-MM-DD)',
    example: '2024-01-01',
    required: true,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date (YYYY-MM-DD)',
    example: '2024-12-31',
    required: true,
  })
  @ApiQuery({
    name: 'metric',
    description: 'Metric type',
    enum: ['voter-registrations', 'events', 'canvassing'],
    example: 'voter-registrations',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Returns time series data' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  getTimeSeriesData(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('metric') metric: string,
  ) {
    return this.analyticsService.getTimeSeriesData(startDate, endDate, metric);
  }
}
