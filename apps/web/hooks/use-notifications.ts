"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { notificationsApi, Notification } from "@/lib/api/notifications";

const WS_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Mock user ID until auth is implemented
const MOCK_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    // Fetch initial notifications
    const fetchNotifications = useCallback(async () => {
        try {
            const response = await notificationsApi.list(50, true);
            if (response.data) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await notificationsApi.getUnreadCount();
            if (response.data) {
                setUnreadCount(response.data.count);
            }
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    }, []);

    // Mark single notification as read
    const markAsRead = useCallback(async (id: string) => {
        try {
            await notificationsApi.markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
        try {
            await notificationsApi.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    }, []);

    // Delete notification
    const deleteNotification = useCallback(async (id: string) => {
        try {
            await notificationsApi.delete(id);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    }, []);

    // Setup WebSocket connection
    useEffect(() => {
        // Initial fetch
        fetchNotifications();
        fetchUnreadCount();

        // Connect to WebSocket
        const socket = io(`${WS_URL}/notifications`, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            // Subscribe to user's notifications
            socket.emit("subscribe", { userId: MOCK_USER_ID });
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        // Handle new notification
        socket.on("notification", (notification: Notification) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        // Handle unread count update
        socket.on("unread-count", (data: { count: number }) => {
            setUnreadCount(data.count);
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchNotifications, fetchUnreadCount]);

    return {
        notifications,
        unreadCount,
        loading,
        connected,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refresh: fetchNotifications,
    };
}
