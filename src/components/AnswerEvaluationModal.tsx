import React, { useState } from 'react';
import {
  X,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  RefreshCw,
  Quote,
  Lightbulb,
} from 'lucide-react';
import { InterviewQuestion, AnswerEvaluationResult } from '../types';

interface AnswerEvaluationModalProps {
  question: InterviewQuestion;
  interviewerTitle: string;
  targetRole: string;
  onClose: () => void;
}

export const AnswerEvaluationModal: React.FC<AnswerEvaluationModalProps> = ({
  question,
  interviewerTitle,
  targetRole,
  onClose,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) {
      setError('Lütfen bir cevap yazın veya hazır taslak cevabı yükleyin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/interview/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          interviewerTitle,
          targetRole,
          userAnswer: userAnswer.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Değerlendirme servisi yanıt vermedi.');
      }

      const data: AnswerEvaluationResult = await res.json();
      setEvaluation(data);
    } catch (err: any) {
      setError(err.message || 'Değerlendirme sırasında beklenmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDraft = () => {
    setUserAnswer(
      question.exampleStrongAnswer ||
        'Önceki projemizde benzer bir durumla karşılaştık. Ekibimle birlikte darboğazı tespit ettik ve mimariyi modüler hale getirdik. Sonuç olarak hata oranını %35 düşürdük ve teslimat hızımızı 2 katına çıkardık.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>{targetRole}</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-700 font-semibold">{interviewerTitle} Mülakatı</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mt-0.5">
              Cevap Simülasyonu & STAR Koçluğu
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Question banner */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Mülakatçının Sorusu:
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {question.question}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  <span className="font-semibold text-slate-700">Mülakatçının Gizli Amacı:</span>{' '}
                  {question.interviewerIntent}
                </p>
              </div>
            </div>
          </div>

          {/* User Answer Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Bu soruya vereceğin gerçekçi cevabı buraya yaz:
              </label>
              <button
                type="button"
                onClick={handleFillDraft}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
              >
                Taslak / Örnek Cevap Yükle
              </button>
            </div>
            <textarea
              rows={5}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Örnek: 'Önceki çalıştığım şirkette büyük bir ölçek problemi yaşadık... Durum buydu, benim görevim... Yaptığım hamle... Sonuç olarak metriklerimiz...'"
              className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              onClick={handleEvaluate}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{interviewerTitle} Gözüyle Değerlendiriliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Cevabımı Değerlendir & Koçluk Al</span>
                </>
              )}
            </button>
          </div>

          {/* Evaluation Results */}
          {evaluation && (
            <div className="pt-6 border-t border-slate-200 space-y-6">
              {/* Score & Impression */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-blue-50/60 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-white border border-blue-200 shadow-xs">
                    <span className="text-2xl font-bold tabular-nums text-blue-700">
                      {evaluation.score}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">/ 100 PUAN</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                      Mülakatçının İç Sesi / İlk İzlenimi
                    </h4>
                    <p className="text-sm font-medium text-slate-700 mt-0.5 italic">
                      "{evaluation.interviewerImpression}"
                    </p>
                  </div>
                </div>
              </div>

              {/* STAR Compliance Checklist */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="text-xs font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  STAR (Situation, Task, Action, Result) Metodolojisi Uyumu
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 text-xs">
                    {evaluation.starCompliance.situationFound ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="font-medium text-slate-700">Durum (Situation)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 text-xs">
                    {evaluation.starCompliance.taskFound ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="font-medium text-slate-700">Görev (Task)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 text-xs">
                    {evaluation.starCompliance.actionFound ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="font-medium text-slate-700">Aksiyon (Action)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 text-xs">
                    {evaluation.starCompliance.resultFound ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="font-medium text-slate-700">Sonuç (Result)</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Koç Notu:</span>{' '}
                  {evaluation.starCompliance.feedback}
                </p>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/50 border border-emerald-200/70 rounded-lg">
                  <h4 className="text-xs font-semibold text-emerald-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Öne Çıkan Güçlü Yönler
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {evaluation.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">·</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/50 border border-amber-200/70 rounded-lg">
                  <h4 className="text-xs font-semibold text-amber-900 mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    Eksik Kalan / Geliştirilecek Noktalar
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {evaluation.areasToImprove.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Enhanced Answer Version */}
              <div className="p-4 bg-indigo-50/40 border border-indigo-200/70 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-semibold text-indigo-950">
                    Bu Yanıt Nasıl Kusursuz Hale Getirilebilirdi? (Örnek Model Versiyon)
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-slate-800 bg-white p-3 rounded border border-indigo-100">
                  {evaluation.enhancedAnswerVersion}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
