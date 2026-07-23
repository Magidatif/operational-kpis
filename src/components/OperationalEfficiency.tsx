import React, { useState } from 'react';
import {
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { Clock, Building2, MapPin, TrendingUp, AlertCircle } from 'lucide-react';
import type { PatientRecord } from '../types';
import { calculatePeakHours, calculateWaitTimeByGroup, calculatePatientFlow } from '../utils/dataProcessor';
import { translations } from '../utils/translations';
import type { Language } from '../utils/translations';

interface OperationalEfficiencyProps {
  records: PatientRecord[];
  lang: Language;
}

export const OperationalEfficiency: React.FC<OperationalEfficiencyProps> = ({ records, lang }) => {
  const [groupBy, setGroupBy] = useState<'facilityName' | 'regionName'>('facilityName');
  const [flowMode, setFlowMode] = useState<'all' | 'volume' | 'turnaround'>('all');
  const t = translations[lang];

  const peakData = calculatePeakHours(records);
  const waitTimeGroupData = calculateWaitTimeByGroup(records, groupBy);
  const flowData = calculatePatientFlow(records);

  // Peak hour highlight
  const maxPeak = peakData.reduce((max, item) => (item.count > max.count ? item : max), { count: 0, hour: '00:00' });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* 1. Peak Hours Area Chart */}
      <div className="glass-card p-5 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-sm font-extrabold text-[#1E3A8A] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0EA5E9]" />
              <span>{t.peakHoursTitle}</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              {t.peakHoursSub}
            </p>
          </div>
          {maxPeak.count > 0 && (
            <div className="px-2.5 py-1 bg-[#1E3A8A]/10 text-[#1E3A8A] border border-[#1E3A8A]/20 rounded-lg text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
              <TrendingUp className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>{t.highestPeakBadge(maxPeak.hour, maxPeak.count)}</span>
            </div>
          )}
        </div>

        <div className="h-88 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={peakData} margin={{ top: 30, right: 10, left: -20, bottom: 10 }}>
              <defs>
                <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="hour"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                interval={2}
              />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(value: any) => [`${value} ${t.patientsUnit}`, t.countLabel]}
                labelFormatter={(label) => `${t.hourLabel} ${label}`}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#1E3A8A"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#peakGradient)"
              >
                <LabelList
                  dataKey="count"
                  position="top"
                  offset={10}
                  fill="#1E3A8A"
                  fontSize={10}
                  fontWeight="bold"
                  formatter={(v: any) => (Number(v) > 0 ? v : '')}
                />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Wait Time by Facility / Region Bar Chart */}
      <div className="glass-card p-5 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-sm font-extrabold text-[#1E3A8A] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
              <span>{t.waitTimeTitle}</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              {t.waitTimeSub}
            </p>
          </div>

          <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-lg border border-[#E2E8F0] self-start sm:self-auto">
            <button
              onClick={() => setGroupBy('facilityName')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md font-bold transition-all ${
                groupBy === 'facilityName'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>{t.btnHospital}</span>
            </button>
            <button
              onClick={() => setGroupBy('regionName')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md font-bold transition-all ${
                groupBy === 'regionName'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>{t.btnRegion}</span>
            </button>
          </div>
        </div>

        <div className="h-88 w-full overflow-y-auto pr-2">
          <div style={{ height: `${Math.max(300, waitTimeGroupData.length * 45)}px`, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={waitTimeGroupData} margin={{ top: 15, right: 40, left: 160, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#0F172A"
                  fontSize={11}
                  fontWeight="bold"
                  tickLine={false}
                  interval={0}
                  width={150}
                  tick={({ x, y, payload }) => {
                    const textStr = payload.value || '';
                    const truncated = textStr.length > 25 ? textStr.substring(0, 25) + '...' : textStr;
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <title>{textStr}</title>
                        <text
                          x={-8}
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
                    `${t.formatDuration(value)} (${t.kpiTotalPatients}: ${item.payload.totalPatients})`,
                    t.kpiAvgWaitTime
                  ]}
                />
                <Bar dataKey="avgWaitTime" fill="#0EA5E9" radius={[0, 6, 6, 0]} barSize={22}>
                  <LabelList
                    dataKey="avgWaitTime"
                    content={(props: any) => {
                      const { x, y, width, height, value } = props;
                      return (
                        <text
                          x={x + width + 8}
                          y={y + height / 2}
                          fill="#0F172A"
                          fontSize={11}
                          fontWeight="black"
                          textAnchor="end"
                          dominantBaseline="central"
                        >
                          {t.formatDuration(value)}
                        </text>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Patient Flow Analysis */}
      <div className="glass-card p-5 transition-all lg:col-span-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-sm font-extrabold text-[#1E3A8A] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              <span>{t.patientFlowTitle}</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              {t.patientFlowSub}
            </p>
          </div>
          
          <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-lg border border-[#E2E8F0] self-start sm:self-auto">
            <button
              onClick={() => setFlowMode('all')}
              className={`px-2.5 py-1 text-[11px] rounded-md font-bold transition-all ${flowMode === 'all' ? 'bg-[#1E3A8A] text-white' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              {t.btnShowAll}
            </button>
            <button
              onClick={() => setFlowMode('volume')}
              className={`px-2.5 py-1 text-[11px] rounded-md font-bold transition-all ${flowMode === 'volume' ? 'bg-[#1E3A8A] text-white' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              {t.btnShowVolume}
            </button>
            <button
              onClick={() => setFlowMode('turnaround')}
              className={`px-2.5 py-1 text-[11px] rounded-md font-bold transition-all ${flowMode === 'turnaround' ? 'bg-[#1E3A8A] text-white' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              {t.btnShowTurnaround}
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={flowData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCheckIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCheckOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
              
              {(flowMode === 'all' || flowMode === 'volume') && (
                <YAxis yAxisId="left" stroke="#64748B" fontSize={11} tickLine={false} />
              )}
              
              {(flowMode === 'all' || flowMode === 'turnaround') && (
                <YAxis yAxisId="right" orientation={flowMode === 'turnaround' ? 'left' : 'right'} stroke="#F59E0B" fontSize={11} tickLine={false} />
              )}
              
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <Tooltip
                formatter={(value: any, name: any) => {
                  if (name === 'avgTurnaround') return [t.formatDuration(value), t.avgTurnaroundLabel];
                  return [value, name === 'checkIns' ? t.checkInLabel : t.checkOutLabel];
                }}
              />
              
              {(flowMode === 'all' || flowMode === 'volume') && (
                <>
                  <Area yAxisId="left" type="monotone" dataKey="checkIns" name="checkIns" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorCheckIn)" strokeWidth={2} />
                  <Area yAxisId="left" type="monotone" dataKey="checkOuts" name="checkOuts" stroke="#10B981" fillOpacity={1} fill="url(#colorCheckOut)" strokeWidth={2} />
                </>
              )}
              
              {(flowMode === 'all' || flowMode === 'turnaround') && (
                <Line yAxisId="right" type="monotone" dataKey="avgTurnaround" name="avgTurnaround" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
