#!/bin/bash

# Pre-deployment validation script
# This script verifies all critical components before deployment

echo "🔍 Starting pre-deployment validation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VALIDATION_PASSED=true

# Function to print status
print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        VALIDATION_PASSED=false
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

echo ""
echo "📋 VALIDATION CHECKLIST"
echo "======================="

# 1. Check if Azure CLI is installed and authenticated
echo ""
echo "1. Checking Azure CLI..."
if command -v az &> /dev/null; then
    if az account show &> /dev/null; then
        CURRENT_SUB=$(az account show --query name -o tsv)
        print_status "Azure CLI authenticated (Subscription: $CURRENT_SUB)" 0
    else
        print_status "Azure CLI not authenticated" 1
        echo "   Run: az login"
    fi
else
    print_status "Azure CLI not installed" 1
fi

# 2. Check if azd is installed and environment is initialized
echo ""
echo "2. Checking Azure Developer CLI..."
if command -v azd &> /dev/null; then
    if [ -d ".azure" ]; then
        print_status "AZD environment initialized" 0
    else
        print_status "AZD environment not initialized" 1
        echo "   Run: azd init"
    fi
else
    print_status "Azure Developer CLI not installed" 1
fi

# 3. Check local.settings.json exists and has required values
echo ""
echo "3. Checking local configuration..."
if [ -f "backend/local.settings.json" ]; then
    print_status "local.settings.json exists" 0
    
    # Check for required environment variables
    REQUIRED_VARS=("AZURE_OPENAI_ENDPOINT" "AZURE_OPENAI_KEY" "AZURE_OPENAI_DEPLOYMENT" "AZURE_OPENAI_API_VERSION")
    
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "\"$var\"" backend/local.settings.json; then
            VALUE=$(grep "\"$var\"" backend/local.settings.json | cut -d'"' -f4)
            if [ ! -z "$VALUE" ] && [ "$VALUE" != "your-value-here" ]; then
                print_status "$var configured" 0
            else
                print_status "$var missing or placeholder" 1
            fi
        else
            print_status "$var not found" 1
        fi
    done
else
    print_status "local.settings.json missing" 1
    echo "   Copy from local.settings.json.example and configure"
fi

# 4. Check package.json and dependencies
echo ""
echo "4. Checking dependencies..."
if [ -f "backend/package.json" ]; then
    print_status "package.json exists" 0
    
    cd backend
    if [ -d "node_modules" ]; then
        print_status "Dependencies installed" 0
    else
        print_status "Dependencies not installed" 1
        echo "   Run: cd backend && npm install"
    fi
    cd ..
else
    print_status "package.json missing" 1
fi

# 5. Test local function app startup
echo ""
echo "5. Testing local function app..."
cd backend
if npm run build &> /dev/null; then
    print_status "Function app builds successfully" 0
else
    print_status "Function app build failed" 1
fi
cd ..

# 6. Check if Azure resources exist (if azd env exists)
if [ -d ".azure" ] && command -v azd &> /dev/null; then
    echo ""
    echo "6. Checking Azure resources..."
    
    # Try to get current environment name
    ENV_NAME=$(azd env list --output json 2>/dev/null | jq -r '.[0].Name // empty' 2>/dev/null)
    
    if [ ! -z "$ENV_NAME" ]; then
        print_status "Environment '$ENV_NAME' found" 0
        
        # Check if resources are deployed
        if azd show --output json &> /dev/null; then
            print_status "Azure resources deployed" 0
        else
            print_warning "Azure resources may not be deployed"
            echo "   Run: azd up"
        fi
    else
        print_warning "No AZD environment found"
    fi
fi

# 7. Validate specific files exist
echo ""
echo "7. Checking required files..."
REQUIRED_FILES=(
    "azure.yaml"
    "backend/generateWireframe/function.json"
    "backend/generateWireframe/index.js"
    "backend/host.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status "$file exists" 0
    else
        print_status "$file missing" 1
    fi
done

# 8. Check for common issues
echo ""
echo "8. Checking for common issues..."

# Check for .gitignore
if [ -f ".gitignore" ] && grep -q "local.settings.json" .gitignore; then
    print_status "local.settings.json properly gitignored" 0
else
    print_warning "local.settings.json should be in .gitignore"
fi

# Check for environment-specific configurations
if [ -f "backend/local.settings.json" ] && grep -q "localhost" backend/local.settings.json; then
    print_warning "localhost references found in local.settings.json"
fi

# Final result
echo ""
echo "🏁 VALIDATION SUMMARY"
echo "===================="

if [ "$VALIDATION_PASSED" = true ]; then
    echo -e "${GREEN}✅ All validations passed! Ready for deployment.${NC}"
    echo ""
    echo "🚀 To deploy, run:"
    echo "   azd deploy"
    exit 0
else
    echo -e "${RED}❌ Some validations failed. Please fix the issues above before deploying.${NC}"
    echo ""
    echo "💡 Common fixes:"
    echo "   - Run 'az login' to authenticate"
    echo "   - Configure backend/local.settings.json with your Azure OpenAI credentials"
    echo "   - Run 'cd backend && npm install' to install dependencies"
    echo "   - Run 'azd init' to initialize Azure Developer CLI"
    exit 1
fi
