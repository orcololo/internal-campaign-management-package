"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var export_report_dto_1 = require("./dto/export-report.dto");
var mock_auth_guard_1 = require("../common/guards/mock-auth.guard");
var ReportsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Reports'), (0, common_1.Controller)('reports'), (0, common_1.UseGuards)(mock_auth_guard_1.MockAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _getStatistics_decorators;
    var _getMostUsed_decorators;
    var _getRecentlyUsed_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var _remove_decorators;
    var _previewReport_decorators;
    var _executeReport_decorators;
    var _getSummary_decorators;
    var _validateReport_decorators;
    var _exportReport_decorators;
    var _getExportStatus_decorators;
    var _downloadExport_decorators;
    var ReportsController = _classThis = /** @class */ (function () {
        function ReportsController_1(reportsService, savedReportsService, pdfGenerator, csvGenerator, excelGenerator, exportQueue) {
            this.reportsService = (__runInitializers(this, _instanceExtraInitializers), reportsService);
            this.savedReportsService = savedReportsService;
            this.pdfGenerator = pdfGenerator;
            this.csvGenerator = csvGenerator;
            this.excelGenerator = excelGenerator;
            this.exportQueue = exportQueue;
            this.EXPORT_THRESHOLD = 5000; // Queue exports larger than this
        }
        ReportsController_1.prototype.create = function (userId, dto) {
            return this.savedReportsService.create(userId, dto);
        };
        ReportsController_1.prototype.findAll = function (userId, filters) {
            return this.savedReportsService.findAll(userId, filters);
        };
        ReportsController_1.prototype.getStatistics = function (userId) {
            return this.savedReportsService.getStatistics(userId);
        };
        ReportsController_1.prototype.getMostUsed = function (userId) {
            return this.savedReportsService.getMostUsed(userId);
        };
        ReportsController_1.prototype.getRecentlyUsed = function (userId) {
            return this.savedReportsService.getRecentlyUsed(userId);
        };
        ReportsController_1.prototype.findOne = function (id, userId) {
            return this.savedReportsService.findOne(id, userId);
        };
        ReportsController_1.prototype.update = function (id, userId, dto) {
            return this.savedReportsService.update(id, userId, dto);
        };
        ReportsController_1.prototype.remove = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.savedReportsService.remove(id, userId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { message: 'Report deleted successfully' }];
                    }
                });
            });
        };
        ReportsController_1.prototype.previewReport = function (id, userId, dto) {
            return this.reportsService.previewReport(id, userId, dto);
        };
        ReportsController_1.prototype.executeReport = function (id, userId) {
            return this.reportsService.executeReport(id, userId);
        };
        ReportsController_1.prototype.getSummary = function (id, userId) {
            return this.reportsService.getReportSummary(id, userId);
        };
        ReportsController_1.prototype.validateReport = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var report;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.savedReportsService.findOne(id, userId)];
                        case 1:
                            report = _a.sent();
                            return [2 /*return*/, this.reportsService.validateReport(report)];
                    }
                });
            });
        };
        ReportsController_1.prototype.exportReport = function (id, userId, dto, res) {
            return __awaiter(this, void 0, void 0, function () {
                var summary, recordCount, job, reportResult, fileBuffer, fileName, mimeType, _a, pdfSummary, columns;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.reportsService.getReportSummary(id, userId)];
                        case 1:
                            summary = _b.sent();
                            recordCount = summary.summary.total;
                            if (!(recordCount > this.EXPORT_THRESHOLD)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.exportQueue.add('generate', {
                                    reportId: id,
                                    userId: userId,
                                    format: dto.format,
                                    includeSummary: dto.includeSummary,
                                    includeFilters: dto.includeFilters,
                                })];
                        case 2:
                            job = _b.sent();
                            return [2 /*return*/, res.status(common_1.HttpStatus.ACCEPTED).json({
                                    message: 'Export job queued successfully',
                                    jobId: job.id,
                                    status: 'queued',
                                    estimatedTime: Math.ceil(recordCount / 1000) * 5, // ~5 seconds per 1000 records
                                    statusUrl: "/reports/exports/".concat(job.id, "/status"),
                                })];
                        case 3: return [4 /*yield*/, this.reportsService.executeReport(id, userId)];
                        case 4:
                            reportResult = _b.sent();
                            _a = dto.format;
                            switch (_a) {
                                case export_report_dto_1.ExportFormat.PDF: return [3 /*break*/, 5];
                                case export_report_dto_1.ExportFormat.CSV: return [3 /*break*/, 7];
                                case export_report_dto_1.ExportFormat.EXCEL: return [3 /*break*/, 9];
                            }
                            return [3 /*break*/, 11];
                        case 5:
                            pdfSummary = dto.includeSummary ? summary : null;
                            columns = reportResult.data.length > 0 ? Object.keys(reportResult.data[0]) : [];
                            return [4 /*yield*/, this.pdfGenerator.generate({
                                    reportName: reportResult.report.name,
                                    description: reportResult.report.description || undefined,
                                    data: reportResult.data,
                                    columns: columns,
                                    summary: pdfSummary
                                        ? {
                                            total: pdfSummary.summary.total,
                                            supportLevel: pdfSummary.summary.supportLevelBreakdown,
                                            cityBreakdown: pdfSummary.summary.cityBreakdown,
                                        }
                                        : undefined,
                                    generatedBy: 'Sistema',
                                })];
                        case 6:
                            fileBuffer = _b.sent();
                            fileName = "".concat(reportResult.report.name, "_").concat(Date.now(), ".pdf");
                            mimeType = 'application/pdf';
                            return [3 /*break*/, 12];
                        case 7: return [4 /*yield*/, this.csvGenerator.generateFromObjects(reportResult.data)];
                        case 8:
                            fileBuffer = _b.sent();
                            fileName = "".concat(reportResult.report.name, "_").concat(Date.now(), ".csv");
                            mimeType = 'text/csv; charset=utf-8';
                            return [3 /*break*/, 12];
                        case 9: return [4 /*yield*/, this.excelGenerator.generateFromObjects(reportResult.data, {
                                sheetName: reportResult.report.name,
                                title: reportResult.report.name,
                                includeFilters: dto.includeFilters,
                            })];
                        case 10:
                            fileBuffer = _b.sent();
                            fileName = "".concat(reportResult.report.name, "_").concat(Date.now(), ".xlsx");
                            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                            return [3 /*break*/, 12];
                        case 11: return [2 /*return*/, res.status(common_1.HttpStatus.BAD_REQUEST).json({
                                message: "Unsupported export format: ".concat(dto.format),
                            })];
                        case 12:
                            // Set response headers
                            res.setHeader('Content-Type', mimeType);
                            res.setHeader('Content-Disposition', "attachment; filename=\"".concat(fileName, "\""));
                            res.setHeader('Content-Length', fileBuffer.length);
                            return [2 /*return*/, res.send(fileBuffer)];
                    }
                });
            });
        };
        ReportsController_1.prototype.getExportStatus = function (jobId, res) {
            return __awaiter(this, void 0, void 0, function () {
                var job, state, progress, failedReason, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.exportQueue.getJob(jobId)];
                        case 1:
                            job = _a.sent();
                            if (!job) {
                                return [2 /*return*/, res.status(common_1.HttpStatus.NOT_FOUND).json({
                                        message: 'Job not found',
                                    })];
                            }
                            return [4 /*yield*/, job.getState()];
                        case 2:
                            state = _a.sent();
                            progress = job.progress();
                            failedReason = job.failedReason;
                            // If job is completed, check if we have the result
                            if (state === 'completed') {
                                result = job.returnvalue;
                                if (result && result.fileBuffer) {
                                    // Return download info
                                    return [2 /*return*/, res.status(common_1.HttpStatus.OK).json({
                                            status: 'completed',
                                            jobId: job.id,
                                            progress: 100,
                                            result: {
                                                fileName: result.fileName,
                                                mimeType: result.mimeType,
                                                size: result.fileBuffer.length,
                                                downloadUrl: "/reports/exports/".concat(jobId, "/download"),
                                            },
                                        })];
                                }
                            }
                            return [2 /*return*/, res.status(common_1.HttpStatus.OK).json({
                                    status: state,
                                    jobId: job.id,
                                    progress: progress,
                                    failedReason: failedReason,
                                    data: job.data,
                                })];
                    }
                });
            });
        };
        ReportsController_1.prototype.downloadExport = function (jobId, res) {
            return __awaiter(this, void 0, void 0, function () {
                var job, state, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.exportQueue.getJob(jobId)];
                        case 1:
                            job = _a.sent();
                            if (!job) {
                                return [2 /*return*/, res.status(common_1.HttpStatus.NOT_FOUND).json({
                                        message: 'Job not found',
                                    })];
                            }
                            return [4 /*yield*/, job.getState()];
                        case 2:
                            state = _a.sent();
                            if (state !== 'completed') {
                                return [2 /*return*/, res.status(common_1.HttpStatus.BAD_REQUEST).json({
                                        message: "Job is not completed yet. Current status: ".concat(state),
                                        statusUrl: "/reports/exports/".concat(jobId, "/status"),
                                    })];
                            }
                            result = job.returnvalue;
                            if (!result || !result.fileBuffer) {
                                return [2 /*return*/, res.status(common_1.HttpStatus.NOT_FOUND).json({
                                        message: 'Export file not found',
                                    })];
                            }
                            // Set response headers
                            res.setHeader('Content-Type', result.mimeType);
                            res.setHeader('Content-Disposition', "attachment; filename=\"".concat(result.fileName, "\""));
                            res.setHeader('Content-Length', result.fileBuffer.length);
                            return [2 /*return*/, res.send(result.fileBuffer)];
                    }
                });
            });
        };
        return ReportsController_1;
    }());
    __setFunctionName(_classThis, "ReportsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({ summary: 'Create a new saved report' }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Report created successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Invalid input',
            })];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'List all saved reports for current user' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Reports retrieved successfully',
            })];
        _getStatistics_decorators = [(0, common_1.Get)('statistics'), (0, swagger_1.ApiOperation)({ summary: 'Get report statistics for current user' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Statistics retrieved successfully',
            })];
        _getMostUsed_decorators = [(0, common_1.Get)('most-used'), (0, swagger_1.ApiOperation)({ summary: 'Get most used reports' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Most used reports retrieved successfully',
            })];
        _getRecentlyUsed_decorators = [(0, common_1.Get)('recently-used'), (0, swagger_1.ApiOperation)({ summary: 'Get recently used reports' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Recently used reports retrieved successfully',
            })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get a saved report by ID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Report retrieved successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Report not found',
            })];
        _update_decorators = [(0, common_1.Patch)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update a saved report' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Report updated successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Report not found',
            })];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Delete a saved report (soft delete)' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Report deleted successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Report not found',
            })];
        _previewReport_decorators = [(0, common_1.Post)(':id/preview'), (0, swagger_1.ApiOperation)({ summary: 'Preview report data with pagination' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Report preview generated successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Report not found',
            })];
        _executeReport_decorators = [(0, common_1.Post)(':id/execute'), (0, swagger_1.ApiOperation)({ summary: 'Execute report and return all data' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Report executed successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Report not found',
            })];
        _getSummary_decorators = [(0, common_1.Get)(':id/summary'), (0, swagger_1.ApiOperation)({ summary: 'Get report summary statistics' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Report summary retrieved successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Report not found',
            })];
        _validateReport_decorators = [(0, common_1.Get)(':id/validate'), (0, swagger_1.ApiOperation)({ summary: 'Validate report configuration' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Validation result returned',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Report not found',
            })];
        _exportReport_decorators = [(0, common_1.Post)(':id/export'), (0, swagger_1.ApiOperation)({ summary: 'Export report in specified format' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Export generated successfully or job queued',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Report not found',
            })];
        _getExportStatus_decorators = [(0, common_1.Get)('exports/:jobId/status'), (0, swagger_1.ApiOperation)({ summary: 'Check export job status' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Job status retrieved',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Job not found',
            })];
        _downloadExport_decorators = [(0, common_1.Get)('exports/:jobId/download'), (0, swagger_1.ApiOperation)({ summary: 'Download completed export' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'File download started',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Job not found or not completed',
            })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStatistics_decorators, { kind: "method", name: "getStatistics", static: false, private: false, access: { has: function (obj) { return "getStatistics" in obj; }, get: function (obj) { return obj.getStatistics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMostUsed_decorators, { kind: "method", name: "getMostUsed", static: false, private: false, access: { has: function (obj) { return "getMostUsed" in obj; }, get: function (obj) { return obj.getMostUsed; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRecentlyUsed_decorators, { kind: "method", name: "getRecentlyUsed", static: false, private: false, access: { has: function (obj) { return "getRecentlyUsed" in obj; }, get: function (obj) { return obj.getRecentlyUsed; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _previewReport_decorators, { kind: "method", name: "previewReport", static: false, private: false, access: { has: function (obj) { return "previewReport" in obj; }, get: function (obj) { return obj.previewReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _executeReport_decorators, { kind: "method", name: "executeReport", static: false, private: false, access: { has: function (obj) { return "executeReport" in obj; }, get: function (obj) { return obj.executeReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSummary_decorators, { kind: "method", name: "getSummary", static: false, private: false, access: { has: function (obj) { return "getSummary" in obj; }, get: function (obj) { return obj.getSummary; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validateReport_decorators, { kind: "method", name: "validateReport", static: false, private: false, access: { has: function (obj) { return "validateReport" in obj; }, get: function (obj) { return obj.validateReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportReport_decorators, { kind: "method", name: "exportReport", static: false, private: false, access: { has: function (obj) { return "exportReport" in obj; }, get: function (obj) { return obj.exportReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getExportStatus_decorators, { kind: "method", name: "getExportStatus", static: false, private: false, access: { has: function (obj) { return "getExportStatus" in obj; }, get: function (obj) { return obj.getExportStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _downloadExport_decorators, { kind: "method", name: "downloadExport", static: false, private: false, access: { has: function (obj) { return "downloadExport" in obj; }, get: function (obj) { return obj.downloadExport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReportsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReportsController = _classThis;
}();
exports.ReportsController = ReportsController;
