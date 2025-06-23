import useMapStore from '@/store/map';

export const useLayers = () =>
  useMapStore((s) => ({
    layers: s.layers,
    toggleLayer: s.toggleLayer,
  }));
