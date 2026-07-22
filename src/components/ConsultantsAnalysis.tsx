import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList
} from 'recharts';
import { PieChart as PieIcon, Award, Search, Stethoscope } from 'lucide-react';
import type { PatientRecord } from '../types';
import {
  calculateDoctorPerformance,
  calculateQueueStatusDistribution
} from '../utils/dataProcessor';
import { translations } from '../utils/translations';
import type { Language } from '../utils/translations';

interface ConsultantsAnalysisProps {
  records: PatientRecord[];
  lang: Language;
}

const STATUS_COLORS: { [key: string]: string } = {
  'مكتمل': '#10B981', // Emerald Green
  'Completed': '#10B981',
  'قيد الانتظار': '#F59E0B', // Amber Gold
  'Waiting': '#F59E0B',
  'قيد الكشف': '#EF4444', // Red
  'In-Progress': '#EF4444',
  'ملغاة': '#F43F5E', // Rose Red
  'Cancelled': '#F43F5E',
  'غير محدد': '#64748B'
};

export const ConsultantsAnalysis: React.FC<ConsultantsAnalysisProps> = ({ records, lang }) => {
  const [docSearch, setDocSearch] = useState('');
  const [viewType, setViewType] = useState<'chart' | 'table'>('chart');
  const t = translations[lang];

  const doctorsData = calculateDoctorPerformance(records);
  const rawQueueData = calculateQueueStatusDistribution(records);

  // Translate queue status names if English
  const queueStatusData = rawQueueData.map((q) => {
    let name = q.name;
    if (lang === 'en') {
      if (q.name.includes('مكتمل')) name = t.queueCompleted;
      else if (q.name.includes('انتظار')) name = t.queueWaiting;
      else if (q.name.includes('كشف') || q.name.includes('قيد')) name = t.queueInProgress;
      else if (q.name.includes('ملغاة')) name = t.queueCancelled;
    }
    return { ...q, name };
  });

  const filteredDoctors = doctorsData.filter((d) =>
    d.doctorName.toLowerCase().includes(docSearch.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* 1. Consultants Performance Ranking (Horizontal Bar Chart) */}
      <div className="lg:col-span-2 glass-card p-5 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-sm font-extrabold text-[#1E3A8A] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#A855F7]" />
              <span>{t.doctorsTitle}</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              {t.doctorsSub}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-2.5" />
              <input
                type="text"
                placeholder={t.searchDoctorPlaceholder}
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg pl-2 pr-8 py-1 text-xs text-[#0F172A] font-semibold focus:border-[#0EA5E9] focus:outline-none w-36 sm:w-44"
              />
            </div>

            <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-lg border border-[#E2E8F0]">
              <button
                onClick={() => setViewType('chart')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  viewType === 'chart' ? 'bg-[#1E3A8A] text-white' : 'text-[#64748B]'
                }`}
              >
                {t.btnChart}
              </button>
              <button
                onClick={() => setViewType('table')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  viewType === 'table' ? 'bg-[#1E3A8A] text-white' : 'text-[#64748B]'
                }`}
              >
                {t.btnTable}
              </button>
            </div>
          </div>
        </div>

        {viewType === 'chart' ? (
          <div className="h-80 w-full overflow-y-auto pr-2">
            <div style={{ height: `${Math.max(300, filteredDoctors.length * 45)}px`, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={filteredDoctors}
                  margin={{ top: 15, right: 80, left: 160, bottom: 15 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" stroke="#64748B" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="doctorName"
                    stroke="#0F172A"
                    fontSize={11}
                    width={150}
                    tickLine={false}
                    interval={0}
                    tick={({ x, y, payload }) => {
                      const textStr = payload.value || '';
                      const truncated = textStr.length > 22 ? textStr.substring(0, 22) + '...' : textStr;
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <title>{textStr}</title>
                          <text
                            x={-12}
                            y={4}
                            textAnchor="start"
                            fill="#0F172A"
                            fontSize={11}
                            fontWeight="bold"
                          >
                            {truncated}
                          </text>
                        </g>
                      );
                    }}
                  />
                  <Tooltip
                    formatter={(value: any, _name: any, item: any) => [
                      `${Number(value).toLocaleString()} (${t.kpiAvgConsultTime}: ${t.formatDuration(item.payload.avgConsultTime)})`,
                      t.colCompletedCount
                    ]}
                  />
                  <Bar dataKey="completedCount" fill="#A855F7" radius={[0, 6, 6, 0]} barSize={22} minPointSize={5}>
                    <LabelList
                      dataKey="completedCount"
                      content={(props: any) => {
                        const { x, y, width, height, value } = props;
                        return (
                          <text
                            x={x + width + 8}
                            y={y + height / 2}
                            fill="#1E3A8A"
                            fontSize={11}
                            fontWeight="black"
                            textAnchor="end"
                            dominantBaseline="central"
                          >
                            {Number(value).toLocaleString()}
                          </text>
                        );
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#F8FAFC] text-[#0F172A] border-b border-[#E2E8F0]">
                <tr>
                  <th className="p-2.5 font-bold">{t.colRank}</th>
                  <th className="p-2.5 font-bold">{t.colDoctorName}</th>
                  <th className="p-2.5 font-bold">{t.colFacility}</th>
                  <th className="p-2.5 font-bold">{t.colCompletedCount}</th>
                  <th className="p-2.5 font-bold">{t.colAvgConsultTime}</th>
                  <th className="p-2.5 font-bold">{t.colAvgWaitTime}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
                {filteredDoctors.map((doc, idx) => (
                  <tr key={doc.doctorName} className="hover:bg-[#F8FAFC]">
                    <td className="p-2.5 text-[#64748B] font-mono">{idx + 1}</td>
                    <td className="p-2.5 font-extrabold text-[#1E3A8A] flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-[#A855F7] shrink-0" />
                      <span>{doc.doctorName}</span>
                    </td>
                    <td className="p-2.5 text-[#64748B] font-semibold">{doc.facilityName}</td>
                    <td className="p-2.5 font-black text-[#10B981]">{doc.completedCount.toLocaleString()}</td>
                    <td className="p-2.5 text-[#0EA5E9] font-extrabold">{t.formatDuration(doc.avgConsultTime)}</td>
                    <td className="p-2.5 text-[#F59E0B] font-extrabold">{t.formatDuration(doc.avgWaitTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Queue Status Distribution (1 col width) */}
      <div className="glass-card p-5 transition-all">
        <div className="mb-4 pb-3 border-b border-[#E2E8F0]">
          <h3 className="text-sm font-extrabold text-[#1E3A8A] flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-[#A855F7]" />
            <span>{t.queueStatusTitle}</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5 font-medium">
            {t.queueStatusSub}
          </p>
        </div>

        <div className="h-60 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={queueStatusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                cornerRadius={5}
                stroke="none"
                dataKey="value"
                label={({ cx, x, y, value }) => {
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#0F172A"
                      textAnchor={x > cx ? 'end' : 'start'}
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight="bold"
                    >
                      {value.toLocaleString()}
                    </text>
                  );
                }}
                labelLine={{ stroke: '#CBD5E1', strokeWidth: 1.5, strokeDasharray: '3 3' }}
              >
                {queueStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name] || '#6366F1'}
                    style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(val: any) => [`${Number(val).toLocaleString()} ${t.patientsUnit}`, t.countLabel]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-2 space-y-1.5 border-t border-[#E2E8F0] pt-3">
          {queueStatusData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[item.name] || '#6366F1' }}
                />
                <span className="text-[#0F172A] font-bold">{item.name}</span>
              </div>
              <span className="font-extrabold text-[#1E3A8A]">{item.value.toLocaleString()} {t.patientsUnit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
