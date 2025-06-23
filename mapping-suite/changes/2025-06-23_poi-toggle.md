# POI Toggle Enhancement

**Date:** 2025-06-23  
**Type:** UI Enhancement  
**Scope:** Add toggle for Google's native POI layer  

## Summary
Added a fourth pill "Map POIs" to the PlaceFilterTabs component that allows users to toggle Google's native POI layer on/off. This provides full control over map visibility - users can choose to see only custom Places categories, only native POIs, or both simultaneously.

## Changes Made

### Modified Files
- `src/store/map.ts` - Added showNativePoi state and toggleNativePoi action
- `src/components/MapWrapperAdmin.tsx` - Added POI toggle logic with useEffect
- `src/components/MapWrapperUser.tsx` - Added POI toggle logic with useEffect  
- `src/features/backoffice/components/PlaceFilterTabs.tsx` - Added fourth pill for native POI toggle

## Technical Details

### Store Updates
- Added `showNativePoi: boolean` (default: false)
- Added `toggleNativePoi: () => void` action
- Clean state management with Zustand

### Map Logic Implementation
- Created `HIDE_POI_STYLE` constant for consistent POI hiding
- Added useEffect in both MapWrapperAdmin and MapWrapperUser
- Uses `map.setOptions({ styles })` to dynamically toggle POI visibility
- `showNativePoi = true` → `styles: []` (show POIs)
- `showNativePoi = false` → `styles: HIDE_POI_STYLE` (hide POIs)

### UI Enhancement
- Fourth pill: "Map POIs" after Stadiums
- Same styling patterns as existing pills
- Active state: white background, primary text, border, shadow
- Inactive state: primary background, white text, hover effect
- Tooltip: "Toggle default Google POIs"

### SSR Handling
- Added proper hydration handling in PlaceFilterTabs
- Uses mounted state to prevent server/client mismatch
- Returns static inactive pills during SSR
- Activates full functionality after client hydration

### Default Behavior
- Page loads with native POIs hidden (`showNativePoi: false`)
- Clean basemap with only custom Places visible
- Click "Map POIs" → pill turns white, Google's native POIs appear
- Click again → pill turns blue, native POIs disappear
- Custom Places layers remain independent

## Visual States
- **Inactive (Default)**: Blue pill, native POIs hidden
- **Active**: White pill with primary border, native POIs visible
- **Independent**: Works alongside Hotels/Restaurants/Stadiums toggles
- **Consistent**: Same behavior in both admin and user maps

## Benefits
- **Full Control**: Choose between custom Places, native POIs, or both
- **Clean Default**: Starts with minimal POI clutter
- **Flexible UX**: Users can customize their map view
- **Consistent**: Same toggle behavior across all map instances
- **Performance**: Efficient style changes without re-rendering map

## Implementation Notes
- Uses `map.setOptions()` for dynamic style updates
- POI hiding style: `{ featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] }`
- Maintains existing Places overlay functionality
- No breaking changes to existing features
