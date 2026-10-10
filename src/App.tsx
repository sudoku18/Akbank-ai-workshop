import React, { useState } from 'react';
import {
  Target,
  BookOpen,
  Layers,
  Sparkles,
  ArrowRight,
  Award,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { Header } from './components/Header';
import { InterviewGenerator } from './components/InterviewGenerator';
import { CareerPathway } from './components/CareerPathway';
import { PresetsView } from './components/PresetsView';
import { QuickPreset } from './types';
import coachPortrait from './assets/images/coach_advisor_portrait_1791632020240.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<'interview' | 'career' | 'presets'>('interview');

  // Selected preset state for prefilling forms
  const [selectedPreset, setSelectedPreset] = useState<QuickPreset | null>(null);

  const handleSelectPreset = (preset: QuickPreset, targetTab: 'interview' | 'career') => {
    setSelectedPreset(preset);
    setActiveTab(targetTab);
  };

  const handleReset = () => {
    setSelectedPreset(null);
    setActiveTab('interview');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header strictly complying with top bar contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleReset}
      />

      {/* Hero Intro Section with Coach Portrait & High-Value Pitch */}
      <section className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Yapay Zeka Destekli Kariyer & Mülakat Koçu Ajanı</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Mülakatçının Unvanına Özel Sorular & Eğitim İçeriklerinden Kariyer Yol Haritası
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              İki temel uzmanlık modülü: <strong>1)</strong> Mülakata katılacak kişinin unvanına (VP, Lead Architect, HR Director vb.) göre özel soru simülasyonu ve STAR koçluğu. <strong>2)</strong> Daha önce aldığın eğitimlerin içeriklerini analiz ederek bir sonraki kariyer adımın için alman gereken nokta atışı eğitim ve sertifikasyon önerisi.
            </p>

            {/* Quick module switchers */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setActiveTab('interview')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'interview'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Target className="w-4 h-4" />
                <span>1. Mülakat Soru Simülatörü</span>
              </button>

              <button
                onClick={() => setActiveTab('career')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'career'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>2. Eğitim & Kariyer Yol Haritası</span>
              </button>

              <button
                onClick={() => setActiveTab('presets')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'presets'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Hazır Senaryolar</span>
              </button>
            </div>
          </div>

          {/* Coach Avatar card */}
          <div className="hidden lg:flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-xs shrink-0 max-w-xs">
            <img
              src={coachPortrait}
              alt="Kariyer ve Mülakat Danışmanı"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs"
            />
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900">
                CareerPulse AI Koç
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Senior Executive & Technical Hiring Coach
              </p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Aktif Koçluk Modu</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'interview' && (
          <InterviewGenerator
            key={selectedPreset?.id || 'default-interview'}
            initialRole={selectedPreset?.role || 'Senior Backend Engineer'}
            initialInterviewerTitle={selectedPreset?.interviewerTitle || 'VP of Engineering'}
            initialCompanyContext={
              selectedPreset?.companyContext ||
              'Fintech Scaleup (Yüksek işlem hacmi, mikroservis mimarisi)'
            }
            initialSeniority={selectedPreset?.seniority || 'Senior'}
          />
        )}

        {activeTab === 'career' && (
          <CareerPathway
            key={selectedPreset?.id || 'default-career'}
            initialTrainings={
              selectedPreset?.completedTrainings ||
              `1. Node.js & TypeScript İleri Seviye Backend Geliştirme (Express, NestJS, Rest API Tasarımı, JWT Kimlik Doğrulama)
2. PostgreSQL Veritabanı Modelleme & Temel SQL Optimizasyonu (İndeksleme, İlişkisel Şemalar)
3. Git & GitHub Ekip İçi İş Akışları Eğitimi (Branching stratejileri, PR review)
4. Docker Temelleri ve Konteynerizasyon Workshop'u (Dockerfile, Docker Compose)`
            }
            initialTargetGoal={
              selectedPreset?.targetGoal ||
              'Kıdemli Tech Lead & Dağıtık Sistem Mimarı (Distributed Systems Architect)'
            }
            initialCurrentRole={selectedPreset?.role || 'Backend Developer'}
            initialExperienceYears={selectedPreset?.seniority || '3-4 Yıl'}
          />
        )}

        {activeTab === 'presets' && (
          <PresetsView onSelectPreset={handleSelectPreset} />
        )}
      </main>

      {/* Quiet Footer without telemetry */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">CareerPulse AI</span>
            <span aria-hidden="true">·</span>
            <span>Mülakat & Kariyer Koçluğu Platformu</span>
          </div>
          <div>
            <span>STAR Metodolojisi & Yetkinlik Boşluk Analizi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
