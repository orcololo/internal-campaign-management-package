#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Checking if services are running...${NC}"

# Check frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Frontend is running on http://localhost:3000${NC}"
else
  echo -e "${RED}❌ Frontend is NOT running${NC}"
  echo -e "${YELLOW}   Start with: cd apps/web && pnpm dev${NC}"
  exit 1
fi

# Check backend
if curl -s http://localhost:3001 > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Backend is running on http://localhost:3001${NC}"
else
  echo -e "${YELLOW}⚠️  Backend might not be running (optional for some tests)${NC}"
fi

echo ""
echo -e "${GREEN}🚀 Running E2E tests...${NC}"
echo ""

# Run the tests
if [ "$1" == "--headed" ]; then
  HEADLESS=false pnpm test:e2e
else
  pnpm test:e2e
fi
