import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for cleaning JSON from Gemini responses
function extractCleanJson(rawText: string) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

// 1. Generate Interview Questions tailored to Target Role & Interviewer Persona
app.post('/api/interview/generate-questions', async (req, res) => {
  try {
    const {
      targetRole,
      interviewerTitle,
      companyContext = 'Modern teknoloji şirketi',
      candidateSeniority = 'Senior',
      extraNotes = '',
      language = 'tr',
    } = req.body;

    if (!targetRole || !interviewerTitle) {
      return res.status(400).json({
        error: 'targetRole ve interviewerTitle alanları zorunludur.',
      });
    }

    const prompt = `
Sen dünya standartlarında kıdemli bir Mülakat & Yönetici Koçusun (Senior Executive Career & Interview Coach).
Aday şu pozisyona girmeye hazırlanıyor: "${targetRole}" (${candidateSeniority} seviye).
Adayın mülakata gireceği kişinin unvanı: "${interviewerTitle}".
Şirket / Sektör Bağlamı: "${companyContext}".
Ek Bilgiler / İlan Notları: "${extraNotes || 'Genel mülakat akışı'}".
İstenen Dil: ${language === 'tr' ? 'Türkçe' : 'İngilizce'}.

GÖREVİN:
"${interviewerTitle}" unvanına sahip bir mülakatçının zihnini ve beklentilerini çözümle.
Bu unvandaki kişi adayı hangi filtreden geçirir? (Örn: VP of Engineering sistem ölçeği, iş birliği ve ROI'ye bakar; HR Director kültürel uyum, çatışma yönetimi ve kariyer motivasyonuna bakar; Staff Engineer kod kalitesi, edge caseler ve teknik ödünleşimlere bakar).

Aşağıdaki JSON şemasına BİREBİR UYGUN bir çıktı ver:
{
  "interviewerPersona": {
    "title": "${interviewerTitle}",
    "primaryFocus": "Bu unvanın temel odak noktası ve motivasyonu",
    "evaluationLens": "Adayda aradığı gizli sinyaller ve değerlendirme kriterleri",
    "redFlags": ["Bu unvandaki kişinin eleme sebebi saydığı 3 kritik yanıt hatası"],
    "greenFlags": ["Adayı bu unvanın gözünde öne çıkaracak 3 altın davranış/sinyal"]
  },
  "questions": [
    {
      "id": "q1",
      "category": "Teknik & Uzmanlık" veya "Mimari & Sistem Düşüncesi" veya "Liderlik & İşbirliği" veya "Kriz & Karar Alma" veya "Stratejik & İş Etkisi",
      "difficulty": "Orta" veya "İleri Seviye" veya "Zorlu",
      "question": "Mülakatçının doğrudan ağzından çıkacak gerçekçi ve keskin soru",
      "interviewerIntent": "Bu soruyu neden soruyor? Arka planda neyi sınıyor?",
      "starAdvice": {
        "situation": "Örnek bir senaryo çerçevesi",
        "task": "Senin üstlendiğin sorumluluk vurgusu",
        "action": "Aldığın aksiyon ve teknik/stratejik karar",
        "result": "Ölçülebilir iş veya teknik çıktısı"
      },
      "commonMistakes": ["Adayların bu soruda sıklıkla düştüğü 2 hata"],
      "modelAnswerPoints": ["Yanıtında mutlaka geçirmen gereken kilit noktalar"],
      "exampleStrongAnswer": "Bu soruya verilebilecek 2-3 cümlelik örnek güçlü özet yanıt"
    }
  ],
  "reverseQuestionsToAsk": [
    {
      "question": "Adayın mülakat sonuna doğru BU UNVANA sorması gereken etkileyici soru",
      "whyItImpresses": "Bu soru mülakatçıyı neden etkiler ve adayı nasıl vizyoner gösterir?"
    }
  ]
}

En az 6 adet zengin ve derin soru üret. Sorular tam olarak "${interviewerTitle}" unvanının soracağı tarzda, klişelerden uzak ve yüksek kalibrede olsun.
Sadece geçerli JSON çıktısı döndür.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = extractCleanJson(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating interview questions:', error);
    return res.status(500).json({
      error: 'Mülakat soruları üretilirken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'),
    });
  }
});

// 2. Evaluate Candidate's Practice Answer with STAR coaching feedback
app.post('/api/interview/evaluate-answer', async (req, res) => {
  try {
    const { question, interviewerTitle, targetRole, userAnswer } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ error: 'Soru ve yanıt alanları zorunludur.' });
    }

    const prompt = `
Sen uzman bir mülakat simülatörü ve koçusun.
Pozisyon: "${targetRole}"
Mülakatçı Unvanı: "${interviewerTitle}"
Sorulan Soru: "${question}"
Adayın Verdiği Yanıt:
"""
${userAnswer}
"""

Adayın yanıtını "${interviewerTitle}" unvanının beklentilerine ve STAR (Situation, Task, Action, Result) metodolojisine göre titizlikle değerlendir.
Aşağıdaki JSON şemasına uygun çıktı ver:
{
  "score": 85,
  "interviewerImpression": "Bu unvandaki kişi bu yanıtı duyduğunda aklından ilk ne geçirir? (1-2 samimi cümle)",
  "strengths": ["Yanıttaki en güçlü 2-3 nokta"],
  "areasToImprove": ["Geliştirilmesi ve eklenmesi gereken 2-3 eksik"],
  "starCompliance": {
    "situationFound": true/false,
    "taskFound": true/false,
    "actionFound": true/false,
    "resultFound": true/false,
    "feedback": "STAR uyumu hakkında spesifik geri bildirim (Örn: 'Sonuç kısmında somut metrik eksik')"
  },
  "enhancedAnswerVersion": "Aynı içeriğin profesyonel, etkileyici ve ölçülebilir sonuçlarla yeniden yazılmış kusursuz hali (Adayın bunu okuyup ilham alması için)."
}

Sadece geçerli JSON çıktısı döndür.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const parsed = extractCleanJson(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    return res.status(500).json({
      error: 'Yanıt değerlendirilirken hata oluştu: ' + (error.message || 'Bilinmeyen hata'),
    });
  }
});

// 3. Career Upskilling & Education Pathway Advisor based on past training content
app.post('/api/career/pathway-analysis', async (req, res) => {
  try {
    const {
      completedTrainings,
      targetCareerGoal,
      currentRole = 'Mevcut Pozisyon',
      experienceYears = '3-5 yıl',
      learningPreferences = 'Hands-on projeler ve sektörde kabul gören sertifikalar',
    } = req.body;

    if (!completedTrainings || !targetCareerGoal) {
      return res.status(400).json({
        error: 'completedTrainings ve targetCareerGoal alanları zorunludur.',
      });
    }

    const prompt = `
Sen üst düzey bir Kariyer Gelişim Danışmanı ve Kurumsal Eğitim Mimarı'sın (Corporate Learning & Career Path Architect).

Adayın Bilgileri:
- Mevcut Pozisyonu: "${currentRole}"
- Deneyim Yılı: "${experienceYears}"
- Katıldığı Eğitimler ve İçerikleri:
"""
${completedTrainings}
"""
- Ulaşmak İstediği Hedef Pozisyon / Bir Sonraki Adım: "${targetCareerGoal}"
- Öğrenme Tercihi: "${learningPreferences}"

GÖREVİN:
1. Adayın daha önce aldığı eğitimlerin içeriklerini derinlemesine analiz et. Bu eğitimlerden adayın cebine koyduğu somut yetkinlikleri listele.
2. Hedef pozisyonun ("${targetCareerGoal}") sektördeki gerçek pazar gereksinimleri ile adayın mevcut eğitim çıktısını kıyasla (Yetkinlik Boşluk Analizi - Skill Gap Analysis).
3. "Bir sonraki adım için nasıl bir eğitim almam gerekir?" sorusuna kesin ve nokta atışı bir eğitim müfredatı ve yol haritası çiz.
Genel geçer "İngilizce öğrenin" veya "Çok çalışın" gibi tavsiyeler YASAKTIR. Somut teknolojiler, metodolojiler, mimari kavramlar ve sertifikasyonlar içermelidir.

Aşağıdaki JSON şemasında yanıt ver:
{
  "coachExecutiveSummary": "Kariyer koçunun adaya özel stratejik değerlendirme ve yönlendirme özeti (2-3 paragraf)",
  "readinessScorePercentage": 65,
  "currentSkillInventory": ["Tamamlanan eğitimlerden elde edilen 4-6 somut yetkinlik"],
  "targetRoleExpectations": ["Hedeflenen rolde aranan 4-6 kritik endüstri standardı"],
  "gapAnalysis": {
    "criticalGaps": [
      {
        "skill": "Eksik yetkinlik başlığı",
        "importance": "Yüksek" veya "Orta",
        "reason": "Hedef rolde neden bu bilgiye ihtiyaç var ve mevcut eğitimler neden bunu karşılamadı"
      }
    ],
    "alreadyCoveredStrengths": ["Mevcut eğitimlerin adaya kazandırdığı ve hedef rolde avantaja dönüşecek 3 nokta"]
  },
  "nextTrainingCurriculum": [
    {
      "stepNumber": 1,
      "title": "Alınması Gereken 1. Eğitim / Modül Başlığı (Örn: Dağıtık Sistem Tasarımı & Mikroservis Mimarisi)",
      "recommendedFormat": "Uluslararası Sertifika" veya "İleri Seviye Hands-on Proje Eğitimi" veya "Vaka Analizi & Sistem Tasarımı" veya "Liderlik & Strateji Atölyesi",
      "detailedSyllabus": [
        "Eğitimin içermesi gereken 3-4 kilit konu başlığı"
      ],
      "whyCrucial": "Bu eğitimi almanın bir sonraki kariyer adımına somut katkısı",
      "targetOutcome": "Eğitim tamamlandığında adayın yapabileceği somut şey",
      "suggestedCertificationsOrTopics": ["Önerilen uluslararası sertifika, kitap veya spesifik konu"]
    }
  ],
  "actionPlan30_60_90": {
    "first30Days": "İlk 30 gün: Hangi temel kavramlara ve hangi eğitime başlanmalı?",
    "first60Days": "60. gün: Uygulama ve proje aşamasında ne yapılmalı?",
    "first90Days": "90. gün: Portfolyoya eklenecek çıktı ve mülakata hazır hale gelme aşaması"
  },
  "capstoneProjectRecommendation": {
    "projectTitle": "Yeni eğitimlerle inşa edilecek vitrin proje başlığı",
    "projectDescription": "Hedef rolün mülakatında sunulabilecek ve tüm yeni yetkinlikleri kanıtlayan proje detayı",
    "proofOfSkills": ["Bu projenin mülakatçıya kanıtlayacağı 3 yetkinlik"]
  }
}

nextTrainingCurriculum dizisinde en az 3, en fazla 4 mantıklı sıralı eğitim adımı belirle.
Sadece geçerli JSON çıktısı döndür.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.65,
      },
    });

    const parsed = extractCleanJson(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating career pathway:', error);
    return res.status(500).json({
      error: 'Kariyer ve eğitim yol haritası üretilirken hata oluştu: ' + (error.message || 'Bilinmeyen hata'),
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerPulse AI Server running on port ${PORT}`);
  });
}

startServer();
