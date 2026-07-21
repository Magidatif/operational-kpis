import React, { useRef, useState } from 'react';
import { FileUp, FileSpreadsheet, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { parseExcelFile, parseCSVFile } from '../utils/excelParser';
import type { PatientRecord } from '../types';
import { translations } from '../utils/translations';
import type { Language } from '../utils/translations';

interface FileUploaderProps {
  onDataLoaded: (newRecords: PatientRecord[], fileName: string) => void;
  onClearAll: () => void;
  uploadedFiles: { name: string; count: number }[];
  onRemoveFile: (fileName: string) => void;
  lang: Language;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onDataLoaded,
  uploadedFiles,
  onRemoveFile,
  lang
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  const handleFiles = async (files: FileList | File[]) => {
    setLoading(true);
    setErrorMessage(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase();

      try {
        let records: PatientRecord[] = [];
        if (ext === 'xlsx' || ext === 'xls') {
          records = await parseExcelFile(file);
        } else if (ext === 'csv') {
          records = await parseCSVFile(file);
        } else {
          setErrorMessage(t.fileErrorUnsupported(ext || ''));
          continue;
        }

        if (records.length === 0) {
          setErrorMessage(t.fileErrorEmpty(file.name));
        } else {
          onDataLoaded(records, file.name);
        }
      } catch (err) {
        console.error('Error parsing file:', err);
        setErrorMessage(t.fileErrorParse(file.name));
      }
    }

    setLoading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="glass-card p-5 mb-6 transition-all">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-extrabold text-[#1E3A8A] flex items-center gap-2">
            <FileUp className="w-5 h-5 text-[#0EA5E9]" />
            <span>{t.uploaderTitle}</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5 font-medium">
            {t.uploaderSubTitle}
          </p>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#10B981] font-extrabold flex items-center gap-1.5 bg-[#10B981]/10 px-3 py-1 rounded-full border border-[#10B981]/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.filesUploadedCount(uploadedFiles.length, uploadedFiles.reduce((a, b) => a + b.count, 0))}
            </span>
          </div>
        )}
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
          isDragging
            ? 'border-[#0EA5E9] bg-[#0EA5E9]/10 scale-[0.99]'
            : 'border-[#CBD5E1] hover:border-[#0EA5E9] bg-[#F8FAFC] hover:bg-white'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept=".xlsx, .xls, .csv"
          className="hidden"
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-8 h-8 border-3 border-[#0EA5E9] border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs font-bold text-[#0EA5E9]">{t.readingFiles}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-3 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-full border border-[#0EA5E9]/20">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-[#0F172A]">
              {t.dropzoneText}
            </p>
            <p className="text-xs text-[#64748B]">
              {t.dropzoneColumnsInfo}
            </p>
          </div>
        )}
      </div>

      {/* Error Notification */}
      {errorMessage && (
        <div className="mt-3 p-3 bg-[#F43F5E]/10 border border-[#F43F5E]/30 rounded-lg flex items-center gap-2 text-[#F43F5E] text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded Files Pills */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-[#64748B]">{t.uploadedFilesLabel}</span>
          {uploadedFiles.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-2 px-3 py-1 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="font-bold">{f.name}</span>
              <span className="text-[10px] text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.5 rounded font-bold">
                {f.count}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile(f.name);
                }}
                className="text-[#64748B] hover:text-[#F43F5E] transition-colors p-0.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
