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
exports.CsvGeneratorService = void 0;
var common_1 = require("@nestjs/common");
var csv_writer_1 = require("csv-writer");
var fs = require("fs/promises");
var path = require("path");
var crypto_1 = require("crypto");
/**
 * CSV Generator Service
 *
 * Generates CSV exports with proper encoding for Excel compatibility.
 * Uses UTF-8 BOM and Brazilian delimiter (semicolon) by default.
 */
var CsvGeneratorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CsvGeneratorService = _classThis = /** @class */ (function () {
        function CsvGeneratorService_1() {
            this.tempDir = path.join(process.cwd(), 'temp');
        }
        /**
         * Ensure temp directory exists
         */
        CsvGeneratorService_1.prototype.ensureTempDir = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 4]);
                            return [4 /*yield*/, fs.access(this.tempDir)];
                        case 1:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            _a = _b.sent();
                            return [4 /*yield*/, fs.mkdir(this.tempDir, { recursive: true })];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Generate CSV from data
         *
         * @param options CSV generation options
         * @returns CSV as Buffer with UTF-8 BOM
         */
        CsvGeneratorService_1.prototype.generate = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                var tempFilePath, delimiter, csvWriter, csvContent, BOM, csvWithBOM, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.ensureTempDir()];
                        case 1:
                            _a.sent();
                            tempFilePath = path.join(this.tempDir, "".concat((0, crypto_1.randomUUID)(), ".csv"));
                            delimiter = options.delimiter || ';';
                            csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
                                path: tempFilePath,
                                header: options.columns,
                                fieldDelimiter: delimiter,
                                encoding: 'utf8',
                            });
                            // Write data to CSV
                            return [4 /*yield*/, csvWriter.writeRecords(options.data)];
                        case 2:
                            // Write data to CSV
                            _a.sent();
                            return [4 /*yield*/, fs.readFile(tempFilePath, 'utf-8')];
                        case 3:
                            csvContent = _a.sent();
                            // Delete temp file
                            return [4 /*yield*/, fs.unlink(tempFilePath)];
                        case 4:
                            // Delete temp file
                            _a.sent();
                            BOM = '\uFEFF';
                            csvWithBOM = BOM + csvContent;
                            return [2 /*return*/, Buffer.from(csvWithBOM, 'utf-8')];
                        case 5:
                            error_1 = _a.sent();
                            throw new common_1.InternalServerErrorException("Failed to generate CSV: ".concat(error_1.message));
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Generate CSV from objects (auto-detect columns)
         *
         * @param data Array of objects
         * @param columnTitles Optional custom column titles (key -> title mapping)
         * @returns CSV as Buffer
         */
        CsvGeneratorService_1.prototype.generateFromObjects = function (data, columnTitles) {
            return __awaiter(this, void 0, void 0, function () {
                var firstRow, columns;
                var _this = this;
                return __generator(this, function (_a) {
                    if (!data || data.length === 0) {
                        throw new common_1.InternalServerErrorException('No data provided for CSV generation');
                    }
                    firstRow = data[0];
                    columns = Object.keys(firstRow).map(function (key) { return ({
                        id: key,
                        title: (columnTitles === null || columnTitles === void 0 ? void 0 : columnTitles[key]) || _this.formatColumnTitle(key),
                    }); });
                    return [2 /*return*/, this.generate({ data: data, columns: columns })];
                });
            });
        };
        /**
         * Format column key to readable title
         * Example: "firstName" -> "First Name"
         */
        CsvGeneratorService_1.prototype.formatColumnTitle = function (key) {
            return key
                .replace(/([A-Z])/g, ' $1') // Add space before capitals
                .replace(/_/g, ' ') // Replace underscores with spaces
                .trim()
                .split(' ')
                .map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); })
                .join(' ');
        };
        /**
         * Generate CSV with custom options
         *
         * @param data Array of objects
         * @param options Custom options
         * @returns CSV as Buffer
         */
        CsvGeneratorService_1.prototype.generateWithOptions = function (data, options) {
            return __awaiter(this, void 0, void 0, function () {
                var columns;
                var _this = this;
                return __generator(this, function (_a) {
                    if (!data || data.length === 0) {
                        throw new common_1.InternalServerErrorException('No data provided for CSV generation');
                    }
                    columns = options.columns ||
                        Object.keys(data[0]).map(function (key) { return ({
                            id: key,
                            title: _this.formatColumnTitle(key),
                        }); });
                    return [2 /*return*/, this.generate({
                            data: data,
                            columns: columns,
                            delimiter: options.delimiter,
                        })];
                });
            });
        };
        return CsvGeneratorService_1;
    }());
    __setFunctionName(_classThis, "CsvGeneratorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CsvGeneratorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CsvGeneratorService = _classThis;
}();
exports.CsvGeneratorService = CsvGeneratorService;
