'use client';

import { useLayers } from '@/hooks/useLayers';

export default function LayerChecklist() {
  const { layers, toggleLayer } = useLayers();

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h3 className="mb-3 text-lg font-medium text-gray-900">Map Layers</h3>{' '}
      <div className="space-y-2">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={layers.terrain}
            onChange={() => toggleLayer('terrain')}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className={`text-sm ${layers.terrain ? 'text-gray-900' : 'text-gray-400'}`}>
            Terrain
          </span>
        </label>

        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={layers.hotel}
            onChange={() => toggleLayer('hotel')}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className={`text-sm ${layers.hotel ? 'text-gray-900' : 'text-gray-400'}`}>
            Hotels
          </span>
        </label>

        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={layers.airport}
            onChange={() => toggleLayer('airport')}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className={`text-sm ${layers.airport ? 'text-gray-900' : 'text-gray-400'}`}>
            Airports
          </span>
        </label>
      </div>
    </div>
  );
}
