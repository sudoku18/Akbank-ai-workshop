import { QuickPreset } from '../types';

export const QUICK_PRESETS: QuickPreset[] = [
  {
    id: 'backend-to-lead',
    name: 'Backend Geliştirici → Kıdemli Tech Lead',
    subtitle: 'VP of Engineering ile mülakat & mimari yetkinlik adımı',
    role: 'Senior Backend Tech Lead',
    interviewerTitle: 'VP of Engineering',
    companyContext: 'Büyüyen Fintech Scaleup (Günlük 2M+ ödeme işlemi, mikroservis geçişi)',
    seniority: 'Senior / Lead',
    completedTrainings: `1. Node.js & TypeScript İleri Seviye Backend Geliştirme (Express, NestJS, Rest API Tasarımı)
2. PostgreSQL Veritabanı Modelleme & Temel SQL Optimizasyonu
3. Git & GitHub Ekip İçi İş Akışları Eğitimi
4. Docker Temelleri ve Konteynerizasyon Workshop'u`,
    targetGoal: 'Kıdemli Tech Lead & Dağıtık Sistem Mimarı (Distributed Systems Architect)',
  },
  {
    id: 'data-analyst-to-ml',
    name: 'Veri Analisti → Machine Learning Engineer',
    subtitle: 'Head of Data Science ile mülakat & MLOps adımı',
    role: 'Machine Learning Engineer',
    interviewerTitle: 'Head of Data & AI',
    companyContext: 'E-Ticaret & Kişiselleştirilmiş Tavsiye Motoru Geliştiren Teknoloji Şirketi',
    seniority: 'Mid-Level',
    completedTrainings: `1. Python ile Veri Analizi (Pandas, NumPy, Matplotlib)
2. İleri Seviye SQL & İlişkisel Veritabanı Sorgulama
3. Tableau & PowerBI ile İş Zekası ve Dashboard Geliştirme
4. Temel İstatistik ve Hipotez Testleri Semineri`,
    targetGoal: 'Senior Machine Learning & MLOps Engineer (Üretim Seviyesinde Model Dağıtımı)',
  },
  {
    id: 'frontend-to-architect',
    name: 'Frontend Geliştirici → Çözüm Mimarı / Full-Stack Lead',
    subtitle: 'Lead Software Architect ile sistem mülakatı & bulut adımı',
    role: 'Lead Solutions Architect',
    interviewerTitle: 'Lead Software Architect',
    companyContext: 'Global SaaS Ürünü (Multi-tenant B2B platform, 500k aktif kullanıcı)',
    seniority: 'Senior',
    completedTrainings: `1. React 19, Next.js & Modern Frontend Mimarisi Bootcamp'i
2. TypeScript ile Tip Güvenli Uygulama Geliştirme
3. Web Performansı & Core Web Vitals Optimizasyonu
4. Temel REST & GraphQL API Tüketimi`,
    targetGoal: 'Full-Stack Çözüm Mimarı & Bulut Mimarisi Uzmanı (Cloud Solutions Architect)',
  },
  {
    id: 'designer-to-product-manager',
    name: 'Ürün Tasarımcısı → Kıdemli Product Manager',
    subtitle: 'CPO / Co-Founder ile ürün vizyonu mülakatı & metrik adımı',
    role: 'Senior Product Manager',
    interviewerTitle: 'Chief Product Officer (CPO)',
    companyContext: 'Erken Aşama Seri-A B2B SaaS Girişimi',
    seniority: 'Mid-Level → Senior',
    completedTrainings: `1. UI/UX Tasarım İlkeleri & İleri Seviye Figma Prototipleme
2. Tasarım Odaklı Düşünme (Design Thinking) ve Kullanıcı Araştırmaları
3. Agile & Scrum Proje Yönetimi Temelleri
4. Temel Web Tasarımı ve Kullanılabilirlik Testleri`,
    targetGoal: 'Kıdemli Ürün Yöneticisi (Senior Product Manager - Büyüme & Veri Odaklı Ürün Stratejisi)',
  },
];

export const COMMON_INTERVIEWER_TITLES = [
  'VP of Engineering',
  'Engineering Manager',
  'Chief Technology Officer (CTO)',
  'HR Director / Yetenek Kazanımı Lideri',
  'Lead System Architect',
  'Head of Product / CPO',
  'Staff / Principal Software Engineer',
  'Akran Yazılımcı (Peer Senior Engineer)',
  'CEO / Kurucu Ortak',
];
