import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { Users, CreditCard, CalendarDays } from 'lucide-react';
import type { PatientRecord } from '../types';
import {
  calculateGenderDistribution,
  calculateBillingDistribution,
  calculateAgeGroupDistribution
} from '../utils/dataProcessor';
import { translations } from '../utils/translations';
import type { Language } from '../utils/translations';

interface DemographicsAnalysisProps {
  records: PatientRecord[];
  lang: Language;
}

export const DemographicsAnalysis: React.FC<DemographicsAnalysisProps> = ({ records, lang }) => {
  const t = translations[lang];
  const rawGenderData = calculateGenderDistribution(records);
  const billingData = calculateBillingDistribution(records);
  const rawAgeData = calculateAgeGroupDistribution(records);

  // Apply specified theme colors & translations
  const genderData = rawGenderData.map((g) => {
    let fill = '#64748B';
    let name = g.name;
    if (g.name === 'ذكر') {
      fill = '#0EA5E9';
      if (lang === 'en') name = t.genderMale;
    } else if (g.name === 'أنثى') {
      fill = '#F43F5E';
      if (lang === 'en') name = t.genderFemale;
    } else if (lang === 'en') {
      name = t.genderUnknown;
    }
    return { ...g, name, fill };
  });

  const ageData = rawAgeData.map((a) => {
    let name = a.name;
    if (lang === 'en') {
      if (a.name.includes('أطفال')) name = t.ageChildren;
      else if (a.name.includes('شباب')) name = t.ageYouth;
      else if (a.name.includes('بالغين')) name = t.ageAdults;
      else if (a.name.includes('كبار')) name = t.ageSeniors;
    }
    return { ...a, name };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* 1. Gender Donut Chart */}
      <div className="glass-card p-5 transition-all">
        <div className="mb-4 pb-3 border-b border-[#E2E8F0]">
          <h3 className="text-sm font-extrabold text-[#1E3A8A] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#F43F5E]" />
            <span>{t.genderTitle}</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5 font-medium">
            {t.genderSub}
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                label={({ value }) => `${value}`}
                labelLine={false}
              >
                {genderData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(val: any) => [`${val} ${t.patientsUnit}`, t.kpiTotalPatients]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-around border-t border-[#E2E8F0] pt-3">
          {genderData.map((g) => (
            <div key={g.name} className="text-center">
              <span className="text-xs text-[#64748B] font-bold block">{g.name}</span>
              <span className="text-base font-black" style={{ color: g.fill }}>
                {g.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Billing Group Bar Chart (Clean Column Layout) */}
      <div className="glass-card p-5 transition-all">
        <div className="mb-4 pb-3 border-b border-[#E2E8F0]">
          <h3 className="text-sm font-extrabold text-[#1E3A8A] flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#06B6D4]" />
            <span>{t.billingTitle}</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5 font-medium">
            {t.billingSub}
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={billingData.slice(0, 5)}
              margin={{ top: 30, right: 15, left: -15, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="name"
                stroke="#0F172A"
                fontSize={11}
                fontWeight="bold"
                tickLine={false}
                interval={0}
              />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip formatter={(val: any) => [`${val} ${t.patientsUnit}`, t.countLabel]} />
              <Bar dataKey="count" fill="#06B6D4" radius={[6, 6, 0, 0]} barSize={40}>
                <LabelList
                  dataKey="count"
                  position="top"
                  offset={8}
                  fill="#0F172A"
                  fontSize={11}
                  fontWeight="black"
                  formatter={(v: any) => Number(v).toLocaleString()}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Age Groups Distribution */}
      <div className="glass-card p-5 transition-all">
        <div className="mb-4 pb-3 border-b border-[#E2E8F0]">
          <h3 className="text-sm font-extrabold text-[#1E3A8A] flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#6366F1]" />
            <span>{t.ageGroupTitle}</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5 font-medium">
            {t.ageGroupSub}
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageData} margin={{ top: 30, right: 15, left: -15, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="name"
                stroke="#0F172A"
                fontSize={10}
                fontWeight="bold"
                tickLine={false}
                interval={0}
              />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip formatter={(val: any) => [`${val} ${t.patientsUnit}`, t.countLabel]} />
              <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={36}>
                <LabelList
                  dataKey="count"
                  position="top"
                  offset={8}
                  fill="#1E3A8A"
                  fontSize={11}
                  fontWeight="black"
                  formatter={(v: any) => Number(v).toLocaleString()}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
