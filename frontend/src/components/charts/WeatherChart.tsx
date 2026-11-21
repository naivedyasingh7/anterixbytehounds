import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { WeatherWeek } from '../../types';

interface WeatherChartProps {
  data: WeatherWeek[];
  height?: number;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({ data, height = 240 }) => {
  return (
    <div className="w-full bg-[#F5EFE6] p-4 rounded-2xl border border-[#EAE3D9]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-sans font-medium text-[#1B1D1C]">Precipitation & Dry Spell Distribution</h4>
        <span className="text-[10px] font-mono text-[#9E3A3A] bg-[#FDF2F2] px-2.5 py-0.5 rounded-full border border-[#E5B5B5]">
          Drought Stress Window
        </span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EAE3D9" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#68625B' }} />
            <YAxis tick={{ fontSize: 11, fill: '#68625B' }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#1B1D1C] text-[#FBF9F5] p-3 rounded-2xl text-xs shadow-xl border border-white/10 font-sans space-y-1">
                      <p className="font-serif font-semibold text-[#CAB4AA]">{label}</p>
                      <p>Rainfall: <b className="text-[#8B5F4D]">{payload[0]?.value} mm</b></p>
                      <p>Max Temp: <b className="text-white">{payload[0]?.payload?.temp_max}°C</b></p>
                      <p>Soil Moisture: <b className="text-[#5B7553]">{payload[0]?.payload?.soil_moisture}</b></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="rainfall_mm" name="Rainfall (mm)" fill="#8B5F4D" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
