#!/bin/bash

# Easy push script that bypasses environment validation
echo "🚀 Pushing with environment validation bypass..."
SKIP_ENV_CHECK=true git push origin main "$@"