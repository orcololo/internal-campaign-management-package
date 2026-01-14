"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.ExcelGeneratorService = void 0;
var common_1 = require("@nestjs/common");
var ExcelJS = require("exceljs");
/**
 * Excel Generator Service
 *
 * Generates Excel (.xlsx) exports with styling, filters, and formatting.
 * Uses ExcelJS for rich spreadsheet features.
 */
var ExcelGeneratorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ExcelGeneratorService = _classThis = /** @class */ (function () {
        function ExcelGeneratorService_1() {
        }
        /**
         * Generate Excel file from data
         *
         * @param options Excel generation options
         * @returns Excel file as Buffer
         */
        ExcelGeneratorService_1.prototype.generate = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                var workbook, sheetName, worksheet_1, currentRow_1, titleCell, summaryHeaderCell, headerRow, headerRowObj, buffer, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            workbook = new ExcelJS.Workbook();
                            // Set workbook properties
                            workbook.creator = 'Campaign Platform';
                            workbook.created = new Date();
                            workbook.modified = new Date();
                            sheetName = options.sheetName || 'Relatório';
                            worksheet_1 = workbook.addWorksheet(sheetName);
                            currentRow_1 = 1;
                            // Add title if provided
                            if (options.title) {
                                worksheet_1.mergeCells("A".concat(currentRow_1, ":").concat(this.getColumnLetter(options.columns.length)).concat(currentRow_1));
                                titleCell = worksheet_1.getCell("A".concat(currentRow_1));
                                titleCell.value = options.title;
                                titleCell.font = { size: 16, bold: true, color: { argb: 'FF1E40AF' } };
                                titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
                                titleCell.fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: 'FFEFF6FF' },
                                };
                                worksheet_1.getRow(currentRow_1).height = 30;
                                currentRow_1 += 2;
                            }
                            // Add summary section if provided
                            if (options.includeSummary && options.summary) {
                                worksheet_1.mergeCells("A".concat(currentRow_1, ":").concat(this.getColumnLetter(options.columns.length)).concat(currentRow_1));
                                summaryHeaderCell = worksheet_1.getCell("A".concat(currentRow_1));
                                summaryHeaderCell.value = 'Resumo';
                                summaryHeaderCell.font = { size: 12, bold: true };
                                summaryHeaderCell.fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: 'FFE5E7EB' },
                                };
                                currentRow_1++;
                                // Add summary items
                                Object.entries(options.summary).forEach(function (_a) {
                                    var key = _a[0], value = _a[1];
                                    var summaryRow = worksheet_1.getRow(currentRow_1);
                                    summaryRow.getCell(1).value = _this.formatSummaryLabel(key);
                                    summaryRow.getCell(2).value = value;
                                    summaryRow.getCell(1).font = { bold: true };
                                    currentRow_1++;
                                });
                                currentRow_1++; // Empty row after summary
                            }
                            headerRow = currentRow_1;
                            // Define columns
                            worksheet_1.columns = options.columns.map(function (col) { return ({
                                header: col.header,
                                key: col.key,
                                width: col.width || 20,
                            }); });
                            headerRowObj = worksheet_1.getRow(headerRow);
                            headerRowObj.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
                            headerRowObj.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FF2563EB' },
                            };
                            headerRowObj.alignment = { horizontal: 'center', vertical: 'middle' };
                            headerRowObj.height = 25;
                            // Add borders to header
                            headerRowObj.eachCell(function (cell) {
                                cell.border = {
                                    top: { style: 'thin', color: { argb: 'FF000000' } },
                                    left: { style: 'thin', color: { argb: 'FF000000' } },
                                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                                    right: { style: 'thin', color: { argb: 'FF000000' } },
                                };
                            });
                            // Add data rows
                            options.data.forEach(function (item, index) {
                                var row = worksheet_1.addRow(item);
                                // Alternate row colors
                                if (index % 2 === 1) {
                                    row.fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: 'FFF9FAFB' },
                                    };
                                }
                                // Add borders
                                row.eachCell(function (cell) {
                                    cell.border = {
                                        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                                        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                                        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                                        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                                    };
                                    cell.alignment = { vertical: 'middle', wrapText: false };
                                });
                            });
                            // Add auto-filter if enabled
                            if (options.includeFilters) {
                                worksheet_1.autoFilter = {
                                    from: { row: headerRow, column: 1 },
                                    to: { row: headerRow, column: options.columns.length },
                                };
                            }
                            // Freeze header row
                            worksheet_1.views = [{ state: 'frozen', ySplit: headerRow }];
                            return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                        case 1:
                            buffer = _a.sent();
                            return [2 /*return*/, Buffer.from(buffer)];
                        case 2:
                            error_1 = _a.sent();
                            throw new common_1.InternalServerErrorException("Failed to generate Excel: ".concat(error_1.message));
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Generate Excel from objects (auto-detect columns)
         *
         * @param data Array of objects
         * @param options Optional configuration
         * @returns Excel file as Buffer
         */
        ExcelGeneratorService_1.prototype.generateFromObjects = function (data, options) {
            return __awaiter(this, void 0, void 0, function () {
                var firstRow, columns;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    if (!data || data.length === 0) {
                        throw new common_1.InternalServerErrorException('No data provided for Excel generation');
                    }
                    firstRow = data[0];
                    columns = Object.keys(firstRow).map(function (key) {
                        var _a, _b;
                        return ({
                            header: ((_a = options === null || options === void 0 ? void 0 : options.columnTitles) === null || _a === void 0 ? void 0 : _a[key]) || _this.formatColumnTitle(key),
                            key: key,
                            width: ((_b = options === null || options === void 0 ? void 0 : options.columnWidths) === null || _b === void 0 ? void 0 : _b[key]) || 20,
                        });
                    });
                    return [2 /*return*/, this.generate({
                            data: data,
                            columns: columns,
                            sheetName: options === null || options === void 0 ? void 0 : options.sheetName,
                            title: options === null || options === void 0 ? void 0 : options.title,
                            includeFilters: (_a = options === null || options === void 0 ? void 0 : options.includeFilters) !== null && _a !== void 0 ? _a : true,
                        })];
                });
            });
        };
        /**
         * Get Excel column letter from index (A, B, C, ... Z, AA, AB, ...)
         */
        ExcelGeneratorService_1.prototype.getColumnLetter = function (columnIndex) {
            var letter = '';
            while (columnIndex > 0) {
                var remainder = (columnIndex - 1) % 26;
                letter = String.fromCharCode(65 + remainder) + letter;
                columnIndex = Math.floor((columnIndex - 1) / 26);
            }
            return letter;
        };
        /**
         * Format column key to readable title
         * Example: "firstName" -> "First Name"
         */
        ExcelGeneratorService_1.prototype.formatColumnTitle = function (key) {
            return key
                .replace(/([A-Z])/g, ' $1')
                .replace(/_/g, ' ')
                .trim()
                .split(' ')
                .map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); })
                .join(' ');
        };
        /**
         * Format summary label for display
         */
        ExcelGeneratorService_1.prototype.formatSummaryLabel = function (key) {
            var labels = {
                total: 'Total de Registros',
                average: 'Média',
                sum: 'Soma',
                min: 'Mínimo',
                max: 'Máximo',
            };
            return labels[key] || this.formatColumnTitle(key);
        };
        return ExcelGeneratorService_1;
    }());
    __setFunctionName(_classThis, "ExcelGeneratorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExcelGeneratorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExcelGeneratorService = _classThis;
}();
exports.ExcelGeneratorService = ExcelGeneratorService;
