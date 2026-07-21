import React from 'react';
import { Filter, Calendar, Building2, Search, RotateCcw, UserCheck, CreditCard } from 'lucide-react';
import dayjs from 'dayjs';
import type { FilterState } from '../types';
import { translations } from '../utils/translations';
import type { Language } from '../utils/translations';

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableFacilities: string[];
  availableRegions: string[];
  availableBillingGroups: string[];
  availableQueueStatuses: string[];
  totalFilteredCount: number;
  totalRecordsCount: number;
  lang: Language;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onFilterChange,
  availableFacilities,
  availableBillingGroups,
  availableQueueStatuses,
  totalFilteredCount,
  totalRecordsCount,
  lang
}) => {
  const t = translations[lang];

  const handleDatePreset = (preset: 'today' | 'week' | 'month' | 'all') => {
    if (preset === 'all') {
      onFilterChange({ ...filters, dateRange: { start: '', end: '' } });
      return;
    }

    const today = dayjs();
    let start = '';
    const end = today.format('YYYY-MM-DD');

    if (preset === 'today') {
      start = today.format('YYYY-MM-DD');
    } else if (preset === 'week') {
      start = today.subtract(7, 'day').format('YYYY-MM-DD');
    } else if (preset === 'month') {
      start = today.subtract(30, 'day').format('YYYY-MM-DD');
    }

    onFilterChange({ ...filters, dateRange: { start, end } });
  };

  const handleReset = () => {
    onFilterChange({
      dateRange: { start: '', end: '' },
      facilityNames: [],
      regionNames: [],
      billingGroups: [],
      queueStatuses: [],
      genders: [],
      searchQuery: ''
    });
  };

  const isFiltered =
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.facilityNames.length > 0 ||
    filters.regionNames.length > 0 ||
    filters.billingGroups.length > 0 ||
    filters.queueStatuses.length > 0 ||
    filters.genders.length > 0 ||
    filters.searchQuery;

  return (
    <div className="glass-card p-4 mb-6 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3 pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#0EA5E9]" />
          <h3 className="text-xs font-extrabold text-[#1E3A8A]">{t.filtersTitle}</h3>
          <span className="text-[11px] font-bold text-[#0EA5E9] bg-[#0EA5E9]/10 px-2.5 py-0.5 rounded-full border border-[#0EA5E9]/20">
            {t.showingCount(totalFilteredCount, totalRecordsCount)}
          </span>
        </div>

        {/* Date Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-[#64748B] font-bold ml-1">{t.datePresetsLabel}</span>
          {(['all', 'today', 'week', 'month'] as const).map((p) => {
            const labels = { all: t.presetAll, today: t.presetToday, week: t.presetWeek, month: t.presetMonth };
            return (
              <button
                key={p}
                onClick={() => handleDatePreset(p)}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-[#F1F5F9] hover:bg-[#0EA5E9] hover:text-white text-[#0F172A] border border-[#CBD5E1] transition-all font-bold"
              >
                {labels[p]}
              </button>
            );
          })}

          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-[#F43F5E]/10 hover:bg-[#F43F5E]/20 text-[#F43F5E] border border-[#F43F5E]/30 rounded-lg transition-all font-bold mr-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.resetFilters}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Date Range Start & End */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>{t.fromDate}</span>
          </label>
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                dateRange: { ...filters.dateRange, start: e.target.value }
              })
            }
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] font-semibold focus:border-[#0EA5E9] focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>{t.toDate}</span>
          </label>
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                dateRange: { ...filters.dateRange, end: e.target.value }
              })
            }
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] font-semibold focus:border-[#0EA5E9] focus:outline-none"
          />
        </div>

        {/* Facility Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>{t.facilityLabel}</span>
          </label>
          <select
            value={filters.facilityNames[0] || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                facilityNames: e.target.value ? [e.target.value] : []
              })
            }
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] font-semibold focus:border-[#0EA5E9] focus:outline-none"
          >
            <option value="">{t.allFacilities(availableFacilities.length)}</option>
            {availableFacilities.map((fac) => (
              <option key={fac} value={fac}>
                {fac}
              </option>
            ))}
          </select>
        </div>

        {/* Billing Group */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>{t.billingLabel}</span>
          </label>
          <select
            value={filters.billingGroups[0] || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                billingGroups: e.target.value ? [e.target.value] : []
              })
            }
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] font-semibold focus:border-[#0EA5E9] focus:outline-none"
          >
            <option value="">{t.allBilling}</option>
            {availableBillingGroups.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Queue Status */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{t.queueLabel}</span>
          </label>
          <select
            value={filters.queueStatuses[0] || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                queueStatuses: e.target.value ? [e.target.value] : []
              })
            }
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] font-semibold focus:border-[#0EA5E9] focus:outline-none"
          >
            <option value="">{t.allQueueStatuses}</option>
            {availableQueueStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>{t.searchLabel}</span>
          </label>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] font-semibold focus:border-[#0EA5E9] focus:outline-none placeholder-[#94A3B8]"
          />
        </div>
      </div>
    </div>
  );
};
