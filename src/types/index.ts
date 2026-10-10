export interface InterviewerPersona {
  title: string;
  primaryFocus: string;
  evaluationLens: string;
  redFlags: string[];
  greenFlags: string[];
}

export interface StarAdvice {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  difficulty: 'Orta' | 'İleri Seviye' | 'Zorlu' | string;
  question: string;
  interviewerIntent: string;
  starAdvice: StarAdvice;
  commonMistakes: string[];
  modelAnswerPoints: string[];
  exampleStrongAnswer: string;
}

export interface ReverseQuestion {
  question: string;
  whyItImpresses: string;
}

export interface InterviewGenerationResult {
  interviewerPersona: InterviewerPersona;
  questions: InterviewQuestion[];
  reverseQuestionsToAsk: ReverseQuestion[];
}

export interface AnswerEvaluationResult {
  score: number;
  interviewerImpression: string;
  strengths: string[];
  areasToImprove: string[];
  starCompliance: {
    situationFound: boolean;
    taskFound: boolean;
    actionFound: boolean;
    resultFound: boolean;
    feedback: string;
  };
  enhancedAnswerVersion: string;
}

export interface SkillGapItem {
  skill: string;
  importance: 'Yüksek' | 'Orta';
  reason: string;
}

export interface NextTrainingStep {
  stepNumber: number;
  title: string;
  recommendedFormat: string;
  detailedSyllabus: string[];
  whyCrucial: string;
  targetOutcome: string;
  suggestedCertificationsOrTopics: string[];
}

export interface CareerPathwayResult {
  coachExecutiveSummary: string;
  readinessScorePercentage: number;
  currentSkillInventory: string[];
  targetRoleExpectations: string[];
  gapAnalysis: {
    criticalGaps: SkillGapItem[];
    alreadyCoveredStrengths: string[];
  };
  nextTrainingCurriculum: NextTrainingStep[];
  actionPlan30_60_90: {
    first30Days: string;
    first60Days: string;
    first90Days: string;
  };
  capstoneProjectRecommendation: {
    projectTitle: string;
    projectDescription: string;
    proofOfSkills: string[];
  };
}

export interface QuickPreset {
  id: string;
  name: string;
  subtitle: string;
  role: string;
  interviewerTitle: string;
  companyContext: string;
  seniority: string;
  completedTrainings: string;
  targetGoal: string;
}
