// useReportAnalysis.ts - Enhanced analysis for provider evaluation reports
import type IEvalScore from "@/interfaces/IEvalScore";

export interface ScoreDistribution {
  counts: { [key: number]: number };
  percentages: { [key: number]: string };
  totalScores: number;
  distributionChart: { label: string; value: number; percentage: number }[];
}

export interface CategoryPerformance {
  category: string;
  meanScore: number;
  itemCount: number;
  highestScore: number;
  lowestScore: number;
  performanceLevel: 'Needs Improvement' | 'Developing' | 'Proficient' | 'Expert';
}

export interface CompetencyLevel {
  level: 'Novice' | 'Developing' | 'Proficient' | 'Expert';
  description: string;
  color: string;
  recommendations: string[];
}

export interface PassFailStatus {
  passed: boolean;
  score: number;
  threshold: number;
  status: string;
  message: string;
}

export interface TrendAnalysis {
  sessions: { session: number; meanScore: number; date: string }[];
  improvement: number;
  trend: 'improving' | 'declining' | 'stable';
  projectedNextScore: number;
}

export interface ItemAnalysis {
  item: string;
  score: number;
  category?: string;
  status: 'strength' | 'weakness' | 'average';
  recommendation?: string;
}

export interface ReportAnalysis {
  scoreDistribution: ScoreDistribution;
  categoryPerformance: CategoryPerformance[];
  competencyLevel: CompetencyLevel;
  passFail: PassFailStatus;
  trendAnalysis?: TrendAnalysis;
  strengths: ItemAnalysis[];
  weaknesses: ItemAnalysis[];
  recommendations: string[];
  overallRating: string;
}

// Competency thresholds
const COMPETENCY_THRESHOLDS = {
  novice: 2.0,
  developing: 3.0,
  proficient: 4.0,
  expert: 5.0
};

const PASS_THRESHOLD = 3.0; // Minimum passing score

export function useReportAnalysis() {
  
  /**
   * Calculate score distribution with percentages and chart data
   */
  const calculateScoreDistribution = (scores: number[]): ScoreDistribution => {
    const counts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalScores = 0;
    
    scores.forEach(score => {
      if (score >= 1 && score <= 5) {
        counts[Math.round(score)]++;
        totalScores++;
      }
    });
    
    const percentages: { [key: number]: string } = {};
    const distributionChart: { label: string; value: number; percentage: number }[] = [];
    
    Object.keys(counts).forEach(key => {
      const score = parseInt(key);
      const percentage = totalScores > 0 ? ((counts[score] / totalScores) * 100).toFixed(1) : '0.0';
      percentages[score] = percentage + '%';
      distributionChart.push({
        label: `Rating ${score}`,
        value: counts[score],
        percentage: parseFloat(percentage)
      });
    });
    
    return { counts, percentages, totalScores, distributionChart };
  };
  
  /**
   * Calculate performance by category/section
   */
  const calculateCategoryPerformance = (scores: IEvalScore[]): CategoryPerformance[] => {
    const categoryMap: { [key: string]: { scores: number[]; items: string[] } } = {};
    
    scores.forEach(item => {
      const category = item.category || 'General';
      if (!categoryMap[category]) {
        categoryMap[category] = { scores: [], items: [] };
      }
      categoryMap[category].scores.push(Number(item.score));
      categoryMap[category].items.push(item.item || 'Unknown');
    });
    
    const categoryPerformance: CategoryPerformance[] = [];
    
    Object.keys(categoryMap).forEach(category => {
      const data = categoryMap[category];
      const scores = data.scores;
      const meanScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const highestScore = Math.max(...scores);
      const lowestScore = Math.min(...scores);
      
      let performanceLevel: CategoryPerformance['performanceLevel'];
      if (meanScore < 2.0) performanceLevel = 'Needs Improvement';
      else if (meanScore < 3.0) performanceLevel = 'Developing';
      else if (meanScore < 4.0) performanceLevel = 'Proficient';
      else performanceLevel = 'Expert';
      
      categoryPerformance.push({
        category,
        meanScore: parseFloat(meanScore.toFixed(2)),
        itemCount: data.items.length,
        highestScore,
        lowestScore,
        performanceLevel
      });
    });
    
    return categoryPerformance.sort((a, b) => a.meanScore - b.meanScore);
  };
  
  /**
   * Determine competency level based on mean score
   */
  const determineCompetencyLevel = (meanScore: number): CompetencyLevel => {
    let level: CompetencyLevel['level'];
    let description: string;
    let color: string;
    let recommendations: string[];
    
    if (meanScore < COMPETENCY_THRESHOLDS.novice) {
      level = 'Novice';
      description = 'Foundational skills are still developing. Requires significant guidance and practice.';
      color = 'red';
      recommendations = [
        'Focus on understanding fundamental concepts',
        'Seek additional mentorship and training',
        'Practice basic skills regularly with supervision',
        'Review foundational learning materials'
      ];
    } else if (meanScore < COMPETENCY_THRESHOLDS.developing) {
      level = 'Developing';
      description = 'Basic competency established but needs refinement. Shows promise with guidance.';
      color = 'orange';
      recommendations = [
        'Continue structured practice with feedback',
        'Focus on areas with lower scores',
        'Set specific improvement goals for each session',
        'Seek peer review and coaching opportunities'
      ];
    } else if (meanScore < COMPETENCY_THRESHOLDS.proficient) {
      level = 'Proficient';
      description = 'Solid competency demonstrated consistently. Can perform independently with minor refinements.';
      color = 'blue';
      recommendations = [
        'Maintain current performance levels',
        'Challenge yourself with advanced scenarios',
        'Mentor junior colleagues to reinforce skills',
        'Focus on efficiency and speed improvements'
      ];
    } else {
      level = 'Expert';
      description = 'Exceptional performance demonstrating mastery. Ready for advanced responsibilities.';
      color = 'green';
      recommendations = [
        'Consider taking on mentorship roles',
        'Contribute to training program development',
        'Lead quality improvement initiatives',
        'Pursue specialized advanced certifications'
      ];
    }
    
    return { level, description, color, recommendations };
  };
  
  /**
   * Check pass/fail status
   */
  const checkPassFail = (meanScore: number): PassFailStatus => {
    const passed = meanScore >= PASS_THRESHOLD;
    
    let status: string;
    let message: string;
    
    if (passed) {
      if (meanScore >= 4.5) {
        status = 'Excellent';
        message = 'Outstanding performance! Meets and exceeds competency standards.';
      } else if (meanScore >= PASS_THRESHOLD) {
        status = 'Passed';
        message = 'Meets minimum competency requirements.';
      } else {
        status = 'Marginal Pass';
        message = 'Just meets requirements. Consider focused improvement in weak areas.';
      }
    } else {
      status = 'Needs Improvement';
      message = 'Below competency threshold. Requires additional training and practice.';
    }
    
    return {
      passed,
      score: parseFloat(meanScore.toFixed(2)),
      threshold: PASS_THRESHOLD,
      status,
      message
    };
  };
  
  /**
   * Analyze trends across multiple sessions
   */
  const analyzeTrends = (
    sessions: { session: number; meanScore: number; date: number }[]
  ): TrendAnalysis | null => {
    if (sessions.length < 2) return null;
    
    const sortedSessions = sessions.sort((a, b) => a.session - b.session);
    
    let improvement = 0;
    let trend: TrendAnalysis['trend'] = 'stable';
    
    if (sortedSessions.length >= 2) {
      const firstScore = sortedSessions[0].meanScore;
      const lastScore = sortedSessions[sortedSessions.length - 1].meanScore;
      improvement = ((lastScore - firstScore) / firstScore) * 100;
      
      if (improvement > 5) trend = 'improving';
      else if (improvement < -5) trend = 'declining';
      else trend = 'stable';
    }
    
    // Simple projection: average of last 2 sessions
    const lastTwo = sortedSessions.slice(-2);
    const projectedNextScore = lastTwo.length >= 2 
      ? (lastTwo[0].meanScore + lastTwo[1].meanScore) / 2
      : sortedSessions[sortedSessions.length - 1].meanScore;
    
    return {
      sessions: sortedSessions.map(s => ({
        session: s.session,
        meanScore: parseFloat(s.meanScore.toFixed(2)),
        date: new Date(s.date).toLocaleDateString()
      })),
      improvement: parseFloat(improvement.toFixed(1)),
      trend,
      projectedNextScore: parseFloat(projectedNextScore.toFixed(2))
    };
  };
  
  /**
   * Identify strengths and weaknesses
   */
  const identifyStrengthsAndWeaknesses = (scores: IEvalScore[]): { strengths: ItemAnalysis[]; weaknesses: ItemAnalysis[] } => {
    const meanScore = scores.reduce((sum, s) => sum + Number(s.score), 0) / scores.length;
    
    const strengths: ItemAnalysis[] = [];
    const weaknesses: ItemAnalysis[] = [];
    
    scores.forEach(item => {
      const score = Number(item.score);
      const itemAnalysis: ItemAnalysis = {
        item: item.item || 'Unknown',
        score,
        category: item.category,
        status: 'average',
        recommendation: undefined
      };
      
      if (score >= meanScore + 0.5) {
        itemAnalysis.status = 'strength';
        itemAnalysis.recommendation = 'Continue excellent work';
        strengths.push(itemAnalysis);
      } else if (score <= meanScore - 0.5) {
        itemAnalysis.status = 'weakness';
        itemAnalysis.recommendation = `Focus on improving this area`;
        weaknesses.push(itemAnalysis);
      }
    });
    
    return {
      strengths: strengths.sort((a, b) => b.score - a.score).slice(0, 5),
      weaknesses: weaknesses.sort((a, b) => a.score - b.score).slice(0, 5)
    };
  };
  
  /**
   * Generate overall rating text
   */
  const getOverallRating = (meanScore: number, passFail: PassFailStatus): string => {
    if (!passFail.passed) return 'Did Not Pass';
    if (meanScore >= 4.5) return 'Excellent';
    if (meanScore >= 4.0) return 'Very Good';
    if (meanScore >= 3.5) return 'Good';
    if (meanScore >= PASS_THRESHOLD) return 'Satisfactory';
    return 'Marginal Pass';
  };
  
  /**
   * Main function to generate comprehensive report analysis
   */
  const generateReportAnalysis = (
    scores: IEvalScore[],
    allSessions?: { session: number; meanScore: number; date: number }[]
  ): ReportAnalysis => {
    const numericScores = scores.map(s => Number(s.score));
    const meanScore = numericScores.length > 0 
      ? numericScores.reduce((a, b) => a + b, 0) / numericScores.length 
      : 0;
    
    const scoreDistribution = calculateScoreDistribution(numericScores);
    const categoryPerformance = calculateCategoryPerformance(scores);
    const competencyLevel = determineCompetencyLevel(meanScore);
    const passFail = checkPassFail(meanScore);
    const trendAnalysis = allSessions ? (analyzeTrends(allSessions) ?? undefined) : undefined;
    const { strengths, weaknesses } = identifyStrengthsAndWeaknesses(scores);
    
    // Generate overall recommendations
    const recommendations: string[] = [
      ...competencyLevel.recommendations,
      ...weaknesses.map(w => `Improve: ${w.item}`),
      ...strengths.map(s => `Maintain: ${s.item}`)
    ].slice(0, 5);
    
    return {
      scoreDistribution,
      categoryPerformance,
      competencyLevel,
      passFail,
      trendAnalysis,
      strengths,
      weaknesses,
      recommendations,
      overallRating: getOverallRating(meanScore, passFail)
    };
  };
  
  return {
    calculateScoreDistribution,
    calculateCategoryPerformance,
    determineCompetencyLevel,
    checkPassFail,
    analyzeTrends,
    identifyStrengthsAndWeaknesses,
    getOverallRating,
    generateReportAnalysis,
    COMPETENCY_THRESHOLDS,
    PASS_THRESHOLD
  };
}
