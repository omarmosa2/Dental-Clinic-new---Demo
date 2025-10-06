#!/bin/bash

echo "Starting Dental Clinic Application in Demo Mode..."
echo ""
echo "This will run the application with:"
echo "- No database connection (uses localStorage)"
echo "- No license validation"
echo "- All features available for demonstration"
echo ""
echo "Press any key to continue or Ctrl+C to cancel..."
read -n 1 -s

export VITE_DEMO_MODE=true
npm run dev
