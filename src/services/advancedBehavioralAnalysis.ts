import { AnalysisResult } from './analysisEngine';

export interface BaselineBehavior {
  subject: string;
  duration: number; // seconds of observation
  posturalNorm: {
    shoulderHeight: 'level' | 'raised_left' | 'raised_right';
    armPosition: 'crossed' | 'open' | 'hands_clasped' | 'at_sides';
    legPosition: 'parallel' | 'crossed' | 'wide_stance' | 'shifted_weight';
    torsoOrientation: 'forward' | 'angled_left' | 'angled_right' | 'leaning_back';
  };
  facialNorm: {
    eyebrowPosition: 'neutral' | 'slightly_raised' | 'furrowed' | 'asymmetrical';
    eyeContactPattern: 'direct' | 'intermittent' | 'avoiding' | 'scanning';
    mouthPosition: 'neutral' | 'slight_upturn' | 'compressed' | 'tense';
    blinkRate: number; // per minute
  };
  vocalNorm: {
    pitchRange: { low: number; high: number };
    speechRate: number; // words per minute
    volumeLevel: 'quiet' | 'normal' | 'loud' | 'variable';
    pausePattern: 'natural' | 'frequent' | 'rushed' | 'hesitant';
  };
  gestureNorm: {
    handMovementFrequency: 'minimal' | 'moderate' | 'frequent' | 'excessive';
    gestureSize: 'contained' | 'moderate' | 'expansive' | 'restricted';
    adaptorBehaviors: string[]; // self-touch, object manipulation, etc.
  };
}

export interface CulturalContext {
  region: 'western' | 'eastern' | 'mediterranean' | 'african' | 'latin' | 'nordic';
  personalSpace: number; // inches
  eyeContactNorms: {
    directGazeAcceptable: boolean;
    genderConsiderations: boolean;
    hierarchyInfluence: boolean;
  };
  gestureInterpretations: {
    [gesture: string]: {
      meaning: string;
      appropriateness: 'positive' | 'neutral' | 'negative' | 'taboo';
      contextDependent: boolean;
    };
  };
  touchNorms: {
    businessHandshake: 'firm' | 'light' | 'brief' | 'extended';
    socialTouch: 'minimal' | 'moderate' | 'frequent';
    personalBoundaries: 'strict' | 'flexible' | 'contextual';
  };
}

export interface SignalCluster {
  name: string;
  signals: string[];
  interpretation: string;
  confidence: number;
  timeWindow: { start: string; end: string };
  significance: 'high' | 'medium' | 'low';
  contradictorySignals?: string[];
}

export interface TemporalPattern {
  pattern: 'increasing' | 'decreasing' | 'cyclical' | 'stable' | 'erratic';
  signal: string;
  timePoints: Array<{ time: string; value: number }>;
  trend: {
    slope: number;
    correlation: number;
    significance: number;
  };
  interpretation: string;
}

export interface StressComfortIndicator {
  type: 'stress' | 'comfort' | 'neutral';
  level: number; // 0-1 scale
  indicators: string[];
  physiologicalMarkers: string[];
  behavioralMarkers: string[];
  timeStamp: string;
  reliability: number;
}

class AdvancedBehavioralAnalysis {
  private readonly culturalContexts: { [key: string]: CulturalContext } = {
    western: {
      region: 'western',
      personalSpace: 18,
      eyeContactNorms: {
        directGazeAcceptable: true,
        genderConsiderations: false,
        hierarchyInfluence: false
      },
      gestureInterpretations: {
        'thumbs_up': { meaning: 'approval', appropriateness: 'positive', contextDependent: false },
        'crossed_arms': { meaning: 'defensive or cold', appropriateness: 'negative', contextDependent: true },
        'open_palms': { meaning: 'honesty and openness', appropriateness: 'positive', contextDependent: false },
        'pointing': { meaning: 'directing attention', appropriateness: 'neutral', contextDependent: true }
      },
      touchNorms: {
        businessHandshake: 'firm',
        socialTouch: 'minimal',
        personalBoundaries: 'strict'
      }
    },
    eastern: {
      region: 'eastern',
      personalSpace: 24,
      eyeContactNorms: {
        directGazeAcceptable: false,
        genderConsiderations: true,
        hierarchyInfluence: true
      },
      gestureInterpretations: {
        'bow': { meaning: 'respect and greeting', appropriateness: 'positive', contextDependent: false },
        'direct_pointing': { meaning: 'rude', appropriateness: 'negative', contextDependent: false },
        'two_handed_presentation': { meaning: 'respect', appropriateness: 'positive', contextDependent: false }
      },
      touchNorms: {
        businessHandshake: 'light',
        socialTouch: 'minimal',
        personalBoundaries: 'strict'
      }
    }
  };

  private readonly stressIndicators = {
    physiological: [
      'increased_blink_rate', 'pupil_dilation', 'facial_flushing', 'perspiration',
      'rapid_breathing', 'increased_heart_rate', 'muscle_tension'
    ],
    behavioral: [
      'self_touch_increase', 'fidgeting', 'speech_rate_increase', 'vocal_tremor',
      'foot_tapping', 'pen_clicking', 'hair_touching', 'face_touching'
    ],
    postural: [
      'shoulder_raising', 'forward_head_posture', 'closed_posture', 'weight_shifting',
      'defensive_positioning', 'barrier_creation'
    ],
    vocal: [
      'pitch_elevation', 'speech_fragmentation', 'volume_changes', 'pause_irregularity',
      'filler_word_increase', 'speech_rate_variation'
    ]
  };

  private readonly comfortIndicators = {
    physiological: [
      'steady_breathing', 'normal_blink_rate', 'relaxed_facial_muscles', 'natural_coloring'
    ],
    behavioral: [
      'smooth_movements', 'purposeful_gestures', 'natural_speech_flow', 'appropriate_pausing'
    ],
    postural: [
      'open_posture', 'relaxed_shoulders', 'natural_alignment', 'stable_positioning'
    ],
    vocal: [
      'steady_pitch', 'consistent_volume', 'natural_pace', 'clear_articulation'
    ]
  };

  establishBaseline(analysisData: AnalysisResult, observationDuration: number = 10): BaselineBehavior {
    const baselineEvents = analysisData.timeline
      .filter(event => this.parseTimeToSeconds(event.time) <= observationDuration)
      .sort((a, b) => this.parseTimeToSeconds(a.time) - this.parseTimeToSeconds(b.time));

    return {
      subject: 'primary',
      duration: observationDuration,
      posturalNorm: this.analyzeBaselinePosture(baselineEvents, analysisData),
      facialNorm: this.analyzeBaselineFacial(baselineEvents, analysisData),
      vocalNorm: this.analyzeBaselineVocal(baselineEvents, analysisData),
      gestureNorm: this.analyzeBaselineGestures(baselineEvents, analysisData)
    };
  }

  detectSignalClusters(analysisData: AnalysisResult): SignalCluster[] {
    const clusters: SignalCluster[] = [];
    const timeWindows = this.createTimeWindows(analysisData.timeline, 10); // 10-second windows

    timeWindows.forEach(window => {
      const windowSignals = this.getSignalsInWindow(analysisData, window);
      
      // Detect confidence clusters
      const confidenceCluster = this.detectConfidenceCluster(windowSignals, window);
      if (confidenceCluster) clusters.push(confidenceCluster);

      // Detect engagement clusters
      const engagementCluster = this.detectEngagementCluster(windowSignals, window);
      if (engagementCluster) clusters.push(engagementCluster);

      // Detect deception clusters
      const deceptionCluster = this.detectDeceptionCluster(windowSignals, window);
      if (deceptionCluster) clusters.push(deceptionCluster);

      // Detect stress clusters
      const stressCluster = this.detectStressCluster(windowSignals, window);
      if (stressCluster) clusters.push(stressCluster);
    });

    return clusters.sort((a, b) => b.significance === 'high' ? 1 : -1);
  }

  analyzeTemporalPatterns(analysisData: AnalysisResult): TemporalPattern[] {
    const patterns: TemporalPattern[] = [];
    const signalKeys = Object.keys(analysisData.signals);

    signalKeys.forEach(signalKey => {
      const signal = analysisData.signals[signalKey];
      if (!signal) return;

      // Create time series data for confidence
      const timePoints = this.createTimeSeriesData(analysisData, signalKey);
      
      if (timePoints.length >= 3) {
        const trend = this.calculateTrend(timePoints);
        const pattern = this.identifyPattern(timePoints);

        patterns.push({
          pattern,
          signal: signalKey,
          timePoints,
          trend,
          interpretation: this.interpretTemporalPattern(pattern, signalKey, trend)
        });
      }
    });

    return patterns;
  }

  assessStressComfortLevels(analysisData: AnalysisResult): StressComfortIndicator[] {
    const indicators: StressComfortIndicator[] = [];
    const timeWindows = this.createTimeWindows(analysisData.timeline, 15); // 15-second windows

    timeWindows.forEach(window => {
      const windowEvents = analysisData.timeline.filter(event => {
        const eventTime = this.parseTimeToSeconds(event.time);
        return eventTime >= window.start && eventTime < window.end;
      });

      const stressLevel = this.calculateStressLevel(windowEvents, analysisData);
      const comfortLevel = this.calculateComfortLevel(windowEvents, analysisData);

      if (stressLevel > 0.6) {
        indicators.push({
          type: 'stress',
          level: stressLevel,
          indicators: this.identifyStressIndicators(windowEvents),
          physiologicalMarkers: this.getPhysiologicalMarkers(windowEvents, 'stress'),
          behavioralMarkers: this.getBehavioralMarkers(windowEvents, 'stress'),
          timeStamp: this.formatTime(window.start),
          reliability: this.calculateReliability(windowEvents)
        });
      } else if (comfortLevel > 0.6) {
        indicators.push({
          type: 'comfort',
          level: comfortLevel,
          indicators: this.identifyComfortIndicators(windowEvents),
          physiologicalMarkers: this.getPhysiologicalMarkers(windowEvents, 'comfort'),
          behavioralMarkers: this.getBehavioralMarkers(windowEvents, 'comfort'),
          timeStamp: this.formatTime(window.start),
          reliability: this.calculateReliability(windowEvents)
        });
      }
    });

    return indicators;
  }

  applyCulturalContext(
    analysisData: AnalysisResult, 
    culturalBackground: string = 'western'
  ): AnalysisResult {
    const context = this.culturalContexts[culturalBackground];
    if (!context) return analysisData;

    const adjustedData = { ...analysisData };

    // Adjust eye contact interpretations
    if (adjustedData.signals.eye_movement) {
      adjustedData.signals.eye_movement = this.adjustEyeContactForCulture(
        adjustedData.signals.eye_movement,
        context
      );
    }

    // Adjust gesture interpretations
    if (adjustedData.signals.gestures) {
      adjustedData.signals.gestures = this.adjustGesturesForCulture(
        adjustedData.signals.gestures,
        context
      );
    }

    // Adjust personal space considerations
    if (adjustedData.signals.posture) {
      adjustedData.signals.posture = this.adjustPostureForCulture(
        adjustedData.signals.posture,
        context
      );
    }

    return adjustedData;
  }

  generateAdvancedInsights(
    baseline: BaselineBehavior,
    clusters: SignalCluster[],
    patterns: TemporalPattern[],
    stressComfort: StressComfortIndicator[]
  ): string[] {
    const insights: string[] = [];

    // Baseline deviation insights
    insights.push(`Baseline established over ${baseline.duration} seconds with ${this.assessBaselineStability(baseline)}`);

    // Cluster insights
    const highSignificanceClusters = clusters.filter(c => c.significance === 'high');
    if (highSignificanceClusters.length > 0) {
      insights.push(`${highSignificanceClusters.length} high-significance behavioral clusters detected, suggesting ${this.interpretClusterPatterns(highSignificanceClusters)}`);
    }

    // Temporal pattern insights
    const increasingPatterns = patterns.filter(p => p.pattern === 'increasing');
    const decreasingPatterns = patterns.filter(p => p.pattern === 'decreasing');
    
    if (increasingPatterns.length > 0) {
      insights.push(`Increasing trends observed in ${increasingPatterns.map(p => p.signal).join(', ')}, indicating ${this.interpretIncreasingTrends(increasingPatterns)}`);
    }

    if (decreasingPatterns.length > 0) {
      insights.push(`Decreasing trends in ${decreasingPatterns.map(p => p.signal).join(', ')}, suggesting ${this.interpretDecreasingTrends(decreasingPatterns)}`);
    }

    // Stress/comfort insights
    const stressIndicators = stressComfort.filter(sc => sc.type === 'stress');
    const comfortIndicators = stressComfort.filter(sc => sc.type === 'comfort');
    
    if (stressIndicators.length > comfortIndicators.length) {
      insights.push(`Predominant stress indicators detected with average level ${this.calculateAverageLevel(stressIndicators).toFixed(2)}, suggesting heightened tension`);
    } else if (comfortIndicators.length > stressIndicators.length) {
      insights.push(`Strong comfort indicators with average level ${this.calculateAverageLevel(comfortIndicators).toFixed(2)}, indicating subject ease and confidence`);
    }

    return insights;
  }

  // Helper methods
  private parseTimeToSeconds(timeStr: string): number {
    const parts = timeStr.split(':').map(Number);
    return parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0];
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private analyzeBaselinePosture(events: any[], analysisData: AnalysisResult): BaselineBehavior['posturalNorm'] {
    const postureSignal = analysisData.signals.posture;
    
    return {
      shoulderHeight: this.inferShoulderHeight(postureSignal),
      armPosition: this.inferArmPosition(postureSignal),
      legPosition: this.inferLegPosition(postureSignal),
      torsoOrientation: this.inferTorsoOrientation(postureSignal)
    };
  }

  private analyzeBaselineFacial(events: any[], analysisData: AnalysisResult): BaselineBehavior['facialNorm'] {
    const facialSignal = analysisData.signals.facial_expression;
    const eyeSignal = analysisData.signals.eye_movement;
    
    return {
      eyebrowPosition: this.inferEyebrowPosition(facialSignal),
      eyeContactPattern: this.inferEyeContactPattern(eyeSignal),
      mouthPosition: this.inferMouthPosition(facialSignal),
      blinkRate: this.inferBlinkRate(eyeSignal)
    };
  }

  private analyzeBaselineVocal(events: any[], analysisData: AnalysisResult): BaselineBehavior['vocalNorm'] {
    // const vocalSignal = analysisData.signals.voice_tone; // Reserved for future vocal analysis
    
    return {
      pitchRange: { low: 150, high: 300 }, // Default ranges
      speechRate: 150, // words per minute
      volumeLevel: 'normal',
      pausePattern: 'natural'
    };
  }

  private analyzeBaselineGestures(events: any[], analysisData: AnalysisResult): BaselineBehavior['gestureNorm'] {
    const gestureSignal = analysisData.signals.gestures;
    
    return {
      handMovementFrequency: this.inferGestureFrequency(gestureSignal),
      gestureSize: this.inferGestureSize(gestureSignal),
      adaptorBehaviors: this.identifyAdaptorBehaviors(gestureSignal)
    };
  }

  private createTimeWindows(timeline: any[], windowSize: number): Array<{ start: number; end: number }> {
    if (timeline.length === 0) return [];
    
    const firstTime = this.parseTimeToSeconds(timeline[0].time);
    const lastTime = this.parseTimeToSeconds(timeline[timeline.length - 1].time);
    const windows: Array<{ start: number; end: number }> = [];
    
    for (let start = firstTime; start < lastTime; start += windowSize) {
      windows.push({ start, end: Math.min(start + windowSize, lastTime) });
    }
    
    return windows;
  }

  private getSignalsInWindow(analysisData: AnalysisResult, window: { start: number; end: number }): any {
    const windowEvents = analysisData.timeline.filter(event => {
      const eventTime = this.parseTimeToSeconds(event.time);
      return eventTime >= window.start && eventTime < window.end;
    });

    return {
      events: windowEvents,
      signals: analysisData.signals,
      window
    };
  }

  private detectConfidenceCluster(windowSignals: any, window: any): SignalCluster | null {
    const confidenceIndicators = ['open_posture', 'steady_eye_contact', 'purposeful_gestures', 'clear_speech'];
    const presentIndicators = windowSignals.events.filter((event: any) => 
      confidenceIndicators.some(indicator => event.event.toLowerCase().includes(indicator.replace('_', ' ')))
    );

    if (presentIndicators.length >= 2) {
      return {
        name: 'Confidence Cluster',
        signals: presentIndicators.map((e: any) => e.event),
        interpretation: 'Subject displaying strong confidence indicators',
        confidence: 0.85,
        timeWindow: { start: this.formatTime(window.start), end: this.formatTime(window.end) },
        significance: 'high'
      };
    }
    return null;
  }

  private detectEngagementCluster(windowSignals: any, window: any): SignalCluster | null {
    const engagementIndicators = ['forward_lean', 'nods', 'eye_contact', 'active_listening'];
    const presentIndicators = windowSignals.events.filter((event: any) => 
      engagementIndicators.some(indicator => event.event.toLowerCase().includes(indicator.replace('_', ' ')))
    );

    if (presentIndicators.length >= 2) {
      return {
        name: 'Engagement Cluster',
        signals: presentIndicators.map((e: any) => e.event),
        interpretation: 'High levels of engagement and active participation',
        confidence: 0.80,
        timeWindow: { start: this.formatTime(window.start), end: this.formatTime(window.end) },
        significance: 'high'
      };
    }
    return null;
  }

  private detectDeceptionCluster(windowSignals: any, window: any): SignalCluster | null {
    const deceptionIndicators = ['touch_face', 'avoid_eye_contact', 'speech_hesitation', 'incongruent'];
    const presentIndicators = windowSignals.events.filter((event: any) => 
      deceptionIndicators.some(indicator => event.event.toLowerCase().includes(indicator.replace('_', ' ')))
    );

    if (presentIndicators.length >= 2) {
      return {
        name: 'Potential Deception Cluster',
        signals: presentIndicators.map((e: any) => e.event),
        interpretation: 'Possible deception indicators - requires additional verification',
        confidence: 0.65,
        timeWindow: { start: this.formatTime(window.start), end: this.formatTime(window.end) },
        significance: 'medium'
      };
    }
    return null;
  }

  private detectStressCluster(windowSignals: any, window: any): SignalCluster | null {
    const stressIndicators = ['tension', 'fidget', 'rapid_speech', 'defensive'];
    const presentIndicators = windowSignals.events.filter((event: any) => 
      stressIndicators.some(indicator => event.event.toLowerCase().includes(indicator))
    );

    if (presentIndicators.length >= 2) {
      return {
        name: 'Stress Response Cluster',
        signals: presentIndicators.map((e: any) => e.event),
        interpretation: 'Elevated stress levels detected',
        confidence: 0.78,
        timeWindow: { start: this.formatTime(window.start), end: this.formatTime(window.end) },
        significance: 'high'
      };
    }
    return null;
  }

  // Additional helper methods would continue here...
  private createTimeSeriesData(analysisData: AnalysisResult, signalKey: string): Array<{ time: string; value: number }> {
    // Implementation for creating time series data
    return analysisData.timeline.map(event => ({
      time: event.time,
      value: event.confidence
    }));
  }

  private calculateTrend(timePoints: Array<{ time: string; value: number }>): { slope: number; correlation: number; significance: number } {
    // Simple linear regression
    const n = timePoints.length;
    const sumX = timePoints.reduce((sum, point, index) => sum + index, 0);
    const sumY = timePoints.reduce((sum, point) => sum + point.value, 0);
    const sumXY = timePoints.reduce((sum, point, index) => sum + (index * point.value), 0);
    const sumXX = timePoints.reduce((sum, point, index) => sum + (index * index), 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const correlation = Math.abs(slope); // Simplified correlation
    const significance = correlation > 0.5 ? 0.8 : 0.4;

    return { slope, correlation, significance };
  }

  private identifyPattern(timePoints: Array<{ time: string; value: number }>): 'increasing' | 'decreasing' | 'cyclical' | 'stable' | 'erratic' {
    const trend = this.calculateTrend(timePoints);
    
    if (Math.abs(trend.slope) < 0.01) return 'stable';
    if (trend.slope > 0.01) return 'increasing';
    if (trend.slope < -0.01) return 'decreasing';
    
    // Check for cyclical patterns (simplified)
    const variance = this.calculateVariance(timePoints.map(p => p.value));
    if (variance > 0.1) return 'erratic';
    
    return 'stable';
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }

  private interpretTemporalPattern(pattern: string, signal: string, trend: any): string {
    const interpretations: { [key: string]: string } = {
      'increasing': `${signal} shows increasing trend, suggesting escalating response`,
      'decreasing': `${signal} shows decreasing trend, indicating diminishing response`,
      'stable': `${signal} remains stable throughout interaction`,
      'cyclical': `${signal} shows cyclical pattern, suggesting periodic responses`,
      'erratic': `${signal} shows erratic pattern, indicating inconsistent responses`
    };
    
    return interpretations[pattern] || 'Pattern interpretation unavailable';
  }

  // Placeholder implementations for various inference methods
  private inferShoulderHeight(signal: any): 'level' | 'raised_left' | 'raised_right' { return 'level'; }
  private inferArmPosition(signal: any): 'crossed' | 'open' | 'hands_clasped' | 'at_sides' { return 'open'; }
  private inferLegPosition(signal: any): 'parallel' | 'crossed' | 'wide_stance' | 'shifted_weight' { return 'parallel'; }
  private inferTorsoOrientation(signal: any): 'forward' | 'angled_left' | 'angled_right' | 'leaning_back' { return 'forward'; }
  private inferEyebrowPosition(signal: any): 'neutral' | 'slightly_raised' | 'furrowed' | 'asymmetrical' { return 'neutral'; }
  private inferEyeContactPattern(signal: any): 'direct' | 'intermittent' | 'avoiding' | 'scanning' { return 'direct'; }
  private inferMouthPosition(signal: any): 'neutral' | 'slight_upturn' | 'compressed' | 'tense' { return 'neutral'; }
  private inferBlinkRate(signal: any): number { return 20; }
  private inferGestureFrequency(signal: any): 'minimal' | 'moderate' | 'frequent' | 'excessive' { return 'moderate'; }
  private inferGestureSize(signal: any): 'contained' | 'moderate' | 'expansive' | 'restricted' { return 'moderate'; }
  
  private identifyAdaptorBehaviors(signal: any): string[] { 
    return ['hair_touch', 'face_touch', 'clothing_adjustment']; 
  }

  private calculateStressLevel(events: any[], analysisData: AnalysisResult): number {
    // Implementation for stress level calculation
    const stressEvents = events.filter(event => 
      this.stressIndicators.behavioral.some(indicator => 
        event.event.toLowerCase().includes(indicator.replace('_', ' '))
      )
    );
    return Math.min(stressEvents.length / 3, 1); // Normalize to 0-1
  }

  private calculateComfortLevel(events: any[], analysisData: AnalysisResult): number {
    // Implementation for comfort level calculation
    const comfortEvents = events.filter(event => 
      this.comfortIndicators.behavioral.some(indicator => 
        event.event.toLowerCase().includes(indicator.replace('_', ' '))
      )
    );
    return Math.min(comfortEvents.length / 3, 1); // Normalize to 0-1
  }

  private identifyStressIndicators(events: any[]): string[] {
    return events
      .filter(event => this.stressIndicators.behavioral.some(indicator => 
        event.event.toLowerCase().includes(indicator.replace('_', ' '))
      ))
      .map(event => event.event);
  }

  private identifyComfortIndicators(events: any[]): string[] {
    return events
      .filter(event => this.comfortIndicators.behavioral.some(indicator => 
        event.event.toLowerCase().includes(indicator.replace('_', ' '))
      ))
      .map(event => event.event);
  }

  private getPhysiologicalMarkers(events: any[], type: 'stress' | 'comfort'): string[] {
    const markers = type === 'stress' ? this.stressIndicators.physiological : this.comfortIndicators.physiological;
    return events
      .filter(event => markers.some(marker => event.event.toLowerCase().includes(marker.replace('_', ' '))))
      .map(event => event.event);
  }

  private getBehavioralMarkers(events: any[], type: 'stress' | 'comfort'): string[] {
    const markers = type === 'stress' ? this.stressIndicators.behavioral : this.comfortIndicators.behavioral;
    return events
      .filter(event => markers.some(marker => event.event.toLowerCase().includes(marker.replace('_', ' '))))
      .map(event => event.event);
  }

  private calculateReliability(events: any[]): number {
    // Simple reliability calculation based on number of observations
    return Math.min(events.length / 5, 1);
  }

  private adjustEyeContactForCulture(eyeSignal: any, context: CulturalContext): any {
    const adjusted = { ...eyeSignal };
    
    if (!context.eyeContactNorms.directGazeAcceptable) {
      // Adjust interpretation for cultures where direct eye contact is less appropriate
      adjusted.indicators = adjusted.indicators.map((indicator: string) => 
        indicator === 'direct_eye_contact' ? 'respectful_gaze_avoidance' : indicator
      );
    }
    
    return adjusted;
  }

  private adjustGesturesForCulture(gestureSignal: any, context: CulturalContext): any {
    const adjusted = { ...gestureSignal };
    
    // Apply cultural gesture interpretations
    Object.keys(context.gestureInterpretations).forEach(gesture => {
      const interpretation = context.gestureInterpretations[gesture];
      if (adjusted.indicators.includes(gesture)) {
        if (interpretation.appropriateness === 'negative' || interpretation.appropriateness === 'taboo') {
          adjusted.confidence *= 0.8; // Reduce confidence for culturally inappropriate gestures
        }
      }
    });
    
    return adjusted;
  }

  private adjustPostureForCulture(postureSignal: any, context: CulturalContext): any {
    // Implementation for cultural posture adjustments
    return postureSignal;
  }

  private assessBaselineStability(baseline: BaselineBehavior): string {
    // Implementation for assessing baseline stability
    return 'stable behavioral patterns';
  }

  private interpretClusterPatterns(clusters: SignalCluster[]): string {
    const clusterTypes = clusters.map(c => c.name.toLowerCase());
    if (clusterTypes.includes('confidence')) return 'high subject confidence';
    if (clusterTypes.includes('engagement')) return 'active engagement';
    if (clusterTypes.includes('stress')) return 'elevated stress responses';
    return 'mixed behavioral responses';
  }

  private interpretIncreasingTrends(patterns: TemporalPattern[]): string {
    return 'escalating behavioral responses over time';
  }

  private interpretDecreasingTrends(patterns: TemporalPattern[]): string {
    return 'diminishing behavioral intensity';
  }

  private calculateAverageLevel(indicators: StressComfortIndicator[]): number {
    return indicators.reduce((sum, indicator) => sum + indicator.level, 0) / indicators.length;
  }
}

export const advancedBehavioralAnalysis = new AdvancedBehavioralAnalysis();