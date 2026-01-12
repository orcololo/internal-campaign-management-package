#!/usr/bin/env node

/**
 * Analytics Backend Test Script
 * Tests all analytics endpoints to ensure they're working correctly
 */

const API_URL = process.env.API_URL || 'http://localhost:3001';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

async function testEndpoint(name, endpoint, expectedFields = []) {
  try {
    console.log(`${colors.blue}Testing:${colors.reset} ${name} - ${endpoint}`);

    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
      console.log(
        `${colors.red}✗ FAILED${colors.reset} - HTTP ${response.status}: ${response.statusText}\n`,
      );
      return false;
    }

    const data = await response.json();

    // Check if expected fields exist
    if (expectedFields.length > 0) {
      const missingFields = expectedFields.filter((field) => !(field in data));
      if (missingFields.length > 0) {
        console.log(
          `${colors.yellow}⚠ WARNING${colors.reset} - Missing fields: ${missingFields.join(', ')}`,
        );
      }
    }

    console.log(`${colors.green}✓ SUCCESS${colors.reset} - Response received`);
    console.log(`  Keys: ${Object.keys(data).join(', ')}`);
    console.log('');

    return true;
  } catch (error) {
    console.log(`${colors.red}✗ ERROR${colors.reset} - ${error.message}\n`);
    return false;
  }
}

async function runTests() {
  console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  Analytics Backend API Test${colors.reset}`);
  console.log(`${colors.blue}  API URL: ${API_URL}${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

  const tests = [
    {
      name: 'Campaign Overview',
      endpoint: '/analytics/overview',
      expectedFields: ['summary', 'voters', 'events', 'canvassing', 'trends'],
    },
    {
      name: 'Voter Analytics',
      endpoint: '/analytics/voters',
      expectedFields: ['total', 'demographics', 'geographic', 'political', 'contact'],
    },
    {
      name: 'Event Analytics',
      endpoint: '/analytics/events',
      expectedFields: ['total', 'byType', 'byStatus', 'upcoming', 'completed'],
    },
    {
      name: 'Canvassing Analytics',
      endpoint: '/analytics/canvassing',
      expectedFields: ['sessions', 'doorKnocks', 'performance'],
    },
    {
      name: 'Geographic Heatmap',
      endpoint: '/analytics/geographic-heatmap',
      expectedFields: ['points', 'summary'],
    },
    {
      name: 'Time Series Data',
      endpoint:
        '/analytics/time-series?startDate=2024-01-01&endDate=2024-12-31&metric=voter-registrations',
      expectedFields: [],
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const success = await testEndpoint(test.name, test.endpoint, test.expectedFields);
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  Test Results${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.green}  Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}  Failed: ${failed}${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
