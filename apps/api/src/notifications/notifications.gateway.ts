import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationType } from '../database/schemas';

interface NotificationPayload {
    id: string;
    type: NotificationType;
    title: string;
    message?: string;
    link?: string;
    createdAt: Date;
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/notifications',
})
@Injectable()
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(NotificationsGateway.name);
    private userSockets = new Map<string, Set<string>>(); // userId -> Set<socketId>

    constructor(private readonly notificationsService: NotificationsService) { }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        // Remove socket from all user mappings
        for (const [userId, sockets] of this.userSockets.entries()) {
            sockets.delete(client.id);
            if (sockets.size === 0) {
                this.userSockets.delete(userId);
            }
        }
    }

    /**
     * Client subscribes to notifications for a user
     */
    @SubscribeMessage('subscribe')
    async handleSubscribe(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { userId: string },
    ) {
        const { userId } = data;

        if (!userId) {
            return { success: false, error: 'userId required' };
        }

        // Add socket to user's socket set
        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }
        this.userSockets.get(userId)!.add(client.id);

        // Join room for this user
        client.join(`user:${userId}`);

        // Send initial unread count
        const unreadCount = await this.notificationsService.countUnread(userId);
        client.emit('unread-count', { count: unreadCount });

        this.logger.log(`User ${userId} subscribed, socket ${client.id}`);
        return { success: true };
    }

    /**
     * Mark notification as read via WebSocket
     */
    @SubscribeMessage('mark-read')
    async handleMarkRead(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { notificationId: string; userId: string },
    ) {
        const { notificationId, userId } = data;

        await this.notificationsService.markAsRead(notificationId, userId);
        const unreadCount = await this.notificationsService.countUnread(userId);

        // Emit updated count to all user's sockets
        this.server.to(`user:${userId}`).emit('unread-count', { count: unreadCount });

        return { success: true };
    }

    /**
     * Mark all notifications as read
     */
    @SubscribeMessage('mark-all-read')
    async handleMarkAllRead(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { userId: string },
    ) {
        const { userId } = data;

        await this.notificationsService.markAllAsRead(userId);
        this.server.to(`user:${userId}`).emit('unread-count', { count: 0 });

        return { success: true };
    }

    /**
     * Send notification to a user (called by other services)
     */
    async sendToUser(userId: string, notification: NotificationPayload) {
        this.server.to(`user:${userId}`).emit('notification', notification);

        // Also send updated count
        const unreadCount = await this.notificationsService.countUnread(userId);
        this.server.to(`user:${userId}`).emit('unread-count', { count: unreadCount });
    }

    /**
     * Send notification to multiple users
     */
    async sendToUsers(userIds: string[], notification: NotificationPayload) {
        for (const userId of userIds) {
            await this.sendToUser(userId, notification);
        }
    }
}
