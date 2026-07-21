import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { FiltersBar } from './components/FiltersBar';
import { KpiCards } from './components/KpiCards';
import { OperationalEfficiency } from './components/OperationalEfficiency';
import { ConsultantsAnalysis } from './components/ConsultantsAnalysis';
import { DemographicsAnalysis } from './components/DemographicsAnalysis';
import { ComparisonView } from './components/ComparisonView';
import { DeployGuideModal } from './components/DeployGuideModal';
import type { PatientRecord, FilterState, ViewMode } from './types';
import { filterRecords, calculateKpis } from './utils/dataProcessor';
import { translations } from './utils/translations';
import type { Language } from './utils/translations';
import { FileUp } from 'lucide-react';

export function App() {
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; count: number }[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<Language>('ar');

  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: '', end: '' },
    facilityNames: [],
    regionNames: [],
    billingGroups: [],
    queueStatuses: [],
    genders: [],
    searchQuery: ''
  });

  const t = translations[lang];

  // Update HTML direction when language changes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleDataLoaded = (newRecords: PatientRecord[], fileName: string) => {
    setRecords((prev) => [...prev, ...newRecords]);
    setUploadedFiles((prev) => {
      const existing = prev.find((f) => f.name === fileName);
      if (existing) {
        return prev.map((f) => (f.name === fileName ? { name: fileName, count: f.count + newRecords.length } : f));
      }
      return [...prev, { name: fileName, count: newRecords.length }];
    });
  };

  const handleRemoveFile = (fileName: string) => {
    setRecords((prev) => prev.filter((r) => r.sourceFile !== fileName));
    setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const handleClearAll = () => {
    setRecords([]);
    setUploadedFiles([]);
  };

  // Unique filter values
  const availableFacilities = Array.from(new Set(records.map((r) => r.facilityName))).filter(Boolean);
  const availableRegions = Array.from(new Set(records.map((r) => r.regionName))).filter(Boolean);
  const availableBillingGroups = Array.from(new Set(records.map((r) => r.billingGroup))).filter(Boolean);
  const availableQueueStatuses = Array.from(new Set(records.map((r) => r.queueStatus))).filter(Boolean);

  // Filtered dataset & KPIs
  const filteredRecords = filterRecords(records, filters);
  const kpisSummary = calculateKpis(filteredRecords);

  return (
    <div className="min-h-screen pb-12 bg-[#F8FAFC] text-[#0F172A]">
      {/* Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        lang={lang}
        onToggleLanguage={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        totalRecordsCount={records.length}
        onClearData={handleClearAll}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* File Upload Dropzone */}
        <FileUploader
          onDataLoaded={handleDataLoaded}
          onClearAll={handleClearAll}
          uploadedFiles={uploadedFiles}
          onRemoveFile={handleRemoveFile}
          lang={lang}
        />

        {records.length > 0 ? (
          <>
            {/* Global Filters Slicer Bar */}
            <FiltersBar
              filters={filters}
              onFilterChange={setFilters}
              availableFacilities={availableFacilities}
              availableRegions={availableRegions}
              availableBillingGroups={availableBillingGroups}
              availableQueueStatuses={availableQueueStatuses}
              totalFilteredCount={filteredRecords.length}
              totalRecordsCount={records.length}
              lang={lang}
            />

            {/* Main View Router */}
            {currentView === 'dashboard' && (
              <div className="space-y-6">
                {/* 1. KPIs Cards */}
                <KpiCards kpis={kpisSummary} lang={lang} />

                {/* 2. Operational Efficiency (Peak Hours & Wait Times) */}
                <OperationalEfficiency records={filteredRecords} lang={lang} />

                {/* 3. Consultants & Queue Status Analysis */}
                <ConsultantsAnalysis records={filteredRecords} lang={lang} />

                {/* 4. Demographics, Billing & Age Groups */}
                <DemographicsAnalysis records={filteredRecords} lang={lang} />
              </div>
            )}

            {currentView === 'comparison' && (
              <ComparisonView records={filteredRecords} lang={lang} />
            )}
          </>
        ) : (
          <div className="glass-card p-12 text-center my-8 border border-dashed border-[#CBD5E1]">
            <div className="p-4 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-[#0EA5E9]/20">
              <FileUp className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1E3A8A] mb-2">{t.emptyStateTitle}</h3>
            <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6 font-semibold">
              {t.emptyStateDesc}
            </p>
          </div>
        )}
      </main>

      {/* Cloudflare Pages Deploy Guide Modal */}
      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
        lang={lang}
      />
    </div>
  );
}

export default App;
