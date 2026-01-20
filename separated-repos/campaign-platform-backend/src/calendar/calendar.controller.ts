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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventsDto } from './dto/query-events.dto';
import { Roles, UserRole } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Calendar')
@Controller('calendar')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 409, description: 'Conflict - event conflicts with existing events' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.calendarService.create(createEventDto);
  }

  @Get()
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA, UserRole.ESCRITORIO)
  @ApiOperation({ summary: 'Get all events with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of events' })
  findAll(@Query() query: QueryEventsDto) {
    return this.calendarService.findAll(query);
  }

  @Get('statistics')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Get event statistics' })
  @ApiResponse({ status: 200, description: 'Returns event statistics' })
  getStatistics() {
    return this.calendarService.getStatistics();
  }

  @Get('upcoming')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA, UserRole.ESCRITORIO)
  @ApiOperation({ summary: 'Get upcoming events' })
  @ApiQuery({ name: 'limit', description: 'Max events to return', example: 10, required: false })
  @ApiResponse({ status: 200, description: 'Returns upcoming events' })
  getUpcoming(@Query('limit') limit?: string) {
    return this.calendarService.getUpcomingEvents(limit ? parseInt(limit) : 10);
  }

  @Get('date-range')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA, UserRole.ESCRITORIO)
  @ApiOperation({ summary: 'Get events by date range' })
  @ApiQuery({ name: 'startDate', description: 'Start date', example: '2024-03-01', required: true })
  @ApiQuery({ name: 'endDate', description: 'End date', example: '2024-03-31', required: true })
  @ApiResponse({ status: 200, description: 'Returns events in date range' })
  getByDateRange(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.calendarService.getEventsByDateRange(startDate, endDate);
  }

  @Post('check-conflicts')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Check for scheduling conflicts' })
  @ApiResponse({ status: 200, description: 'Returns conflicting events if any' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  checkConflicts(
    @Body()
    body: {
      startDate: string;
      startTime: string;
      endDate: string;
      endTime: string;
      excludeEventId?: string;
    },
  ) {
    return this.calendarService.checkConflicts(
      body.startDate,
      body.startTime,
      body.endDate,
      body.endTime,
      body.excludeEventId,
    );
  }

  @Get(':id')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA, UserRole.ESCRITORIO)
  @ApiOperation({ summary: 'Get an event by ID' })
  @ApiParam({ name: 'id', description: 'Event UUID' })
  @ApiResponse({ status: 200, description: 'Returns the event' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findOne(@Param('id') id: string) {
    return this.calendarService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
  @ApiOperation({ summary: 'Update an event' })
  @ApiParam({ name: 'id', description: 'Event UUID' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 409, description: 'Conflict - event update would create conflicts' })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.calendarService.update(id, updateEventDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA)
  @ApiOperation({ summary: 'Delete an event (soft delete)' })
  @ApiParam({ name: 'id', description: 'Event UUID' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  remove(@Param('id') id: string) {
    return this.calendarService.remove(id);
  }
}
