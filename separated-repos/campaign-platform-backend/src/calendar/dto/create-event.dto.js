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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEventDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateEventDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _visibility_decorators;
    var _visibility_initializers = [];
    var _visibility_extraInitializers = [];
    var _startDate_decorators;
    var _startDate_initializers = [];
    var _startDate_extraInitializers = [];
    var _startTime_decorators;
    var _startTime_initializers = [];
    var _startTime_extraInitializers = [];
    var _endDate_decorators;
    var _endDate_initializers = [];
    var _endDate_extraInitializers = [];
    var _endTime_decorators;
    var _endTime_initializers = [];
    var _endTime_extraInitializers = [];
    var _allDay_decorators;
    var _allDay_initializers = [];
    var _allDay_extraInitializers = [];
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _state_decorators;
    var _state_initializers = [];
    var _state_extraInitializers = [];
    var _zipCode_decorators;
    var _zipCode_initializers = [];
    var _zipCode_extraInitializers = [];
    var _latitude_decorators;
    var _latitude_initializers = [];
    var _latitude_extraInitializers = [];
    var _longitude_decorators;
    var _longitude_initializers = [];
    var _longitude_extraInitializers = [];
    var _expectedAttendees_decorators;
    var _expectedAttendees_initializers = [];
    var _expectedAttendees_extraInitializers = [];
    var _confirmedAttendees_decorators;
    var _confirmedAttendees_initializers = [];
    var _confirmedAttendees_extraInitializers = [];
    var _organizer_decorators;
    var _organizer_initializers = [];
    var _organizer_extraInitializers = [];
    var _contactPerson_decorators;
    var _contactPerson_initializers = [];
    var _contactPerson_extraInitializers = [];
    var _contactPhone_decorators;
    var _contactPhone_initializers = [];
    var _contactPhone_extraInitializers = [];
    var _contactEmail_decorators;
    var _contactEmail_initializers = [];
    var _contactEmail_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    var _color_decorators;
    var _color_initializers = [];
    var _color_extraInitializers = [];
    var _reminderSet_decorators;
    var _reminderSet_initializers = [];
    var _reminderSet_extraInitializers = [];
    var _reminderMinutesBefore_decorators;
    var _reminderMinutesBefore_initializers = [];
    var _reminderMinutesBefore_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateEventDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.type = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.status = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.visibility = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _visibility_initializers, void 0));
                this.startDate = (__runInitializers(this, _visibility_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.startTime = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _startTime_initializers, void 0));
                this.endDate = (__runInitializers(this, _startTime_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.endTime = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _endTime_initializers, void 0));
                this.allDay = (__runInitializers(this, _endTime_extraInitializers), __runInitializers(this, _allDay_initializers, void 0));
                this.location = (__runInitializers(this, _allDay_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.address = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.city = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.state = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.zipCode = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _zipCode_initializers, void 0));
                this.latitude = (__runInitializers(this, _zipCode_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                this.expectedAttendees = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _expectedAttendees_initializers, void 0));
                this.confirmedAttendees = (__runInitializers(this, _expectedAttendees_extraInitializers), __runInitializers(this, _confirmedAttendees_initializers, void 0));
                this.organizer = (__runInitializers(this, _confirmedAttendees_extraInitializers), __runInitializers(this, _organizer_initializers, void 0));
                this.contactPerson = (__runInitializers(this, _organizer_extraInitializers), __runInitializers(this, _contactPerson_initializers, void 0));
                this.contactPhone = (__runInitializers(this, _contactPerson_extraInitializers), __runInitializers(this, _contactPhone_initializers, void 0));
                this.contactEmail = (__runInitializers(this, _contactPhone_extraInitializers), __runInitializers(this, _contactEmail_initializers, void 0));
                this.notes = (__runInitializers(this, _contactEmail_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.tags = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.color = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _color_initializers, void 0));
                this.reminderSet = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _reminderSet_initializers, void 0));
                this.reminderMinutesBefore = (__runInitializers(this, _reminderSet_extraInitializers), __runInitializers(this, _reminderMinutesBefore_initializers, void 0));
                __runInitializers(this, _reminderMinutesBefore_extraInitializers);
            }
            return CreateEventDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event title', example: 'Comício na Praça Central' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Event description',
                    example: 'Grande comício com artistas locais',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Event type',
                    enum: [
                        'COMICIO',
                        'REUNIAO',
                        'VISITA',
                        'ENTREVISTA',
                        'DEBATE',
                        'CAMINHADA',
                        'CORPO_A_CORPO',
                        'EVENTO_PRIVADO',
                        'OUTRO',
                    ],
                    example: 'COMICIO',
                }), (0, class_validator_1.IsEnum)([
                    'COMICIO',
                    'REUNIAO',
                    'VISITA',
                    'ENTREVISTA',
                    'DEBATE',
                    'CAMINHADA',
                    'CORPO_A_CORPO',
                    'EVENTO_PRIVADO',
                    'OUTRO',
                ])];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Event status',
                    enum: ['AGENDADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO', 'ADIADO'],
                    example: 'AGENDADO',
                    default: 'AGENDADO',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['AGENDADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO', 'ADIADO'])];
            _visibility_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Event visibility',
                    enum: ['PUBLICO', 'PRIVADO', 'INTERNO'],
                    example: 'PUBLICO',
                    default: 'PUBLICO',
                }), (0, class_validator_1.IsEnum)(['PUBLICO', 'PRIVADO', 'INTERNO'])];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date', example: '2024-03-15' }), (0, class_validator_1.IsDateString)()];
            _startTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start time', example: '14:00' }), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Start time must be in HH:MM format' })];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date', example: '2024-03-15' }), (0, class_validator_1.IsDateString)()];
            _endTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'End time', example: '18:00' }), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'End time must be in HH:MM format' })];
            _allDay_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'All day event', example: false, default: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _location_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Event location name', example: 'Praça Central' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(255)];
            _address_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Full address', example: 'Rua das Flores, 123' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _city_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'City', example: 'São Paulo' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _state_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'State', example: 'SP' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2)];
            _zipCode_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'ZIP code', example: '01234-567' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(10)];
            _latitude_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Latitude', example: '-23.5505' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _longitude_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Longitude', example: '-46.6333' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _expectedAttendees_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expected attendees', example: '200-500' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(50)];
            _confirmedAttendees_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Confirmed attendees', example: '150' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(10)];
            _organizer_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Event organizer', example: 'Comitê Central' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(255)];
            _contactPerson_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Contact person', example: 'Maria Silva' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(255)];
            _contactPhone_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Contact phone', example: '(11) 98765-4321' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(20)];
            _contactEmail_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Contact email', example: 'maria@example.com' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(255)];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Tags (JSON array)',
                    example: '["importante", "eleicao2024"]',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _color_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Color for calendar display', example: '#FF5733' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(/^#[0-9A-F]{6}$/i, { message: 'Color must be a valid hex color code' })];
            _reminderSet_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Set reminder', example: true, default: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _reminderMinutesBefore_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Reminder minutes before event', example: '30' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _visibility_decorators, { kind: "field", name: "visibility", static: false, private: false, access: { has: function (obj) { return "visibility" in obj; }, get: function (obj) { return obj.visibility; }, set: function (obj, value) { obj.visibility = value; } }, metadata: _metadata }, _visibility_initializers, _visibility_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: function (obj) { return "startDate" in obj; }, get: function (obj) { return obj.startDate; }, set: function (obj, value) { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _startTime_decorators, { kind: "field", name: "startTime", static: false, private: false, access: { has: function (obj) { return "startTime" in obj; }, get: function (obj) { return obj.startTime; }, set: function (obj, value) { obj.startTime = value; } }, metadata: _metadata }, _startTime_initializers, _startTime_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: function (obj) { return "endDate" in obj; }, get: function (obj) { return obj.endDate; }, set: function (obj, value) { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _endTime_decorators, { kind: "field", name: "endTime", static: false, private: false, access: { has: function (obj) { return "endTime" in obj; }, get: function (obj) { return obj.endTime; }, set: function (obj, value) { obj.endTime = value; } }, metadata: _metadata }, _endTime_initializers, _endTime_extraInitializers);
            __esDecorate(null, null, _allDay_decorators, { kind: "field", name: "allDay", static: false, private: false, access: { has: function (obj) { return "allDay" in obj; }, get: function (obj) { return obj.allDay; }, set: function (obj, value) { obj.allDay = value; } }, metadata: _metadata }, _allDay_initializers, _allDay_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _zipCode_decorators, { kind: "field", name: "zipCode", static: false, private: false, access: { has: function (obj) { return "zipCode" in obj; }, get: function (obj) { return obj.zipCode; }, set: function (obj, value) { obj.zipCode = value; } }, metadata: _metadata }, _zipCode_initializers, _zipCode_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            __esDecorate(null, null, _expectedAttendees_decorators, { kind: "field", name: "expectedAttendees", static: false, private: false, access: { has: function (obj) { return "expectedAttendees" in obj; }, get: function (obj) { return obj.expectedAttendees; }, set: function (obj, value) { obj.expectedAttendees = value; } }, metadata: _metadata }, _expectedAttendees_initializers, _expectedAttendees_extraInitializers);
            __esDecorate(null, null, _confirmedAttendees_decorators, { kind: "field", name: "confirmedAttendees", static: false, private: false, access: { has: function (obj) { return "confirmedAttendees" in obj; }, get: function (obj) { return obj.confirmedAttendees; }, set: function (obj, value) { obj.confirmedAttendees = value; } }, metadata: _metadata }, _confirmedAttendees_initializers, _confirmedAttendees_extraInitializers);
            __esDecorate(null, null, _organizer_decorators, { kind: "field", name: "organizer", static: false, private: false, access: { has: function (obj) { return "organizer" in obj; }, get: function (obj) { return obj.organizer; }, set: function (obj, value) { obj.organizer = value; } }, metadata: _metadata }, _organizer_initializers, _organizer_extraInitializers);
            __esDecorate(null, null, _contactPerson_decorators, { kind: "field", name: "contactPerson", static: false, private: false, access: { has: function (obj) { return "contactPerson" in obj; }, get: function (obj) { return obj.contactPerson; }, set: function (obj, value) { obj.contactPerson = value; } }, metadata: _metadata }, _contactPerson_initializers, _contactPerson_extraInitializers);
            __esDecorate(null, null, _contactPhone_decorators, { kind: "field", name: "contactPhone", static: false, private: false, access: { has: function (obj) { return "contactPhone" in obj; }, get: function (obj) { return obj.contactPhone; }, set: function (obj, value) { obj.contactPhone = value; } }, metadata: _metadata }, _contactPhone_initializers, _contactPhone_extraInitializers);
            __esDecorate(null, null, _contactEmail_decorators, { kind: "field", name: "contactEmail", static: false, private: false, access: { has: function (obj) { return "contactEmail" in obj; }, get: function (obj) { return obj.contactEmail; }, set: function (obj, value) { obj.contactEmail = value; } }, metadata: _metadata }, _contactEmail_initializers, _contactEmail_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: function (obj) { return "color" in obj; }, get: function (obj) { return obj.color; }, set: function (obj, value) { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(null, null, _reminderSet_decorators, { kind: "field", name: "reminderSet", static: false, private: false, access: { has: function (obj) { return "reminderSet" in obj; }, get: function (obj) { return obj.reminderSet; }, set: function (obj, value) { obj.reminderSet = value; } }, metadata: _metadata }, _reminderSet_initializers, _reminderSet_extraInitializers);
            __esDecorate(null, null, _reminderMinutesBefore_decorators, { kind: "field", name: "reminderMinutesBefore", static: false, private: false, access: { has: function (obj) { return "reminderMinutesBefore" in obj; }, get: function (obj) { return obj.reminderMinutesBefore; }, set: function (obj, value) { obj.reminderMinutesBefore = value; } }, metadata: _metadata }, _reminderMinutesBefore_initializers, _reminderMinutesBefore_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateEventDto = CreateEventDto;
