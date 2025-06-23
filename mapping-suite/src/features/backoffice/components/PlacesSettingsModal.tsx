'use client';

import { useState } from 'react';
import useMapStore from '@/store/map';

interface PlacesSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlacesSettingsModal({ isOpen, onClose }: PlacesSettingsModalProps) {
  const placesConfig = useMapStore(s => s.placesConfig);
  const setPlacesConfig = useMapStore(s => s.setPlacesConfig);
  
  const [maxResults, setMaxResults] = useState(placesConfig.maxResults);
  const [minZoom, setMinZoom] = useState(placesConfig.minZoom);

  if (!isOpen) return null;

  const handleSave = () => {
    setPlacesConfig({ maxResults, minZoom });
    onClose();
  };

  const handleCancel = () => {
    setMaxResults(placesConfig.maxResults);
    setMinZoom(placesConfig.minZoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-sm mx-4 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Places Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="maxResults" className="block text-sm font-medium text-gray-700 mb-1">
              Max Results per Category
            </label>            <input
              id="maxResults"
              type="number"
              min="5"
              max="50"
              value={maxResults}
              onChange={(e) => setMaxResults(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 10-30</p>
          </div>

          <div>
            <label htmlFor="minZoom" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Zoom Level
            </label>            <input
              id="minZoom"
              type="number"
              min="10"
              max="18"
              value={minZoom}
              onChange={(e) => setMinZoom(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">Places appear only when zoomed in past this level</p>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
