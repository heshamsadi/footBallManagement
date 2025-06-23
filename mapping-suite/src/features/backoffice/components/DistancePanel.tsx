'use client';

import { useState, useCallback } from 'react';
import useMapStore from '@/store/map';
import { calcDistance } from '@/lib/map/google/distance';
import type { DistanceRecord } from '@/store/map';

export default function DistancePanel() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const { addDistance } = useMapStore();
  const handleCalculate = useCallback(async () => {
    if (!origin.trim() || !destination.trim()) {
      // eslint-disable-next-line no-alert
      alert('Invalid');
      return;
    }

    setLoading(true);
    try {
      const result = await calcDistance(origin.trim(), destination.trim());

      const record: DistanceRecord = {
        id: crypto.randomUUID(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        origin: origin.trim(),
        destination: destination.trim(),
        km: result.km,
        minutes: result.minutes,
      };

      addDistance(record);

      // Clear inputs
      setOrigin('');
      setDestination('');
    } catch {
      // eslint-disable-next-line no-alert
      alert('Invalid');
    } finally {
      setLoading(false);
    }
  }, [origin, destination, addDistance]);

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Distance Calculator</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="block text-sm font-medium text-gray-700">Origin</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Enter origin address"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="block text-sm font-medium text-gray-700">Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination address"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleCalculate}
        disabled={loading}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Calculating...' : 'Calculate'}
      </button>
    </section>
  );
}
