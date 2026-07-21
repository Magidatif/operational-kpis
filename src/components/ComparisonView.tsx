import React, { useState } from 'react';
import {
  GitCompare,
  Building2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList
} from 'recharts';
import dayjs from 'dayjs';
import type { PatientRecord, ComparisonType } from '../types';
import {
  calculateFacilityComparison,
  calculatePeriodComparison
} from '../utils/dataProcessor';
import { translations } from '../utils/translations';
import type { Language } from '../utils/translations';

interface ComparisonViewProps {
  records: PatientRecord[];
  lang: Language;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ records, lang }) => {
  const [comparisonType, setComparisonType] = useState<ComparisonType>('facility');
  const t = translations[lang];

  // Period inputs
  const defaultP1Start = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
  const defaultP1End = dayjs().subtract(15, 'day').format('YYYY-MM-DD');
  const defaultP2Start = dayjs().subtract(14, 'day').format('YYYY-MM-DD');
  const defaultP2End = dayjs().format('YYYY-MM-DD');

  const [p1Start, setP1Start] = useState(defaultP1Start);
  const [p1End, setP1End] = useState(defaultP1End);
  const [p2Start, setP2Start] = useState(defaultP2Start);
  const [p2End, setP2End] = useState(defaultP2End);

  const facilityData = calculateFacilityComparison(records);
  const periodData = calculatePeriodComparison(records, p1Start, p1End, p2Start, p2End);

  return (
    <div className="space-y-6">
      {/* Comparison Selector Header */}
      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-[#1E3A8A] flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-[#0EA5E9]" />
              <span>{t.comparisonMatrixTitle}</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-1 font-medium">
              {t.comparisonMatrixSub}
            </p>
          </div>

          <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
            <button
              onClick={() => setComparisonType('facility')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                comparisonType === 'facility'
                  ? 'bg-[#1E3A8A] text-white shadow-md'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{t.cmpByFacilityBtn}</span>
            </button>
            <button
              onClick={() => setComparisonType('period')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                comparisonType === 'period'
                  ? 'bg-[#1E3A8A] text-white shadow-md'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{t.cmpByPeriodBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: FACILITY COMPARISON */}
      {comparisonType === 'facility' && (
        <div className="space-y-6">
          {/* Side-by-side Chart */}
          <div className="glass-card p-5">
            <div className="mb-4 pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-extrabold text-[#1E3A8A] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0EA5E9]" />
                <span>{t.cmpFacilityChartTitle}</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5 font-medium">
                {t.cmpFacilityChartSub}
              </p>
            </div>

            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={facilityData} margin={{ top: 25, right: 10, left: -10, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis
                    dataKey="facilityName"
                    stroke="#0F172A"
                    fontSize={11}
                    fontWeight="bold"
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={65}
                    dy={8}
                  />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar name={t.kpiTotalPatients} dataKey="totalPatients" fill="#1E3A8A" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="totalPatients" position="top" fill="#1E3A8A" fontSize={10} fontWeight="bold" />
                  </Bar>
                  <Bar name={`${t.kpiAvgWaitTime} (${t.minutesUnit})`} dataKey="avgWaitTime" fill="#F59E0B" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="avgWaitTime" position="top" fill="#F59E0B" fontSize={10} fontWeight="bold" formatter={(v: any) => `${v}${t.minutesUnit}`} />
                  </Bar>
                  <Bar name={`${t.kpiAvgConsultTime} (${t.minutesUnit})`} dataKey="avgConsultTime" fill="#06B6D4" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="avgConsultTime" position="top" fill="#06B6D4" fontSize={10} fontWeight="bold" formatter={(v: any) => `${v}${t.minutesUnit}`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Facility Metrics Matrix */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-extrabold text-[#1E3A8A] mb-3">{t.cmpFacilityTableTitle}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#F8FAFC] text-[#0F172A] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="p-3 font-bold">{t.colFacility}</th>
                    <th className="p-3 font-bold">{t.kpiTotalPatients}</th>
                    <th className="p-3 font-bold">{t.kpiCompletedConsultations}</th>
                    <th className="p-3 font-bold">{t.kpiAvgWaitTime}</th>
                    <th className="p-3 font-bold">{t.kpiAvgConsultTime}</th>
                    <th className="p-3 font-bold">{t.colActiveDoctors}</th>
                    <th className="p-3 font-bold">{t.colCongestionStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
                  {facilityData.map((item) => (
                    <tr key={item.facilityName} className="hover:bg-[#F8FAFC]">
                      <td className="p-3 font-bold text-[#1E3A8A] flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#0EA5E9]" />
                        <span>{item.facilityName}</span>
                      </td>
                      <td className="p-3 font-black text-[#0F172A]">{item.totalPatients} {t.patientsUnit}</td>
                      <td className="p-3 text-[#10B981] font-extrabold">{item.completedConsultations}</td>
                      <td className="p-3 text-[#F59E0B] font-black">{item.avgWaitTime} {t.minutesUnit}</td>
                      <td className="p-3 text-[#0EA5E9] font-black">{item.avgConsultTime} {t.minutesUnit}</td>
                      <td className="p-3 text-[#6366F1] font-bold">{item.doctorsCount} {t.doctorsUnit}</td>
                      <td className="p-3">
                        {item.avgWaitTime > 30 ? (
                          <span className="px-2.5 py-1 bg-[#F43F5E]/10 text-[#F43F5E] border border-[#F43F5E]/20 rounded-full font-bold inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {t.statusHighCongestion}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded-full font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {t.statusBalancedPerformance}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: TIME PERIOD COMPARISON */}
      {comparisonType === 'period' && (
        <div className="space-y-6">
          {/* Period Range Pickers */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-extrabold text-[#1E3A8A] mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0EA5E9]" />
              <span>{t.periodPickerTitle}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Period 1 Picker */}
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#1E3A8A]/20">
                <h4 className="text-xs font-extrabold text-[#1E3A8A] mb-3">{t.period1Title}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#64748B] font-bold block mb-1">{t.fromDate}</label>
                    <input
                      type="date"
                      value={p1Start}
                      onChange={(e) => setP1Start(e.target.value)}
                      className="w-full bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#64748B] font-bold block mb-1">{t.toDate}</label>
                    <input
                      type="date"
                      value={p1End}
                      onChange={(e) => setP1End(e.target.value)}
                      className="w-full bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Period 2 Picker */}
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#0EA5E9]/30">
                <h4 className="text-xs font-extrabold text-[#0EA5E9] mb-3">{t.period2Title}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#64748B] font-bold block mb-1">{t.fromDate}</label>
                    <input
                      type="date"
                      value={p2Start}
                      onChange={(e) => setP2Start(e.target.value)}
                      className="w-full bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#64748B] font-bold block mb-1">{t.toDate}</label>
                    <input
                      type="date"
                      value={p2End}
                      onChange={(e) => setP2End(e.target.value)}
                      className="w-full bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Variance KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Patients Variance */}
            <div className="glass-card p-5">
              <p className="text-xs font-bold text-[#64748B]">{t.kpiTotalPatients}</p>
              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <span className="text-sm font-bold text-[#1E3A8A] block">
                    {t.periodVal1(periodData.period1Kpis.totalPatients)}
                  </span>
                  <span className="text-lg font-black text-[#0EA5E9]">
                    {t.periodVal2(periodData.period2Kpis.totalPatients)}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-extrabold ${
                    periodData.kpiVariances.totalPatients >= 0
                      ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                      : 'bg-[#F43F5E]/10 text-[#F43F5E] border border-[#F43F5E]/20'
                  }`}
                >
                  {periodData.kpiVariances.totalPatients >= 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  <span>{periodData.kpiVariances.totalPatients}%</span>
                </div>
              </div>
            </div>

            {/* Avg Wait Time Variance */}
            <div className="glass-card p-5">
              <p className="text-xs font-bold text-[#64748B]">{t.kpiAvgWaitTime}</p>
              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <span className="text-sm font-bold text-[#F59E0B] block">
                    {t.periodVal1(`${periodData.period1Kpis.avgWaitTime} ${t.minutesUnit}`)}
                  </span>
                  <span className="text-lg font-black text-[#F59E0B]">
                    {t.periodVal2(`${periodData.period2Kpis.avgWaitTime} ${t.minutesUnit}`)}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-extrabold ${
                    periodData.kpiVariances.avgWaitTime <= 0
                      ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                      : 'bg-[#F43F5E]/10 text-[#F43F5E] border border-[#F43F5E]/20'
                  }`}
                >
                  {periodData.kpiVariances.avgWaitTime <= 0 ? (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  )}
                  <span>{periodData.kpiVariances.avgWaitTime}%</span>
                </div>
              </div>
            </div>

            {/* Avg Consult Time Variance */}
            <div className="glass-card p-5">
              <p className="text-xs font-bold text-[#64748B]">{t.kpiAvgConsultTime}</p>
              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <span className="text-sm font-bold text-[#1E3A8A] block">
                    {t.periodVal1(`${periodData.period1Kpis.avgConsultTime} ${t.minutesUnit}`)}
                  </span>
                  <span className="text-lg font-black text-[#0EA5E9]">
                    {t.periodVal2(`${periodData.period2Kpis.avgConsultTime} ${t.minutesUnit}`)}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 px-2 py-1 bg-[#F1F5F9] text-[#0F172A] rounded-lg text-xs font-extrabold border border-[#E2E8F0]">
                  <span>{periodData.kpiVariances.avgConsultTime}%</span>
                </div>
              </div>
            </div>

            {/* Completed Consultations Variance */}
            <div className="glass-card p-5">
              <p className="text-xs font-bold text-[#64748B]">{t.kpiCompletedConsultations}</p>
              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <span className="text-sm font-bold text-[#10B981] block">
                    {t.periodVal1(periodData.period1Kpis.completedConsultations)}
                  </span>
                  <span className="text-lg font-black text-[#10B981]">
                    {t.periodVal2(periodData.period2Kpis.completedConsultations)}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-extrabold ${
                    periodData.kpiVariances.completedConsultations >= 0
                      ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                      : 'bg-[#F43F5E]/10 text-[#F43F5E] border border-[#F43F5E]/20'
                  }`}
                >
                  {periodData.kpiVariances.completedConsultations >= 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  <span>{periodData.kpiVariances.completedConsultations}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
