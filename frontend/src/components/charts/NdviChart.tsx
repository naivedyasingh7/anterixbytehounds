import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { NdviObservation } from '../../types';

interface NdviChartProps {
  data: NdviObservation[];
  height?: number;
}

export const NdviChart: React.FC<NdviChartProps> = ({ data, height = 260 }) => {
  return (
    <div className="w-full bg-white p-3 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-2">
          <span>Multi-Temporal Sentinel-2 NDVI Trajectory</span>
          <span className="text-[10px] font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            10-Day Cadence
          </span>
        </h4>
        <span className="text-[11px] text-slate-400">Target Range: 0.0 - 1.0</span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-xl border border-slate-700">
                      <p className="font-semibold text-emerald-400 mb-1">{label}</p>
                      <p>Observed NDVI: <b className="text-white">{payload[0]?.value}</b></p>
                      <p>District Normal: <b className="text-slate-300">{payload[1]?.value}</b></p>
                      <p className="text-[10px] text-amber-300 mt-1">Stage: {payload[0]?.payload?.phenology_stage}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
            <Line 
              type="monotone" 
              dataKey="mean_ndvi" 
              name="Field Observed NDVI" 
              stroke="#16a34a" 
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#16a34a' }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="district_normal_ndvi" 
              name="District Historical Normal" 
              stroke="#94a3b8" 
              strokeWidth={1.8} 
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
