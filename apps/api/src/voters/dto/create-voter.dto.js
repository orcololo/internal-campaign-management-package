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
exports.CreateVoterDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var CreateVoterDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _motherName_decorators;
    var _motherName_initializers = [];
    var _motherName_extraInitializers = [];
    var _cpf_decorators;
    var _cpf_initializers = [];
    var _cpf_extraInitializers = [];
    var _dateOfBirth_decorators;
    var _dateOfBirth_initializers = [];
    var _dateOfBirth_extraInitializers = [];
    var _gender_decorators;
    var _gender_initializers = [];
    var _gender_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _whatsapp_decorators;
    var _whatsapp_initializers = [];
    var _whatsapp_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    var _addressNumber_decorators;
    var _addressNumber_initializers = [];
    var _addressNumber_extraInitializers = [];
    var _addressComplement_decorators;
    var _addressComplement_initializers = [];
    var _addressComplement_extraInitializers = [];
    var _neighborhood_decorators;
    var _neighborhood_initializers = [];
    var _neighborhood_extraInitializers = [];
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
    var _electoralTitle_decorators;
    var _electoralTitle_initializers = [];
    var _electoralTitle_extraInitializers = [];
    var _electoralZone_decorators;
    var _electoralZone_initializers = [];
    var _electoralZone_extraInitializers = [];
    var _electoralSection_decorators;
    var _electoralSection_initializers = [];
    var _electoralSection_extraInitializers = [];
    var _votingLocation_decorators;
    var _votingLocation_initializers = [];
    var _votingLocation_extraInitializers = [];
    var _educationLevel_decorators;
    var _educationLevel_initializers = [];
    var _educationLevel_extraInitializers = [];
    var _occupation_decorators;
    var _occupation_initializers = [];
    var _occupation_extraInitializers = [];
    var _incomeLevel_decorators;
    var _incomeLevel_initializers = [];
    var _incomeLevel_extraInitializers = [];
    var _maritalStatus_decorators;
    var _maritalStatus_initializers = [];
    var _maritalStatus_extraInitializers = [];
    var _religion_decorators;
    var _religion_initializers = [];
    var _religion_extraInitializers = [];
    var _ethnicity_decorators;
    var _ethnicity_initializers = [];
    var _ethnicity_extraInitializers = [];
    var _facebook_decorators;
    var _facebook_initializers = [];
    var _facebook_extraInitializers = [];
    var _instagram_decorators;
    var _instagram_initializers = [];
    var _instagram_extraInitializers = [];
    var _twitter_decorators;
    var _twitter_initializers = [];
    var _twitter_extraInitializers = [];
    var _supportLevel_decorators;
    var _supportLevel_initializers = [];
    var _supportLevel_extraInitializers = [];
    var _politicalParty_decorators;
    var _politicalParty_initializers = [];
    var _politicalParty_extraInitializers = [];
    var _votingHistory_decorators;
    var _votingHistory_initializers = [];
    var _votingHistory_extraInitializers = [];
    var _topIssues_decorators;
    var _topIssues_initializers = [];
    var _topIssues_extraInitializers = [];
    var _issuePositions_decorators;
    var _issuePositions_initializers = [];
    var _issuePositions_extraInitializers = [];
    var _previousCandidateSupport_decorators;
    var _previousCandidateSupport_initializers = [];
    var _previousCandidateSupport_extraInitializers = [];
    var _influencerScore_decorators;
    var _influencerScore_initializers = [];
    var _influencerScore_extraInitializers = [];
    var _persuadability_decorators;
    var _persuadability_initializers = [];
    var _persuadability_extraInitializers = [];
    var _turnoutLikelihood_decorators;
    var _turnoutLikelihood_initializers = [];
    var _turnoutLikelihood_extraInitializers = [];
    var _familyMembers_decorators;
    var _familyMembers_initializers = [];
    var _familyMembers_extraInitializers = [];
    var _hasWhatsapp_decorators;
    var _hasWhatsapp_initializers = [];
    var _hasWhatsapp_extraInitializers = [];
    var _preferredContact_decorators;
    var _preferredContact_initializers = [];
    var _preferredContact_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    var _engagementTrend_decorators;
    var _engagementTrend_initializers = [];
    var _engagementTrend_extraInitializers = [];
    var _seasonalActivity_decorators;
    var _seasonalActivity_initializers = [];
    var _seasonalActivity_extraInitializers = [];
    var _lastContactDate_decorators;
    var _lastContactDate_initializers = [];
    var _lastContactDate_extraInitializers = [];
    var _contactFrequency_decorators;
    var _contactFrequency_initializers = [];
    var _contactFrequency_extraInitializers = [];
    var _responseRate_decorators;
    var _responseRate_initializers = [];
    var _responseRate_extraInitializers = [];
    var _eventAttendance_decorators;
    var _eventAttendance_initializers = [];
    var _eventAttendance_extraInitializers = [];
    var _volunteerStatus_decorators;
    var _volunteerStatus_initializers = [];
    var _volunteerStatus_extraInitializers = [];
    var _donationHistory_decorators;
    var _donationHistory_initializers = [];
    var _donationHistory_extraInitializers = [];
    var _engagementScore_decorators;
    var _engagementScore_initializers = [];
    var _engagementScore_extraInitializers = [];
    var _ageGroup_decorators;
    var _ageGroup_initializers = [];
    var _ageGroup_extraInitializers = [];
    var _householdType_decorators;
    var _householdType_initializers = [];
    var _householdType_extraInitializers = [];
    var _employmentStatus_decorators;
    var _employmentStatus_initializers = [];
    var _employmentStatus_extraInitializers = [];
    var _vehicleOwnership_decorators;
    var _vehicleOwnership_initializers = [];
    var _vehicleOwnership_extraInitializers = [];
    var _internetAccess_decorators;
    var _internetAccess_initializers = [];
    var _internetAccess_extraInitializers = [];
    var _communicationStyle_decorators;
    var _communicationStyle_initializers = [];
    var _communicationStyle_extraInitializers = [];
    var _contentPreference_decorators;
    var _contentPreference_initializers = [];
    var _contentPreference_extraInitializers = [];
    var _bestContactTime_decorators;
    var _bestContactTime_initializers = [];
    var _bestContactTime_extraInitializers = [];
    var _bestContactDay_decorators;
    var _bestContactDay_initializers = [];
    var _bestContactDay_extraInitializers = [];
    var _socialMediaFollowers_decorators;
    var _socialMediaFollowers_initializers = [];
    var _socialMediaFollowers_extraInitializers = [];
    var _communityRole_decorators;
    var _communityRole_initializers = [];
    var _communityRole_extraInitializers = [];
    var _networkSize_decorators;
    var _networkSize_initializers = [];
    var _networkSize_extraInitializers = [];
    var _influenceRadius_decorators;
    var _influenceRadius_initializers = [];
    var _influenceRadius_extraInitializers = [];
    var _referralCode_decorators;
    var _referralCode_initializers = [];
    var _referralCode_extraInitializers = [];
    var _referredBy_decorators;
    var _referredBy_initializers = [];
    var _referredBy_extraInitializers = [];
    var _referralDate_decorators;
    var _referralDate_initializers = [];
    var _referralDate_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateVoterDto() {
                // Basic Information
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.motherName = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _motherName_initializers, void 0));
                this.cpf = (__runInitializers(this, _motherName_extraInitializers), __runInitializers(this, _cpf_initializers, void 0));
                this.dateOfBirth = (__runInitializers(this, _cpf_extraInitializers), __runInitializers(this, _dateOfBirth_initializers, void 0));
                this.gender = (__runInitializers(this, _dateOfBirth_extraInitializers), __runInitializers(this, _gender_initializers, void 0));
                // Contact Information
                this.phone = (__runInitializers(this, _gender_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.whatsapp = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _whatsapp_initializers, void 0));
                this.email = (__runInitializers(this, _whatsapp_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                // Address Information
                this.address = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.addressNumber = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _addressNumber_initializers, void 0));
                this.addressComplement = (__runInitializers(this, _addressNumber_extraInitializers), __runInitializers(this, _addressComplement_initializers, void 0));
                this.neighborhood = (__runInitializers(this, _addressComplement_extraInitializers), __runInitializers(this, _neighborhood_initializers, void 0));
                this.city = (__runInitializers(this, _neighborhood_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.state = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.zipCode = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _zipCode_initializers, void 0));
                this.latitude = (__runInitializers(this, _zipCode_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                // Electoral Information
                this.electoralTitle = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _electoralTitle_initializers, void 0));
                this.electoralZone = (__runInitializers(this, _electoralTitle_extraInitializers), __runInitializers(this, _electoralZone_initializers, void 0));
                this.electoralSection = (__runInitializers(this, _electoralZone_extraInitializers), __runInitializers(this, _electoralSection_initializers, void 0));
                this.votingLocation = (__runInitializers(this, _electoralSection_extraInitializers), __runInitializers(this, _votingLocation_initializers, void 0));
                // Social Segmentation
                this.educationLevel = (__runInitializers(this, _votingLocation_extraInitializers), __runInitializers(this, _educationLevel_initializers, void 0));
                this.occupation = (__runInitializers(this, _educationLevel_extraInitializers), __runInitializers(this, _occupation_initializers, void 0));
                this.incomeLevel = (__runInitializers(this, _occupation_extraInitializers), __runInitializers(this, _incomeLevel_initializers, void 0));
                this.maritalStatus = (__runInitializers(this, _incomeLevel_extraInitializers), __runInitializers(this, _maritalStatus_initializers, void 0));
                this.religion = (__runInitializers(this, _maritalStatus_extraInitializers), __runInitializers(this, _religion_initializers, void 0));
                this.ethnicity = (__runInitializers(this, _religion_extraInitializers), __runInitializers(this, _ethnicity_initializers, void 0));
                // Social Media
                this.facebook = (__runInitializers(this, _ethnicity_extraInitializers), __runInitializers(this, _facebook_initializers, void 0));
                this.instagram = (__runInitializers(this, _facebook_extraInitializers), __runInitializers(this, _instagram_initializers, void 0));
                this.twitter = (__runInitializers(this, _instagram_extraInitializers), __runInitializers(this, _twitter_initializers, void 0));
                // Political Information
                this.supportLevel = (__runInitializers(this, _twitter_extraInitializers), __runInitializers(this, _supportLevel_initializers, void 0));
                this.politicalParty = (__runInitializers(this, _supportLevel_extraInitializers), __runInitializers(this, _politicalParty_initializers, void 0));
                this.votingHistory = (__runInitializers(this, _politicalParty_extraInitializers), __runInitializers(this, _votingHistory_initializers, void 0));
                this.topIssues = (__runInitializers(this, _votingHistory_extraInitializers), __runInitializers(this, _topIssues_initializers, void 0));
                this.issuePositions = (__runInitializers(this, _topIssues_extraInitializers), __runInitializers(this, _issuePositions_initializers, void 0));
                this.previousCandidateSupport = (__runInitializers(this, _issuePositions_extraInitializers), __runInitializers(this, _previousCandidateSupport_initializers, void 0));
                this.influencerScore = (__runInitializers(this, _previousCandidateSupport_extraInitializers), __runInitializers(this, _influencerScore_initializers, void 0));
                this.persuadability = (__runInitializers(this, _influencerScore_extraInitializers), __runInitializers(this, _persuadability_initializers, void 0));
                this.turnoutLikelihood = (__runInitializers(this, _persuadability_extraInitializers), __runInitializers(this, _turnoutLikelihood_initializers, void 0));
                // Additional Information
                this.familyMembers = (__runInitializers(this, _turnoutLikelihood_extraInitializers), __runInitializers(this, _familyMembers_initializers, void 0));
                this.hasWhatsapp = (__runInitializers(this, _familyMembers_extraInitializers), __runInitializers(this, _hasWhatsapp_initializers, void 0));
                this.preferredContact = (__runInitializers(this, _hasWhatsapp_extraInitializers), __runInitializers(this, _preferredContact_initializers, void 0));
                this.notes = (__runInitializers(this, _preferredContact_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.tags = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                // Engagement & Behavioral
                this.engagementTrend = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _engagementTrend_initializers, void 0));
                this.seasonalActivity = (__runInitializers(this, _engagementTrend_extraInitializers), __runInitializers(this, _seasonalActivity_initializers, void 0));
                this.lastContactDate = (__runInitializers(this, _seasonalActivity_extraInitializers), __runInitializers(this, _lastContactDate_initializers, void 0));
                this.contactFrequency = (__runInitializers(this, _lastContactDate_extraInitializers), __runInitializers(this, _contactFrequency_initializers, void 0));
                this.responseRate = (__runInitializers(this, _contactFrequency_extraInitializers), __runInitializers(this, _responseRate_initializers, void 0));
                this.eventAttendance = (__runInitializers(this, _responseRate_extraInitializers), __runInitializers(this, _eventAttendance_initializers, void 0));
                this.volunteerStatus = (__runInitializers(this, _eventAttendance_extraInitializers), __runInitializers(this, _volunteerStatus_initializers, void 0));
                this.donationHistory = (__runInitializers(this, _volunteerStatus_extraInitializers), __runInitializers(this, _donationHistory_initializers, void 0));
                this.engagementScore = (__runInitializers(this, _donationHistory_extraInitializers), __runInitializers(this, _engagementScore_initializers, void 0));
                // Demographics Extended
                this.ageGroup = (__runInitializers(this, _engagementScore_extraInitializers), __runInitializers(this, _ageGroup_initializers, void 0));
                this.householdType = (__runInitializers(this, _ageGroup_extraInitializers), __runInitializers(this, _householdType_initializers, void 0));
                this.employmentStatus = (__runInitializers(this, _householdType_extraInitializers), __runInitializers(this, _employmentStatus_initializers, void 0));
                this.vehicleOwnership = (__runInitializers(this, _employmentStatus_extraInitializers), __runInitializers(this, _vehicleOwnership_initializers, void 0));
                this.internetAccess = (__runInitializers(this, _vehicleOwnership_extraInitializers), __runInitializers(this, _internetAccess_initializers, void 0));
                // Communication Preferences Extended
                this.communicationStyle = (__runInitializers(this, _internetAccess_extraInitializers), __runInitializers(this, _communicationStyle_initializers, void 0));
                this.contentPreference = (__runInitializers(this, _communicationStyle_extraInitializers), __runInitializers(this, _contentPreference_initializers, void 0));
                this.bestContactTime = (__runInitializers(this, _contentPreference_extraInitializers), __runInitializers(this, _bestContactTime_initializers, void 0));
                this.bestContactDay = (__runInitializers(this, _bestContactTime_extraInitializers), __runInitializers(this, _bestContactDay_initializers, void 0));
                // Social Network & Influence
                this.socialMediaFollowers = (__runInitializers(this, _bestContactDay_extraInitializers), __runInitializers(this, _socialMediaFollowers_initializers, void 0));
                this.communityRole = (__runInitializers(this, _socialMediaFollowers_extraInitializers), __runInitializers(this, _communityRole_initializers, void 0));
                this.networkSize = (__runInitializers(this, _communityRole_extraInitializers), __runInitializers(this, _networkSize_initializers, void 0));
                this.influenceRadius = (__runInitializers(this, _networkSize_extraInitializers), __runInitializers(this, _influenceRadius_initializers, void 0));
                this.referralCode = (__runInitializers(this, _influenceRadius_extraInitializers), __runInitializers(this, _referralCode_initializers, void 0));
                this.referredBy = (__runInitializers(this, _referralCode_extraInitializers), __runInitializers(this, _referredBy_initializers, void 0));
                this.referralDate = (__runInitializers(this, _referredBy_extraInitializers), __runInitializers(this, _referralDate_initializers, void 0));
                __runInitializers(this, _referralDate_extraInitializers);
            }
            return CreateVoterDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Full name of the voter', example: 'João da Silva' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _motherName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Mother\'s name', example: 'Maria da Silva' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(255)];
            _cpf_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'CPF (Brazilian ID)', example: '123.456.789-00' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
                    message: 'CPF must be in format: 000.000.000-00',
                })];
            _dateOfBirth_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Date of birth', example: '1985-05-15' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _gender_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Gender',
                    enum: ['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'],
                    example: 'MASCULINO',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'])];
            _phone_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Phone number', example: '(11) 98765-4321' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(20)];
            _whatsapp_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'WhatsApp number', example: '(11) 98765-4321' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(20)];
            _email_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Email address', example: 'joao@example.com' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)(), (0, class_validator_1.MaxLength)(255)];
            _address_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Street address', example: 'Rua das Flores' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _addressNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Address number', example: '123' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(10)];
            _addressComplement_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Address complement', example: 'Apto 45' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _neighborhood_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Neighborhood', example: 'Centro' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _city_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'City', example: 'São Paulo' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _state_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'State code', example: 'SP' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2)];
            _zipCode_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'ZIP code', example: '01234-567' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(10)];
            _latitude_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Latitude', example: -23.5505 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _longitude_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Longitude', example: -46.6333 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _electoralTitle_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Electoral title number', example: '1234 5678 9012' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(20)];
            _electoralZone_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Electoral zone', example: '001' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(10)];
            _electoralSection_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Electoral section', example: '0123' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(10)];
            _votingLocation_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Voting location', example: 'Escola Municipal Central' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(255)];
            _educationLevel_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Education level',
                    enum: [
                        'FUNDAMENTAL_INCOMPLETO',
                        'FUNDAMENTAL_COMPLETO',
                        'MEDIO_INCOMPLETO',
                        'MEDIO_COMPLETO',
                        'SUPERIOR_INCOMPLETO',
                        'SUPERIOR_COMPLETO',
                        'POS_GRADUACAO',
                        'NAO_INFORMADO',
                    ],
                    example: 'SUPERIOR_COMPLETO',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)([
                    'FUNDAMENTAL_INCOMPLETO',
                    'FUNDAMENTAL_COMPLETO',
                    'MEDIO_INCOMPLETO',
                    'MEDIO_COMPLETO',
                    'SUPERIOR_INCOMPLETO',
                    'SUPERIOR_COMPLETO',
                    'POS_GRADUACAO',
                    'NAO_INFORMADO',
                ])];
            _occupation_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Occupation/Profession', example: 'Professor' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(150)];
            _incomeLevel_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Income level',
                    enum: [
                        'ATE_1_SALARIO',
                        'DE_1_A_2_SALARIOS',
                        'DE_2_A_5_SALARIOS',
                        'DE_5_A_10_SALARIOS',
                        'ACIMA_10_SALARIOS',
                        'NAO_INFORMADO',
                    ],
                    example: 'DE_2_A_5_SALARIOS',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)([
                    'ATE_1_SALARIO',
                    'DE_1_A_2_SALARIOS',
                    'DE_2_A_5_SALARIOS',
                    'DE_5_A_10_SALARIOS',
                    'ACIMA_10_SALARIOS',
                    'NAO_INFORMADO',
                ])];
            _maritalStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Marital status',
                    enum: ['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL', 'NAO_INFORMADO'],
                    example: 'CASADO',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL', 'NAO_INFORMADO'])];
            _religion_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Religion', example: 'Católica' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _ethnicity_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Ethnicity/Race', example: 'Parda' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(50)];
            _facebook_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Facebook profile', example: 'facebook.com/joaosilva' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(255)];
            _instagram_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Instagram handle', example: '@joaosilva' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(255)];
            _twitter_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Twitter/X handle', example: '@joaosilva' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(255)];
            _supportLevel_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Support level for the campaign',
                    enum: [
                        'MUITO_FAVORAVEL',
                        'FAVORAVEL',
                        'NEUTRO',
                        'DESFAVORAVEL',
                        'MUITO_DESFAVORAVEL',
                        'NAO_DEFINIDO',
                    ],
                    example: 'FAVORAVEL',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)([
                    'MUITO_FAVORAVEL',
                    'FAVORAVEL',
                    'NEUTRO',
                    'DESFAVORAVEL',
                    'MUITO_DESFAVORAVEL',
                    'NAO_DEFINIDO',
                ])];
            _politicalParty_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Political party affiliation', example: 'PT' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _votingHistory_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Voting history notes',
                    example: 'Voted in last 3 elections',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _topIssues_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Top issues', example: '["Education", "Health"]' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _issuePositions_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Issue positions', example: '{"education": "support"}' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            _previousCandidateSupport_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Previous candidate support', example: 'Candidate X' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _influencerScore_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Influencer score (0-100)', example: 80 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _persuadability_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Persuadability', example: 'ALTO' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(20)];
            _turnoutLikelihood_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Turnout likelihood',
                    enum: ['ALTO', 'MEDIO', 'BAIXO', 'NAO_DEFINIDO'],
                    example: 'ALTO',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['ALTO', 'MEDIO', 'BAIXO', 'NAO_DEFINIDO'])];
            _familyMembers_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Number of family members', example: 4 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _hasWhatsapp_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Has WhatsApp?', example: true }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === 'SIM')
                        return true;
                    if (value === 'NAO')
                        return false;
                    return value;
                }), (0, class_validator_1.IsBoolean)()];
            _preferredContact_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Preferred contact method',
                    enum: ['TELEFONE', 'WHATSAPP', 'EMAIL'],
                    example: 'WHATSAPP',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['TELEFONE', 'WHATSAPP', 'EMAIL'])];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes', example: 'Contact in the morning' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Tags for categorization',
                    example: '["lideranca_local", "apoiador"]',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _engagementTrend_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Engagement trend', example: 'CRESCENTE' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['CRESCENTE', 'ESTAVEL', 'DECRESCENTE', 'NAO_DEFINIDO'])];
            _seasonalActivity_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Seasonal activity (JSON)', example: '{"summer": 10}' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            _lastContactDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Last contact date', example: '2023-01-01' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _contactFrequency_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Contact frequency', example: 5 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _responseRate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Response rate', example: 80 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _eventAttendance_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Event attendance (JSON array)', example: '["event1"]' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _volunteerStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Volunteer status',
                    enum: ['ATIVO', 'INATIVO', 'INTERESSADO', 'NAO_VOLUNTARIO'],
                    example: 'INTERESSADO',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['ATIVO', 'INATIVO', 'INTERESSADO', 'NAO_VOLUNTARIO'])];
            _donationHistory_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Donation history (JSON array)', example: '[{"amount": 100}]' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _engagementScore_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Engagement score (0-100)', example: 80 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _ageGroup_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Age group', example: '18-25' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(20)];
            _householdType_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Household type',
                    enum: [
                        'SOLTEIRO',
                        'FAMILIA_COM_FILHOS',
                        'FAMILIA_SEM_FILHOS',
                        'IDOSOS',
                        'ESTUDANTES',
                        'NAO_INFORMADO',
                    ],
                    example: 'SOLTEIRO',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)([
                    'SOLTEIRO',
                    'FAMILIA_COM_FILHOS',
                    'FAMILIA_SEM_FILHOS',
                    'IDOSOS',
                    'ESTUDANTES',
                    'NAO_INFORMADO',
                ])];
            _employmentStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Employment status',
                    enum: [
                        'EMPREGADO',
                        'DESEMPREGADO',
                        'APOSENTADO',
                        'ESTUDANTE',
                        'AUTONOMO',
                        'NAO_INFORMADO',
                    ],
                    example: 'EMPREGADO',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)([
                    'EMPREGADO',
                    'DESEMPREGADO',
                    'APOSENTADO',
                    'ESTUDANTE',
                    'AUTONOMO',
                    'NAO_INFORMADO',
                ])];
            _vehicleOwnership_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Vehicle ownership', example: true }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === 'SIM')
                        return true;
                    if (value === 'NAO')
                        return false;
                    return value;
                }), (0, class_validator_1.IsBoolean)()];
            _internetAccess_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Internet access', example: 'Fibra' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _communicationStyle_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Communication style',
                    enum: ['FORMAL', 'INFORMAL', 'NAO_DEFINIDO'],
                    example: 'FORMAL',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['FORMAL', 'INFORMAL', 'NAO_DEFINIDO'])];
            _contentPreference_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Content preference', example: '["Video"]' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _bestContactTime_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Best contact time', example: 'Manhã' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(50)];
            _bestContactDay_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Best contact day', example: '["Monday"]' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _socialMediaFollowers_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Social media followers', example: 1000 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _communityRole_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Community role',
                    enum: [
                        'LIDER',
                        'MEMBRO_ATIVO',
                        'ATIVISTA',
                        'MEMBRO',
                        'NAO_PARTICIPANTE',
                        'NAO_DEFINIDO',
                    ],
                    example: 'LIDER',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)([
                    'LIDER',
                    'MEMBRO_ATIVO',
                    'ATIVISTA',
                    'MEMBRO',
                    'NAO_PARTICIPANTE',
                    'NAO_DEFINIDO',
                ])];
            _networkSize_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Network size', example: 50 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _influenceRadius_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Influence radius', example: 5 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _referralCode_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Referral code', example: 'JOAO-SILVA-123' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _referredBy_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Referred by (Voter ID)', example: 'uuid' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _referralDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Referral date', example: '2023-01-01' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _motherName_decorators, { kind: "field", name: "motherName", static: false, private: false, access: { has: function (obj) { return "motherName" in obj; }, get: function (obj) { return obj.motherName; }, set: function (obj, value) { obj.motherName = value; } }, metadata: _metadata }, _motherName_initializers, _motherName_extraInitializers);
            __esDecorate(null, null, _cpf_decorators, { kind: "field", name: "cpf", static: false, private: false, access: { has: function (obj) { return "cpf" in obj; }, get: function (obj) { return obj.cpf; }, set: function (obj, value) { obj.cpf = value; } }, metadata: _metadata }, _cpf_initializers, _cpf_extraInitializers);
            __esDecorate(null, null, _dateOfBirth_decorators, { kind: "field", name: "dateOfBirth", static: false, private: false, access: { has: function (obj) { return "dateOfBirth" in obj; }, get: function (obj) { return obj.dateOfBirth; }, set: function (obj, value) { obj.dateOfBirth = value; } }, metadata: _metadata }, _dateOfBirth_initializers, _dateOfBirth_extraInitializers);
            __esDecorate(null, null, _gender_decorators, { kind: "field", name: "gender", static: false, private: false, access: { has: function (obj) { return "gender" in obj; }, get: function (obj) { return obj.gender; }, set: function (obj, value) { obj.gender = value; } }, metadata: _metadata }, _gender_initializers, _gender_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _whatsapp_decorators, { kind: "field", name: "whatsapp", static: false, private: false, access: { has: function (obj) { return "whatsapp" in obj; }, get: function (obj) { return obj.whatsapp; }, set: function (obj, value) { obj.whatsapp = value; } }, metadata: _metadata }, _whatsapp_initializers, _whatsapp_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _addressNumber_decorators, { kind: "field", name: "addressNumber", static: false, private: false, access: { has: function (obj) { return "addressNumber" in obj; }, get: function (obj) { return obj.addressNumber; }, set: function (obj, value) { obj.addressNumber = value; } }, metadata: _metadata }, _addressNumber_initializers, _addressNumber_extraInitializers);
            __esDecorate(null, null, _addressComplement_decorators, { kind: "field", name: "addressComplement", static: false, private: false, access: { has: function (obj) { return "addressComplement" in obj; }, get: function (obj) { return obj.addressComplement; }, set: function (obj, value) { obj.addressComplement = value; } }, metadata: _metadata }, _addressComplement_initializers, _addressComplement_extraInitializers);
            __esDecorate(null, null, _neighborhood_decorators, { kind: "field", name: "neighborhood", static: false, private: false, access: { has: function (obj) { return "neighborhood" in obj; }, get: function (obj) { return obj.neighborhood; }, set: function (obj, value) { obj.neighborhood = value; } }, metadata: _metadata }, _neighborhood_initializers, _neighborhood_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _zipCode_decorators, { kind: "field", name: "zipCode", static: false, private: false, access: { has: function (obj) { return "zipCode" in obj; }, get: function (obj) { return obj.zipCode; }, set: function (obj, value) { obj.zipCode = value; } }, metadata: _metadata }, _zipCode_initializers, _zipCode_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            __esDecorate(null, null, _electoralTitle_decorators, { kind: "field", name: "electoralTitle", static: false, private: false, access: { has: function (obj) { return "electoralTitle" in obj; }, get: function (obj) { return obj.electoralTitle; }, set: function (obj, value) { obj.electoralTitle = value; } }, metadata: _metadata }, _electoralTitle_initializers, _electoralTitle_extraInitializers);
            __esDecorate(null, null, _electoralZone_decorators, { kind: "field", name: "electoralZone", static: false, private: false, access: { has: function (obj) { return "electoralZone" in obj; }, get: function (obj) { return obj.electoralZone; }, set: function (obj, value) { obj.electoralZone = value; } }, metadata: _metadata }, _electoralZone_initializers, _electoralZone_extraInitializers);
            __esDecorate(null, null, _electoralSection_decorators, { kind: "field", name: "electoralSection", static: false, private: false, access: { has: function (obj) { return "electoralSection" in obj; }, get: function (obj) { return obj.electoralSection; }, set: function (obj, value) { obj.electoralSection = value; } }, metadata: _metadata }, _electoralSection_initializers, _electoralSection_extraInitializers);
            __esDecorate(null, null, _votingLocation_decorators, { kind: "field", name: "votingLocation", static: false, private: false, access: { has: function (obj) { return "votingLocation" in obj; }, get: function (obj) { return obj.votingLocation; }, set: function (obj, value) { obj.votingLocation = value; } }, metadata: _metadata }, _votingLocation_initializers, _votingLocation_extraInitializers);
            __esDecorate(null, null, _educationLevel_decorators, { kind: "field", name: "educationLevel", static: false, private: false, access: { has: function (obj) { return "educationLevel" in obj; }, get: function (obj) { return obj.educationLevel; }, set: function (obj, value) { obj.educationLevel = value; } }, metadata: _metadata }, _educationLevel_initializers, _educationLevel_extraInitializers);
            __esDecorate(null, null, _occupation_decorators, { kind: "field", name: "occupation", static: false, private: false, access: { has: function (obj) { return "occupation" in obj; }, get: function (obj) { return obj.occupation; }, set: function (obj, value) { obj.occupation = value; } }, metadata: _metadata }, _occupation_initializers, _occupation_extraInitializers);
            __esDecorate(null, null, _incomeLevel_decorators, { kind: "field", name: "incomeLevel", static: false, private: false, access: { has: function (obj) { return "incomeLevel" in obj; }, get: function (obj) { return obj.incomeLevel; }, set: function (obj, value) { obj.incomeLevel = value; } }, metadata: _metadata }, _incomeLevel_initializers, _incomeLevel_extraInitializers);
            __esDecorate(null, null, _maritalStatus_decorators, { kind: "field", name: "maritalStatus", static: false, private: false, access: { has: function (obj) { return "maritalStatus" in obj; }, get: function (obj) { return obj.maritalStatus; }, set: function (obj, value) { obj.maritalStatus = value; } }, metadata: _metadata }, _maritalStatus_initializers, _maritalStatus_extraInitializers);
            __esDecorate(null, null, _religion_decorators, { kind: "field", name: "religion", static: false, private: false, access: { has: function (obj) { return "religion" in obj; }, get: function (obj) { return obj.religion; }, set: function (obj, value) { obj.religion = value; } }, metadata: _metadata }, _religion_initializers, _religion_extraInitializers);
            __esDecorate(null, null, _ethnicity_decorators, { kind: "field", name: "ethnicity", static: false, private: false, access: { has: function (obj) { return "ethnicity" in obj; }, get: function (obj) { return obj.ethnicity; }, set: function (obj, value) { obj.ethnicity = value; } }, metadata: _metadata }, _ethnicity_initializers, _ethnicity_extraInitializers);
            __esDecorate(null, null, _facebook_decorators, { kind: "field", name: "facebook", static: false, private: false, access: { has: function (obj) { return "facebook" in obj; }, get: function (obj) { return obj.facebook; }, set: function (obj, value) { obj.facebook = value; } }, metadata: _metadata }, _facebook_initializers, _facebook_extraInitializers);
            __esDecorate(null, null, _instagram_decorators, { kind: "field", name: "instagram", static: false, private: false, access: { has: function (obj) { return "instagram" in obj; }, get: function (obj) { return obj.instagram; }, set: function (obj, value) { obj.instagram = value; } }, metadata: _metadata }, _instagram_initializers, _instagram_extraInitializers);
            __esDecorate(null, null, _twitter_decorators, { kind: "field", name: "twitter", static: false, private: false, access: { has: function (obj) { return "twitter" in obj; }, get: function (obj) { return obj.twitter; }, set: function (obj, value) { obj.twitter = value; } }, metadata: _metadata }, _twitter_initializers, _twitter_extraInitializers);
            __esDecorate(null, null, _supportLevel_decorators, { kind: "field", name: "supportLevel", static: false, private: false, access: { has: function (obj) { return "supportLevel" in obj; }, get: function (obj) { return obj.supportLevel; }, set: function (obj, value) { obj.supportLevel = value; } }, metadata: _metadata }, _supportLevel_initializers, _supportLevel_extraInitializers);
            __esDecorate(null, null, _politicalParty_decorators, { kind: "field", name: "politicalParty", static: false, private: false, access: { has: function (obj) { return "politicalParty" in obj; }, get: function (obj) { return obj.politicalParty; }, set: function (obj, value) { obj.politicalParty = value; } }, metadata: _metadata }, _politicalParty_initializers, _politicalParty_extraInitializers);
            __esDecorate(null, null, _votingHistory_decorators, { kind: "field", name: "votingHistory", static: false, private: false, access: { has: function (obj) { return "votingHistory" in obj; }, get: function (obj) { return obj.votingHistory; }, set: function (obj, value) { obj.votingHistory = value; } }, metadata: _metadata }, _votingHistory_initializers, _votingHistory_extraInitializers);
            __esDecorate(null, null, _topIssues_decorators, { kind: "field", name: "topIssues", static: false, private: false, access: { has: function (obj) { return "topIssues" in obj; }, get: function (obj) { return obj.topIssues; }, set: function (obj, value) { obj.topIssues = value; } }, metadata: _metadata }, _topIssues_initializers, _topIssues_extraInitializers);
            __esDecorate(null, null, _issuePositions_decorators, { kind: "field", name: "issuePositions", static: false, private: false, access: { has: function (obj) { return "issuePositions" in obj; }, get: function (obj) { return obj.issuePositions; }, set: function (obj, value) { obj.issuePositions = value; } }, metadata: _metadata }, _issuePositions_initializers, _issuePositions_extraInitializers);
            __esDecorate(null, null, _previousCandidateSupport_decorators, { kind: "field", name: "previousCandidateSupport", static: false, private: false, access: { has: function (obj) { return "previousCandidateSupport" in obj; }, get: function (obj) { return obj.previousCandidateSupport; }, set: function (obj, value) { obj.previousCandidateSupport = value; } }, metadata: _metadata }, _previousCandidateSupport_initializers, _previousCandidateSupport_extraInitializers);
            __esDecorate(null, null, _influencerScore_decorators, { kind: "field", name: "influencerScore", static: false, private: false, access: { has: function (obj) { return "influencerScore" in obj; }, get: function (obj) { return obj.influencerScore; }, set: function (obj, value) { obj.influencerScore = value; } }, metadata: _metadata }, _influencerScore_initializers, _influencerScore_extraInitializers);
            __esDecorate(null, null, _persuadability_decorators, { kind: "field", name: "persuadability", static: false, private: false, access: { has: function (obj) { return "persuadability" in obj; }, get: function (obj) { return obj.persuadability; }, set: function (obj, value) { obj.persuadability = value; } }, metadata: _metadata }, _persuadability_initializers, _persuadability_extraInitializers);
            __esDecorate(null, null, _turnoutLikelihood_decorators, { kind: "field", name: "turnoutLikelihood", static: false, private: false, access: { has: function (obj) { return "turnoutLikelihood" in obj; }, get: function (obj) { return obj.turnoutLikelihood; }, set: function (obj, value) { obj.turnoutLikelihood = value; } }, metadata: _metadata }, _turnoutLikelihood_initializers, _turnoutLikelihood_extraInitializers);
            __esDecorate(null, null, _familyMembers_decorators, { kind: "field", name: "familyMembers", static: false, private: false, access: { has: function (obj) { return "familyMembers" in obj; }, get: function (obj) { return obj.familyMembers; }, set: function (obj, value) { obj.familyMembers = value; } }, metadata: _metadata }, _familyMembers_initializers, _familyMembers_extraInitializers);
            __esDecorate(null, null, _hasWhatsapp_decorators, { kind: "field", name: "hasWhatsapp", static: false, private: false, access: { has: function (obj) { return "hasWhatsapp" in obj; }, get: function (obj) { return obj.hasWhatsapp; }, set: function (obj, value) { obj.hasWhatsapp = value; } }, metadata: _metadata }, _hasWhatsapp_initializers, _hasWhatsapp_extraInitializers);
            __esDecorate(null, null, _preferredContact_decorators, { kind: "field", name: "preferredContact", static: false, private: false, access: { has: function (obj) { return "preferredContact" in obj; }, get: function (obj) { return obj.preferredContact; }, set: function (obj, value) { obj.preferredContact = value; } }, metadata: _metadata }, _preferredContact_initializers, _preferredContact_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _engagementTrend_decorators, { kind: "field", name: "engagementTrend", static: false, private: false, access: { has: function (obj) { return "engagementTrend" in obj; }, get: function (obj) { return obj.engagementTrend; }, set: function (obj, value) { obj.engagementTrend = value; } }, metadata: _metadata }, _engagementTrend_initializers, _engagementTrend_extraInitializers);
            __esDecorate(null, null, _seasonalActivity_decorators, { kind: "field", name: "seasonalActivity", static: false, private: false, access: { has: function (obj) { return "seasonalActivity" in obj; }, get: function (obj) { return obj.seasonalActivity; }, set: function (obj, value) { obj.seasonalActivity = value; } }, metadata: _metadata }, _seasonalActivity_initializers, _seasonalActivity_extraInitializers);
            __esDecorate(null, null, _lastContactDate_decorators, { kind: "field", name: "lastContactDate", static: false, private: false, access: { has: function (obj) { return "lastContactDate" in obj; }, get: function (obj) { return obj.lastContactDate; }, set: function (obj, value) { obj.lastContactDate = value; } }, metadata: _metadata }, _lastContactDate_initializers, _lastContactDate_extraInitializers);
            __esDecorate(null, null, _contactFrequency_decorators, { kind: "field", name: "contactFrequency", static: false, private: false, access: { has: function (obj) { return "contactFrequency" in obj; }, get: function (obj) { return obj.contactFrequency; }, set: function (obj, value) { obj.contactFrequency = value; } }, metadata: _metadata }, _contactFrequency_initializers, _contactFrequency_extraInitializers);
            __esDecorate(null, null, _responseRate_decorators, { kind: "field", name: "responseRate", static: false, private: false, access: { has: function (obj) { return "responseRate" in obj; }, get: function (obj) { return obj.responseRate; }, set: function (obj, value) { obj.responseRate = value; } }, metadata: _metadata }, _responseRate_initializers, _responseRate_extraInitializers);
            __esDecorate(null, null, _eventAttendance_decorators, { kind: "field", name: "eventAttendance", static: false, private: false, access: { has: function (obj) { return "eventAttendance" in obj; }, get: function (obj) { return obj.eventAttendance; }, set: function (obj, value) { obj.eventAttendance = value; } }, metadata: _metadata }, _eventAttendance_initializers, _eventAttendance_extraInitializers);
            __esDecorate(null, null, _volunteerStatus_decorators, { kind: "field", name: "volunteerStatus", static: false, private: false, access: { has: function (obj) { return "volunteerStatus" in obj; }, get: function (obj) { return obj.volunteerStatus; }, set: function (obj, value) { obj.volunteerStatus = value; } }, metadata: _metadata }, _volunteerStatus_initializers, _volunteerStatus_extraInitializers);
            __esDecorate(null, null, _donationHistory_decorators, { kind: "field", name: "donationHistory", static: false, private: false, access: { has: function (obj) { return "donationHistory" in obj; }, get: function (obj) { return obj.donationHistory; }, set: function (obj, value) { obj.donationHistory = value; } }, metadata: _metadata }, _donationHistory_initializers, _donationHistory_extraInitializers);
            __esDecorate(null, null, _engagementScore_decorators, { kind: "field", name: "engagementScore", static: false, private: false, access: { has: function (obj) { return "engagementScore" in obj; }, get: function (obj) { return obj.engagementScore; }, set: function (obj, value) { obj.engagementScore = value; } }, metadata: _metadata }, _engagementScore_initializers, _engagementScore_extraInitializers);
            __esDecorate(null, null, _ageGroup_decorators, { kind: "field", name: "ageGroup", static: false, private: false, access: { has: function (obj) { return "ageGroup" in obj; }, get: function (obj) { return obj.ageGroup; }, set: function (obj, value) { obj.ageGroup = value; } }, metadata: _metadata }, _ageGroup_initializers, _ageGroup_extraInitializers);
            __esDecorate(null, null, _householdType_decorators, { kind: "field", name: "householdType", static: false, private: false, access: { has: function (obj) { return "householdType" in obj; }, get: function (obj) { return obj.householdType; }, set: function (obj, value) { obj.householdType = value; } }, metadata: _metadata }, _householdType_initializers, _householdType_extraInitializers);
            __esDecorate(null, null, _employmentStatus_decorators, { kind: "field", name: "employmentStatus", static: false, private: false, access: { has: function (obj) { return "employmentStatus" in obj; }, get: function (obj) { return obj.employmentStatus; }, set: function (obj, value) { obj.employmentStatus = value; } }, metadata: _metadata }, _employmentStatus_initializers, _employmentStatus_extraInitializers);
            __esDecorate(null, null, _vehicleOwnership_decorators, { kind: "field", name: "vehicleOwnership", static: false, private: false, access: { has: function (obj) { return "vehicleOwnership" in obj; }, get: function (obj) { return obj.vehicleOwnership; }, set: function (obj, value) { obj.vehicleOwnership = value; } }, metadata: _metadata }, _vehicleOwnership_initializers, _vehicleOwnership_extraInitializers);
            __esDecorate(null, null, _internetAccess_decorators, { kind: "field", name: "internetAccess", static: false, private: false, access: { has: function (obj) { return "internetAccess" in obj; }, get: function (obj) { return obj.internetAccess; }, set: function (obj, value) { obj.internetAccess = value; } }, metadata: _metadata }, _internetAccess_initializers, _internetAccess_extraInitializers);
            __esDecorate(null, null, _communicationStyle_decorators, { kind: "field", name: "communicationStyle", static: false, private: false, access: { has: function (obj) { return "communicationStyle" in obj; }, get: function (obj) { return obj.communicationStyle; }, set: function (obj, value) { obj.communicationStyle = value; } }, metadata: _metadata }, _communicationStyle_initializers, _communicationStyle_extraInitializers);
            __esDecorate(null, null, _contentPreference_decorators, { kind: "field", name: "contentPreference", static: false, private: false, access: { has: function (obj) { return "contentPreference" in obj; }, get: function (obj) { return obj.contentPreference; }, set: function (obj, value) { obj.contentPreference = value; } }, metadata: _metadata }, _contentPreference_initializers, _contentPreference_extraInitializers);
            __esDecorate(null, null, _bestContactTime_decorators, { kind: "field", name: "bestContactTime", static: false, private: false, access: { has: function (obj) { return "bestContactTime" in obj; }, get: function (obj) { return obj.bestContactTime; }, set: function (obj, value) { obj.bestContactTime = value; } }, metadata: _metadata }, _bestContactTime_initializers, _bestContactTime_extraInitializers);
            __esDecorate(null, null, _bestContactDay_decorators, { kind: "field", name: "bestContactDay", static: false, private: false, access: { has: function (obj) { return "bestContactDay" in obj; }, get: function (obj) { return obj.bestContactDay; }, set: function (obj, value) { obj.bestContactDay = value; } }, metadata: _metadata }, _bestContactDay_initializers, _bestContactDay_extraInitializers);
            __esDecorate(null, null, _socialMediaFollowers_decorators, { kind: "field", name: "socialMediaFollowers", static: false, private: false, access: { has: function (obj) { return "socialMediaFollowers" in obj; }, get: function (obj) { return obj.socialMediaFollowers; }, set: function (obj, value) { obj.socialMediaFollowers = value; } }, metadata: _metadata }, _socialMediaFollowers_initializers, _socialMediaFollowers_extraInitializers);
            __esDecorate(null, null, _communityRole_decorators, { kind: "field", name: "communityRole", static: false, private: false, access: { has: function (obj) { return "communityRole" in obj; }, get: function (obj) { return obj.communityRole; }, set: function (obj, value) { obj.communityRole = value; } }, metadata: _metadata }, _communityRole_initializers, _communityRole_extraInitializers);
            __esDecorate(null, null, _networkSize_decorators, { kind: "field", name: "networkSize", static: false, private: false, access: { has: function (obj) { return "networkSize" in obj; }, get: function (obj) { return obj.networkSize; }, set: function (obj, value) { obj.networkSize = value; } }, metadata: _metadata }, _networkSize_initializers, _networkSize_extraInitializers);
            __esDecorate(null, null, _influenceRadius_decorators, { kind: "field", name: "influenceRadius", static: false, private: false, access: { has: function (obj) { return "influenceRadius" in obj; }, get: function (obj) { return obj.influenceRadius; }, set: function (obj, value) { obj.influenceRadius = value; } }, metadata: _metadata }, _influenceRadius_initializers, _influenceRadius_extraInitializers);
            __esDecorate(null, null, _referralCode_decorators, { kind: "field", name: "referralCode", static: false, private: false, access: { has: function (obj) { return "referralCode" in obj; }, get: function (obj) { return obj.referralCode; }, set: function (obj, value) { obj.referralCode = value; } }, metadata: _metadata }, _referralCode_initializers, _referralCode_extraInitializers);
            __esDecorate(null, null, _referredBy_decorators, { kind: "field", name: "referredBy", static: false, private: false, access: { has: function (obj) { return "referredBy" in obj; }, get: function (obj) { return obj.referredBy; }, set: function (obj, value) { obj.referredBy = value; } }, metadata: _metadata }, _referredBy_initializers, _referredBy_extraInitializers);
            __esDecorate(null, null, _referralDate_decorators, { kind: "field", name: "referralDate", static: false, private: false, access: { has: function (obj) { return "referralDate" in obj; }, get: function (obj) { return obj.referralDate; }, set: function (obj, value) { obj.referralDate = value; } }, metadata: _metadata }, _referralDate_initializers, _referralDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateVoterDto = CreateVoterDto;
