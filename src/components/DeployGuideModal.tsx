import React from 'react';
import { X, CloudUpload } from 'lucide-react';
import { translations } from '../utils/translations';
import type { Language } from '../utils/translations';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="glass-card max-w-2xl w-full p-6 relative border border-[#E2E8F0] shadow-2xl animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E2E8F0]">
          <div className="p-3 bg-[#1E3A8A] text-white rounded-xl shadow-md">
            <CloudUpload className="w-6 h-6 text-[#0EA5E9]" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#1E3A8A]">{t.cfModalTitle}</h3>
            <p className="text-xs text-[#64748B] font-medium">{t.cfModalSub}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-[#0F172A] max-h-[70vh] overflow-y-auto pr-1">
          {/* Step 1 */}
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <div className="flex items-center gap-2 text-[#1E3A8A] font-bold mb-1">
              <span className="w-5 h-5 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center text-[11px]">1</span>
              <span>{t.cfStep1Title}</span>
            </div>
            <p className="text-[#64748B] mr-7 mb-2 font-semibold">{t.cfStep1Desc}</p>
            <pre className="bg-[#0F172A] p-2.5 rounded-lg text-[#0EA5E9] font-mono text-[11px] dir-ltr overflow-x-auto mr-7 border border-[#1E3A8A]">
              npm run build
            </pre>
            <p className="text-[#64748B] text-[11px] mr-7 mt-1 font-semibold">{t.cfStep1Note}</p>
          </div>

          {/* Step 2 */}
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <div className="flex items-center gap-2 text-[#0EA5E9] font-bold mb-1">
              <span className="w-5 h-5 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center text-[11px]">2</span>
              <span>{t.cfStep2Title}</span>
            </div>
            <pre className="bg-[#0F172A] p-2.5 rounded-lg text-[#0EA5E9] font-mono text-[11px] dir-ltr overflow-x-auto mr-7 border border-[#1E3A8A]">
              npx wrangler pages deploy dist --project-name=healthcare-kpi-dashboard
            </pre>
          </div>

          {/* Step 3 */}
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <div className="flex items-center gap-2 text-[#10B981] font-bold mb-1">
              <span className="w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[11px]">3</span>
              <span>{t.cfStep3Title}</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#0F172A] font-semibold mr-2">
              {t.cfStep3Steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#E2E8F0] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#0EA5E9] text-white font-bold rounded-lg text-xs transition-all shadow-md"
          >
            {t.btnUnderstand}
          </button>
        </div>
      </div>
    </div>
  );
};
