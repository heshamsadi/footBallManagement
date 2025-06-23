interface StatsCardProps {
  label: string;
  value: string;
  trend?: string;
}

export default function StatsCard({ label, value, trend }: StatsCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
          </div>
        </div>
        <div className="mt-1">
          <div className="text-sm font-medium text-gray-500">{label}</div>
          {trend && (
            <div className="text-sm text-gray-400">{trend}</div>
          )}
        </div>
      </div>
    </div>
  );
}
