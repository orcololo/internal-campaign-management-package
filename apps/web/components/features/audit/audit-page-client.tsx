"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Download,
    Filter,
    RefreshCw,
    History,
    User,
    FileText,
    Trash2,
    Edit,
    Plus,
    Upload,
    LogIn,
    LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { auditApi, AuditLog, AuditFilters, AuditAction, AuditEntity } from "@/lib/api/audit";

const ACTION_LABELS: Record<AuditAction, { label: string; icon: any; color: string }> = {
    create: { label: "Criação", icon: Plus, color: "bg-green-500" },
    update: { label: "Atualização", icon: Edit, color: "bg-blue-500" },
    delete: { label: "Exclusão", icon: Trash2, color: "bg-red-500" },
    export: { label: "Exportação", icon: Download, color: "bg-purple-500" },
    login: { label: "Login", icon: LogIn, color: "bg-cyan-500" },
    logout: { label: "Logout", icon: LogOut, color: "bg-gray-500" },
    bulk_delete: { label: "Exclusão em massa", icon: Trash2, color: "bg-red-700" },
    bulk_update: { label: "Atualização em massa", icon: Edit, color: "bg-blue-700" },
    import: { label: "Importação", icon: Upload, color: "bg-orange-500" },
};

const ENTITY_LABELS: Record<AuditEntity, string> = {
    voter: "Eleitor",
    user: "Usuário",
    event: "Evento",
    geofence: "Geofence",
    report: "Relatório",
    campaign: "Campanha",
    template: "Template",
    notification: "Notificação",
};

export function AuditPageClient() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<AuditFilters>({
        page: 1,
        limit: 25,
    });
    const [meta, setMeta] = useState({ total: 0, totalPages: 0 });
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await auditApi.list(filters);
            if (response.data) {
                setLogs(response.data.data);
                setMeta({
                    total: response.data.meta.total,
                    totalPages: response.data.meta.totalPages,
                });
            }
        } catch (error) {
            toast.error("Erro ao carregar logs de auditoria");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleExport = async () => {
        try {
            await auditApi.exportCsv(filters);
            toast.success("Exportação iniciada");
        } catch (error) {
            toast.error("Erro ao exportar logs");
        }
    };

    const handleFilterChange = (key: keyof AuditFilters, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value === "all" ? undefined : value,
            page: 1,
        }));
    };

    const renderActionBadge = (action: AuditAction) => {
        const config = ACTION_LABELS[action];
        const Icon = config.icon;
        return (
            <Badge className={`${config.color} text-white gap-1`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <History className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">Logs de Auditoria</h1>
                        <p className="text-muted-foreground">
                            Histórico de todas as modificações do sistema
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchLogs} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Atualizar
                    </Button>
                    <Button onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Exportar CSV
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filtros
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Select
                            value={filters.entityType || "all"}
                            onValueChange={(v) => handleFilterChange("entityType", v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tipo de entidade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as entidades</SelectItem>
                                {Object.entries(ENTITY_LABELS).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.action || "all"}
                            onValueChange={(v) => handleFilterChange("action", v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Ação" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as ações</SelectItem>
                                {Object.entries(ACTION_LABELS).map(([key, config]) => (
                                    <SelectItem key={key} value={key}>
                                        {config.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            type="date"
                            placeholder="Data inicial"
                            value={filters.fromDate || ""}
                            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                        />

                        <Input
                            type="date"
                            placeholder="Data final"
                            value={filters.toDate || ""}
                            onChange={(e) => handleFilterChange("toDate", e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="text-sm text-muted-foreground">
                {meta.total} registros encontrados
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data/Hora</TableHead>
                                <TableHead>Ação</TableHead>
                                <TableHead>Entidade</TableHead>
                                <TableHead>ID da Entidade</TableHead>
                                <TableHead>IP</TableHead>
                                <TableHead className="text-right">Detalhes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6}>
                                            <Skeleton className="h-10 w-full" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Nenhum log encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm:ss", {
                                                locale: ptBR,
                                            })}
                                        </TableCell>
                                        <TableCell>{renderActionBadge(log.action)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{ENTITY_LABELS[log.entityType]}</Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {log.entityId ? log.entityId.substring(0, 8) + "..." : "-"}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {log.ipAddress || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedLog(log)}
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2">
                                                            Detalhes do Log
                                                            {renderActionBadge(log.action)}
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <span className="text-muted-foreground">ID:</span>
                                                                <p className="font-mono">{log.id}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Data:</span>
                                                                <p>
                                                                    {format(new Date(log.createdAt), "PPpp", {
                                                                        locale: ptBR,
                                                                    })}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Entidade:</span>
                                                                <p>{ENTITY_LABELS[log.entityType]}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">ID Entidade:</span>
                                                                <p className="font-mono">{log.entityId || "-"}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">IP:</span>
                                                                <p>{log.ipAddress || "-"}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">User Agent:</span>
                                                                <p className="truncate">{log.userAgent || "-"}</p>
                                                            </div>
                                                        </div>

                                                        {(log.oldValues || log.newValues) && (
                                                            <div className="space-y-2">
                                                                <span className="text-muted-foreground text-sm">
                                                                    Alterações:
                                                                </span>
                                                                <ScrollArea className="h-64 rounded border p-3">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        {log.oldValues && (
                                                                            <div>
                                                                                <p className="text-sm font-medium text-red-500 mb-2">
                                                                                    Valores Anteriores
                                                                                </p>
                                                                                <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                                                                                    {JSON.stringify(log.oldValues, null, 2)}
                                                                                </pre>
                                                                            </div>
                                                                        )}
                                                                        {log.newValues && (
                                                                            <div>
                                                                                <p className="text-sm font-medium text-green-500 mb-2">
                                                                                    Novos Valores
                                                                                </p>
                                                                                <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                                                                                    {JSON.stringify(log.newValues, null, 2)}
                                                                                </pre>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </ScrollArea>
                                                            </div>
                                                        )}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            {meta.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Página {filters.page} de {meta.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={filters.page === 1}
                            onClick={() => handleFilterChange("page", (filters.page || 1) - 1)}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={filters.page === meta.totalPages}
                            onClick={() => handleFilterChange("page", (filters.page || 1) + 1)}
                        >
                            Próxima
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
