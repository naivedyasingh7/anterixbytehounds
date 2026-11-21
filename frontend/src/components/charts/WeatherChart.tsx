import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { WeatherWeek } from '../../types';

interface WeatherChartProps {
  data: WeatherWeek[];
  height?: number;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({ data, height = 240 }) => {
  return (
    <div className="w-full bg-white p-3 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-slate-700">Precipitation & Dry Spell Distribution</h4>
        <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 font-medium">
          Drought Stress Window
        </span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-2 rounded-lg text-xs shadow-lg">
                      <p className="font-bold text-sky-400">{label}</p>
                      <p>Rainfall: <b>{payload[0]?.value} mm</b></p>
                      <p>Max Temp: <b>{payload[0]?.payload?.temp_max}°C</b></p>
                      <p>Soil Moisture: <b>{payload[0]?.payload?.soil_moisture}</b></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="rainfall_mm" name="Rainfall (mm)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
