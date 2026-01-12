import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { voters } from '../schemas/voter.schema';
import { events } from '../schemas/event.schema';
import { canvassingSessions, doorKnocks } from '../schemas/canvassing.schema';
import { macapaVotersSeed } from './voters-macapa.seed';
import { macapaEventsSeed } from './events-macapa.seed';
import {
  macapaCanvassingSessionsSeed,
  generateDoorKnocksForSession,
} from './canvassing-macapa.seed';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use require for CommonJS module
const postgres = require('postgres');

async function runSeed() {
  console.log('🌱 Starting seed process...\n');

  // Create database connection using postgres with individual credentials
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || 'postgres';
  const database = process.env.DB_NAME || 'campaign_platform';

  const connectionString = `postgres://${user}:${password}@${host}:${port}/${database}`;
  console.log(`🔌 Connecting to: ${database} at ${host}:${port}\n`);

  const client = postgres(connectionString);
  const db = drizzle(client);

  try {
    console.log('📊 Seeding 200 voters from Macapá-AP...');

    // Insert voters in batches of 50 to avoid query size limits
    const batchSize = 50;
    let inserted = 0;

    for (let i = 0; i < macapaVotersSeed.length; i += batchSize) {
      const batch = macapaVotersSeed.slice(i, i + batchSize);
      await db.insert(voters).values(batch as any);
      inserted += batch.length;
      console.log(`✅ Inserted ${inserted}/${macapaVotersSeed.length} voters`);
    }

    // Set up some referral relationships (10% of voters have referrers)
    console.log('\n🔗 Setting up referral relationships...');
    const allVoters = await db.select().from(voters).limit(200);

    const referralUpdates = allVoters.slice(0, 20).map((voter, index) => {
      const referrerIndex = Math.floor(Math.random() * (allVoters.length - 20)) + 20;
      return {
        voterId: voter.id,
        referrerId: allVoters[referrerIndex].id,
      };
    });

    for (const update of referralUpdates) {
      await db
        .update(voters)
        .set({
          referredBy: update.referrerId,
          referralDate: new Date(
            Date.now() - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000),
          ),
        })
        .where(eq(voters.id, update.voterId));
    }

    console.log(`✅ Set up ${referralUpdates.length} referral relationships`);

    // Seed events
    console.log('\n📅 Seeding 50 events (20 historical + 30 for January 2026)...');
    let eventsInserted = 0;
    const eventBatchSize = 10;

    for (let i = 0; i < macapaEventsSeed.length; i += eventBatchSize) {
      const batch = macapaEventsSeed.slice(i, i + eventBatchSize);
      await db.insert(events).values(batch as any);
      eventsInserted += batch.length;
      console.log(`✅ Inserted ${eventsInserted}/${macapaEventsSeed.length} events`);
    }

    // Seed canvassing sessions
    console.log('\n🚪 Seeding 15 canvassing sessions...');
    let sessionsInserted = 0;

    for (const sessionData of macapaCanvassingSessionsSeed) {
      const [insertedSession] = await db
        .insert(canvassingSessions)
        .values(sessionData as any)
        .returning();
      sessionsInserted++;
      console.log(`✅ Inserted session ${sessionsInserted}/${macapaCanvassingSessionsSeed.length}`);

      // Generate and insert door knocks for completed sessions
      if (sessionData.status === 'CONCLUIDA' && insertedSession) {
        const neighborhood = {
          name: sessionData.neighborhood!,
          lat: 0.034,
          lng: -51.0665,
        };
        const doorKnocksData = generateDoorKnocksForSession(
          insertedSession.id,
          sessionData,
          neighborhood,
        );

        if (doorKnocksData.length > 0) {
          const doorKnockBatchSize = 20;
          let doorKnocksInserted = 0;

          for (let i = 0; i < doorKnocksData.length; i += doorKnockBatchSize) {
            const batch = doorKnocksData.slice(i, i + doorKnockBatchSize);
            await db.insert(doorKnocks).values(batch as any);
            doorKnocksInserted += batch.length;
          }

          console.log(`   ✅ Inserted ${doorKnocksInserted} door knocks for session`);
        }
      }
    }

    console.log('\n✨ Seed completed successfully!');
    console.log(`\n📈 Summary:`);
    console.log(`   - Total voters: ${macapaVotersSeed.length}`);
    console.log(`   - Total events: ${macapaEventsSeed.length}`);
    console.log(`   - Total canvassing sessions: ${macapaCanvassingSessionsSeed.length}`);
    console.log(`   - City: Macapá-AP`);
    console.log(`   - Referral relationships: ${referralUpdates.length}`);
    console.log(`   - Events: 20 historical + 30 for January 2026`);
    console.log(
      `   - Date range: Last 60 days (historical) + January 2026 (current/future events)`,
    );
    console.log(
      `\n🎯 All data includes realistic dates for trend visualization and calendar testing`,
    );
  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the seed
runSeed();
