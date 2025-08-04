#!/bin/bash

# 🔍 System Performance Monitor for Development
# Monitors VS Code, Node.js processes, and development servers

echo "🚀 Development Environment Monitor"
echo "=================================="
echo "Timestamp: $(date)"
echo ""

# Monitor VS Code processes
echo "📊 VS Code Process Health:"
echo "-------------------------"
ps aux | grep -E "Visual Studio Code|Code Helper" | grep -v grep | awk '{printf "%-15s %5s %5s %10s %s\n", $1, $3, $4, $6, $11}' | head -10

echo ""
echo "🟢 Node.js Development Servers:"
echo "------------------------------"
# Check development server ports
if lsof -i :5173 >/dev/null 2>&1; then
    echo "✅ Frontend (Vite): http://localhost:5173 - RUNNING"
else
    echo "❌ Frontend (Vite): http://localhost:5173 - NOT RUNNING"
fi

if lsof -i :7072 >/dev/null 2>&1; then
    echo "✅ Backend (Azure Functions): http://localhost:7072 - RUNNING"
else
    echo "❌ Backend (Azure Functions): http://localhost:7072 - NOT RUNNING"
fi

echo ""
echo "💾 Memory Usage:"
echo "---------------"
echo "Total Memory: $(sysctl hw.memsize | awk '{print $2/1024/1024/1024 " GB"}')"
echo "Memory Pressure: $(memory_pressure | head -1)"

echo ""
echo "🔄 System Load:"
echo "--------------"
uptime

echo ""
echo "⚡ Top CPU Processes (Development Related):"
echo "----------------------------------------"
ps aux | grep -E "(node|vite|func|Code)" | grep -v grep | sort -k3 -nr | head -5

echo ""
echo "🚨 Potential Issues:"
echo "------------------"
# Check for zombie processes
ZOMBIES=$(ps aux | grep -E "(defunct|<defunct>)" | grep -v grep | wc -l)
if [ $ZOMBIES -gt 0 ]; then
    echo "⚠️  Found $ZOMBIES zombie processes"
else
    echo "✅ No zombie processes detected"
fi

# Check memory pressure
MEMORY_PRESSURE=$(memory_pressure | grep "System-wide memory free percentage" | awk '{print $5}' | sed 's/%//')
if [ "$MEMORY_PRESSURE" -lt 10 ]; then
    echo "⚠️  High memory pressure: ${MEMORY_PRESSURE}%"
else
    echo "✅ Memory pressure normal: ${MEMORY_PRESSURE}%"
fi

echo ""
echo "🔄 Run 'bash monitor-system.sh' to refresh this status"
