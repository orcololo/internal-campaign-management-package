#!/bin/bash

# Analytics Module Verification Script
# Tests backend, frontend configuration, and connectivity

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Analytics Module Verification Script${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Check if we're in the right directory
if [ ! -d "apps/api" ] || [ ! -d "apps/web" ]; then
    echo -e "${RED}✗ Error: Must run from project root${NC}"
    echo "  Current directory: $(pwd)"
    exit 1
fi

echo -e "${GREEN}✓ Project structure verified${NC}\n"

# 1. Check Backend Files
echo -e "${BLUE}[1/6] Checking Backend Files...${NC}"
BACKEND_FILES=(
    "apps/api/src/analytics/analytics.module.ts"
    "apps/api/src/analytics/analytics.controller.ts"
    "apps/api/src/analytics/analytics.service.ts"
)

for file in "${BACKEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file ${RED}(MISSING)${NC}"
        exit 1
    fi
done
echo ""

# 2. Check Frontend Files
echo -e "${BLUE}[2/6] Checking Frontend Files...${NC}"
FRONTEND_FILES=(
    "apps/web/lib/api/http-adapter.ts"
    "apps/web/lib/api/mock-adapter.ts"
    "apps/web/lib/api/client.ts"
    "apps/web/lib/api/endpoints/analytics.ts"
    "apps/web/app/(dashboard)/analytics/page.tsx"
)

for file in "${FRONTEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file ${RED}(MISSING)${NC}"
        exit 1
    fi
done
echo ""

# 3. Check Environment Configuration
echo -e "${BLUE}[3/6] Checking Environment Configuration...${NC}"
if [ -f "apps/web/.env.local" ]; then
    echo -e "  ${GREEN}✓${NC} apps/web/.env.local exists"
    
    if grep -q "NEXT_PUBLIC_USE_MOCK" apps/web/.env.local; then
        MOCK_MODE=$(grep "NEXT_PUBLIC_USE_MOCK" apps/web/.env.local | cut -d '=' -f 2)
        echo -e "  ${GREEN}✓${NC} NEXT_PUBLIC_USE_MOCK = ${YELLOW}${MOCK_MODE}${NC}"
    else
        echo -e "  ${YELLOW}⚠${NC} NEXT_PUBLIC_USE_MOCK not set (will default to true)"
    fi
    
    if grep -q "NEXT_PUBLIC_API_URL" apps/web/.env.local; then
        API_URL=$(grep "NEXT_PUBLIC_API_URL" apps/web/.env.local | cut -d '=' -f 2)
        echo -e "  ${GREEN}✓${NC} NEXT_PUBLIC_API_URL = ${YELLOW}${API_URL}${NC}"
    else
        echo -e "  ${YELLOW}⚠${NC} NEXT_PUBLIC_API_URL not set (will default to http://localhost:3001)"
    fi
else
    echo -e "  ${YELLOW}⚠${NC} apps/web/.env.local not found"
    echo -e "  ${YELLOW}→${NC} Copy from .env.example if needed"
fi
echo ""

# 4. Check Backend Running
echo -e "${BLUE}[4/6] Checking Backend Status...${NC}"
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "  ${GREEN}✓${NC} Backend is running on port 3001"
    
    # Try to fetch from backend
    if curl -s http://localhost:3001/analytics/overview > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} Analytics endpoint responding"
    else
        echo -e "  ${YELLOW}⚠${NC} Backend running but analytics endpoint not responding"
        echo -e "    ${YELLOW}→${NC} Check if AnalyticsModule is imported in AppModule"
    fi
else
    echo -e "  ${RED}✗${NC} Backend NOT running on port 3001"
    echo -e "    ${YELLOW}→${NC} Start with: cd apps/api && npm run dev"
fi
echo ""

# 5. Check Frontend Running
echo -e "${BLUE}[5/6] Checking Frontend Status...${NC}"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "  ${GREEN}✓${NC} Frontend is running on port 3000"
else
    echo -e "  ${RED}✗${NC} Frontend NOT running on port 3000"
    echo -e "    ${YELLOW}→${NC} Start with: cd apps/web && npm run dev"
fi
echo ""

# 6. Check Documentation
echo -e "${BLUE}[6/6] Checking Documentation...${NC}"
DOCS=(
    "docs/ANALYTICS-IMPLEMENTATION.md"
    "docs/ANALYTICS-QUICK-START.md"
    "docs/ANALYTICS-SUMMARY.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "  ${GREEN}✓${NC} $doc"
    else
        echo -e "  ${YELLOW}⚠${NC} $doc ${YELLOW}(missing)${NC}"
    fi
done
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

BACKEND_RUNNING=$(lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 && echo "true" || echo "false")
FRONTEND_RUNNING=$(lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 && echo "true" || echo "false")

if [ "$BACKEND_RUNNING" = "true" ] && [ "$FRONTEND_RUNNING" = "true" ]; then
    echo -e "${GREEN}✓ All systems operational${NC}"
    echo -e "\n${GREEN}Next steps:${NC}"
    echo -e "  1. Visit http://localhost:3000/analytics"
    echo -e "  2. Check browser console for any errors"
    echo -e "  3. Verify data is loading from backend"
    echo -e "\n${YELLOW}To test backend directly:${NC}"
    echo -e "  curl http://localhost:3001/analytics/overview | jq"
elif [ "$BACKEND_RUNNING" = "false" ] && [ "$FRONTEND_RUNNING" = "false" ]; then
    echo -e "${YELLOW}⚠ Start both services:${NC}"
    echo -e "\n${YELLOW}Terminal 1 (Backend):${NC}"
    echo -e "  cd apps/api && npm run dev"
    echo -e "\n${YELLOW}Terminal 2 (Frontend):${NC}"
    echo -e "  cd apps/web && npm run dev"
elif [ "$BACKEND_RUNNING" = "false" ]; then
    echo -e "${YELLOW}⚠ Backend not running${NC}"
    echo -e "  ${YELLOW}→${NC} Start with: cd apps/api && npm run dev"
    echo -e "  ${YELLOW}→${NC} Or set NEXT_PUBLIC_USE_MOCK=true to use mock data"
else
    echo -e "${YELLOW}⚠ Frontend not running${NC}"
    echo -e "  ${YELLOW}→${NC} Start with: cd apps/web && npm run dev"
fi

echo -e "\n${BLUE}Documentation:${NC}"
echo -e "  📖 Full guide: docs/ANALYTICS-IMPLEMENTATION.md"
echo -e "  🚀 Quick start: docs/ANALYTICS-QUICK-START.md"
echo -e "  📊 Summary: docs/ANALYTICS-SUMMARY.md"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

exit 0
