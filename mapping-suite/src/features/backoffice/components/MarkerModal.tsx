'use client';

import { useState } from 'react';
import useMapStore from '@/store/map';
import type { Marker } from '@/store/map';

interface MarkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
}

export default function MarkerModal({ isOpen, onClose, lat, lng }: MarkerModalProps) {
  const { icons, addMarker } = useMapStore();
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [selectedLayer, setSelectedLayer] = useState<'terrain' | 'hotel' | 'airport'>('terrain');

  if (!isOpen) return null;
  const handleAdd = () => {
    if (!selectedIcon) {
      // eslint-disable-next-line no-alert
      alert('Please select an icon');
      return;
    }

    const marker: Marker = {
      id: crypto.randomUUID(),
      lat,
      lng,
      icon: selectedIcon,
      layer: selectedLayer,
    };

    addMarker(marker);
    onClose();
    setSelectedIcon('');
    setSelectedLayer('terrain');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Add Marker</h3>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Position: {lat.toFixed(6)}, {lng.toFixed(6)}
          </p>
        </div>{' '}
        <div className="mb-4">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Icon</label>
          <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
            {icons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setSelectedIcon(icon)}
                className={`relative rounded border p-2 ${
                  selectedIcon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/icons/${icon}`} alt={icon} className="h-8 w-8 mx-auto" />
              </button>
            ))}
          </div>
          {icons.length === 0 && <p className="text-sm text-gray-500">No icons uploaded yet</p>}
        </div>{' '}
        <div className="mb-6">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="block text-sm font-medium text-gray-700 mb-2">Layer</label>
          <div className="space-y-2">
            {(['terrain', 'hotel', 'airport'] as const).map((layer) => (
              // eslint-disable-next-line jsx-a11y/label-has-associated-control
              <label key={layer} className="flex items-center">
                <input
                  type="radio"
                  name="layer"
                  value={layer}
                  checked={selectedLayer === layer}
                  onChange={(e) => setSelectedLayer(e.target.value as typeof layer)}
                  className="mr-2"
                />
                <span className="text-sm capitalize">{layer}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Marker
          </button>
        </div>
      </div>
    </div>
  );
}
