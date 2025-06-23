# Map Geolocation Default Location

**Date:** 2025-01-23  
**Type:** Feature  
**Scope:** Map initialization with user location  

## Summary
Implement geolocation API integration to set the map's default location to the user's current position instead of the hardcoded San Francisco coordinates. Includes proper error handling and fallback to San Francisco if geolocation fails or is unavailable.

## Changes Made

### New Files
- `src/lib/geolocation.ts` - Geolocation utility with async location fetching and fallback handling

### Modified Files
- `src/store/map.ts` - Added geolocation initialization logic and state tracking
- `src/components/MapWrapperAdmin.tsx` - Integrate user location initialization on map mount
- `src/components/MapWrapperUser.tsx` - Integrate user location initialization on map mount

## Technical Details

### Geolocation Utility
- Async `getCurrentLocation()` function with configurable options
- Default timeout of 10 seconds, high accuracy enabled
- Graceful fallback to San Francisco (37.7749, -122.4194) on error
- Browser compatibility check with `isGeolocationAvailable()`

### Store Updates
- Added `isLocationInitialized` flag to prevent duplicate location requests
- Added `initializeLocation()` async method to fetch and set user location
- Location initialization happens once per session

### Component Integration
- Both admin and user map wrappers now initialize user location before map setup
- Uses updated center coordinates after geolocation resolves
- Maintains existing interactive/locked behavior for respective map types

## Error Handling
- Handles geolocation API unavailability
- Handles user permission denial
- Handles timeout scenarios
- All errors gracefully fall back to San Francisco coordinates
- Development logging for debugging geolocation issues

## Browser Compatibility
- Supported in all modern browsers with navigator.geolocation
- Graceful degradation for browsers without geolocation support
- No breaking changes to existing functionality

## Testing Considerations
- Geolocation requires HTTPS in production
- Local development (localhost) allows HTTP geolocation
- User permission prompt appears on first access
- Fallback ensures maps always load with valid coordinates
