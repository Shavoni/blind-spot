import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Brain,
  Target,
  Lightbulb,
  Activity,
  BarChart3,
  Zap,
  Globe,
  X,
  ChevronRight,
  Shield,
  Sparkles
} from 'lucide-react';
import { ForensicReport as ForensicReportType } from '../services/forensicReportService';
import { exportService, ExportOptions } from '../services/exportService';
import { Card, Button, Badge, Progress, Alert, Modal } from './ui';

interface ForensicReportProps {
  report: ForensicReportType;
  onClose: () => void;
}

const ForensicReport: React.FC<ForensicReportProps> = ({ report, onClose }) => {
  const [activeTab, setActiveTab] = useState<'report' | 'raw' | 'export'>('report');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyReport = async () => {
    try {
      const markdownContent = formatReportAsMarkdown(report);
      await navigator.clipboard.writeText(markdownContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy report:', error);
    }
  };

  const handleDownloadReport = () => {
    const markdownContent = formatReportAsMarkdown(report);
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forensic-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="full"
      showCloseButton={false}
      closeOnOverlay={false}
    >
      <div className="flex flex-col h-[90vh]">
        {/* Premium Header */}
        <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-3">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Forensic Analysis Report
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4" />
                {report.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCopyReport}
              variant="secondary"
              size="sm"
              icon={copySuccess ? CheckCircle : Copy}
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              onClick={handleDownloadReport}
              variant="gradient"
              size="sm"
              icon={Download}
            >
              Download
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('report')}
            className={`px-6 py-3 text-sm font-medium transition-all duration-200 relative ${
              activeTab === 'report' 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Formatted Report
            </div>
            {activeTab === 'report' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-6 py-3 text-sm font-medium transition-all duration-200 relative ${
              activeTab === 'raw' 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Raw Data
            </div>
            {activeTab === 'raw' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-6 py-3 text-sm font-medium transition-all duration-200 relative ${
              activeTab === 'export' 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Options
            </div>
            {activeTab === 'export' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'report' && <FormattedReportView report={report} />}
          {activeTab === 'raw' && <RawDataView report={report} />}
          {activeTab === 'export' && <ExportOptionsView report={report} />}
        </div>
      </div>
    </Modal>
  );
};

const FormattedReportView: React.FC<{ report: ForensicReportType }> = ({ report }) => {
  return (
    <div className="p-8 space-y-8">
      {/* Subjects */}
      <Card variant="glass" className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Analysis Subjects</h3>
        </div>
        <div className="space-y-3">
          {report.subjects.map(subject => (
            <div key={subject.id} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <Badge variant="info" size="sm">{subject.role}</Badge>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">{subject.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subject.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Baseline Calibration */}
      <Card variant="elevated" className="animate-fade-in animation-delay-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            1. {report.baselineCalibration.phaseName}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Behavioral Cue</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Observation</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Implication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {report.baselineCalibration.observations.map((obs, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{obs.cue}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{obs.observation}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{obs.implication}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Analysis Phases */}
      {report.analysisPhases.map((phase, phaseIdx) => (
        <Card key={phaseIdx} variant="glass" className="animate-fade-in" style={{animationDelay: `${(phaseIdx + 2) * 100}ms`}}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {phaseIdx + 2}. {phase.phaseName}
            </h3>
          </div>
          <div className="space-y-4">
            {phase.observations.map((obs, obsIdx) => (
              <div key={obsIdx} className="relative pl-4 border-l-2 border-purple-200 dark:border-purple-800">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-purple-600 rounded-full" />
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-purple-600 dark:text-purple-400">{obs.cue}</h4>
                    {obs.timestamp && (
                      <Badge variant="default" size="sm" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {obs.timestamp}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{obs.observation}</p>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      {obs.implication}
                    </p>
                  </div>
                  {obs.microExpressions && obs.microExpressions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {obs.microExpressions.map((expr, idx) => (
                        <Badge key={idx} variant="purple" size="sm" pill>
                          {expr}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Decision Indicators */}
      <Card variant="gradient" className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {report.analysisPhases.length + 2}. Decision-Read Indicators
          </h3>
        </div>
        <div className="space-y-3">
          {report.decisionIndicators.map((indicator, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl">
              <span className="font-medium text-gray-900 dark:text-gray-100">{indicator.indicator}</span>
              <div className="flex items-center gap-3">
                <Badge 
                  variant={
                    indicator.presence === 'Present' ? 'danger' :
                    indicator.presence === 'Partial' ? 'warning' :
                    'success'
                  }
                >
                  {indicator.presence}
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Weight: {indicator.weight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary Judgment */}
      <Card variant="elevated" className="animate-fade-in bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Summary Judgment</h3>
        </div>
        
        <Alert variant="info" className="mb-6">
          {report.summaryJudgment.overallAssessment}
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Trust Vector</h4>
            <Progress 
              value={report.summaryJudgment.trustVector * 100} 
              variant={
                report.summaryJudgment.trustVector > 0.8 ? 'success' :
                report.summaryJudgment.trustVector > 0.6 ? 'warning' : 'danger'
              }
              showValue
              size="lg"
            />
          </div>
          
          <div className="text-center">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Engagement Level</h4>
            <Badge 
              variant={
                report.summaryJudgment.engagementLevel === 'High' ? 'success' :
                report.summaryJudgment.engagementLevel === 'Moderate' ? 'warning' :
                'danger'
              }
              size="lg"
            >
              {report.summaryJudgment.engagementLevel}
            </Badge>
          </div>
          
          <div className="text-center">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Openness</h4>
            <Badge 
              variant={
                report.summaryJudgment.opennessToNext === 'Excellent' ? 'success' :
                report.summaryJudgment.opennessToNext === 'Good' ? 'info' :
                report.summaryJudgment.opennessToNext === 'Fair' ? 'warning' :
                'danger'
              }
              size="lg"
            >
              {report.summaryJudgment.opennessToNext}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          {report.summaryJudgment.keyFindings.map((finding, idx) => (
            <Card key={idx} variant="default" padding="sm">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {finding.category}
                  </span>
                  <Badge variant="purple" size="sm" className="ml-2">
                    {finding.level}
                  </Badge>
                </div>
                <Progress 
                  value={finding.confidence * 100} 
                  variant="gradient"
                  size="sm"
                  label="Confidence"
                  showValue
                  className="w-32"
                />
              </div>
              {finding.evidence.length > 0 && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Evidence: {finding.evidence.join(', ')}
                </div>
              )}
            </Card>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card variant="glass" className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recommended Actions</h3>
        </div>
        <div className="space-y-4">
          {report.recommendations.map((rec, idx) => (
            <div key={idx} className="group hover:scale-[1.02] transition-transform duration-200">
              <Card variant="elevated" hover>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                      {idx + 1}
                    </span>
                    {rec.action}
                  </h4>
                  <Badge 
                    variant={
                      rec.priority === 'High' ? 'danger' :
                      rec.priority === 'Medium' ? 'warning' :
                      'info'
                    }
                  >
                    {rec.priority} Priority
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Rationale:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{rec.rationale}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Expected Outcome:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{rec.expectedOutcome}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Card>

      {/* Advanced Analysis Sections */}
      {report.signalClusters && report.signalClusters.length > 0 && (
        <Card variant="glass" className="animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Behavioral Signal Clusters</h3>
          </div>
          <div className="space-y-4">
            {report.signalClusters.map((cluster, idx) => (
              <Card key={idx} variant="gradient" padding="sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300">{cluster.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        cluster.significance === 'high' ? 'danger' :
                        cluster.significance === 'medium' ? 'warning' :
                        'info'
                      }
                      size="sm"
                    >
                      {cluster.significance}
                    </Badge>
                    <Badge variant="purple" size="sm">
                      {Math.round(cluster.confidence * 100)}%
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{cluster.interpretation}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="default" size="sm">
                    {cluster.timeWindow.start} - {cluster.timeWindow.end}
                  </Badge>
                  {cluster.signals.map((signal, sIdx) => (
                    <Badge key={sIdx} variant="purple" size="sm" pill>
                      {signal}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {report.stressComfortIndicators && report.stressComfortIndicators.length > 0 && (
        <Card variant="elevated" className="animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Stress & Comfort Analysis</h3>
          </div>
          <div className="space-y-4">
            {report.stressComfortIndicators.map((indicator, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border-l-4 ${
                  indicator.type === 'stress' 
                    ? 'bg-red-50 dark:bg-red-900/10 border-red-500' 
                    : indicator.type === 'comfort' 
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-500'
                    : 'bg-gray-50 dark:bg-gray-900/10 border-gray-500'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className={`font-semibold capitalize ${
                    indicator.type === 'stress' ? 'text-red-700 dark:text-red-400' :
                    indicator.type === 'comfort' ? 'text-green-700 dark:text-green-400' :
                    'text-gray-700 dark:text-gray-400'
                  }`}>
                    {indicator.type} Response
                  </h4>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={indicator.level * 100} 
                      variant={indicator.type === 'stress' ? 'danger' : 'success'}
                      size="sm"
                      showValue
                      className="w-24"
                    />
                    <Badge variant="default" size="sm">
                      {indicator.timeStamp}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Physiological:</span>
                    <div className="text-gray-600 dark:text-gray-400 mt-1">
                      {indicator.physiologicalMarkers.join(', ') || 'None detected'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Behavioral:</span>
                    <div className="text-gray-600 dark:text-gray-400 mt-1">
                      {indicator.behavioralMarkers.join(', ') || 'None detected'}
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant="default" size="sm">
                    Reliability: {Math.round(indicator.reliability * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {report.culturalContext && (
        <Card variant="glass" className="animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Cultural Context</h3>
          </div>
          <Alert variant="success" icon={false}>
            Analysis adjusted for <span className="font-semibold capitalize">{report.culturalContext}</span> cultural norms and behavioral expectations.
          </Alert>
        </Card>
      )}

      {/* Confidence Note */}
      <Card variant="elevated" className="animate-fade-in border-2 border-orange-200 dark:border-orange-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Analysis Confidence</h3>
        </div>
        <Alert variant="warning" icon={false}>
          {report.confidenceNote}
        </Alert>
      </Card>
    </div>
  );
};

const RawDataView: React.FC<{ report: ForensicReportType }> = ({ report }) => {
  return (
    <div className="p-8">
      <Card variant="elevated">
        <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-auto font-mono">
          {JSON.stringify(report, null, 2)}
        </pre>
      </Card>
    </div>
  );
};

const ExportOptionsView: React.FC<{ report: ForensicReportType }> = ({ report }) => {
  const [exportOptions, setExportOptions] = React.useState<ExportOptions>({
    format: 'pdf',
    includeAdvancedAnalysis: true,
    includeRawData: true,
    culturalContext: true,
    confidenceThreshold: 0.5
  });
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async (format: 'pdf' | 'csv' | 'json' | 'markdown') => {
    try {
      setIsExporting(true);
      const options = { ...exportOptions, format };
      const blob = await exportService.exportReport(report, options);
      
      if (format !== 'pdf') {
        const filename = exportService.generateFilename(report, format);
        exportService.downloadBlob(blob, filename);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Export Format Options */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          variant="glass" 
          hover 
          onClick={() => handleExport('pdf')}
          className={`cursor-pointer ${isExporting ? 'opacity-50' : ''}`}
        >
          <div className="text-center">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mx-auto mb-3">
              <Download className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">PDF Report</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Professional formatted</p>
          </div>
        </Card>
        
        <Card 
          variant="glass" 
          hover 
          onClick={() => handleExport('markdown')}
          className={`cursor-pointer ${isExporting ? 'opacity-50' : ''}`}
        >
          <div className="text-center">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl w-fit mx-auto mb-3">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Markdown</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Raw markdown</p>
          </div>
        </Card>
        
        <Card 
          variant="glass" 
          hover 
          onClick={() => handleExport('csv')}
          className={`cursor-pointer ${isExporting ? 'opacity-50' : ''}`}
        >
          <div className="text-center">
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl w-fit mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">CSV Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Structured export</p>
          </div>
        </Card>
        
        <Card 
          variant="glass" 
          hover 
          onClick={() => handleExport('json')}
          className={`cursor-pointer ${isExporting ? 'opacity-50' : ''}`}
        >
          <div className="text-center">
            <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl w-fit mx-auto mb-3">
              <BarChart3 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">JSON Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Complete structure</p>
          </div>
        </Card>
      </div>

      {/* Export Configuration */}
      <Card variant="elevated">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-6">Export Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Include Advanced Analysis</span>
            <button
              onClick={() => setExportOptions(prev => ({ ...prev, includeAdvancedAnalysis: !prev.includeAdvancedAnalysis }))}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                exportOptions.includeAdvancedAnalysis 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-transform absolute top-0.5 ${
                exportOptions.includeAdvancedAnalysis ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Include Raw Data</span>
            <button
              onClick={() => setExportOptions(prev => ({ ...prev, includeRawData: !prev.includeRawData }))}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                exportOptions.includeRawData 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-transform absolute top-0.5 ${
                exportOptions.includeRawData ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Include Cultural Context</span>
            <button
              onClick={() => setExportOptions(prev => ({ ...prev, culturalContext: !prev.culturalContext }))}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                exportOptions.culturalContext 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-transform absolute top-0.5 ${
                exportOptions.culturalContext ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Minimum Confidence Threshold
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={exportOptions.confidenceThreshold}
                onChange={(e) => setExportOptions(prev => ({ ...prev, confidenceThreshold: parseFloat(e.target.value) }))}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <Badge variant="info">
                {Math.round(exportOptions.confidenceThreshold * 100)}%
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Export Status */}
      {isExporting && (
        <Alert variant="info" className="animate-pulse">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
            Generating export...
          </div>
        </Alert>
      )}
    </div>
  );
};

const formatReportAsMarkdown = (report: ForensicReportType): string => {
  let markdown = `# Forensic Body-Language Report\n\n`;
  markdown += `**${report.title}**\n\n`;
  
  // Subjects
  report.subjects.forEach(subject => {
    markdown += `**${subject.label}** (${subject.role}): ${subject.description}\n`;
  });
  markdown += '\n⸻\n\n';

  // Baseline Calibration
  markdown += `## 1. ${report.baselineCalibration.phaseName}\n\n`;
  markdown += `| Cue | Observation | Implication |\n`;
  markdown += `|-----|-------------|-------------|\n`;
  report.baselineCalibration.observations.forEach(obs => {
    markdown += `| ${obs.cue} | ${obs.observation} | ${obs.implication} |\n`;
  });
  markdown += '\n⸻\n\n';

  // Analysis Phases  
  report.analysisPhases.forEach((phase, index) => {
    markdown += `## ${index + 2}. ${phase.phaseName}\n\n`;
    phase.observations.forEach(obs => {
      markdown += `• **${obs.cue}** ${obs.timestamp ? `(≈${obs.timestamp})` : ''}\n`;
      markdown += `  • ${obs.observation}\n`;
      markdown += `  • *Interpretation:* ${obs.implication}\n`;
      if (obs.microExpressions && obs.microExpressions.length > 0) {
        markdown += `  • *Micro-expressions:* ${obs.microExpressions.join(', ')}\n`;
      }
      markdown += '\n';
    });
    markdown += '⸻\n\n';
  });

  // Decision Indicators
  markdown += `## ${report.analysisPhases.length + 2}. Decision-Read Indicators\n\n`;
  markdown += `| Indicator | Presence | Weight |\n`;
  markdown += `|-----------|----------|--------|\n`;
  report.decisionIndicators.forEach(indicator => {
    markdown += `| ${indicator.indicator} | ${indicator.presence} | ${indicator.weight} |\n`;
  });
  markdown += '\n⸻\n\n';

  // Summary Judgment
  markdown += `## Summary Judgment\n\n`;
  markdown += `**${report.summaryJudgment.overallAssessment}**\n\n`;
  report.summaryJudgment.keyFindings.forEach((finding, index) => {
    markdown += `${index + 1}. **${finding.category}:** ${finding.level}\n`;
    if (finding.evidence.length > 0) {
      markdown += `   • Evidence: ${finding.evidence.join(', ')}\n`;
    }
  });
  markdown += '\n';

  // Recommendations
  markdown += `## Recommended Next Moves\n\n`;
  report.recommendations.forEach((rec, index) => {
    markdown += `${index + 1}. **${rec.action}** (${rec.priority} Priority)\n`;
    markdown += `   • *Rationale:* ${rec.rationale}\n`;
    markdown += `   • *Expected Outcome:* ${rec.expectedOutcome}\n\n`;
  });

  // Confidence Note
  markdown += '⸻\n\n';
  markdown += `## Confidence Note\n\n`;
  markdown += report.confidenceNote;

  return markdown;
};

export default ForensicReport;