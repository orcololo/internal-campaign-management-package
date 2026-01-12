import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { voters } from '../schemas/voter.schema';
import { macapaVotersSeed } from './voters-macapa.seed';
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
      const referrerIndex =
        Math.floor(Math.random() * (allVoters.length - 20)) + 20;
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

    console.log('\n✨ Seed completed successfully!');
    console.log(`\n📈 Summary:`);
    console.log(`   - Total voters: ${macapaVotersSeed.length}`);
    console.log(`   - City: Macapá-AP`);
    console.log(`   - Referral relationships: ${referralUpdates.length}`);
    console.log(
      `\n🎯 All voters are located within Macapá-AP with realistic coordinates`,
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
