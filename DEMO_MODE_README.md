# Demo Mode Configuration

## Overview
This application supports a Demo Mode that allows running the application without a database or license validation. This is useful for demonstrations, testing, and development.

## How to Enable Demo Mode

### Method 1: Environment Variable
Create a `.env.local` file in the project root with:
```
VITE_DEMO_MODE=true
```

### Method 2: Build-time Configuration
Set the environment variable when building:
```bash
VITE_DEMO_MODE=true npm run build
```

### Method 3: Development Server
Set the environment variable when running the development server:
```bash
VITE_DEMO_MODE=true npm run dev
```

## Demo Mode Features

### ✅ What Works in Demo Mode
- All UI components and pages
- Patient management (add, edit, delete, search)
- Appointment management (add, edit, delete, search)
- Payment management (add, edit, delete, search)
- Treatment management
- Inventory management
- Lab management
- Medication management
- Prescription management
- Reports generation
- Settings management
- All data operations (stored in localStorage)

### ❌ What's Disabled in Demo Mode
- SQLite database connection
- License validation system
- File system operations (images are mocked)
- Persistent data storage (data is lost on page refresh)

## Demo Mode Behavior

### Data Storage
- All data is stored in browser's localStorage
- Data is prefixed with `dental_clinic_demo_`
- Data is automatically cleared when the page is refreshed
- No data persistence between sessions

### License System
- License validation is completely bypassed
- No license entry screen is shown
- Application starts directly to the main interface
- Mock license information is provided

### Database Operations
- All database operations are mocked
- Data is stored in memory using localStorage
- All CRUD operations work as expected
- Search and filtering work normally

### File Operations
- Image uploads are mocked
- File paths are generated but files are not actually saved
- Image previews show placeholder images

## Visual Indicators

When Demo Mode is active, you'll see:
- A red "وضع تجريبي" (Demo Mode) badge in the header
- Console messages indicating demo mode initialization
- Mock data in all sections

## Development Notes

### Files Modified for Demo Mode
- `src/config/demoMode.ts` - Demo mode configuration
- `src/services/mockDatabaseService.ts` - Mock database service
- `src/services/mockLicenseManager.ts` - Mock license manager
- `src/services/mockIpcHandlers.ts` - Mock IPC handlers
- `src/hooks/useLicense.ts` - Updated to support demo mode
- `src/App.tsx` - Updated to skip license validation in demo mode
- `src/main.tsx` - Demo mode initialization
- `src/components/DemoModeIndicator.tsx` - Visual indicator component

### Adding New Features
When adding new features, make sure to:
1. Add corresponding mock handlers in `mockIpcHandlers.ts`
2. Add corresponding methods in `mockDatabaseService.ts`
3. Test both normal and demo modes

## Troubleshooting

### Demo Mode Not Working
1. Check that `VITE_DEMO_MODE=true` is set correctly
2. Clear browser cache and localStorage
3. Restart the development server
4. Check console for demo mode initialization messages

### Data Not Persisting
This is expected behavior in demo mode. Data is stored in localStorage and will be lost on page refresh.

### License Screen Still Appearing
Make sure the environment variable is set correctly and the application is restarted.

## Security Notes

⚠️ **Important**: Demo Mode is for demonstration and development purposes only. It should never be used in production environments as it bypasses all security measures.

## Support

For questions or issues related to Demo Mode, please check the console logs for detailed error messages and ensure all environment variables are set correctly.
