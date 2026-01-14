"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var postgres_js_1 = require("drizzle-orm/postgres-js");
var drizzle_orm_1 = require("drizzle-orm");
var voter_schema_1 = require("../schemas/voter.schema");
var event_schema_1 = require("../schemas/event.schema");
var canvassing_schema_1 = require("../schemas/canvassing.schema");
var voters_macapa_seed_1 = require("./voters-macapa.seed");
var events_macapa_seed_1 = require("./events-macapa.seed");
var canvassing_macapa_seed_1 = require("./canvassing-macapa.seed");
var dotenv = require("dotenv");
// Load environment variables
dotenv.config();
// Use require for CommonJS module
var postgres = require('postgres');
function runSeed() {
    return __awaiter(this, void 0, void 0, function () {
        var connectionUrl, connectionString, host, port, user, password, database, client, db, batchSize, inserted, i, batch, allVoters_1, referralUpdates, _i, referralUpdates_1, update, eventsInserted, eventBatchSize, i, batch, sessionsInserted, _a, macapaCanvassingSessionsSeed_1, sessionData, insertedSession, neighborhood, doorKnocksData, doorKnockBatchSize, doorKnocksInserted, i, batch, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('🌱 Starting seed process...\n');
                    connectionUrl = process.env.POSTGRES_URL;
                    if (connectionUrl) {
                        connectionString = connectionUrl;
                        console.log('🔌 Connecting using POSTGRES_URL (Supabase connection pooling)\n');
                    }
                    else {
                        host = process.env.POSTGRES_HOST || 'localhost';
                        port = process.env.DB_PORT || '5432';
                        user = process.env.DB_USER || 'postgres';
                        password = process.env.POSTGRES_PASSWORD || 'postgres';
                        database = process.env.POSTGRES_DATABASE || 'postgres';
                        connectionString = "postgres://".concat(user, ":").concat(password, "@").concat(host, ":").concat(port, "/").concat(database, "?sslmode=require");
                        console.log("\uD83D\uDD0C Connecting to: ".concat(database, " at ").concat(host, ":").concat(port, "\n"));
                    }
                    client = postgres(connectionString, {
                        ssl: {
                            rejectUnauthorized: false, // Required for Supabase
                        },
                    });
                    db = (0, postgres_js_1.drizzle)(client);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 23, 24, 26]);
                    console.log('📊 Seeding 200 voters from Macapá-AP...');
                    batchSize = 50;
                    inserted = 0;
                    i = 0;
                    _b.label = 2;
                case 2:
                    if (!(i < voters_macapa_seed_1.macapaVotersSeed.length)) return [3 /*break*/, 5];
                    batch = voters_macapa_seed_1.macapaVotersSeed.slice(i, i + batchSize);
                    return [4 /*yield*/, db.insert(voter_schema_1.voters).values(batch)];
                case 3:
                    _b.sent();
                    inserted += batch.length;
                    console.log("\u2705 Inserted ".concat(inserted, "/").concat(voters_macapa_seed_1.macapaVotersSeed.length, " voters"));
                    _b.label = 4;
                case 4:
                    i += batchSize;
                    return [3 /*break*/, 2];
                case 5:
                    // Set up some referral relationships (10% of voters have referrers)
                    console.log('\n🔗 Setting up referral relationships...');
                    return [4 /*yield*/, db.select().from(voter_schema_1.voters).limit(200)];
                case 6:
                    allVoters_1 = _b.sent();
                    referralUpdates = allVoters_1.slice(0, 20).map(function (voter, index) {
                        var referrerIndex = Math.floor(Math.random() * (allVoters_1.length - 20)) + 20;
                        return {
                            voterId: voter.id,
                            referrerId: allVoters_1[referrerIndex].id,
                        };
                    });
                    _i = 0, referralUpdates_1 = referralUpdates;
                    _b.label = 7;
                case 7:
                    if (!(_i < referralUpdates_1.length)) return [3 /*break*/, 10];
                    update = referralUpdates_1[_i];
                    return [4 /*yield*/, db
                            .update(voter_schema_1.voters)
                            .set({
                            referredBy: update.referrerId,
                            referralDate: new Date(Date.now() - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000)),
                        })
                            .where((0, drizzle_orm_1.eq)(voter_schema_1.voters.id, update.voterId))];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 7];
                case 10:
                    console.log("\u2705 Set up ".concat(referralUpdates.length, " referral relationships"));
                    // Seed events
                    console.log('\n📅 Seeding 50 events (20 historical + 30 for January 2026)...');
                    eventsInserted = 0;
                    eventBatchSize = 10;
                    i = 0;
                    _b.label = 11;
                case 11:
                    if (!(i < events_macapa_seed_1.macapaEventsSeed.length)) return [3 /*break*/, 14];
                    batch = events_macapa_seed_1.macapaEventsSeed.slice(i, i + eventBatchSize);
                    return [4 /*yield*/, db.insert(event_schema_1.events).values(batch)];
                case 12:
                    _b.sent();
                    eventsInserted += batch.length;
                    console.log("\u2705 Inserted ".concat(eventsInserted, "/").concat(events_macapa_seed_1.macapaEventsSeed.length, " events"));
                    _b.label = 13;
                case 13:
                    i += eventBatchSize;
                    return [3 /*break*/, 11];
                case 14:
                    // Seed canvassing sessions
                    console.log('\n🚪 Seeding 15 canvassing sessions...');
                    sessionsInserted = 0;
                    _a = 0, macapaCanvassingSessionsSeed_1 = canvassing_macapa_seed_1.macapaCanvassingSessionsSeed;
                    _b.label = 15;
                case 15:
                    if (!(_a < macapaCanvassingSessionsSeed_1.length)) return [3 /*break*/, 22];
                    sessionData = macapaCanvassingSessionsSeed_1[_a];
                    return [4 /*yield*/, db
                            .insert(canvassing_schema_1.canvassingSessions)
                            .values(sessionData)
                            .returning()];
                case 16:
                    insertedSession = (_b.sent())[0];
                    sessionsInserted++;
                    console.log("\u2705 Inserted session ".concat(sessionsInserted, "/").concat(canvassing_macapa_seed_1.macapaCanvassingSessionsSeed.length));
                    if (!(sessionData.status === 'CONCLUIDA' && insertedSession)) return [3 /*break*/, 21];
                    neighborhood = {
                        name: sessionData.neighborhood,
                        lat: 0.034,
                        lng: -51.0665,
                    };
                    doorKnocksData = (0, canvassing_macapa_seed_1.generateDoorKnocksForSession)(insertedSession.id, sessionData, neighborhood);
                    if (!(doorKnocksData.length > 0)) return [3 /*break*/, 21];
                    doorKnockBatchSize = 20;
                    doorKnocksInserted = 0;
                    i = 0;
                    _b.label = 17;
                case 17:
                    if (!(i < doorKnocksData.length)) return [3 /*break*/, 20];
                    batch = doorKnocksData.slice(i, i + doorKnockBatchSize);
                    return [4 /*yield*/, db.insert(canvassing_schema_1.doorKnocks).values(batch)];
                case 18:
                    _b.sent();
                    doorKnocksInserted += batch.length;
                    _b.label = 19;
                case 19:
                    i += doorKnockBatchSize;
                    return [3 /*break*/, 17];
                case 20:
                    console.log("   \u2705 Inserted ".concat(doorKnocksInserted, " door knocks for session"));
                    _b.label = 21;
                case 21:
                    _a++;
                    return [3 /*break*/, 15];
                case 22:
                    console.log('\n✨ Seed completed successfully!');
                    console.log("\n\uD83D\uDCC8 Summary:");
                    console.log("   - Total voters: ".concat(voters_macapa_seed_1.macapaVotersSeed.length));
                    console.log("   - Total events: ".concat(events_macapa_seed_1.macapaEventsSeed.length));
                    console.log("   - Total canvassing sessions: ".concat(canvassing_macapa_seed_1.macapaCanvassingSessionsSeed.length));
                    console.log("   - City: Macap\u00E1-AP");
                    console.log("   - Referral relationships: ".concat(referralUpdates.length));
                    console.log("   - Events: 20 historical + 30 for January 2026");
                    console.log("   - Date range: Last 60 days (historical) + January 2026 (current/future events)");
                    console.log("\n\uD83C\uDFAF All data includes realistic dates for trend visualization and calendar testing");
                    return [3 /*break*/, 26];
                case 23:
                    error_1 = _b.sent();
                    console.error('❌ Error during seed:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 26];
                case 24: return [4 /*yield*/, client.end()];
                case 25:
                    _b.sent();
                    console.log('\n🔌 Database connection closed');
                    return [7 /*endfinally*/];
                case 26: return [2 /*return*/];
            }
        });
    });
}
// Run the seed
runSeed();
