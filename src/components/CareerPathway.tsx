import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  BookOpen,
  Compass,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  FolderGit2,
} from 'lucide-react';
import { CareerPathwayResult } from '../types';

interface CareerPathwayProps {
  initialTrainings?: string;
  initialTargetGoal?: string;
  initialCurrentRole?: string;
  initialExperienceYears?: string;
}

export const CareerPathway: React.FC<CareerPathwayProps> = ({
  initialTrainings = `1. Node.js & TypeScript İleri Seviye Backend Geliştirme (Express, NestJS, Rest API Tasarımı, JWT Kimlik Doğrulama)
2. PostgreSQL Veritabanı Modelleme & Temel SQL Optimizasyonu (İndeksleme, İlişkisel Şemalar)
3. Git & GitHub Ekip İçi İş Akışları Eğitimi (Branching stratejileri, PR review)
4. Docker Temelleri ve Konteynerizasyon Workshop'u (Dockerfile, Docker Compose)`,
  initialTargetGoal = 'Kıdemli Tech Lead & Dağıtık Sistem Mimarı (Distributed Systems Architect)',
  initialCurrentRole = 'Backend Developer',
  initialExperienceYears = '3-4 Yıl',
}) => {
  const [completedTrainings, setCompletedTrainings] = useState(initialTrainings);
  const [targetCareerGoal, setTargetCareerGoal] = useState(initialTargetGoal);
  const [currentRole, setCurrentRole] = useState(initialCurrentRole);
  const [experienceYears, setExperienceYears] = useState(initialExperienceYears);
  const [learningPreferences, setLearningPreferences] = useState(
    'Hands-on mimari projeler ve sektörde kabul gören uluslararası sertifikasyonlar'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CareerPathwayResult | null>(null);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!completedTrainings.trim() || !targetCareerGoal.trim()) {
      setError('Lütfen katıldığınız eğitimlerin içeriklerini ve hedef kariyer adımınızı girin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/career/pathway-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTrainings: completedTrainings.trim(),
          targetCareerGoal: targetCareerGoal.trim(),
          currentRole: currentRole.trim(),
          experienceYears,
          learningPreferences,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Yol haritası oluşturulamadı.');
      }

      const data: CareerPathwayResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Analiz sırasında beklenmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const sampleTrainingTemplates = [
    {
      title: 'Full-Stack Web (React + Node)',
      trainings: `1. Modern React 19, Hooks & State Management (Zustand, Redux)
2. Node.js & Express RESTful API Geliştirme Temelleri
3. MongoDB & NoSQL Veritabanı Temelleri
4. Temel CSS & Tailwind CSS ile Duyarlı Tasarım`,
      goal: 'Senior Full-Stack Developer & Frontend Tech Lead',
      role: 'Junior / Mid Full-Stack Geliştirici',
    },
    {
      title: 'Veri & İş Zekası (SQL + Python)',
      trainings: `1. Python ile Veri Bilimi (Pandas, NumPy, Matplotlib, Seaborn)
2. İleri Seviye SQL Sorgulama & Pencere Fonksiyonları (Window Functions)
3. Power BI & Tableau ile İş Zekası Raporlama
4. Temel İstatistiksel Modelleme ve Regresyon`,
      goal: 'Machine Learning Engineer & MLOps Uzmanı',
      role: 'Veri Analisti',
    },
    {
      title: 'Bulut & DevOps Temelleri',
      trainings: `1. AWS Cloud Practitioner Eğitimi ve Temel AWS Servisleri (EC2, S3, RDS, IAM)
2. Linux Sistem Yönetimi & Bash Scripting
3. CI/CD Pipeline Temelleri (GitHub Actions)
4. Docker ile Konteyner Yönetimi`,
      goal: 'Senior Cloud Solutions Architect & Kubernetes DevOps Lead',
      role: 'Junior DevOps / Sistem Yöneticisi',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title & Introduction */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Eğitim & Kariyer Yol Haritası Danışmanı
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Daha önce aldığın eğitimlerin ve sertifikaların içeriklerini ver; yapay zeka mevcut yetkinliklerini analiz etsin, hedefindeki rolde aranan standartlarla kıyaslasın ve bir sonraki kariyer sıçraması için alman gereken nokta atışı eğitim müfredatını çıkarsın.
        </p>
      </div>

      {/* Input Form Card */}
      <form
        onSubmit={handleAnalyze}
        className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-6"
      >
        {/* Quick fill templates */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">
              Hazır Eğitim Şablonu Yükle:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleTrainingTemplates.map((t, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => {
                  setCompletedTrainings(t.trainings);
                  setTargetCareerGoal(t.goal);
                  setCurrentRole(t.role);
                }}
                className="text-xs px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 font-medium transition-colors cursor-pointer"
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Current Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mevcut Pozisyonun
            </label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="Örn: Backend Developer, Veri Analisti, UI Designer"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          {/* Target Goal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Hedef Kariyer Adımı / Bir Sonraki Pozisyon
            </label>
            <input
              type="text"
              value={targetCareerGoal}
              onChange={(e) => setTargetCareerGoal(e.target.value)}
              placeholder="Örn: Dağıtık Sistem Mimarı, Kıdemli Tech Lead, Machine Learning Engineer"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          {/* Experience Years */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Toplam Deneyim Süresi
            </label>
            <input
              type="text"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              placeholder="Örn: 2-3 Yıl, 5+ Yıl"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Learning Preference */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Öğrenme Tercihi & Formatı
            </label>
            <input
              type="text"
              value={learningPreferences}
              onChange={(e) => setLearningPreferences(e.target.value)}
              placeholder="Örn: Hands-on projeler, Uluslararası sertifikalar, Vaka analizleri"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Completed Trainings Textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Katıldığın Eğitimler, Seminerler, Sertifikalar ve İçerikleri (Müfredat, Ders Başlıkları, Teknolojiler)
          </label>
          <p className="text-[11px] text-slate-500 mb-2">
            Ne kadar detaylı yazarsan (hangi modülleri gördün, hangi pratikleri yaptın), yapay zeka bir sonraki adım için eksik halkayı o kadar kusursuz tespit eder.
          </p>
          <textarea
            rows={5}
            value={completedTrainings}
            onChange={(e) => setCompletedTrainings(e.target.value)}
            placeholder={`Örn:
1. İleri Seviye Python & FastAPI Eğitimi (Asenkron mimari, Pydantic, SQLAlchemy ORM)
2. PostgreSQL İleri Veritabanı Tasarımı (Index optimizasyonu, partitioning)
3. Docker & Kubernetes Giriş Atölyesi`}
            className="w-full p-3.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Eğitim İçerikleri & Hedef Rol Analiz Ediliyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Bir Sonraki Eğitim Yol Haritasını Çıkar</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Analysis Results */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Executive Summary Card */}
          <div className="p-6 bg-slate-900 text-white rounded-xl shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Kariyer & Eğitim Mimarı Raporu
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {targetCareerGoal} Yolculuğu
                  </h3>
                </div>
              </div>

              {/* Readiness Score */}
              <div className="flex items-center gap-3 p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-medium">Hedefe Hazırlık Skoru</div>
                  <div className="text-lg font-bold tabular-nums text-emerald-400">
                    %{result.readinessScorePercentage}
                  </div>
                </div>
                <TrendingUp className="w-6 h-6 text-emerald-400 shrink-0" />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Baş Danışman Yönetici Notu
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                {result.coachExecutiveSummary}
              </p>
            </div>
          </div>

          {/* Skill Inventory vs Target Expectations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Inventory */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Tamamlanan Eğitimlerden Kazanılan Yetkinlikler
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {result.currentSkillInventory.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Role Expectations */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {targetCareerGoal} İçin Piyasa Beklentileri
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {result.targetRoleExpectations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 bg-blue-50/50 rounded border border-blue-100">
                    <span className="text-blue-600 font-bold">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skill Gap Analysis */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Yetkinlik Boşluk Analizi (Skill Gap Analysis)
                </h3>
                <p className="text-xs text-slate-500">
                  Mevcut eğitimlerinin hedef rolde eksik bıraktığı kritik yapı taşları
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {result.gapAnalysis.criticalGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-amber-50/40 border border-amber-200/70 rounded-lg space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{gap.skill}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          gap.importance === 'Yüksek'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {gap.importance} Öncelik
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {gap.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Already Covered Strengths */}
            {result.gapAnalysis.alreadyCoveredStrengths.length > 0 && (
              <div className="mt-4 p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Mevcut Eğitimlerinin Sağladığı Güçlü Temel:</span>{' '}
                  {result.gapAnalysis.alreadyCoveredStrengths.join(' · ')}
                </div>
              </div>
            )}
          </div>

          {/* Next Training Curriculum (THE CORE ANSWER TO THE USER'S QUESTION) */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Bir Sonraki Adım İçin Alman Gereken Eğitim Müfredatı
                </h3>
                <p className="text-xs text-slate-500">
                  Bu sıra ile bu eğitimleri tamamladığında hedefindeki rolün mülakatlarına tam yetkinlikle oturacaksın.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {result.nextTrainingCurriculum.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 hover:border-slate-300 transition-colors"
                >
                  {/* Step Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs tabular-nums">
                        {step.stepNumber}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {step.title}
                      </h4>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-md self-start sm:self-auto">
                      Format: {step.recommendedFormat}
                    </span>
                  </div>

                  {/* Syllabus Points */}
                  <div>
                    <h5 className="text-xs font-semibold text-slate-800 mb-2">
                      Eğitimin İçermesi Gereken Kilit Konular & Müfredat:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {step.detailedSyllabus.map((syl, sylIdx) => (
                        <div
                          key={sylIdx}
                          className="flex items-start gap-2 p-2 bg-white rounded border border-slate-200/80"
                        >
                          <span className="text-emerald-600 font-bold">·</span>
                          <span>{syl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why Crucial & Target Outcome */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                    <div className="p-3 bg-white rounded border border-slate-200">
                      <span className="font-semibold text-slate-800">Neden Hayati?</span>
                      <p className="text-slate-600 mt-1 leading-relaxed">
                        {step.whyCrucial}
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded border border-slate-200">
                      <span className="font-semibold text-slate-800">Hedef Çıktı / Kazanım:</span>
                      <p className="text-slate-600 mt-1 leading-relaxed">
                        {step.targetOutcome}
                      </p>
                    </div>
                  </div>

                  {/* Suggested Certifications or Topics */}
                  {step.suggestedCertificationsOrTopics.length > 0 && (
                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2 pt-1">
                      <span className="font-semibold text-slate-700">
                        Önerilen Sertifika & Kaynak Örnekleri:
                      </span>
                      {step.suggestedCertificationsOrTopics.map((item, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-medium rounded border border-emerald-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 30-60-90 Day Action Plan */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  30 - 60 - 90 Günlük Eylem Planı
                </h3>
                <p className="text-xs text-slate-500">
                  Eğitimleri zaman çizelgesine dökerek mülakata hazır hale gelme takvimi
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  İlk 30 Gün (Temel & Giriş)
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {result.actionPlan30_60_90.first30Days}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  60. Gün (Uygulama & Derinleşme)
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {result.actionPlan30_60_90.first60Days}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  90. Gün (Proje & Mülakat Hazırlığı)
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {result.actionPlan30_60_90.first90Days}
                </p>
              </div>
            </div>
          </div>

          {/* Capstone Showcase Project */}
          {result.capstoneProjectRecommendation && (
            <div className="p-6 bg-indigo-50/40 rounded-xl border border-indigo-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-indigo-700" />
                <div>
                  <h3 className="text-base font-bold text-indigo-950">
                    Mülakatlarda Sunulacak Vitrin Portfolyo Projesi
                  </h3>
                  <p className="text-xs text-slate-600">
                    Alacağın yeni eğitimleri kanıtlamak için CV ve GitHub'ına eklemen gereken bitirme projesi
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-indigo-100 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">
                  {result.capstoneProjectRecommendation.projectTitle}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {result.capstoneProjectRecommendation.projectDescription}
                </p>
                <div>
                  <h5 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Mülakatçıya Kanıtlayacağı Yetkinlikler:
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {result.capstoneProjectRecommendation.proofOfSkills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded font-medium border border-indigo-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
