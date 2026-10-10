import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  SlidersHorizontal,
  MessageSquarePlus,
  Send,
  Filter,
} from 'lucide-react';
import { InterviewGenerationResult, InterviewQuestion } from '../types';
import { COMMON_INTERVIEWER_TITLES } from '../data/presets';
import { AnswerEvaluationModal } from './AnswerEvaluationModal';

interface InterviewGeneratorProps {
  initialRole?: string;
  initialInterviewerTitle?: string;
  initialCompanyContext?: string;
  initialSeniority?: string;
}

export const InterviewGenerator: React.FC<InterviewGeneratorProps> = ({
  initialRole = 'Senior Backend Engineer',
  initialInterviewerTitle = 'VP of Engineering',
  initialCompanyContext = 'Fintech Scaleup (Yüksek işlem hacmi, mikroservis mimarisi)',
  initialSeniority = 'Senior',
}) => {
  const [targetRole, setTargetRole] = useState(initialRole);
  const [interviewerTitle, setInterviewerTitle] = useState(initialInterviewerTitle);
  const [companyContext, setCompanyContext] = useState(initialCompanyContext);
  const [candidateSeniority, setCandidateSeniority] = useState(initialSeniority);
  const [extraNotes, setExtraNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InterviewGenerationResult | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [activeQuestionForModal, setActiveQuestionForModal] = useState<InterviewQuestion | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetRole.trim() || !interviewerTitle.trim()) {
      setError('Lütfen hedef pozisyon ve mülakatçı unvanını belirtin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: targetRole.trim(),
          interviewerTitle: interviewerTitle.trim(),
          companyContext: companyContext.trim(),
          candidateSeniority,
          extraNotes: extraNotes.trim(),
          language: 'tr',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Sorular üretilemedi.');
      }

      const data: InterviewGenerationResult = await res.json();
      setResult(data);
      setSelectedCategory('Tümü');
    } catch (err: any) {
      setError(err.message || 'Bir hata meydana geldi.');
    } finally {
      setLoading(false);
    }
  };

  const categories = result
    ? ['Tümü', ...Array.from(new Set(result.questions.map((q) => q.category)))]
    : [];

  const filteredQuestions = result
    ? selectedCategory === 'Tümü'
      ? result.questions
      : result.questions.filter((q) => q.category === selectedCategory)
    : [];

  return (
    <div className="space-y-8">
      {/* Top Description */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Mülakat Simülatörü & Katılımcı Unvanı Odaklı Soru Motoru
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Gireceğin mülakatta karşına oturacak kişinin unvanını (VP, Engineering Manager, HR, vb.) belirt; yapay zeka o unvanın zihniyetine, değerlendirme kriterlerine ve eleme tuzaklarına özel gerçekçi sorular ve STAR taktikleri çıkarsın.
        </p>
      </div>

      {/* Input Form Card */}
      <form
        onSubmit={handleGenerate}
        className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Target Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Hedef Pozisyon / Başvurulan Rol
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Örn: Senior Backend Engineer, Product Manager, Data Scientist"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Interviewer Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mülakatı Yapacak Kişinin Unvanı (Interviewer Title)
            </label>
            <input
              type="text"
              value={interviewerTitle}
              onChange={(e) => setInterviewerTitle(e.target.value)}
              placeholder="Örn: VP of Engineering, HR Director, Lead Architect..."
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {/* Quick title selectors */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 font-medium">Hızlı Seçim:</span>
              {COMMON_INTERVIEWER_TITLES.slice(0, 5).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setInterviewerTitle(t)}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    interviewerTitle === t
                      ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Seniority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Adayın Kıdem Seviyesi
            </label>
            <select
              value={candidateSeniority}
              onChange={(e) => setCandidateSeniority(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Junior">Junior (1-2 Yıl)</option>
              <option value="Mid-Level">Mid-Level (2-4 Yıl)</option>
              <option value="Senior">Senior (5-8 Yıl)</option>
              <option value="Lead / Staff">Lead / Staff (8+ Yıl)</option>
              <option value="Executive / Director">Executive / Director</option>
            </select>
          </div>

          {/* Company Context */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Şirket / Sektör Bağlamı
            </label>
            <input
              type="text"
              value={companyContext}
              onChange={(e) => setCompanyContext(e.target.value)}
              placeholder="Örn: Erken aşama girişim, Kurumsal B2B SaaS, Yüksek hacimli e-ticaret"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Extra Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            İlan Notları veya Özel Odak Noktaları (İsteğe Bağlı)
          </label>
          <input
            type="text"
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            placeholder="Örn: 'Mikroservis geçişi tecrübesi arıyorlar', 'Kültürel uyuma çok önem veriyorlar'..."
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{interviewerTitle} Zihniyetine Özel Sorular Üretiliyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Mülakat Soruları ve Koçluk Taktiklerini Üret</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Results View */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Interviewer Persona Lens Card */}
          <div className="p-6 bg-slate-900 text-white rounded-xl shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Mülakatçı Profili & Psikolojisi
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {result.interviewerPersona.title}
                  </h3>
                </div>
              </div>
              <div className="text-xs text-slate-400">
                Hedef Pozisyon: <span className="text-slate-200 font-medium">{targetRole}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Temel Odak Noktası
                </h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  {result.interviewerPersona.primaryFocus}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Gizli Değerlendirme Filtresi & Sinyalleri
                </h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  {result.interviewerPersona.evaluationLens}
                </p>
              </div>
            </div>

            {/* Red vs Green Flags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-rose-950/30 border border-rose-800/40 rounded-lg space-y-2">
                <h5 className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Kırmızı Bayraklar (Bu Unvanın Eleme Sebepleri)
                </h5>
                <ul className="space-y-1.5 text-xs text-rose-100/80">
                  {result.interviewerPersona.redFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">✕</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-lg space-y-2">
                <h5 className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Yeşil Bayraklar (Bu Unvanı Büyüleyecek Sinyaller)
                </h5>
                <ul className="space-y-1.5 text-xs text-emerald-100/80">
                  {result.interviewerPersona.greenFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Questions Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Potansiyel Mülakat Soruları ({result.questions.length})
              </h3>
              <span className="text-xs text-slate-500">
                · {interviewerTitle} ağzından birebir simüle edilmiştir
              </span>
            </div>

            {categories.length > 1 && (
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
                <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5 shrink-0" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Question Cards Grid */}
          <div className="space-y-5">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors space-y-4"
              >
                {/* Question Header & Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-blue-700">Soru #{idx + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span>{q.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-600">{q.difficulty}</span>
                  </div>

                  <button
                    onClick={() => setActiveQuestionForModal(q)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Bu Soru İçin Cevabımı Test Et</span>
                  </button>
                </div>

                {/* Question Text */}
                <div className="text-base font-semibold text-slate-900 leading-snug">
                  "{q.question}"
                </div>

                {/* Intent */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">
                    {interviewerTitle} Neden Bu Soruyu Soruyor?
                  </span>{' '}
                  {q.interviewerIntent}
                </div>

                {/* Coaching Guidance Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                  {/* STAR Method Hint */}
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg space-y-2">
                    <h5 className="font-semibold text-blue-900">
                      STAR Yöntemi İpuçları (Cevabını Nasıl Yapılandırmalısın?)
                    </h5>
                    <div className="space-y-1 text-slate-700">
                      <p>
                        <strong className="text-blue-800">Durum (S):</strong> {q.starAdvice.situation}
                      </p>
                      <p>
                        <strong className="text-blue-800">Görev (T):</strong> {q.starAdvice.task}
                      </p>
                      <p>
                        <strong className="text-blue-800">Aksiyon (A):</strong> {q.starAdvice.action}
                      </p>
                      <p>
                        <strong className="text-blue-800">Sonuç (R):</strong> {q.starAdvice.result}
                      </p>
                    </div>
                  </div>

                  {/* Mistakes & Key Points */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                    <div>
                      <h5 className="font-semibold text-rose-800 mb-1">
                        Kaçınılması Gereken Yaygın Hatalar
                      </h5>
                      <ul className="space-y-1 text-slate-600">
                        {q.commonMistakes.map((m, mIdx) => (
                          <li key={mIdx} className="flex items-start gap-1">
                            <span className="text-rose-500 font-bold">·</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-emerald-800 mb-1">
                        Cevabında Geçmesi Gereken Kilit Vurgular
                      </h5>
                      <ul className="space-y-1 text-slate-600">
                        {q.modelAnswerPoints.map((p, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-1">
                            <span className="text-emerald-500 font-bold">·</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Example Strong Answer snippet */}
                {q.exampleStrongAnswer && (
                  <div className="text-xs text-slate-600 bg-slate-50/80 p-3 rounded border border-slate-200">
                    <span className="font-semibold text-slate-800">Örnek Güçlü Yanıt Yaklaşımı:</span>{' '}
                    {q.exampleStrongAnswer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Reverse Questions: Questions to Ask the Interviewer */}
          {result.reverseQuestionsToAsk && result.reverseQuestionsToAsk.length > 0 && (
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Mülakatın Sonunda {interviewerTitle} Unvanına Sorabileceğin Ters Köşe Sorular
                  </h3>
                  <p className="text-xs text-slate-500">
                    "Bize sorunuz var mı?" denildiğinde bu soruları sorarak stratejik ve vizyoner bir aday izlenimi bırak.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {result.reverseQuestionsToAsk.map((rq, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-lg space-y-2"
                  >
                    <p className="text-xs font-semibold text-indigo-950">
                      "{rq.question}"
                    </p>
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-indigo-800">Neden Etkileyici:</span>{' '}
                      {rq.whyItImpresses}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Answer Evaluation Modal */}
      {activeQuestionForModal && (
        <AnswerEvaluationModal
          question={activeQuestionForModal}
          interviewerTitle={interviewerTitle}
          targetRole={targetRole}
          onClose={() => setActiveQuestionForModal(null)}
        />
      )}
    </div>
  );
};
