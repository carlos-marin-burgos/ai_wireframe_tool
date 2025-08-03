#!/bin/bash

# Check if Azure CLI is installed
if command -v az &> /dev/null; then
    echo "✅ Azure CLI is already installed"
    az --version | head -n 1
else
    echo "❌ Azure CLI is not installed"
    echo "To install Azure CLI on macOS, run:"
    echo "brew update && brew install azure-cli"
    echo "or"
    echo "curl -L https://aka.ms/InstallAzureCli | bash"
fi
