import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { NdviObservation } from '../../types';
import { MOCK_WORKSPACE_CLM001 } from '../../services/mockData';

export interface NdviChartProps {
  data?: NdviObservation[];
  farmId?: string;
  height?: number;
}

export const NdviChart: React.FC<NdviChartProps> = ({ 
  data = MOCK_WORKSPACE_CLM001.yield_verification.ndvi_timeline, 
  height = 260 
}) => {
  return (
    <div className="w-full bg-[#F5EFE6] p-4 rounded-2xl border border-[#EAE3D9]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-sans font-medium text-[#1B1D1C] flex items-center gap-2">
          <span>Multi-Temporal Sentinel-2 NDVI Trajectory</span>
          <span className="text-[10px] font-mono text-[#5B7553] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full border border-[#5B7553]/30">
            10-Day Cadence
          </span>
        </h4>
        <span className="text-[11px] font-mono text-[#68625B]">Range: 0.0 - 1.0</span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EAE3D9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#68625B' }} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: '#68625B' }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#1B1D1C] text-[#FBF9F5] p-3 rounded-2xl text-xs shadow-xl border border-white/10 font-sans space-y-1">
                      <p className="font-serif font-semibold text-[#CAB4AA]">{label}</p>
                      <p>Observed NDVI: <b className="text-[#5B7553]">{payload[0]?.value}</b></p>
                      <p>District Normal: <b className="text-[#CAB4AA]">{payload[1]?.value}</b></p>
                      <p className="text-[10px] text-[#CAB4AA]/80 pt-0.5">Stage: {payload[0]?.payload?.phenology_stage}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', color: '#68625B' }} />
            <Line 
              type="monotone" 
              dataKey="mean_ndvi" 
              name="Field Observed NDVI" 
              stroke="#5B7553" 
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#5B7553' }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="district_normal_ndvi" 
              name="District Historical Normal" 
              stroke="#8B5F4D" 
              strokeWidth={1.8} 
              strokeDasharray="4 4"
              dot={{ r: 2.5, fill: '#8B5F4D' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
