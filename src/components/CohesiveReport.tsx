import React, { useState } from 'react';
import { 
  User, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Brain,
  Zap,
  Target,
  Download,
  Share2,
  Save,
  FileText
} from 'lucide-react';
import { AnalysisResult } from '../services/analysisEngine';
import { forensicReportService } from '../services/forensicReportService';
import { exportService } from '../services/exportService';
import ForensicReport from './ForensicReport';

interface CohesiveReportProps {
  analysisData: AnalysisResult;
  contextPreset: string;
  isAnalyzing: boolean;
}

const CohesiveReport: React.FC<CohesiveReportProps> = ({ analysisData, contextPreset, isAnalyzing }) => {
  const [showFullReport, setShowFullReport] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [forensicReport, setForensicReport] = useState<any>(null);
  
  const getContextTitle = (preset: string): string => {
    const titles: { [key: string]: string } = {
      'meeting': 'Business Meeting Analysis',
      'interview': 'Job Interview Assessment',
      'presentation': 'Presentation Evaluation',
      'negotiation': 'Negotiation Dynamics',
      'date': 'Personal Interaction Analysis',
      'therapy': 'Therapeutic Session Evaluation',
      'sales': 'Sales Interaction Assessment',
      'training': 'Practice Session Feedback'
    };
    return titles[preset] || 'Behavioral Analysis';
  };

  const formatConfidence = (confidence: number): string => {
    return `${Math.round(confidence * 100)}%`;
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCurrentPhase = (): string => {
    if (!analysisData.timeline || analysisData.timeline.length === 0) return 'Initializing';
    
    const latestEvent = analysisData.timeline[analysisData.timeline.length - 1];
    const timeInSeconds = parseTimeToSeconds(latestEvent.time);
    
    if (timeInSeconds <= 10) return 'Baseline Calibration';
    if (timeInSeconds <= 30) return 'Engagement Assessment';
    if (timeInSeconds <= 50) return 'Challenge Response';
    return 'Decision Formation';
  };

  const parseTimeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':').map(Number);
    return parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0];
  };

  const generateCurrentInsights = (): string[] => {
    const insights: string[] = [];
    const signals = analysisData.signals;

    // Facial expression insights
    if (signals.facial_expression && signals.facial_expression.confidence > 0.7) {
      const indicators = signals.facial_expression.indicators;
      if (indicators.includes('genuine_smile') || indicators.includes('positive_expression')) {
        insights.push('Positive facial expressions detected, indicating genuine engagement and interest');
      } else if (indicators.includes('lip_compression') || indicators.includes('micro_tension')) {
        insights.push('Subtle facial tension observed, suggesting analytical processing or mild skepticism');
      }
    }

    // Posture insights
    if (signals.posture && signals.posture.confidence > 0.7) {
      const indicators = signals.posture.indicators;
      if (indicators.includes('forward_lean') || indicators.includes('open_posture')) {
        insights.push('Open body language with forward lean indicates high engagement and interest');
      } else if (indicators.includes('closed_posture') || indicators.includes('defensive_positioning')) {
        insights.push('More reserved posture suggests cautious evaluation or potential resistance');
      }
    }

    // Voice insights
    if (signals.voice_tone && signals.voice_tone.confidence > 0.6) {
      const indicators = signals.voice_tone.indicators;
      if (indicators.includes('steady_pace') || indicators.includes('clear_articulation')) {
        insights.push('Vocal patterns indicate confidence and clear communication');
      } else if (indicators.includes('pitch_variance') || indicators.includes('speech_rate_increase')) {
        insights.push('Voice modulation suggests heightened emotional state or emphasis');
      }
    }

    // Gesture insights
    if (signals.gestures && signals.gestures.confidence > 0.7) {
      const indicators = signals.gestures.indicators;
      if (indicators.includes('open_palm_gestures') || indicators.includes('purposeful_movements')) {
        insights.push('Hand gestures demonstrate openness and intentional communication');
      } else if (indicators.includes('hand_to_chin') || indicators.includes('analytical_gestures')) {
        insights.push('Analytical hand positions indicate deep consideration and evaluation');
      }
    }

    // Default insight if no specific patterns detected
    if (insights.length === 0) {
      insights.push('Analysis in progress - behavioral patterns are being established and evaluated');
    }

    return insights;
  };

  const getOverallAssessment = (): { level: string; description: string; color: string } => {
    const trustVector = analysisData.trustVector;
    const alertCount = analysisData.alerts?.length || 0;
    
    if (trustVector >= 0.8 && alertCount <= 1) {
      return {
        level: 'Highly Positive',
        description: 'Strong positive indicators with minimal concerns detected',
        color: 'text-green-400'
      };
    } else if (trustVector >= 0.6 && alertCount <= 3) {
      return {
        level: 'Cautiously Positive',
        description: 'Generally positive signals with some areas requiring attention',
        color: 'text-yellow-400'
      };
    } else if (trustVector >= 0.4) {
      return {
        level: 'Mixed Signals',
        description: 'Conflicting indicators require careful interpretation',
        color: 'text-orange-400'
      };
    } else {
      return {
        level: 'Requires Attention',
        description: 'Multiple concern indicators detected, deeper analysis recommended',
        color: 'text-red-400'
      };
    }
  };

  const getKeyRecommendations = (): string[] => {
    const recommendations: string[] = [];
    const assessment = getOverallAssessment();

    if (assessment.level === 'Highly Positive') {
      if (contextPreset === 'interview') {
        recommendations.push('Continue with detailed technical questions to assess competency depth');
        recommendations.push('Explore specific scenario-based questions to gauge problem-solving approach');
      } else if (contextPreset === 'presentation') {
        recommendations.push('Engage with detailed questions to build on the positive momentum');
        recommendations.push('Consider transitioning to next steps or practical implementation discussion');
      } else if (contextPreset === 'negotiation') {
        recommendations.push('This is an optimal time to present your key terms and conditions');
        recommendations.push('Build on the positive rapport to explore mutually beneficial solutions');
      } else {
        recommendations.push('Capitalize on positive engagement by deepening the conversation');
        recommendations.push('This is an excellent time to present more detailed or complex information');
      }
    } else if (assessment.level === 'Cautiously Positive') {
      recommendations.push('Address any visible concerns before proceeding to complex topics');
      recommendations.push('Use clarifying questions to better understand any hesitation');
      recommendations.push('Provide additional supporting evidence or examples to build confidence');
    } else if (assessment.level === 'Mixed Signals') {
      recommendations.push('Pause to address conflicting signals - ask direct questions about concerns');
      recommendations.push('Provide space for the other party to voice any reservations');
      recommendations.push('Consider adjusting your approach based on the specific concerns identified');
    } else {
      recommendations.push('Stop and directly address the apparent concerns or resistance');
      recommendations.push('Ask open-ended questions to understand the root cause of hesitation');
      recommendations.push('Consider taking a break or changing the approach entirely');
    }

    return recommendations.slice(0, 3); // Limit to top 3 recommendations
  };

  const handleGenerateFullReport = async () => {
    if (!analysisData) return;
    
    setIsGeneratingReport(true);
    try {
      const report = await forensicReportService.generateForensicReport(
        analysisData,
        contextPreset
      );
      setForensicReport(report);
      setShowFullReport(true);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleExportAnalysis = async () => {
    if (!analysisData) return;
    
    try {
      // Generate a simple markdown report
      const markdown = generateSimpleMarkdownReport();
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cohesive-analysis-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting analysis:', error);
      alert('Failed to export analysis. Please try again.');
    }
  };

  const handleShareInsights = async () => {
    if (!analysisData) return;
    
    try {
      const currentAssessment = getOverallAssessment();
      const insightsArray = generateCurrentInsights();
      const shareText = `Behavioral Analysis Insights:\n\n${insightsArray.join('\n\n')}\n\nTrust Vector: ${formatConfidence(analysisData.trustVector)}\nAssessment: ${currentAssessment.level}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'Behavioral Analysis Insights',
          text: shareText
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        alert('Insights copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing insights:', error);
      alert('Failed to share insights. Please try again.');
    }
  };

  const handleSaveSession = () => {
    if (!analysisData) return;
    
    try {
      const sessionData = {
        timestamp: new Date().toISOString(),
        contextPreset,
        analysisData,
        insights: generateCurrentInsights(),
        assessment: getOverallAssessment(),
        recommendations: getKeyRecommendations()
      };
      
      const dataStr = JSON.stringify(sessionData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `session-${contextPreset}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Failed to save session. Please try again.');
    }
  };

  const generateSimpleMarkdownReport = (): string => {
    const title = getContextTitle(contextPreset);
    const phase = getCurrentPhase();
    const insightsText = insights.join('\n\n');
    const recommendationsText = recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n');
    
    return `# ${title}
    
Generated: ${new Date().toLocaleString()}

## Overview
- Current Phase: ${phase}
- Trust Vector: ${formatConfidence(analysisData.trustVector)}
- Overall Assessment: ${assessment.level}

## Live Behavioral Insights
${insightsText}

## Signal Overview
${Object.entries(analysisData.signals).map(([signalType, data]) => {
  if (!data) return '';
  return `
### ${signalType.replace('_', ' ')}
- Confidence: ${formatConfidence(data.confidence)}
- Key Indicators: ${data.indicators.slice(0, 3).join(', ')}`;
}).join('\n')}

## Real-time Recommendations
${recommendationsText}

## Assessment Summary
${assessment.description}

${analysisData.alerts && analysisData.alerts.length > 0 ? `
## Active Alerts (${analysisData.alerts.length})
${analysisData.alerts.slice(0, 3).map(alert => 
  `- ${alert.type} (${alert.severity}): ${alert.description}`
).join('\n')}` : ''}
`;
  };

  if (!analysisData) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Start an analysis to see the cohesive report</p>
        </div>
      </div>
    );
  }

  const currentPhase = getCurrentPhase();
  const insights = generateCurrentInsights();
  const assessment = getOverallAssessment();
  const recommendations = getKeyRecommendations();

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6 max-h-full overflow-y-auto">
      {/* Report Header */}
      <div className="border-b border-gray-700 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white flex items-center">
            <User className="w-5 h-5 mr-2 text-cyan-400" />
            {getContextTitle(contextPreset)}
          </h2>
          {isAnalyzing && (
            <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full text-xs">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>LIVE ANALYSIS</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Current Phase: <span className="text-cyan-400 ml-1">{currentPhase}</span>
          </span>
          <span className="flex items-center">
            <Target className="w-4 h-4 mr-1" />
            Trust Vector: <span className={`ml-1 font-bold ${getConfidenceColor(analysisData.trustVector)}`}>
              {formatConfidence(analysisData.trustVector)}
            </span>
          </span>
        </div>
      </div>

      {/* Overall Assessment */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
          Overall Assessment
        </h3>
        <div className="flex items-start space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            assessment.level === 'Highly Positive' ? 'bg-green-900 text-green-300' :
            assessment.level === 'Cautiously Positive' ? 'bg-yellow-900 text-yellow-300' :
            assessment.level === 'Mixed Signals' ? 'bg-orange-900 text-orange-300' :
            'bg-red-900 text-red-300'
          }`}>
            {assessment.level}
          </div>
          <p className="text-gray-300 flex-1">{assessment.description}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleGenerateFullReport}
            disabled={isGeneratingReport}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-2 rounded text-sm text-white transition-colors flex items-center justify-center gap-2"
          >
            {isGeneratingReport ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Generate Full Report
              </>
            )}
          </button>
          <button 
            onClick={handleExportAnalysis}
            className="bg-gray-600 hover:bg-gray-500 p-2 rounded text-sm text-white transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Analysis
          </button>
          <button 
            onClick={handleShareInsights}
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-sm text-white transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Insights
          </button>
          <button 
            onClick={handleSaveSession}
            className="bg-green-600 hover:bg-green-700 p-2 rounded text-sm text-white transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Session
          </button>
        </div>
      </div>

      {/* Current Behavioral Insights */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-400" />
          Live Behavioral Insights
        </h3>
        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300 text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Signal Overview */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-400" />
          Signal Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(analysisData.signals).map(([signalType, data]) => {
            if (!data) return null;
            return (
              <div key={signalType} className="bg-gray-600 p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white capitalize">
                    {signalType.replace('_', ' ')}
                  </span>
                  <span className={`text-xs font-bold ${getConfidenceColor(data.confidence)}`}>
                    {formatConfidence(data.confidence)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {data.indicators.slice(0, 3).map((indicator: string, idx: number) => (
                    <span key={idx} className="text-xs bg-gray-500 text-gray-200 px-2 py-1 rounded">
                      {indicator.replace(/_/g, ' ')}
                    </span>
                  ))}
                  {data.indicators.length > 3 && (
                    <span className="text-xs text-gray-400">+{data.indicators.length - 3} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Alerts */}
      {analysisData.alerts && analysisData.alerts.length > 0 && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
            Active Alerts ({analysisData.alerts.length})
          </h3>
          <div className="space-y-2">
            {analysisData.alerts.slice(0, 3).map((alert: any, idx: number) => (
              <div key={idx} className={`p-3 rounded border-l-4 ${
                alert.severity === 'high' ? 'border-red-500 bg-red-900/20' :
                alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-900/20' :
                'border-blue-500 bg-blue-900/20'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-medium text-white capitalize">{alert.type}</span>
                    <p className="text-xs text-gray-300 mt-1">{alert.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">{alert.timestamp}</span>
                    <div className="text-xs text-gray-500">
                      {formatConfidence(alert.confidence)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {analysisData.alerts.length > 3 && (
              <p className="text-xs text-gray-400 text-center">
                +{analysisData.alerts.length - 3} additional alerts in detailed report
              </p>
            )}
          </div>
        </div>
      )}

      {/* Real-time Recommendations */}
      <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-4 border border-cyan-500/30">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-cyan-400" />
          Real-time Recommendations
        </h3>
        <div className="space-y-3">
          {recommendations.map((recommendation, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {idx + 1}
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Forensic Report Modal */}
      {showFullReport && forensicReport && (
        <ForensicReport 
          report={forensicReport} 
          onClose={() => setShowFullReport(false)} 
        />
      )}
    </div>
  );
};

export default CohesiveReport;