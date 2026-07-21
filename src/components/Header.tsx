import React from 'react';
import {
  Activity,
  BarChart3,
  GitCompare,
  CloudUpload,
  RefreshCw,
  Globe
} from 'lucide-react';
import type { ViewMode } from '../types';
import { translations } from '../utils/translations';
import type { Language } from '../utils/translations';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  lang: Language;
  onToggleLanguage: () => void;
  onOpenDeployGuide: () => void;
  totalRecordsCount: number;
  onClearData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  lang,
  onToggleLanguage,
  onOpenDeployGuide,
  totalRecordsCount,
  onClearData
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300 px-4 lg:px-8 py-3 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-xl shadow-sm p-1 border border-[#E2E8F0] overflow-hidden flex items-center justify-center shrink-0">
            <img 
              src="/logo.png" 
              alt="MAG Logo" 
              className="w-14 h-14 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const nextEl = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextEl) nextEl.style.display = 'block';
              }}
            />
            <Activity style={{ display: 'none' }} className="w-8 h-8 m-3 text-[#0EA5E9] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-[#1E3A8A] tracking-tight">
                {t.appTitle}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/30 font-bold">
                {t.interactiveBadge}
              </span>
            </div>
            <p className="text-xs text-[#64748B] font-medium">
              {t.appSubTitle}
            </p>
          </div>
        </div>

        {/* View Switcher Tabs (Overview & Comparison) */}
        <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              currentView === 'dashboard'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t.tabOverview}</span>
          </button>

          <button
            onClick={() => onViewChange('comparison')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              currentView === 'comparison'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/60'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>{t.tabComparison}</span>
          </button>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-[#1E3A8A] rounded-lg text-xs font-extrabold border border-[#E2E8F0] shadow-sm transition-all"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'}
          >
            <Globe className="w-4 h-4 text-[#0EA5E9]" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {totalRecordsCount > 0 && (
            <button
              onClick={onClearData}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-red-50 text-[#64748B] hover:text-[#F43F5E] rounded-lg text-xs font-bold border border-[#E2E8F0] hover:border-[#F43F5E]/30 transition-all shadow-sm"
              title="Clear all records"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.btnClear}</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
