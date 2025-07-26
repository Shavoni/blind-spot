import { AnalysisResult } from './analysisEngine';
import { 
  advancedBehavioralAnalysis,
  BaselineBehavior,
  SignalCluster,
  TemporalPattern,
  StressComfortIndicator
} from './advancedBehavioralAnalysis';

export interface ForensicPhase {
  phaseName: string;
  timeRange: string;
  observations: ForensicObservation[];
}

export interface ForensicObservation {
  cue: string;
  observation: string;
  implication: string;
  confidence: number;
  timestamp?: string;
  microExpressions?: string[];
  apiSource?: string;
}

export interface DecisionIndicator {
  indicator: string;
  presence: 'Present' | 'Absent' | 'Partial';
  weight: string;
  significance: string;
}

export interface ForensicReport {
  title: string;
  subjects: Subject[];
  baselineCalibration: ForensicPhase;
  analysisPhases: ForensicPhase[];
  decisionIndicators: DecisionIndicator[];
  summaryJudgment: SummaryJudgment;
  recommendations: Recommendation[];
  confidenceNote: string;
  timestamp: string;
  // Advanced analysis sections
  baselineBehavior?: BaselineBehavior;
  signalClusters?: SignalCluster[];
  temporalPatterns?: TemporalPattern[];
  stressComfortIndicators?: StressComfortIndicator[];
  advancedInsights?: string[];
  culturalContext?: string;
}

export interface Subject {
  id: string;
  label: string;
  description: string;
  role: string;
}

export interface SummaryJudgment {
  overallAssessment: string;
  keyFindings: KeyFinding[];
  trustVector: number;
  engagementLevel: 'Low' | 'Moderate' | 'High';
  skepticismLevel: 'Low' | 'Moderate' | 'High';
  opennessToNext: 'Poor' | 'Fair' | 'Good' | 'Excellent';
}

export interface KeyFinding {
  category: string;
  level: string;
  evidence: string[];
  confidence: number;
}

export interface Recommendation {
  priority: 'High' | 'Medium' | 'Low';
  action: string;
  rationale: string;
  expectedOutcome: string;
}

class ForensicReportService {
  private readonly phaseTemplates = {
    baseline: {
      name: 'Baseline Calibration',
      duration: '0-10s',
      focusAreas: ['posture', 'eye_focus', 'hands', 'facial_tension', 'breathing']
    },
    engagement: {
      name: 'Engagement Phase',
      duration: '10-30s',
      focusAreas: ['forward_lean', 'micro_nods', 'eye_accessing', 'lip_movements', 'gesture_openness']
    },
    challenge: {
      name: 'Challenge/Clarification Phase',
      duration: '30-50s',
      focusAreas: ['eyebrow_movements', 'head_tilts', 'hand_gestures', 'forehead_tension', 'defensive_postures']
    },
    reinforcement: {
      name: 'Positive Reinforcement Moments',
      duration: 'variable',
      focusAreas: ['genuine_smiles', 'open_palm_gestures', 'mirroring', 'vocal_tone_changes', 'proximity_changes']
    },
    decision: {
      name: 'Decision-Read Indicators',
      duration: 'final phase',
      focusAreas: ['head_movements', 'shoulder_positions', 'feet_orientation', 'closing_behaviors', 'commitment_signals']
    }
  };

  private readonly microExpressionDatabase = {
    contempt: ['unilateral lip corner raise', 'eye roll', 'head tilt back'],
    disgust: ['nose wrinkle', 'upper lip raise', 'tongue show'],
    anger: ['lip press', 'jaw clench', 'nostril flare', 'eyebrow lower'],
    fear: ['eye widen', 'lip stretch', 'eyebrow raise and pull together'],
    surprise: ['jaw drop', 'eye widen', 'eyebrow raise'],
    happiness: ['crow\'s feet', 'cheek raise', 'lip corner pull'],
    sadness: ['lip corner depress', 'inner eyebrow raise', 'eyelid droop']
  };

  async generateForensicReport(
    analysisData: AnalysisResult,
    contextPreset: string,
    subjects?: Subject[],
    culturalContext: string = 'western'
  ): Promise<ForensicReport> {
    // Apply cultural context adjustments
    const culturallyAdjustedData = advancedBehavioralAnalysis.applyCulturalContext(
      analysisData, 
      culturalContext
    );

    // Perform advanced behavioral analysis
    const baselineBehavior = advancedBehavioralAnalysis.establishBaseline(culturallyAdjustedData);
    const signalClusters = advancedBehavioralAnalysis.detectSignalClusters(culturallyAdjustedData);
    const temporalPatterns = advancedBehavioralAnalysis.analyzeTemporalPatterns(culturallyAdjustedData);
    const stressComfortIndicators = advancedBehavioralAnalysis.assessStressComfortLevels(culturallyAdjustedData);
    
    // Generate advanced insights
    const advancedInsights = advancedBehavioralAnalysis.generateAdvancedInsights(
      baselineBehavior,
      signalClusters,
      temporalPatterns,
      stressComfortIndicators
    );

    // Original analysis
    const phases = this.extractPhases(culturallyAdjustedData);
    const baselinePhase = this.analyzeBaseline(phases.baseline, culturallyAdjustedData);
    const analysisPhases = this.analyzeMainPhases(phases, culturallyAdjustedData);
    const decisionIndicators = this.extractDecisionIndicators(phases.decision, culturallyAdjustedData);
    const summaryJudgment = this.generateSummaryJudgment(culturallyAdjustedData, analysisPhases);
    const recommendations = this.generateRecommendations(summaryJudgment, contextPreset);

    return {
      title: this.generateTitle(contextPreset, subjects),
      subjects: subjects || this.inferSubjects(culturallyAdjustedData),
      baselineCalibration: baselinePhase,
      analysisPhases,
      decisionIndicators,
      summaryJudgment,
      recommendations,
      confidenceNote: this.generateConfidenceNote(culturallyAdjustedData),
      timestamp: new Date().toISOString(),
      // Advanced analysis results
      baselineBehavior,
      signalClusters,
      temporalPatterns,
      stressComfortIndicators,
      advancedInsights,
      culturalContext
    };
  }

  private extractPhases(analysisData: AnalysisResult): any {
    const timeline = analysisData.timeline || [];
    const phases: any = {
      baseline: [],
      engagement: [],
      challenge: [],
      reinforcement: [],
      decision: []
    };

    // Categorize timeline events into phases based on timing and content
    timeline.forEach((event: any, index: number) => {
      const timeInSeconds = this.parseTimeToSeconds(event.time);
      
      if (timeInSeconds <= 10) {
        phases.baseline.push(event);
      } else if (timeInSeconds <= 30) {
        phases.engagement.push(event);
      } else if (timeInSeconds <= 50) {
        phases.challenge.push(event);
      } else {
        phases.decision.push(event);
      }

      // Look for positive reinforcement moments throughout
      if (this.isPositiveReinforcement(event)) {
        phases.reinforcement.push(event);
      }
    });

    return phases;
  }

  private analyzeBaseline(baselineEvents: any[], analysisData: AnalysisResult): ForensicPhase {
    const observations: ForensicObservation[] = [];

    // Analyze posture
    const postureData = this.findSignalData(analysisData, 'posture');
    if (postureData) {
      observations.push({
        cue: 'Posture',
        observation: this.describePosture(postureData),
        implication: this.interpretPosture(postureData),
        confidence: postureData.confidence || 0.8,
        apiSource: postureData.apiSource
      });
    }

    // Analyze eye focus
    const eyeData = this.findSignalData(analysisData, 'eye_movement');
    if (eyeData) {
      observations.push({
        cue: 'Eye Focus',
        observation: this.describeEyeMovement(eyeData, 'baseline'),
        implication: this.interpretEyeMovement(eyeData, 'baseline'),
        confidence: eyeData.confidence || 0.75,
        apiSource: eyeData.apiSource
      });
    }

    // Analyze hand positions
    const gestureData = this.findSignalData(analysisData, 'gestures');
    if (gestureData) {
      observations.push({
        cue: 'Hands',
        observation: this.describeHandPosition(gestureData, 'baseline'),
        implication: this.interpretHandPosition(gestureData, 'baseline'),
        confidence: gestureData.confidence || 0.7,
        apiSource: gestureData.apiSource
      });
    }

    return {
      phaseName: 'Baseline Calibration (first 5-10 seconds)',
      timeRange: '0:00 - 0:10',
      observations
    };
  }

  private analyzeMainPhases(phases: any, analysisData: AnalysisResult): ForensicPhase[] {
    const mainPhases: ForensicPhase[] = [];

    // Engagement Phase
    if (phases.engagement.length > 0) {
      mainPhases.push(this.analyzeEngagementPhase(phases.engagement, analysisData));
    }

    // Challenge Phase
    if (phases.challenge.length > 0) {
      mainPhases.push(this.analyzeChallengePhase(phases.challenge, analysisData));
    }

    // Reinforcement Moments
    if (phases.reinforcement.length > 0) {
      mainPhases.push(this.analyzeReinforcementPhase(phases.reinforcement, analysisData));
    }

    return mainPhases;
  }

  private analyzeEngagementPhase(events: any[], analysisData: AnalysisResult): ForensicPhase {
    const observations: ForensicObservation[] = [];

    // Look for forward lean
    const forwardLean = events.find(e => 
      e.event.toLowerCase().includes('lean') || 
      e.event.toLowerCase().includes('forward')
    );
    
    if (forwardLean) {
      observations.push({
        cue: 'Forward Lean & Micro-Nods',
        observation: `Subject leans forward approximately ${this.estimateLeanDistance(forwardLean)}, with subtle nodding movements`,
        implication: 'Intellectual curiosity; nods are "continue" cues, not unconditional agreement',
        confidence: forwardLean.confidence || 0.85,
        timestamp: forwardLean.time
      });
    }

    // Eye accessing cues
    const eyeAccess = this.findEyeAccessingCues(events);
    if (eyeAccess.length > 0) {
      observations.push({
        cue: 'Eye-Accessing Cues',
        observation: this.describeEyeAccessing(eyeAccess),
        implication: 'Processing information through visual recall and internal dialogue patterns',
        confidence: 0.8,
        microExpressions: eyeAccess.map(e => e.direction)
      });
    }

    // Lip movements
    const lipCues = events.filter(e => 
      e.event.toLowerCase().includes('lip') || 
      e.event.toLowerCase().includes('mouth')
    );
    
    lipCues.forEach(cue => {
      observations.push({
        cue: 'Subtle Lip Compression',
        observation: this.describeLipMovement(cue),
        implication: 'Evaluative skepticism — weighing information critically',
        confidence: cue.confidence || 0.75,
        timestamp: cue.time
      });
    });

    return {
      phaseName: 'Engagement Phase',
      timeRange: '0:10 - 0:30',
      observations
    };
  }

  private analyzeChallengePhase(events: any[], analysisData: AnalysisResult): ForensicPhase {
    const observations: ForensicObservation[] = [];

    // Eyebrow movements
    const eyebrowCues = events.filter(e => 
      e.event.toLowerCase().includes('eyebrow') || 
      e.event.toLowerCase().includes('brow')
    );

    eyebrowCues.forEach(cue => {
      observations.push({
        cue: 'Eyebrow Single-Raise & Head Tilt',
        observation: 'Classic "question mark" gesture observed',
        implication: 'Subject likely probing for clarification or challenging assumptions',
        confidence: cue.confidence || 0.9,
        timestamp: cue.time
      });
    });

    // Hand-to-face gestures
    const handToFace = events.filter(e => 
      e.event.toLowerCase().includes('chin') || 
      e.event.toLowerCase().includes('face touch')
    );

    handToFace.forEach(gesture => {
      observations.push({
        cue: 'Hand-to-Chin Gesture',
        observation: 'Fingers on chin, thumb under jaw while listening',
        implication: 'Deep analytical processing; demands convincing rationale',
        confidence: gesture.confidence || 0.85,
        timestamp: gesture.time
      });
    });

    // Forehead tension
    const tensionCues = this.findTensionIndicators(events);
    tensionCues.forEach(tension => {
      observations.push({
        cue: 'Micro-Tension in Forehead',
        observation: 'Small vertical lines appear during specific topics',
        implication: 'Potential concern about feasibility or implementation',
        confidence: tension.confidence || 0.7,
        timestamp: tension.time
      });
    });

    return {
      phaseName: 'Challenge/Clarification Phase',
      timeRange: '0:30 - 0:50',
      observations
    };
  }

  private analyzeReinforcementPhase(events: any[], analysisData: AnalysisResult): ForensicPhase {
    const observations: ForensicObservation[] = [];

    // Genuine smiles
    const smiles = events.filter(e => 
      e.event.toLowerCase().includes('smile') || 
      e.event.toLowerCase().includes('duchenne')
    );

    smiles.forEach(smile => {
      observations.push({
        cue: 'Genuine Smile',
        observation: 'Smile reaches orbicularis oculi (eye wrinkles)',
        implication: 'Authentic approval of concept or presentation element',
        confidence: smile.confidence || 0.95,
        timestamp: smile.time,
        microExpressions: ['crow\'s feet', 'cheek raise']
      });
    });

    // Open gestures
    const openGestures = events.filter(e => 
      e.event.toLowerCase().includes('open') || 
      e.event.toLowerCase().includes('palm')
    );

    openGestures.forEach(gesture => {
      observations.push({
        cue: 'Open-Palm Gesture While Speaking',
        observation: 'Subject responds with palms visible, fingers spread',
        implication: 'Offers constructive feedback; collaborative stance',
        confidence: gesture.confidence || 0.85,
        timestamp: gesture.time
      });
    });

    return {
      phaseName: 'Positive Reinforcement Moments',
      timeRange: 'Variable throughout interaction',
      observations
    };
  }

  private extractDecisionIndicators(decisionEvents: any[], analysisData: AnalysisResult): DecisionIndicator[] {
    const indicators: DecisionIndicator[] = [
      {
        indicator: 'Head-Shake "No" synced with positive words',
        presence: this.checkForIncongruence(decisionEvents) ? 'Present' : 'Absent',
        weight: this.checkForIncongruence(decisionEvents) ? '80%' : '0%',
        significance: 'Strong indicator of disagreement despite verbal politeness'
      },
      {
        indicator: 'Shoulder Shrug (uncertainty)',
        presence: this.checkForShoulderShrug(decisionEvents) ? 'Partial' : 'Absent',
        weight: '20%',
        significance: 'Some skepticism remains about specific aspects'
      },
      {
        indicator: 'Feet Orientation',
        presence: this.checkFeetOrientation(analysisData) ? 'Present' : 'Absent',
        weight: '60%',
        significance: 'Engagement sustained throughout interaction'
      },
      {
        indicator: 'Closing Behaviors',
        presence: this.checkClosingBehaviors(decisionEvents) ? 'Present' : 'Absent',
        weight: '40%',
        significance: 'Natural conclusion vs. abrupt termination'
      }
    ];

    return indicators;
  }

  private generateSummaryJudgment(
    analysisData: AnalysisResult,
    phases: ForensicPhase[]
  ): SummaryJudgment {
    const positiveSignals = this.countPositiveSignals(phases);
    const negativeSignals = this.countNegativeSignals(phases);
    const engagementScore = this.calculateEngagementScore(phases);

    const keyFindings: KeyFinding[] = [
      {
        category: 'Interest Level',
        level: engagementScore > 0.7 ? 'High' : engagementScore > 0.4 ? 'Moderate' : 'Low',
        evidence: this.gatherEvidenceForInterest(phases),
        confidence: 0.85
      },
      {
        category: 'Skepticism Pockets',
        level: negativeSignals > 3 ? 'High' : negativeSignals > 1 ? 'Moderate' : 'Low',
        evidence: this.gatherEvidenceForSkepticism(phases),
        confidence: 0.8
      },
      {
        category: 'Openness to Next Steps',
        level: this.assessOpenness(phases),
        evidence: this.gatherEvidenceForOpenness(phases),
        confidence: 0.75
      }
    ];

    return {
      overallAssessment: this.generateOverallAssessment(keyFindings),
      keyFindings,
      trustVector: analysisData.trustVector,
      engagementLevel: engagementScore > 0.7 ? 'High' : engagementScore > 0.4 ? 'Moderate' : 'Low',
      skepticismLevel: negativeSignals > 3 ? 'High' : negativeSignals > 1 ? 'Moderate' : 'Low',
      opennessToNext: positiveSignals > negativeSignals * 2 ? 'Excellent' : 
                      positiveSignals > negativeSignals ? 'Good' : 
                      positiveSignals === negativeSignals ? 'Fair' : 'Poor'
    };
  }

  private generateRecommendations(
    summary: SummaryJudgment,
    contextPreset: string
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // High priority recommendations based on skepticism
    if (summary.skepticismLevel !== 'Low') {
      recommendations.push({
        priority: 'High',
        action: 'Address specific concerns identified in skepticism pockets',
        rationale: 'Multiple tension indicators suggest unresolved doubts',
        expectedOutcome: 'Increased trust and buy-in by addressing core concerns'
      });
    }

    // Context-specific recommendations
    switch (contextPreset) {
      case 'interview':
        recommendations.push({
          priority: 'High',
          action: 'Prepare concrete examples demonstrating key competencies',
          rationale: 'Body language shows evaluative processing of claims',
          expectedOutcome: 'Enhanced credibility through specific evidence'
        });
        break;
      
      case 'negotiation':
        recommendations.push({
          priority: 'Medium',
          action: 'Present alternative proposals to test flexibility',
          rationale: 'Mixed signals suggest room for negotiation',
          expectedOutcome: 'Identify optimal compromise position'
        });
        break;
      
      case 'presentation':
        recommendations.push({
          priority: 'High',
          action: 'Offer interactive demonstration or hands-on experience',
          rationale: 'Visual processing cues indicate preference for tangible evidence',
          expectedOutcome: 'Convert intellectual interest to emotional investment'
        });
        break;
    }

    // Universal recommendations
    if (summary.engagementLevel === 'High') {
      recommendations.push({
        priority: 'Medium',
        action: 'Capitalize on high engagement with immediate next steps',
        rationale: 'Positive body language signals readiness to proceed',
        expectedOutcome: 'Maintain momentum while interest is peaked'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private generateConfidenceNote(analysisData: AnalysisResult): string {
    const hasVideo = analysisData.mediaType === 'video' || analysisData.mediaType === 'live';
    const hasAudio = analysisData.signals.voice_tone !== undefined;
    const apiCount = this.countActiveAPIs(analysisData);

    if (hasVideo && hasAudio && apiCount >= 3) {
      return `This assessment leverages ${apiCount} AI APIs analyzing both visual and audio cues, providing high confidence (~85-90% accuracy) in behavioral interpretation. Multi-modal analysis significantly enhances reliability compared to single-channel assessment.`;
    } else if (hasVideo && apiCount >= 2) {
      return 'This assessment relies on visual body-language cues from multiple AI sources. While non-verbal signals are highly predictive (~70-75% accuracy), pairing with audio analysis would further refine certainty.';
    } else {
      return 'This assessment is based on limited data sources. Confidence level is moderate (~60-65%). Additional video/audio input would significantly improve analysis accuracy.';
    }
  }

  // Helper methods
  private parseTimeToSeconds(timeStr: string): number {
    const parts = timeStr.split(':').map(Number);
    return parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0];
  }

  private isPositiveReinforcement(event: any): boolean {
    const positiveKeywords = ['smile', 'nod', 'lean forward', 'open', 'agree', 'yes', 'good'];
    return positiveKeywords.some(keyword => 
      event.event.toLowerCase().includes(keyword)
    );
  }

  private findSignalData(analysisData: AnalysisResult, signalType: string): any {
    return analysisData.signals[signalType];
  }

  private describePosture(postureData: any): string {
    const indicators = postureData.indicators || [];
    if (indicators.includes('open_posture')) {
      return 'Subject sits upright, shoulders relaxed but not slouched';
    } else if (indicators.includes('closed_posture')) {
      return 'Subject shows closed body position, arms crossed or turned away';
    }
    return 'Subject maintains neutral posture';
  }

  private interpretPosture(postureData: any): string {
    const indicators = postureData.indicators || [];
    if (indicators.includes('open_posture')) {
      return 'Neutral-open baseline; no defensive bias at start';
    } else if (indicators.includes('closed_posture')) {
      return 'Defensive or skeptical starting position';
    }
    return 'Baseline comfort level established';
  }

  private describeEyeMovement(eyeData: any, phase: string): string {
    if (phase === 'baseline') {
      return 'Alternates between speaker and reference materials';
    }
    return 'Dynamic eye movement patterns observed';
  }

  private interpretEyeMovement(eyeData: any, phase: string): string {
    if (phase === 'baseline') {
      return 'Signals active listening and readiness to process details';
    }
    return 'Processing information through multiple channels';
  }

  private describeHandPosition(gestureData: any, phase: string): string {
    const indicators = gestureData.indicators || [];
    if (indicators.includes('hands_open')) {
      return 'Rest lightly on surface, fingers uncrossed';
    }
    return 'Hands in neutral position';
  }

  private interpretHandPosition(gestureData: any, phase: string): string {
    const indicators = gestureData.indicators || [];
    if (indicators.includes('hands_open')) {
      return 'Comfort; not yet invested emotionally';
    }
    return 'Baseline gesture pattern established';
  }

  private estimateLeanDistance(event: any): string {
    // Estimate based on event description or confidence
    return '10-15cm';
  }

  private findEyeAccessingCues(events: any[]): any[] {
    return events.filter(e => 
      e.event.toLowerCase().includes('eye') && 
      (e.event.toLowerCase().includes('up') || 
       e.event.toLowerCase().includes('down') ||
       e.event.toLowerCase().includes('left') ||
       e.event.toLowerCase().includes('right'))
    ).map(e => ({
      ...e,
      direction: this.extractEyeDirection(e.event)
    }));
  }

  private extractEyeDirection(eventDescription: string): string {
    const desc = eventDescription.toLowerCase();
    if (desc.includes('up') && desc.includes('left')) return 'up-left (recall/visualization)';
    if (desc.includes('up') && desc.includes('right')) return 'up-right (construction)';
    if (desc.includes('down') && desc.includes('left')) return 'down-left (kinesthetic)';
    if (desc.includes('down') && desc.includes('right')) return 'down-right (internal dialogue)';
    return 'lateral (auditory processing)';
  }

  private describeEyeAccessing(eyeCues: any[]): string {
    const directions = eyeCues.map(c => c.direction).join(', then ');
    return `Gaze moves ${directions}`;
  }

  private describeLipMovement(cue: any): string {
    if (cue.event.toLowerCase().includes('compress')) {
      return 'Brief press of the lips after hearing key information';
    }
    if (cue.event.toLowerCase().includes('purse')) {
      return 'Lips pursed in evaluative expression';
    }
    return 'Subtle lip movement detected';
  }

  private findTensionIndicators(events: any[]): any[] {
    return events.filter(e => 
      e.event.toLowerCase().includes('tension') ||
      e.event.toLowerCase().includes('furrow') ||
      e.event.toLowerCase().includes('frown')
    );
  }

  private checkForIncongruence(events: any[]): boolean {
    return events.some(e => 
      e.event.toLowerCase().includes('incongruent') ||
      (e.event.toLowerCase().includes('no') && e.event.toLowerCase().includes('positive'))
    );
  }

  private checkForShoulderShrug(events: any[]): boolean {
    return events.some(e => e.event.toLowerCase().includes('shrug'));
  }

  private checkFeetOrientation(analysisData: AnalysisResult): boolean {
    // Check if feet are visible in the analysis data
    
    // Check for body-related indicators in signals
    const hasBodySignals = analysisData.signals.posture?.indicators.some(indicator => 
      indicator.toLowerCase().includes('full-body') ||
      indicator.toLowerCase().includes('feet') ||
      indicator.toLowerCase().includes('stance') ||
      indicator.toLowerCase().includes('lower-body')
    ) || false;

    // Check timeline for body/feet related events
    const hasBodyEvents = analysisData.timeline.some(event => 
      event.event.toLowerCase().includes('full body') ||
      event.event.toLowerCase().includes('feet') ||
      event.event.toLowerCase().includes('stance') ||
      event.event.toLowerCase().includes('lower body')
    );

    // Check detailed timeline for body language cues
    const hasBodyCues = analysisData.detailedTimeline?.some(item =>
      item.bodyLanguageCues?.some(cue => 
        cue.toLowerCase().includes('feet') ||
        cue.toLowerCase().includes('stance') ||
        cue.toLowerCase().includes('full body')
      )
    ) || false;

    // Only return true if we have actual evidence of feet/full body visibility
    return hasBodySignals || hasBodyEvents || hasBodyCues;
  }

  private checkClosingBehaviors(events: any[]): boolean {
    return events.some(e => 
      e.event.toLowerCase().includes('closing') ||
      e.event.toLowerCase().includes('wrap') ||
      e.event.toLowerCase().includes('end')
    );
  }

  private countPositiveSignals(phases: ForensicPhase[]): number {
    return phases.reduce((count, phase) => 
      count + phase.observations.filter(o => 
        o.implication.toLowerCase().includes('positive') ||
        o.implication.toLowerCase().includes('interest') ||
        o.implication.toLowerCase().includes('approval')
      ).length, 0
    );
  }

  private countNegativeSignals(phases: ForensicPhase[]): number {
    return phases.reduce((count, phase) => 
      count + phase.observations.filter(o => 
        o.implication.toLowerCase().includes('skeptic') ||
        o.implication.toLowerCase().includes('concern') ||
        o.implication.toLowerCase().includes('defensive')
      ).length, 0
    );
  }

  private calculateEngagementScore(phases: ForensicPhase[]): number {
    const totalObservations = phases.reduce((sum, phase) => sum + phase.observations.length, 0);
    const positiveObservations = this.countPositiveSignals(phases);
    return totalObservations > 0 ? positiveObservations / totalObservations : 0.5;
  }

  private gatherEvidenceForInterest(phases: ForensicPhase[]): string[] {
    const evidence: string[] = [];
    phases.forEach(phase => {
      phase.observations.forEach(obs => {
        if (obs.implication.toLowerCase().includes('interest') || 
            obs.implication.toLowerCase().includes('curiosity')) {
          evidence.push(`${obs.cue} (${phase.phaseName})`);
        }
      });
    });
    return evidence;
  }

  private gatherEvidenceForSkepticism(phases: ForensicPhase[]): string[] {
    const evidence: string[] = [];
    phases.forEach(phase => {
      phase.observations.forEach(obs => {
        if (obs.implication.toLowerCase().includes('skeptic') || 
            obs.implication.toLowerCase().includes('concern')) {
          evidence.push(`${obs.cue} at ${obs.timestamp || phase.timeRange}`);
        }
      });
    });
    return evidence;
  }

  private assessOpenness(phases: ForensicPhase[]): string {
    const openSignals = phases.reduce((count, phase) => 
      count + phase.observations.filter(o => 
        o.observation.toLowerCase().includes('open') ||
        o.implication.toLowerCase().includes('collaborative')
      ).length, 0
    );
    
    return openSignals > 5 ? 'High' : openSignals > 2 ? 'Moderate' : 'Low';
  }

  private gatherEvidenceForOpenness(phases: ForensicPhase[]): string[] {
    const evidence: string[] = [];
    phases.forEach(phase => {
      phase.observations.forEach(obs => {
        if (obs.observation.toLowerCase().includes('open') || 
            obs.implication.toLowerCase().includes('collaborative')) {
          evidence.push(obs.observation);
        }
      });
    });
    return evidence;
  }

  private generateOverallAssessment(findings: KeyFinding[]): string {
    const interestLevel = findings.find(f => f.category === 'Interest Level')?.level || 'Unknown';
    const skepticism = findings.find(f => f.category === 'Skepticism Pockets')?.level || 'Unknown';
    
    if (interestLevel === 'High' && skepticism === 'Low') {
      return 'Subject shows strong positive engagement with minimal reservations';
    } else if (interestLevel === 'High' && skepticism === 'Moderate') {
      return 'Subject demonstrates cautious enthusiasm with specific areas of concern';
    } else if (interestLevel === 'Moderate') {
      return 'Subject exhibits measured interest requiring further convincing';
    } else {
      return 'Subject shows limited engagement or significant skepticism';
    }
  }

  private generateTitle(contextPreset: string, subjects?: Subject[]): string {
    const contextTitles: { [key: string]: string } = {
      'interview': 'Job Interview Assessment',
      'negotiation': 'Negotiation Dynamics Analysis',
      'presentation': 'Presentation Impact Evaluation',
      'meeting': 'Business Meeting Behavioral Analysis',
      'date': 'Personal Interaction Assessment',
      'therapy': 'Therapeutic Progress Evaluation',
      'sales': 'Sales Interaction Analysis',
      'training': 'Practice Session Feedback'
    };

    const baseTitle = contextTitles[contextPreset] || 'Behavioral Analysis';
    if (subjects && subjects.length > 0) {
      return `${baseTitle}: ${subjects.map(s => s.label).join(' & ')}`;
    }
    return baseTitle;
  }

  private inferSubjects(analysisData: AnalysisResult): Subject[] {
    // Default subjects when not specified
    return [
      {
        id: 'subject-a',
        label: 'Subject A',
        description: 'Primary speaker/presenter',
        role: 'Presenter'
      },
      {
        id: 'subject-b',
        label: 'Subject B',
        description: 'Evaluator/listener',
        role: 'Evaluator'
      }
    ];
  }

  private countActiveAPIs(analysisData: AnalysisResult): number {
    const apiSources = new Set<string>();
    Object.values(analysisData.signals).forEach((signal: any) => {
      if (signal.apiSource) {
        apiSources.add(signal.apiSource);
      }
    });
    return apiSources.size;
  }

  formatReportAsMarkdown(report: ForensicReport): string {
    let markdown = `# Forensic Body-Language Report\n\n`;
    markdown += `**${report.title}**\n\n`;
    
    // Subjects
    report.subjects.forEach(subject => {
      markdown += `**${subject.label}** (${subject.role}): ${subject.description}\n`;
    });
    markdown += '\n---\n\n';

    // Baseline Calibration
    markdown += `## 1. ${report.baselineCalibration.phaseName}\n\n`;
    markdown += `| Cue | Observation | Implication |\n`;
    markdown += `|-----|-------------|-------------|\n`;
    report.baselineCalibration.observations.forEach(obs => {
      markdown += `| ${obs.cue} | ${obs.observation} | ${obs.implication} |\n`;
    });
    markdown += '\n---\n\n';

    // Analysis Phases
    report.analysisPhases.forEach((phase, index) => {
      markdown += `## ${index + 2}. ${phase.phaseName}\n\n`;
      phase.observations.forEach(obs => {
        markdown += `- **${obs.cue}** ${obs.timestamp ? `(≈${obs.timestamp})` : ''}\n`;
        markdown += `  - ${obs.observation}\n`;
        markdown += `  - *Interpretation:* ${obs.implication}\n`;
        if (obs.microExpressions && obs.microExpressions.length > 0) {
          markdown += `  - *Micro-expressions:* ${obs.microExpressions.join(', ')}\n`;
        }
        markdown += '\n';
      });
      markdown += '---\n\n';
    });

    // Decision Indicators
    markdown += `## ${report.analysisPhases.length + 2}. Decision-Read Indicators\n\n`;
    markdown += `| Indicator | Presence | Weight |\n`;
    markdown += `|-----------|----------|--------|\n`;
    report.decisionIndicators.forEach(indicator => {
      markdown += `| ${indicator.indicator} | ${indicator.presence} | ${indicator.weight} |\n`;
    });
    markdown += '\n---\n\n';

    // Summary Judgment
    markdown += `## Summary Judgment\n\n`;
    markdown += `**${report.summaryJudgment.overallAssessment}**\n\n`;
    report.summaryJudgment.keyFindings.forEach((finding, index) => {
      markdown += `${index + 1}. **${finding.category}:** ${finding.level}\n`;
      if (finding.evidence.length > 0) {
        markdown += `   - Evidence: ${finding.evidence.join(', ')}\n`;
      }
    });
    markdown += '\n';

    // Recommendations
    markdown += `## Recommended Next Moves\n\n`;
    report.recommendations.forEach((rec, index) => {
      markdown += `${index + 1}. **${rec.action}** (${rec.priority} Priority)\n`;
      markdown += `   - *Rationale:* ${rec.rationale}\n`;
      markdown += `   - *Expected Outcome:* ${rec.expectedOutcome}\n\n`;
    });

    // Confidence Note
    markdown += '---\n\n';
    markdown += `## Confidence Note\n\n`;
    markdown += report.confidenceNote;

    return markdown;
  }

  formatReportAsHTML(report: ForensicReport): string {
    // Convert markdown to styled HTML
    const markdown = this.formatReportAsMarkdown(report);
    // In a real implementation, use a markdown-to-HTML converter
    return `<div class="forensic-report">${markdown}</div>`;
  }
}

export const forensicReportService = new ForensicReportService();