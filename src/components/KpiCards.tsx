import React from 'react';
import { Users, Clock, Stethoscope, CheckCircle2, TrendingUp } from 'lucide-react';
import type { KpiSummary } from '../types';
import { translations } from '../utils/translations';
import type { Language } from '../utils/translations';

interface KpiCardsProps {
  kpis: KpiSummary;
  lang: Language;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis, lang }) => {
  const t = translations[lang];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Patients Card */}
      <div className="glass-card p-5 relative overflow-hidden transition-all hover:scale-[1.01] hover:border-[#1E3A8A]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#64748B]">{t.kpiTotalPatients}</p>
            <h3 className="text-3xl font-black text-[#1E3A8A] mt-1 tracking-tight">
              {lang === 'ar' ? kpis.totalPatients.toLocaleString('ar-EG') : kpis.totalPatients.toLocaleString()}
            </h3>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-[#1E3A8A] font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t.kpiTotalPatientsSub}</span>
            </div>
          </div>
          <div className="p-3.5 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-2xl border border-[#1E3A8A]/20 shadow-inner">
            <Users className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* 2. Avg Wait Time Card */}
      <div className="glass-card p-5 relative overflow-hidden transition-all hover:scale-[1.01] hover:border-[#F59E0B]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#64748B]">{t.kpiAvgWaitTime}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <h3 className="text-3xl font-black text-[#F59E0B] tracking-tight">
                {kpis.avgWaitTime}
              </h3>
              <span className="text-xs text-[#F59E0B] font-extrabold">{t.minutesUnit}</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-[#F59E0B] font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.kpiAvgWaitTimeSub}</span>
            </div>
          </div>
          <div className="p-3.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded-2xl border border-[#F59E0B]/20 shadow-inner">
            <Clock className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* 3. Avg Consultation Time Card */}
      <div className="glass-card p-5 relative overflow-hidden transition-all hover:scale-[1.01] hover:border-[#0EA5E9]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#64748B]">{t.kpiAvgConsultTime}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <h3 className="text-3xl font-black text-[#0EA5E9] tracking-tight">
                {kpis.avgConsultTime}
              </h3>
              <span className="text-xs text-[#0EA5E9] font-extrabold">{t.minutesUnit}</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-[#0EA5E9] font-bold">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{t.kpiAvgConsultTimeSub}</span>
            </div>
          </div>
          <div className="p-3.5 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-2xl border border-[#0EA5E9]/20 shadow-inner">
            <Stethoscope className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* 4. Completed Consultations Card */}
      <div className="glass-card p-5 relative overflow-hidden transition-all hover:scale-[1.01] hover:border-[#10B981]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#64748B]">{t.kpiCompletedConsultations}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-black text-[#10B981] tracking-tight">
                {lang === 'ar' ? kpis.completedConsultations.toLocaleString('ar-EG') : kpis.completedConsultations.toLocaleString()}
              </h3>
              <span className="text-xs font-extrabold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full border border-[#10B981]/20">
                {t.completionPercentage(kpis.completionRate)}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-[#10B981] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.kpiCompletedConsultationsSub}</span>
            </div>
          </div>
          <div className="p-3.5 bg-[#10B981]/10 text-[#10B981] rounded-2xl border border-[#10B981]/20 shadow-inner">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>
      </div>
    </div>
  );
};
