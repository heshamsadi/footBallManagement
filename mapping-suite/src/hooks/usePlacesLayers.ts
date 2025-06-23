import { useEffect, useState } from 'react';
import useMapStore from '@/store/map';

export const usePlacesLayers = () => {
  const [mounted, setMounted] = useState(false);
  
  const layers = useMapStore(s => s.placesLayers);
  const toggle = useMapStore(s => s.togglePlacesLayer);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return default values during SSR to prevent hydration mismatch
  if (!mounted) {
    return {
      layers: { hotel: false, restaurant: false, stadium: false },
      toggle: () => {},
    };
  }

  return { layers, toggle };
};
