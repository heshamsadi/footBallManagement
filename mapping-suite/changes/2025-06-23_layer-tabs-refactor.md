# Layer Filter Tabs Refactor

**Date:** 2025-06-23  
**Type:** UI Refactor  
**Scope:** Convert workspace tabs into interactive layer filter pills  

## Summary
Converted the workspace tab-strip into a layer filter with pill-style tabs that control the Places overlay visibility. The new component acts as interactive checkboxes styled as pills, allowing multiple selections and providing visual feedback for active/inactive states.

## Changes Made

### New Files
- `src/hooks/usePlacesLayers.ts` - Helper hook for Places layer state management
- `src/features/backoffice/components/PlaceFilterTabs.tsx` - New pill-style layer filter component

### Modified Files
- `src/app/page.tsx` - Replaced WorkspaceTabs with PlaceFilterTabs

## Technical Details

### PlaceFilterTabs Component
- Three pill-style buttons: Hotels | Restaurants | Stadiums
- Active state: `bg-white text-primary border border-primary shadow-sm`
- Inactive state: `bg-primary text-white hover:bg-primary/90`
- Multiple tabs can be active simultaneously
- Smooth transitions with `transition-colors duration-200`

### usePlacesLayers Hook
- Clean abstraction for Places layer state management
- Returns `layers` object and `toggle` function
- Connects directly to map store's `placesLayers` and `togglePlacesLayer`

### Visual Design
- Rounded pill shape with `rounded-full`
- Consistent padding: `px-4 py-1`
- Small font size: `text-sm font-medium`
- Uses existing Tailwind theme colors (primary: #0073e6)
- Added subtle shadow for active state depth
- Hover effect for better UX

### Layout Integration
- Positioned at bottom center of map: `absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10`
- Replaced WorkspaceTabs import and usage
- Maintains same positioning as previous tab strip
- Flexible wrap layout with `flex flex-wrap gap-2`

## Behavior
- Clicking a pill toggles the corresponding Places layer visibility
- Initial state reflects current store.placesLayers values
- Real-time sync with map overlay display
- Multiple layers can be active/inactive independently

## Store Integration
- Leverages existing `placesLayers` state in map store
- Uses existing `togglePlacesLayer` action
- No changes needed in store implementation
- Maintains backward compatibility with PlacesLayerCheckboxes

## Visual States
- **Active Tab**: White background, primary text, primary border, subtle shadow
- **Inactive Tab**: Primary background, white text, hover effect
- **Transitions**: Smooth color transitions for better UX
- **Responsive**: Flex wrap for smaller screens

## No Breaking Changes
- WorkspaceTabs component still exists (not deleted)
- Can be reused elsewhere if needed
- Places overlay functionality remains unchanged
- All existing map interactions preserved
