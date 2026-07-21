import React, { useState } from 'react';
import { Table, Download, Search, ChevronRight, ChevronLeft, Building2, User, Stethoscope } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { PatientRecord } from '../types';
import { translations } from '../utils/translations';
import type { Language } from '../utils/translations';

interface DataTableViewProps {
  records: PatientRecord[];
  lang: Language;
}

export const DataTableView: React.FC<DataTableViewProps> = ({ records, lang }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const t = translations[lang];

  const filtered = records.filter(
    (r) =>
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.patientId.toLowerCase().includes(search.toLowerCase()) ||
      r.facilityName.toLowerCase().includes(search.toLowerCase()) ||
      r.consultPerformedBy.toLowerCase().includes(search.toLowerCase()) ||
      r.queueStatus.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentRecords = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportExcel = () => {
    const exportRows = filtered.map((r) => ({
      'Region Code': r.regionCode,
      'Region Name': r.regionName,
      'Facility Id': r.facilityId,
      'Facility Name': r.facilityName,
      'Patient ID': r.patientId,
      'Patient Name': r.patientName,
      'Birth Date': r.birthDate,
      'Age': r.age,
      'Age Group': r.ageGroup,
      'Gender': r.gender,
      'Billing Group': r.billingGroup,
      'Check in Date': r.checkInDate,
      'Assign Date': r.assignDate,
      'Consultation Date': r.consultationDate,
      'Check Out Date': r.checkOutDate,
      'Wait Time (Mins)': r.waitTimeMinutes,
      'Consultation Time (Mins)': r.consultationTimeMinutes,
      'Queue Status': r.queueStatus,
      'Consult Performed By': r.consultPerformedBy,
      'Source File': r.sourceFile
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Patients');
    XLSX.writeFile(workbook, `Healthcare_Records_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="glass-card p-5">
      {/* Header and Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-base font-extrabold text-[#1E3A8A] flex items-center gap-2">
            <Table className="w-5 h-5 text-[#0EA5E9]" />
            <span>{t.tableTitle}</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            {t.tableSub(filtered.length, records.length)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder={t.tableSearchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg pl-3 pr-9 py-1.5 text-xs text-[#0F172A] font-semibold focus:border-[#0EA5E9] focus:outline-none w-48 sm:w-64"
            />
          </div>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-xs font-bold shadow-md shadow-[#10B981]/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{t.btnExportExcel}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead className="bg-[#F8FAFC] text-[#0F172A] border-b border-[#E2E8F0]">
            <tr>
              <th className="p-3 font-bold">Patient ID</th>
              <th className="p-3 font-bold">Patient Name</th>
              <th className="p-3 font-bold">Gender / Age</th>
              <th className="p-3 font-bold">Facility</th>
              <th className="p-3 font-bold">Check-in Date</th>
              <th className="p-3 font-bold">Wait Time</th>
              <th className="p-3 font-bold">Consult Time</th>
              <th className="p-3 font-bold">Doctor</th>
              <th className="p-3 font-bold">Queue Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-[#64748B] font-medium">
                  {t.noMatchingRecords}
                </td>
              </tr>
            ) : (
              currentRecords.map((r) => (
                <tr key={r.id} className="hover:bg-[#F8FAFC]">
                  <td className="p-3 font-mono text-[#0EA5E9] font-bold">{r.patientId}</td>
                  <td className="p-3 font-bold text-[#0F172A] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>{r.patientName}</span>
                  </td>
                  <td className="p-3 text-[#0F172A]">
                    <span className="font-bold">{r.gender}</span> ({r.age})
                  </td>
                  <td className="p-3 text-[#0F172A]">
                    <div className="flex items-center gap-1 font-semibold">
                      <Building2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
                      <span>{r.facilityName}</span>
                    </div>
                  </td>
                  <td className="p-3 text-[#64748B] font-mono text-[11px]">{r.checkInDate}</td>
                  <td className="p-3 font-black text-[#F59E0B]">
                    {r.waitTimeMinutes !== null ? `${r.waitTimeMinutes} ${t.minutesUnit}` : '-'}
                  </td>
                  <td className="p-3 font-black text-[#0EA5E9]">
                    {r.consultationTimeMinutes !== null ? `${r.consultationTimeMinutes} ${t.minutesUnit}` : '-'}
                  </td>
                  <td className="p-3 text-[#1E3A8A] font-bold">
                    <div className="flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-[#A855F7]" />
                      <span>{r.consultPerformedBy}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                        r.queueStatus.includes('مكتمل') || r.queueStatus.includes('Completed')
                          ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                          : r.queueStatus.includes('انتظار') || r.queueStatus.includes('Waiting')
                          ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20'
                          : r.queueStatus.includes('ملغاة') || r.queueStatus.includes('Cancelled')
                          ? 'bg-[#F43F5E]/10 text-[#F43F5E] border border-[#F43F5E]/20'
                          : 'bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20'
                      }`}
                    >
                      {r.queueStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E2E8F0] text-xs font-bold">
          <span className="text-[#64748B]">
            {t.paginationText(currentPage, totalPages)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-[#F1F5F9] hover:bg-white text-[#0F172A] disabled:opacity-40 rounded-lg border border-[#CBD5E1]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-[#F1F5F9] hover:bg-white text-[#0F172A] disabled:opacity-40 rounded-lg border border-[#CBD5E1]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
