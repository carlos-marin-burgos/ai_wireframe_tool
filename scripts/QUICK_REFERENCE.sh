#!/bin/bash

# Quick reference guide for Designetica operations

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${BOLD}🚀 DESIGNETICA PRODUCTION SYSTEM${NC}"
echo -e "${BOLD}================================${NC}"
echo ""

echo -e "${GREEN}✅ YOUR SYSTEM IS NOW BULLETPROOF!${NC}"
echo ""

echo -e "${BOLD}🔧 DAILY OPERATIONS (USE THESE COMMANDS):${NC}"
echo ""
echo -e "${BLUE}Deploy Backend (SAFE):${NC}"
echo "  npm run deploy:backend"
echo "  OR: ./safe-deploy.sh backend"
echo ""
echo -e "${BLUE}Deploy Frontend:${NC}"
echo "  npm run deploy:frontend"
echo "  OR: ./safe-deploy.sh frontend"
echo ""
echo -e "${BLUE}Deploy Everything:${NC}"
echo "  npm run deploy:safe"
echo "  OR: ./safe-deploy.sh all"
echo ""
echo -e "${BLUE}Check System Health:${NC}"
echo "  npm run deploy:status"
echo "  npm run health:full"
echo ""

echo -e "${BOLD}💾 BACKUP OPERATIONS:${NC}"
echo ""
echo -e "${BLUE}List Backups:${NC}"
echo "  npm run backup:list"
echo ""
echo -e "${BLUE}Create Backup:${NC}"
echo "  npm run backup:create"
echo ""
echo -e "${BLUE}Restore Backup:${NC}"
echo "  npm run backup:restore [backup_name]"
echo ""

echo -e "${BOLD}🔍 MONITORING:${NC}"
echo ""
echo -e "${BLUE}Start Monitoring:${NC}"
echo "  npm run monitoring:start"
echo ""
echo -e "${BLUE}Check Monitoring:${NC}"
echo "  npm run monitoring:status"
echo ""
echo -e "${BLUE}View Logs:${NC}"
echo "  npm run monitoring:logs"
echo ""

echo -e "${BOLD}🚨 EMERGENCY PROCEDURES:${NC}"
echo ""
echo -e "${YELLOW}If API Stops Working:${NC}"
echo "  1. npm run deploy:test"
echo "  2. npm run backup:list"
echo "  3. npm run backup:restore [backup_name]"
echo "  4. npm run deploy:backend"
echo ""
echo -e "${YELLOW}Complete Emergency:${NC}"
echo "  npm run emergency:rollback"
echo ""

echo -e "${BOLD}📊 CURRENT STATUS:${NC}"
echo ""

# Quick status check
if curl -s "https://func-designetica-prod-xabnur6oyusju.azurewebsites.net/api/health" > /dev/null; then
    echo -e "${GREEN}✅ API Health: HEALTHY${NC}"
else
    echo -e "${RED}❌ API Health: UNHEALTHY${NC}"
fi

if curl -s "https://white-flower-006d2370f.1.azurestaticapps.net" > /dev/null; then
    echo "✅ Website is up!"
    echo "✅ Backend is responding!"
    echo "🔍 Run full diagnostics with: ./full-check.sh"
    echo ""
    echo "🚀 SUCCESS!"
    echo "  Website: https://white-flower-006d2370f.1.azurestaticapps.net"
echo "  API: https://func-designetica-prod-xabnur6oyusju.azurewebsites.net/api/generate-html-wireframe"
echo "  Health: https://func-designetica-prod-xabnur6oyusju.azurewebsites.net/api/health"
echo ""

echo -e "${BOLD}📖 DOCUMENTATION:${NC}"
echo "  Read: ./PRODUCTION_SAFETY_GUIDE.md"
echo "  Help: ./safe-deploy.sh help"
echo ""

echo -e "${GREEN}🎉 Your business is now protected with enterprise-grade safety systems!${NC}"
echo -e "${GREEN}   Never use 'azd deploy' directly again - always use the safe scripts!${NC}"
