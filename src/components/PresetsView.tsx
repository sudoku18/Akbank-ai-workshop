import React from 'react';
import { Target, BookOpen, ArrowRight, Sparkles, Building, Briefcase } from 'lucide-react';
import { QUICK_PRESETS } from '../data/presets';
import { QuickPreset } from '../types';

interface PresetsViewProps {
  onSelectPreset: (preset: QuickPreset, targetTab: 'interview' | 'career') => void;
}

export const PresetsView: React.FC<PresetsViewProps> = ({ onSelectPreset }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Hazır Mülakat & Kariyer Senaryoları
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Aşağıdaki hazır profillerden birini seçerek hem mülakatçı unvanına göre soru üretimini hem de katıldığı eğitimlerden bir sonraki eğitim tavsiyesi motorunu tek tıkla deneyimleyebilirsin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {QUICK_PRESETS.map((preset) => (
          <div
            key={preset.id}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                  {preset.seniority}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {preset.companyContext.split('(')[0].trim()}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {preset.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {preset.subtitle}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    <strong className="text-slate-700">Mülakatçı Unvanı:</strong>{' '}
                    <span className="text-blue-700 font-semibold">{preset.interviewerTitle}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    <strong className="text-slate-700">Hedef Adım:</strong> {preset.targetGoal}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                <span className="font-semibold text-slate-700 block mb-1">
                  Örnek Katılınan Eğitimler:
                </span>
                <p className="text-slate-500 line-clamp-2 font-mono text-[11px]">
                  {preset.completedTrainings}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => onSelectPreset(preset, 'interview')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Mülakatını Başlat</span>
              </button>

              <button
                onClick={() => onSelectPreset(preset, 'career')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Eğitim Yolunu Çıkar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
