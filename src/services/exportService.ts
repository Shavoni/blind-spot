import { ForensicReport } from './forensicReportService';

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json' | 'markdown';
  includeAdvancedAnalysis: boolean;
  includeRawData: boolean;
  culturalContext: boolean;
  confidenceThreshold: number;
}

class ExportService {
  async exportReport(report: ForensicReport, options: ExportOptions): Promise<Blob> {
    switch (options.format) {
      case 'pdf':
        return this.exportToPDF(report, options);
      case 'csv':
        return this.exportToCSV(report, options);
      case 'json':
        return this.exportToJSON(report, options);
      case 'markdown':
        return this.exportToMarkdown(report, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  private async exportToPDF(report: ForensicReport, options: ExportOptions): Promise<Blob> {
    // Generate comprehensive HTML for PDF conversion
    const htmlContent = this.generatePDFHTML(report, options);
    
    // Create a new window with the HTML content and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then trigger print
      printWindow.onload = () => {
        printWindow.print();
        // Close the window after a delay to ensure print dialog appears
        setTimeout(() => printWindow.close(), 1000);
      };
    }
    
    // Return a blob for consistency with other export methods
    const blob = new Blob([htmlContent], { type: 'text/html' });
    return blob;
  }

  private exportToCSV(report: ForensicReport, options: ExportOptions): Promise<Blob> {
    const csvData = this.generateCSVData(report, options);
    const blob = new Blob([csvData], { type: 'text/csv' });
    return Promise.resolve(blob);
  }

  private exportToJSON(report: ForensicReport, options: ExportOptions): Promise<Blob> {
    const filteredReport = this.filterReportForExport(report, options);
    const jsonData = JSON.stringify(filteredReport, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    return Promise.resolve(blob);
  }

  private exportToMarkdown(report: ForensicReport, options: ExportOptions): Promise<Blob> {
    const markdownContent = this.generateMarkdownContent(report, options);
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    return Promise.resolve(blob);
  }

  private generatePDFHTML(report: ForensicReport, options: ExportOptions): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Forensic Body-Language Report</title>
        <style>
            body { 
                font-family: 'Arial', sans-serif; 
                line-height: 1.6; 
                color: #333; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px;
            }
            .header { 
                text-align: center; 
                border-bottom: 3px solid #2563eb; 
                padding-bottom: 20px; 
                margin-bottom: 30px;
            }
            .section { 
                margin-bottom: 30px; 
                page-break-inside: avoid;
            }
            .section-title { 
                color: #1e40af; 
                font-size: 18px; 
                font-weight: bold; 
                margin-bottom: 15px;
                border-left: 4px solid #3b82f6;
                padding-left: 10px;
            }
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 20px;
            }
            th, td { 
                border: 1px solid #d1d5db; 
                padding: 10px; 
                text-align: left;
            }
            th { 
                background-color: #f3f4f6; 
                font-weight: bold;
            }
            .confidence-high { color: #059669; font-weight: bold; }
            .confidence-medium { color: #d97706; font-weight: bold; }
            .confidence-low { color: #dc2626; font-weight: bold; }
            .insight-box { 
                background-color: #f0f9ff; 
                border: 1px solid #0ea5e9; 
                padding: 15px; 
                border-radius: 5px; 
                margin: 10px 0;
            }
            .cluster-box {
                background-color: #faf5ff;
                border: 1px solid #8b5cf6;
                padding: 12px;
                border-radius: 5px;
                margin: 8px 0;
            }
            .stress-indicator {
                background-color: #fef2f2;
                border-left: 4px solid #ef4444;
                padding: 10px;
                margin: 5px 0;
            }
            .comfort-indicator {
                background-color: #f0fdf4;
                border-left: 4px solid #22c55e;
                padding: 10px;
                margin: 5px 0;
            }
            .page-break { page-break-before: always; }
            @media print {
                body { 
                    margin: 0;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .no-print { display: none; }
                .page-break { page-break-before: always; }
                @page {
                    margin: 1cm;
                    size: A4;
                }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Forensic Body-Language Report</h1>
            <h2>${report.title}</h2>
            <p>Generated: ${new Date(report.timestamp).toLocaleString()}</p>
            ${report.culturalContext ? `<p><strong>Cultural Context:</strong> ${report.culturalContext}</p>` : ''}
        </div>

        <div class="section">
            <h2 class="section-title">Executive Summary</h2>
            <p><strong>${report.summaryJudgment.overallAssessment}</strong></p>
            <div style="display: flex; gap: 20px; margin: 20px 0;">
                <div>
                    <strong>Trust Vector:</strong> 
                    <span class="${this.getConfidenceClass(report.summaryJudgment.trustVector)}">
                        ${Math.round(report.summaryJudgment.trustVector * 100)}%
                    </span>
                </div>
                <div>
                    <strong>Engagement:</strong> ${report.summaryJudgment.engagementLevel}
                </div>
                <div>
                    <strong>Openness:</strong> ${report.summaryJudgment.opennessToNext}
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Subjects</h2>
            ${report.subjects.map(subject => `
                <p><strong>${subject.label}</strong> (${subject.role}): ${subject.description}</p>
            `).join('')}
        </div>

        <div class="section page-break">
            <h2 class="section-title">Baseline Calibration</h2>
            <table>
                <thead>
                    <tr>
                        <th>Cue</th>
                        <th>Observation</th>
                        <th>Implication</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.baselineCalibration.observations.map(obs => `
                        <tr>
                            <td><strong>${obs.cue}</strong></td>
                            <td>${obs.observation}</td>
                            <td>${obs.implication}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        ${report.analysisPhases.map((phase, idx) => `
            <div class="section ${idx === 0 ? 'page-break' : ''}">
                <h2 class="section-title">${idx + 2}. ${phase.phaseName}</h2>
                ${phase.observations.map(obs => `
                    <div style="margin-bottom: 15px; padding: 10px; border-left: 3px solid #6366f1;">
                        <h4 style="color: #4f46e5; margin-bottom: 5px;">
                            ${obs.cue} ${obs.timestamp ? `(${obs.timestamp})` : ''}
                        </h4>
                        <p style="margin-bottom: 5px;"><strong>Observation:</strong> ${obs.observation}</p>
                        <p style="margin-bottom: 5px;"><strong>Interpretation:</strong> ${obs.implication}</p>
                        <p style="font-size: 12px; color: #6b7280;">
                            Confidence: ${Math.round(obs.confidence * 100)}%
                            ${obs.apiSource ? ` | Source: ${obs.apiSource}` : ''}
                        </p>
                        ${obs.microExpressions && obs.microExpressions.length > 0 ? `
                            <p style="font-size: 12px; color: #7c3aed;">
                                <strong>Micro-expressions:</strong> ${obs.microExpressions.join(', ')}
                            </p>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `).join('')}

        ${options.includeAdvancedAnalysis && report.signalClusters && report.signalClusters.length > 0 ? `
            <div class="section page-break">
                <h2 class="section-title">Behavioral Signal Clusters</h2>
                ${report.signalClusters.map(cluster => `
                    <div class="cluster-box">
                        <h4 style="color: #8b5cf6; margin-bottom: 8px;">
                            ${cluster.name} 
                            <span style="font-size: 12px; color: #6b7280;">
                                (${cluster.significance} significance, ${Math.round(cluster.confidence * 100)}% confidence)
                            </span>
                        </h4>
                        <p style="margin-bottom: 8px;">${cluster.interpretation}</p>
                        <p style="font-size: 12px; color: #6b7280;">
                            <strong>Time Window:</strong> ${cluster.timeWindow.start} - ${cluster.timeWindow.end}<br>
                            <strong>Signals:</strong> ${cluster.signals.join(', ')}
                        </p>
                    </div>
                `).join('')}
            </div>
        ` : ''}

        ${options.includeAdvancedAnalysis && report.stressComfortIndicators && report.stressComfortIndicators.length > 0 ? `
            <div class="section page-break">
                <h2 class="section-title">Stress & Comfort Analysis</h2>
                ${report.stressComfortIndicators.map(indicator => `
                    <div class="${indicator.type === 'stress' ? 'stress-indicator' : 'comfort-indicator'}">
                        <h4 style="margin-bottom: 8px; text-transform: capitalize;">
                            ${indicator.type} Response (${Math.round(indicator.level * 100)}%) @ ${indicator.timeStamp}
                        </h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                            <div>
                                <strong>Physiological:</strong><br>
                                ${indicator.physiologicalMarkers.join(', ') || 'None detected'}
                            </div>
                            <div>
                                <strong>Behavioral:</strong><br>
                                ${indicator.behavioralMarkers.join(', ') || 'None detected'}
                            </div>
                        </div>
                        <p style="font-size: 12px; color: #6b7280; margin-top: 8px;">
                            Reliability: ${Math.round(indicator.reliability * 100)}%
                        </p>
                    </div>
                `).join('')}
            </div>
        ` : ''}

        ${report.advancedInsights && report.advancedInsights.length > 0 ? `
            <div class="section page-break">
                <h2 class="section-title">Advanced Behavioral Insights</h2>
                ${report.advancedInsights.map(insight => `
                    <div class="insight-box">
                        <p>${insight}</p>
                    </div>
                `).join('')}
            </div>
        ` : ''}

        <div class="section page-break">
            <h2 class="section-title">Decision Indicators</h2>
            <table>
                <thead>
                    <tr>
                        <th>Indicator</th>
                        <th>Presence</th>
                        <th>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.decisionIndicators.map(indicator => `
                        <tr>
                            <td>${indicator.indicator}</td>
                            <td>
                                <span style="
                                    padding: 2px 8px; 
                                    border-radius: 3px; 
                                    font-size: 12px;
                                    background-color: ${indicator.presence === 'Present' ? '#fef2f2' : 
                                                      indicator.presence === 'Partial' ? '#fef3c7' : '#f0fdf4'};
                                    color: ${indicator.presence === 'Present' ? '#dc2626' : 
                                            indicator.presence === 'Partial' ? '#d97706' : '#059669'};
                                ">
                                    ${indicator.presence}
                                </span>
                            </td>
                            <td>${indicator.weight}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2 class="section-title">Recommendations</h2>
            ${report.recommendations.map((rec, idx) => `
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #d1d5db; border-radius: 5px;">
                    <h4 style="color: #1e40af; margin-bottom: 8px;">
                        ${idx + 1}. ${rec.action}
                        <span style="
                            font-size: 12px; 
                            padding: 2px 6px; 
                            border-radius: 3px; 
                            margin-left: 10px;
                            background-color: ${rec.priority === 'High' ? '#fef2f2' : rec.priority === 'Medium' ? '#fef3c7' : '#eff6ff'};
                            color: ${rec.priority === 'High' ? '#dc2626' : rec.priority === 'Medium' ? '#d97706' : '#2563eb'};
                        ">
                            ${rec.priority} Priority
                        </span>
                    </h4>
                    <p style="margin-bottom: 8px;"><strong>Rationale:</strong> ${rec.rationale}</p>
                    <p><strong>Expected Outcome:</strong> ${rec.expectedOutcome}</p>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h2 class="section-title">Methodology & Confidence</h2>
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 5px;">
                <p>${report.confidenceNote}</p>
            </div>
        </div>

        <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #d1d5db; font-size: 12px; color: #6b7280; text-align: center;">
            <p>Generated by Blindspots Forensic Analysis System | ${new Date().toLocaleString()}</p>
            <p>This report contains advanced behavioral analysis based on multiple AI services and cultural context adjustments.</p>
        </footer>
    </body>
    </html>
    `;
  }

  private generateCSVData(report: ForensicReport, options: ExportOptions): string {
    const rows: string[] = [];
    
    // Header
    rows.push([
      'Section',
      'Timestamp',
      'Element',
      'Observation',
      'Interpretation',
      'Confidence',
      'API_Source',
      'Micro_Expressions',
      'Significance'
    ].join(','));

    // Baseline data
    report.baselineCalibration.observations.forEach(obs => {
      rows.push([
        'Baseline',
        '',
        this.escapeCSV(obs.cue),
        this.escapeCSV(obs.observation),
        this.escapeCSV(obs.implication),
        Math.round(obs.confidence * 100).toString(),
        obs.apiSource || '',
        obs.microExpressions?.join(';') || '',
        ''
      ].join(','));
    });

    // Analysis phases
    report.analysisPhases.forEach(phase => {
      phase.observations.forEach(obs => {
        rows.push([
          this.escapeCSV(phase.phaseName),
          obs.timestamp || '',
          this.escapeCSV(obs.cue),
          this.escapeCSV(obs.observation),
          this.escapeCSV(obs.implication),
          Math.round(obs.confidence * 100).toString(),
          obs.apiSource || '',
          obs.microExpressions?.join(';') || '',
          ''
        ].join(','));
      });
    });

    // Signal clusters (if included)
    if (options.includeAdvancedAnalysis && report.signalClusters) {
      report.signalClusters.forEach(cluster => {
        rows.push([
          'Signal_Cluster',
          `${cluster.timeWindow.start}-${cluster.timeWindow.end}`,
          this.escapeCSV(cluster.name),
          this.escapeCSV(cluster.signals.join('; ')),
          this.escapeCSV(cluster.interpretation),
          Math.round(cluster.confidence * 100).toString(),
          '',
          '',
          cluster.significance
        ].join(','));
      });
    }

    // Stress/Comfort indicators (if included)
    if (options.includeAdvancedAnalysis && report.stressComfortIndicators) {
      report.stressComfortIndicators.forEach(indicator => {
        rows.push([
          `${indicator.type}_Indicator`,
          indicator.timeStamp,
          `${indicator.type}_Response`,
          this.escapeCSV(indicator.behavioralMarkers.join('; ')),
          `Level: ${Math.round(indicator.level * 100)}%`,
          Math.round(indicator.reliability * 100).toString(),
          '',
          '',
          ''
        ].join(','));
      });
    }

    return rows.join('\n');
  }

  private generateMarkdownContent(report: ForensicReport, options: ExportOptions): string {
    let markdown = `# Forensic Body-Language Report\n\n`;
    markdown += `**${report.title}**\n\n`;
    markdown += `*Generated: ${new Date(report.timestamp).toLocaleString()}*\n\n`;
    
    if (report.culturalContext) {
      markdown += `**Cultural Context:** ${report.culturalContext}\n\n`;
    }

    // Executive Summary
    markdown += `## Executive Summary\n\n`;
    markdown += `${report.summaryJudgment.overallAssessment}\n\n`;
    markdown += `- **Trust Vector:** ${Math.round(report.summaryJudgment.trustVector * 100)}%\n`;
    markdown += `- **Engagement Level:** ${report.summaryJudgment.engagementLevel}\n`;
    markdown += `- **Openness to Next Steps:** ${report.summaryJudgment.opennessToNext}\n\n`;

    // Subjects
    markdown += `## Subjects\n\n`;
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
        markdown += `### ${obs.cue} ${obs.timestamp ? `(≈${obs.timestamp})` : ''}\n\n`;
        markdown += `**Observation:** ${obs.observation}\n\n`;
        markdown += `**Interpretation:** ${obs.implication}\n\n`;
        markdown += `**Confidence:** ${Math.round(obs.confidence * 100)}%`;
        if (obs.apiSource) {
          markdown += ` | **Source:** ${obs.apiSource}`;
        }
        markdown += '\n\n';
        if (obs.microExpressions && obs.microExpressions.length > 0) {
          markdown += `**Micro-expressions:** ${obs.microExpressions.join(', ')}\n\n`;
        }
      });
      markdown += '---\n\n';
    });

    // Advanced Analysis (if included)
    if (options.includeAdvancedAnalysis) {
      if (report.signalClusters && report.signalClusters.length > 0) {
        markdown += `## Behavioral Signal Clusters\n\n`;
        report.signalClusters.forEach(cluster => {
          markdown += `### ${cluster.name}\n\n`;
          markdown += `**Interpretation:** ${cluster.interpretation}\n\n`;
          markdown += `**Significance:** ${cluster.significance} | **Confidence:** ${Math.round(cluster.confidence * 100)}%\n\n`;
          markdown += `**Time Window:** ${cluster.timeWindow.start} - ${cluster.timeWindow.end}\n\n`;
          markdown += `**Signals:** ${cluster.signals.join(', ')}\n\n`;
          markdown += '---\n\n';
        });
      }

      if (report.stressComfortIndicators && report.stressComfortIndicators.length > 0) {
        markdown += `## Stress & Comfort Analysis\n\n`;
        report.stressComfortIndicators.forEach(indicator => {
          markdown += `### ${indicator.type.charAt(0).toUpperCase() + indicator.type.slice(1)} Response (${Math.round(indicator.level * 100)}%) @ ${indicator.timeStamp}\n\n`;
          markdown += `**Physiological Markers:** ${indicator.physiologicalMarkers.join(', ') || 'None detected'}\n\n`;
          markdown += `**Behavioral Markers:** ${indicator.behavioralMarkers.join(', ') || 'None detected'}\n\n`;
          markdown += `**Reliability:** ${Math.round(indicator.reliability * 100)}%\n\n`;
          markdown += '---\n\n';
        });
      }

      if (report.advancedInsights && report.advancedInsights.length > 0) {
        markdown += `## Advanced Behavioral Insights\n\n`;
        report.advancedInsights.forEach(insight => {
          markdown += `- ${insight}\n`;
        });
        markdown += '\n---\n\n';
      }
    }

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
      markdown += `   - **Rationale:** ${rec.rationale}\n`;
      markdown += `   - **Expected Outcome:** ${rec.expectedOutcome}\n\n`;
    });

    // Confidence Note
    markdown += '---\n\n';
    markdown += `## Confidence Note\n\n`;
    markdown += report.confidenceNote;

    return markdown;
  }

  private filterReportForExport(report: ForensicReport, options: ExportOptions): any {
    const filtered: any = { ...report };

    if (!options.includeAdvancedAnalysis) {
      delete filtered.baselineBehavior;
      delete filtered.signalClusters;
      delete filtered.temporalPatterns;
      delete filtered.stressComfortIndicators;
      delete filtered.advancedInsights;
    }

    if (!options.includeRawData) {
      // Remove low-confidence observations
      filtered.baselineCalibration.observations = filtered.baselineCalibration.observations
        .filter((obs: any) => obs.confidence >= options.confidenceThreshold);
      
      filtered.analysisPhases = filtered.analysisPhases.map((phase: any) => ({
        ...phase,
        observations: phase.observations.filter((obs: any) => obs.confidence >= options.confidenceThreshold)
      }));
    }

    if (!options.culturalContext) {
      delete filtered.culturalContext;
    }

    return filtered;
  }

  private escapeCSV(str: string): string {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  private getConfidenceClass(confidence: number): string {
    if (confidence > 0.8) return 'confidence-high';
    if (confidence > 0.6) return 'confidence-medium';
    return 'confidence-low';
  }

  // Utility method to trigger download
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Method to generate appropriate filename
  generateFilename(report: ForensicReport, format: string): string {
    const date = new Date(report.timestamp).toISOString().split('T')[0];
    const context = report.title.toLowerCase().replace(/\s+/g, '-');
    return `forensic-report-${context}-${date}.${format}`;
  }
}

export const exportService = new ExportService();