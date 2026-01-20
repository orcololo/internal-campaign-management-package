import { Controller, Get, Put, Delete, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

// TODO: Replace with real auth - get userId from JWT
const MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    @ApiOperation({ summary: 'List notifications for current user' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'includeRead', required: false, type: Boolean })
    @ApiResponse({ status: 200, description: 'List of notifications' })
    async findAll(
        @Query('limit') limit?: number,
        @Query('includeRead') includeRead?: string,
    ) {
        return this.notificationsService.findByUser(
            MOCK_USER_ID,
            limit || 50,
            includeRead === 'true',
        );
    }

    @Get('unread')
    @ApiOperation({ summary: 'Count unread notifications' })
    @ApiResponse({ status: 200, description: 'Unread count' })
    async countUnread() {
        const count = await this.notificationsService.countUnread(MOCK_USER_ID);
        return { count };
    }

    @Put(':id/read')
    @ApiOperation({ summary: 'Mark notification as read' })
    @ApiResponse({ status: 200, description: 'Notification marked as read' })
    async markAsRead(@Param('id') id: string) {
        await this.notificationsService.markAsRead(id, MOCK_USER_ID);
        return { success: true };
    }

    @Put('read-all')
    @ApiOperation({ summary: 'Mark all notifications as read' })
    @ApiResponse({ status: 200, description: 'All notifications marked as read' })
    async markAllAsRead() {
        await this.notificationsService.markAllAsRead(MOCK_USER_ID);
        return { success: true };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete notification' })
    @ApiResponse({ status: 200, description: 'Notification deleted' })
    async delete(@Param('id') id: string) {
        await this.notificationsService.delete(id, MOCK_USER_ID);
        return { success: true };
    }
}
