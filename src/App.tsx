
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Play, Pause, Settings, FileText, TrendingUp, AlertTriangle, Eye, Users, Shield, Database, GitBranch, Terminal, HelpCircle, BookOpen, Lightbulb, MessageCircle, Download, FileSpreadsheet, CheckCircle, Menu, X } from 'lucide-react';
import { analysisEngine, AnalysisResult } from './services/analysisEngine';
import { mediaService } from './services/mediaService';
import { forensicReportService, ForensicReport as ForensicReportType } from './services/forensicReportService';
import { exportService } from './services/exportService';
import ForensicReport from './components/ForensicReport';
import CohesiveReport from './components/CohesiveReport';
import { enhanceAnalysisWithDemoData } from './demo/forensicReportDemo';


const Blindspots = () => {
  const [activeMode, setActiveMode] = useState('live');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSavingReport, setIsSavingReport] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [contextPreset, setContextPreset] = useState('meeting');
  const [apiStatus, setApiStatus] = useState({
    openai: false,
    anthropic: false,
    google: false,
    claudeCode: false
  });
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<string | null>(null);
  const [showScenarioDetails, setShowScenarioDetails] = useState(false);
  const [showLearningPanel, setShowLearningPanel] = useState(false);
  const [textBasedInput, setTextBasedInput] = useState('');
  const [showTextMode, setShowTextMode] = useState(false);
  const [hoveredSignal, setHoveredSignal] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showForensicReport, setShowForensicReport] = useState(false);
  const [forensicReport, setForensicReport] = useState<ForensicReportType | null>(null);
  const [culturalContext, setCulturalContext] = useState('western');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);


  const contextPresets = [
    { id: 'meeting', name: 'Business Meeting', icon: Users, prompt: 'Analyze professional meeting dynamics and engagement levels' },
    { id: 'interview', name: 'Job Interview', icon: FileText, prompt: 'Evaluate interview performance and candidate authenticity' },
    { id: 'presentation', name: 'Presentation/Pitch', icon: TrendingUp, prompt: 'Analyze presentation effectiveness and audience engagement' },
    { id: 'negotiation', name: 'Negotiation', icon: Shield, prompt: 'Detect negotiation tactics and power dynamics' },
    { id: 'date', name: 'Personal/Dating', icon: Eye, prompt: 'Analyze attraction, interest, and compatibility signals' },
    { id: 'therapy', name: 'Counseling/Therapy', icon: TrendingUp, prompt: 'Monitor therapeutic progress and emotional state' },
    { id: 'sales', name: 'Sales Call', icon: TrendingUp, prompt: 'Analyze buyer interest and closing readiness' },
    { id: 'training', name: 'Training/Practice', icon: Lightbulb, prompt: 'General body language practice and improvement' }
  ];

  // Educational content and tooltips
  const signalExplanations = {
    'facial_expression': {
      title: 'Facial Expression Analysis',
      description: 'Micro-expressions reveal genuine emotions and intentions, often contradicting verbal communication.',
      indicators: ['Eyebrow flashes', 'Lip compression', 'Eye crinkles', 'Nostril flares'],
      goodSigns: ['Genuine smiles (Duchenne)', 'Relaxed eyebrows', 'Consistent expressions'],
      warnings: ['Forced smiles', 'Eye blocking', 'Asymmetrical expressions'],
      tips: 'Practice genuine expressions in the mirror. Micro-expressions last 1/25th of a second.'
    },
    'posture': {
      title: 'Posture & Body Position',
      description: 'Body positioning reveals confidence, openness, and engagement levels.',
      indicators: ['Shoulder alignment', 'Spine straightness', 'Hip positioning', 'Stance width'],
      goodSigns: ['Open chest', 'Relaxed shoulders', 'Balanced weight distribution'],
      warnings: ['Closed-off positions', 'Slouching', 'Defensive stances'],
      tips: 'Stand tall with shoulders back. Imagine a string pulling you up from the crown of your head.'
    },
    'gestures': {
      title: 'Hand & Arm Gestures',
      description: 'Gesture patterns indicate emphasis, honesty, and emotional state.',
      indicators: ['Palm orientation', 'Gesture size', 'Hand placement', 'Movement fluidity'],
      goodSigns: ['Open palms', 'Purposeful gestures', 'Natural rhythm'],
      warnings: ['Hidden hands', 'Excessive fidgeting', 'Incongruent gestures'],
      tips: 'Keep gestures within the "box" between your shoulders and waist. Use open palm positions.'
    },
    'eye_movement': {
      title: 'Eye Contact & Gaze Patterns',
      description: 'Eye movements reveal attention, memory access, and emotional responses.',
      indicators: ['Gaze direction', 'Blink rate', 'Pupil dilation', 'Eye contact duration'],
      goodSigns: ['Steady eye contact', 'Natural blink rate', 'Engaged looking'],
      warnings: ['Excessive blinking', 'Gaze avoidance', 'Rapid eye movements'],
      tips: 'Maintain eye contact 50-70% of the time. Look at the triangle between eyes and mouth.'
    },
    'voice_tone': {
      title: 'Voice & Vocal Patterns',
      description: 'Vocal characteristics reveal emotional state, confidence, and authenticity.',
      indicators: ['Pitch variations', 'Speaking pace', 'Volume changes', 'Vocal tremor'],
      goodSigns: ['Steady pace', 'Clear articulation', 'Natural pitch'],
      warnings: ['Vocal strain', 'Rapid speech', 'Monotone delivery'],
      tips: 'Breathe deeply before speaking. Match your vocal energy to your message importance.'
    }
  };

  const learningResources = {
    faqs: [
      {
        question: "How accurate is body language analysis?",
        answer: "Body language analysis is most accurate when combined with context, baseline behavior, and multiple signals. Individual gestures should never be interpreted in isolation."
      },
      {
        question: "Can people fake body language?",
        answer: "While some body language can be controlled, micro-expressions and subtle physiological responses are very difficult to fake consistently."
      },
      {
        question: "What's the most important thing to focus on?",
        answer: "Establish a baseline first, then look for clusters of signals rather than individual gestures. Context is everything."
      },
      {
        question: "How can I improve my own body language?",
        answer: "Practice in low-stakes situations, record yourself, and focus on one aspect at a time. Authenticity is more important than perfection."
      }
    ],
    bestPractices: [
      "Always establish a baseline behavior before making interpretations",
      "Look for clusters of signals, not individual gestures",
      "Consider cultural and personal differences",
      "Focus on changes from baseline rather than absolute positions",
      "Practice active observation in everyday interactions",
      "Remember that context is crucial for accurate interpretation"
    ],
    quickTips: [
      "Mirror the other person's energy level to build rapport",
      "Use the 'steeple' hand position to project confidence",
      "Lean in slightly when someone is speaking to show interest",
      "Keep your torso facing the person you're speaking with",
      "Use purposeful pauses instead of filler words",
      "Practice power poses for 2 minutes before important meetings"
    ]
  };

  // Initialize all connections
  useEffect(() => {
    initializeConnections();
  }, []);

  // Initialize camera when switching to live mode
  useEffect(() => {
    const initializeCamera = async () => {
      if (activeMode === 'live' && !cameraStream && !isAnalyzing) {
        try {
          const cameraInitialized = await mediaService.initializeCamera();
          if (cameraInitialized) {
            const stream = mediaService.getStream();
            setCameraStream(stream);
            
            // Set video element source
            if (videoRef.current && stream) {
              videoRef.current.srcObject = stream;
            }
          }
        } catch (error) {
          console.warn('Camera preview initialization failed:', error);
        }
      } else if (activeMode === 'upload' && cameraStream) {
        // Clean up camera when switching to upload mode
        setCameraStream(null);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        mediaService.cleanup();
      }
    };

    initializeCamera();
  }, [activeMode, cameraStream, isAnalyzing]);

  // Cleanup effect for component unmount
  useEffect(() => {
    const videoElement = videoRef.current;
    
    return () => {
      // Clean up camera resources on unmount
      if (videoElement) {
        videoElement.srcObject = null;
      }
      mediaService.cleanup();
    };
  }, []);

  // Mode change handler with proper cleanup
  const handleModeChange = (newMode: string) => {
    if (newMode !== activeMode) {
      // Stop any ongoing analysis
      if (isAnalyzing) {
        stopLiveAnalysis();
      }
      
      // Clean up camera when switching away from live mode
      if (activeMode === 'live' && newMode !== 'live') {
        setCameraStream(null);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        mediaService.cleanup();
      }
      
      setActiveMode(newMode);
      
      // Close mobile sidebar when mode is selected
      setShowMobileSidebar(false);
      
      // If switching to upload mode, trigger file input
      if (newMode === 'upload') {
        setTimeout(() => fileInputRef.current?.click(), 100);
      }
    }
  };

  // Helper functions for error/success messages
  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const initializeConnections = async () => {
    try {
      setIsInitializing(true);
      console.log('🚀 Initializing Blindspots connections...');
      const serviceStatus = await analysisEngine.initializeServices();
      
      // Update connection states
      
      setApiStatus({
        openai: serviceStatus.openai,
        anthropic: serviceStatus.anthropic,
        google: serviceStatus.google || serviceStatus.googleVideo,
        claudeCode: serviceStatus.claudeCode
      });
      
      console.log('✅ All services initialized');
      showSuccess('Services initialized successfully');
    } catch (error) {
      console.error('❌ Service initialization failed:', error);
      showError('Failed to initialize services. Some features may be limited.');
    } finally {
      setIsInitializing(false);
    }
  };

  // Start live analysis
  const startLiveAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      
      // Camera should already be initialized, just start the analysis engine
      const result = await analysisEngine.startLiveAnalysis(contextPreset);
      
      if (!result.success) {
        throw new Error('Failed to start live analysis');
      }
      
      console.log('🔴 Live analysis started:', result.sessionId);
      showSuccess('Live analysis started');
    } catch (error) {
      console.error('❌ Failed to start live analysis:', error);
      showError('Failed to start analysis. Please check camera permissions.');
      setIsAnalyzing(false);
    }
  };

  // Stop live analysis
  const stopLiveAnalysis = async () => {
    try {
      const result = await analysisEngine.stopLiveAnalysis();
      
      if (result) {
        setAnalysisData(result);
        console.log('⏹️ Live analysis completed');
      }
      
      setIsAnalyzing(false);
      showSuccess('Analysis completed');
    } catch (error) {
      console.error('❌ Failed to stop live analysis:', error);
      showError('Failed to stop analysis properly');
      setIsAnalyzing(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsProcessingFile(true);
      setIsAnalyzing(true);
      console.log('📁 Processing uploaded file:', file.name);
      
      // Process file and get preview
      const processedFile = await mediaService.processUploadedFile(file);
      setUploadedFilePreview(processedFile.preview || null);
      setUploadedFileType(processedFile.type);
      
      const result = await analysisEngine.analyzeUploadedMedia(file, contextPreset);
      
      if (result) {
        setAnalysisData(result);
        console.log('✅ File analysis completed');
      }
      showSuccess('File analyzed successfully');
    } catch (error) {
      console.error('❌ File analysis failed:', error);
      showError('Failed to analyze file. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setIsProcessingFile(false);
    }
  };

  // Toggle analysis
  const toggleAnalysis = () => {
    if (isAnalyzing) {
      stopLiveAnalysis();
    } else {
      if (activeMode === 'live') {
        startLiveAnalysis();
      } else {
        fileInputRef.current?.click();
      }
    }
  };

  // Clear analysis data
  const clearAnalysis = () => {
    setAnalysisData(null);
    setIsAnalyzing(false);
    setUploadedFilePreview(null);
    setUploadedFileType(null);
    
    // Clean up camera if not analyzing
    if (!isAnalyzing && activeMode === 'live') {
      setCameraStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      mediaService.cleanup();
    }
    // Don't clear camera stream unless switching modes
  };

  // Handle text-based analysis
  const handleTextAnalysis = async () => {
    if (!textBasedInput.trim()) return;
    
    try {
      setIsAnalyzing(true);
      console.log('📝 Processing text-based analysis:', textBasedInput);
      
      // Use OpenAI for text analysis
      const textAnalysis = await analysisEngine.analyzeTextInput(textBasedInput, contextPreset);
      
      if (textAnalysis) {
        setAnalysisData(textAnalysis);
        console.log('✅ Text analysis completed');
      }
    } catch (error) {
      console.error('❌ Text analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate forensic report
  const generateForensicReport = async () => {
    if (!analysisData) return;
    
    try {
      console.log('📊 Generating forensic report...');
      
      // Enhance analysis data with demo data for richer reports
      const enhancedData = enhanceAnalysisWithDemoData(analysisData);
      
      const subjects = contextPreset === 'presentation' ? [
        {
          id: 'pitcher',
          label: 'Subject A (Pitcher)',
          description: 'Presenter — demonstrating business concept or proposal',
          role: 'Presenter'
        },
        {
          id: 'evaluator',
          label: 'Subject B (Evaluator)', 
          description: 'Evaluator — assessing proposal and presenter credibility',
          role: 'Evaluator'
        }
      ] : [{
        id: 'subject-a',
        label: 'Subject A',
        description: 'Primary individual being analyzed',
        role: 'Primary Subject'
      }];
      
      const report = await forensicReportService.generateForensicReport(
        enhancedData,
        contextPreset,
        subjects,
        culturalContext
      );
      
      setForensicReport(report);
      setShowForensicReport(true);
      console.log('✅ Forensic report generated');
    } catch (error) {
      console.error('❌ Failed to generate forensic report:', error);
    }
  };

  // Export analysis data
  const exportAnalysisData = async (format: 'json' | 'csv' | 'pdf') => {
    if (!analysisData) return;
    
    try {
      console.log(`📤 Exporting analysis data as ${format.toUpperCase()}...`);
      
      // Generate forensic report first if not already done
      const enhancedData = enhanceAnalysisWithDemoData(analysisData);
      const subjects = contextPreset === 'presentation' ? [
        {
          id: 'pitcher',
          label: 'Subject A (Pitcher)',
          description: 'Presenter — demonstrating business concept or proposal',
          role: 'Presenter'
        },
        {
          id: 'evaluator',
          label: 'Subject B (Evaluator)', 
          description: 'Evaluator — assessing proposal and presenter credibility',
          role: 'Evaluator'
        }
      ] : [{
        id: 'subject-a',
        label: 'Subject A',
        description: 'Primary individual being analyzed',
        role: 'Primary Subject'
      }];
      
      const report = await forensicReportService.generateForensicReport(
        enhancedData,
        contextPreset,
        subjects,
        culturalContext
      );
      
      // Export options
      const exportOptions = {
        format: format as 'pdf' | 'csv' | 'json' | 'markdown',
        includeAdvancedAnalysis: true,
        includeRawData: true,
        culturalContext: true,
        confidenceThreshold: 0.5
      };
      
      const blob = await exportService.exportReport(report, exportOptions);
      const filename = exportService.generateFilename(report, format);
      exportService.downloadBlob(blob, filename);
      
      console.log(`✅ Analysis exported as ${format.toUpperCase()}: ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to export as ${format.toUpperCase()}:`, error);
    }
  };


  // Legacy function - replaced by toggleAnalysis
  const startAnalysis = () => {
    toggleAnalysis();
  };

  const stopAnalysis = () => {
    if (isAnalyzing) {
      stopLiveAnalysis();
    } else {
      clearAnalysis();
    }
  };


  // Component definitions remain the same but with enhanced data...

  const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  );

  const Toast = ({ message, type, onClose }: { message: string; type: 'error' | 'success'; onClose: () => void }) => (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md animate-slide-up ${
      type === 'error' ? 'bg-red-900 border border-red-700' : 'bg-green-900 border border-green-700'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        type === 'error' ? 'bg-red-800' : 'bg-green-800'
      }`}>
        {type === 'error' ? (
          <AlertTriangle className="w-4 h-4 text-red-400" />
        ) : (
          <CheckCircle className="w-4 h-4 text-green-400" />
        )}
      </div>
      <p className="flex-1 text-sm text-white">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white"
      >
        ×
      </button>
    </div>
  );

  const SignalIndicator = ({ signal, data }: { signal: string; data: any }) => {
    // Ensure indicators is always an array of strings
    const indicators = Array.isArray(data?.indicators) ? data.indicators : ['No data'];
    const confidence = data?.confidence || 0;
    const apiSource = data?.apiSource || 'unknown';
    const explanation = signalExplanations[signal as keyof typeof signalExplanations];

    return (
      <div 
        id={`signal-indicator-${signal}`} 
        className="bg-gray-800 p-3 rounded-lg border border-gray-700 relative"
        onMouseEnter={() => setHoveredSignal(signal)}
        onMouseLeave={() => setHoveredSignal(null)}
      >
        <div id={`signal-indicator-${signal}-header`} className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <h4 id={`signal-indicator-${signal}-title`} className="text-sm font-semibold text-cyan-400 capitalize">{signal.replace(/_/g, ' ')}</h4>
            <HelpCircle className="w-3 h-3 text-gray-500 cursor-help" />
          </div>
          <span id={`signal-indicator-${signal}-confidence`} className="text-xs text-gray-400">{Math.round(confidence * 100)}%</span>
        </div>

        {/* Educational Tooltip */}
        {hoveredSignal === signal && explanation && (
          <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-gray-900 border border-cyan-500 rounded-lg p-4 shadow-xl">
            <h5 className="text-sm font-semibold text-cyan-400 mb-2">{explanation.title}</h5>
            <p className="text-xs text-gray-300 mb-3">{explanation.description}</p>
            
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div>
                <span className="text-green-400 font-medium">Good Signs:</span>
                <ul className="list-disc list-inside text-gray-400 ml-2">
                  {explanation.goodSigns.map((sign, idx) => (
                    <li key={idx}>{sign}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-red-400 font-medium">Warning Signs:</span>
                <ul className="list-disc list-inside text-gray-400 ml-2">
                  {explanation.warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-900/30 p-2 rounded mt-2">
                <span className="text-blue-400 font-medium">💡 Pro Tip:</span>
                <p className="text-gray-300 mt-1">{explanation.tips}</p>
              </div>
            </div>
          </div>
        )}

        <div id={`signal-indicator-${signal}-indicators`} className="space-y-1">
          {indicators.map((indicator: any, idx: number) => (
            <div key={idx} id={`signal-indicator-${signal}-item-${idx}`} className="text-xs text-gray-300 flex items-center">
              <div id={`signal-indicator-${signal}-dot-${idx}`} className="w-2 h-2 bg-cyan-500 rounded-full mr-2" />
              {String(indicator).replace(/[-_]/g, ' ')}
            </div>
          ))}
          <div className="text-xs text-gray-500 mt-1">
            API: {apiSource}
          </div>
        </div>
      </div>
    );
  };

  const AlertItem = ({ alert, index }: { alert: any; index: number }) => (
    <div id={`alert-item-${index}`} className={`p-3 rounded-lg border-l-4 ${
      alert.severity === 'high' ? 'border-red-500 bg-red-900/20' :
      alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-900/20' :
      'border-blue-500 bg-blue-900/20'
    }`}>
      <div id={`alert-item-${index}-content`} className="flex justify-between items-start">
        <div id={`alert-item-${index}-details`}>
          <h4 id={`alert-item-${index}-type`} className="text-sm font-medium text-white capitalize">{alert.type}</h4>
          <p id={`alert-item-${index}-description`} className="text-xs text-gray-300 mt-1">{alert.description}</p>
          <p className="text-xs text-gray-500 mt-1">Confidence: {Math.round(alert.confidence * 100)}%</p>
        </div>
        <span id={`alert-item-${index}-timestamp`} className="text-xs text-gray-400">{alert.timestamp}</span>
      </div>
    </div>
  );

  // Show loading screen during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <LoadingSpinner text="Initializing Blindspots services..." />
      </div>
    );
  }

  return (
    <div id="blindspots-app-container" className="min-h-screen bg-gray-900 text-white">
      {/* Header with enhanced connection status */}
      <header id="app-header" className="bg-black border-b border-gray-800 p-4">
        <div id="app-header-content" className="flex justify-between items-center">
          <div id="app-header-brand" className="flex items-center space-x-3">
            <div id="app-header-logo" className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div id="app-header-title-group">
              <h1 id="app-header-title" className="text-lg lg:text-xl font-bold">Blindspots</h1>
              <p id="app-header-subtitle" className="text-xs text-gray-400 hidden sm:block">APOLLO CONFIG | Revealing Hidden Patterns</p>
            </div>
          </div>
          
          {/* Connection Status Panel */}
          <div id="connection-status-panel" className="flex items-center space-x-4 text-gray-400">
            <Settings id="app-header-settings-btn" className="w-5 h-5 cursor-pointer hover:text-cyan-400" />
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded"
            >
              {showMobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div id="app-main-layout" className="flex flex-col lg:flex-row">
        {/* Enhanced Sidebar */}
        <aside id="app-sidebar" className={`${
          showMobileSidebar ? 'block' : 'hidden'
        } lg:block w-full lg:w-64 bg-gray-800 border-b lg:border-b-0 lg:border-r border-gray-700 p-4`}>
          <div id="app-sidebar-content" className="space-y-4">
            
            {/* Analysis Mode Section */}
            <div id="analysis-mode-section">
              <h3 id="analysis-mode-title" className="text-sm font-semibold text-gray-300 mb-3">Analysis Mode</h3>
              <div id="analysis-mode-buttons" className="space-y-2">
                <button
                  id="live-analysis-mode-btn"
                  onClick={() => handleModeChange('live')}
                  className={`w-full p-3 rounded-lg flex items-center space-x-3 ${
                    activeMode === 'live' ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Live Analysis</span>
                </button>
                <button
                  id="upload-analysis-mode-btn"
                  onClick={() => handleModeChange('upload')}
                  className={`w-full p-3 rounded-lg flex items-center space-x-3 ${
                    activeMode === 'upload' ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload & Analyze</span>
                </button>
              </div>
            </div>

            {/* Enhanced Context Preset Section */}
            <div id="context-preset-section">
              <div className="flex justify-between items-center mb-3">
                <h3 id="context-preset-title" className="text-sm font-semibold text-gray-300">Analysis Scenario</h3>
                <button
                  onClick={() => setShowScenarioDetails(!showScenarioDetails)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
              
              <select
                id="context-preset-select"
                value={contextPreset}
                onChange={(e) => setContextPreset(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-sm mb-2"
              >
                {contextPresets.map(preset => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>

              {/* Scenario Details Panel */}

            </div>


            {/* Trust Score Display */}
            {/* Analysis Status Indicator */}
            {isAnalyzing && !analysisData && (
              <div className="bg-cyan-900/30 border border-cyan-600/50 p-3 rounded-lg mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-cyan-600 rounded-full animate-pulse" />
                  <span className="text-sm text-cyan-400">Analyzing...</span>
                </div>
              </div>
            )}
            
            {analysisData && analysisData.trustVector > 0 && (
              <div id="trust-vector-section" className="bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Confidence</span>
                  <span className="text-lg font-bold text-cyan-400">{Math.round(analysisData.trustVector * 100)}%</span>
                </div>
              </div>
            )}

            {/* Settings Button */}
            <div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm flex items-center justify-center space-x-2 transition-all"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area - New Layout with Cohesive Report */}
        <main id="app-main-content" className="flex-1 p-4 lg:p-6">
          <div id="main-content-grid" className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
            
            {/* Video Feed Section - Reduced to 1 column */}
            <section id="video-feed-section" className="lg:col-span-1">
              <div id="video-feed-container" className="bg-gray-800 rounded-lg p-4">
                <div id="video-feed-header" className="flex justify-between items-center mb-4">
                  <h2 id="video-feed-title" className="text-sm font-semibold">
                    {activeMode === 'live' ? 'Live Feed' : 'Upload'}
                  </h2>
                  <div id="video-feed-controls" className="flex space-x-1">
                    {!isAnalyzing ? (
                      <button
                        id="start-analysis-btn"
                        onClick={startAnalysis}
                        disabled={isProcessingFile}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-2 py-1 rounded text-xs flex items-center space-x-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Start</span>
                      </button>
                    ) : (
                      <button
                        id="stop-analysis-btn"
                        onClick={stopAnalysis}
                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs flex items-center space-x-1"
                      >
                        <Pause className="w-3 h-3" />
                        <span>Stop</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div id="video-display" className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden min-h-[200px]">
                  {activeMode === 'live' ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      {!cameraStream && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                          <div className="text-center">
                            <Camera className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-400">Initializing...</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    isProcessingFile ? (
                      <LoadingSpinner text="Processing file..." />
                    ) : uploadedFilePreview ? (
                      <div className="w-full h-full relative">
                        {uploadedFileType === 'video' ? (
                          <video
                            src={uploadedFilePreview}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : uploadedFileType === 'image' ? (
                          <img
                            src={uploadedFilePreview}
                            alt="Uploaded content"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <FileText className="w-8 h-8 text-gray-600" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-400 mb-2">Upload media</p>
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          onChange={handleFileUpload}
                          accept="video/*,audio/*,image/*"
                          className="hidden"
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-cyan-600 hover:bg-cyan-700 px-2 py-1 rounded text-xs"
                        >
                          Select File
                        </button>
                      </div>
                    )
                  )}
                  
                  {/* Recording Indicator */}
                  {isAnalyzing && (
                    <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded text-xs font-semibold animate-pulse">
                      ● LIVE
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Cohesive Report Section - Main Center Area */}
            <section id="cohesive-report-section" className="lg:col-span-2">
              <div className="space-y-4">
                {/* Cohesive Report */}
                <div className="h-96">
                  <CohesiveReport 
                    analysisData={analysisData || {
                      timestamp: Date.now(),
                      sessionId: 'placeholder',
                      signals: {},
                      trustVector: 0,
                      timeline: [],
                      alerts: [],
                      claudeCodeGenerated: false,
                      contextPreset: contextPreset,
                      mediaType: 'live' as const
                    }}
                    contextPreset={contextPreset}
                    isAnalyzing={isAnalyzing}
                  />
                </div>

                {/* Timeline Below Report */}
                {analysisData && (
                  <div id="analysis-timeline-section" className="bg-gray-800 rounded-lg p-4">
                    <h3 id="analysis-timeline-title" className="text-sm font-semibold text-gray-300 mb-3">Analysis Timeline</h3>
                    <div id="analysis-timeline-container" className="bg-gray-900 p-3 rounded-lg max-h-40 overflow-y-auto">
                      <div id="analysis-timeline-events" className="space-y-2">
                        {analysisData.timeline.map((event: any, idx: number) => (
                          <div key={idx} id={`timeline-event-${idx}`} className="flex justify-between items-center text-sm">
                            <div id={`timeline-event-${idx}-info`} className="flex items-center space-x-3">
                              <span id={`timeline-event-${idx}-time`} className="text-gray-400 font-mono text-xs">{event.time}</span>
                              <span id={`timeline-event-${idx}-description`} className="text-white text-xs">{event.event}</span>
                              <span className="text-xs text-cyan-400">({event.apiCall})</span>
                            </div>
                            <span id={`timeline-event-${idx}-confidence`} className={`text-xs px-1 py-0.5 rounded ${
                              event.confidence > 0.85 ? 'bg-green-900 text-green-300' :
                              event.confidence > 0.7 ? 'bg-yellow-900 text-yellow-300' :
                              'bg-red-900 text-red-300'
                            }`}>
                              {Math.round(event.confidence * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Enhanced Analysis Panel */}
            <aside id="analysis-panel" className="space-y-6">
              
              {/* Signal Analysis with API sources */}
              {analysisData && (
                <section id="signal-analysis-section" className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 id="signal-analysis-title" className="text-lg font-semibold flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
                      Multi-API Signal Analysis
                    </h3>
                    <button
                      onClick={generateForensicReport}
                      className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-xs flex items-center space-x-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Forensic Report</span>
                    </button>
                  </div>
                  <div id="signal-analysis-indicators" className="space-y-3">
                    {Object.entries(analysisData.signals).map(([signal, data]) => (
                      <SignalIndicator key={signal} signal={signal} data={data} />
                    ))}
                  </div>
                </section>
              )}

              {/* Enhanced Alerts */}
              {analysisData && analysisData.alerts.length > 0 && (
                <section id="alerts-section" className="bg-gray-800 p-4 rounded-lg">
                  <h3 id="alerts-title" className="text-lg font-semibold mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                    Active Alerts
                  </h3>
                  <div id="alerts-list" className="space-y-3">
                    {analysisData.alerts.map((alert: any, idx: number) => (
                      <AlertItem key={idx} alert={alert} index={idx} />
                    ))}
                  </div>
                </section>
              )}

              {/* Export Options */}
              {analysisData && (
                <section id="export-section" className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Download className="w-5 h-5 mr-2 text-green-400" />
                    Export Options
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => exportAnalysisData('json')}
                      className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-left transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">JSON Export</div>
                          <div className="text-xs text-gray-300">Raw analysis data</div>
                        </div>
                        <FileText className="w-4 h-4" />
                      </div>
                    </button>
                    <button
                      onClick={() => exportAnalysisData('csv')}
                      className="w-full bg-green-600 hover:bg-green-700 p-3 rounded text-left transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">CSV Export</div>
                          <div className="text-xs text-gray-300">Spreadsheet format</div>
                        </div>
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                    </button>
                    <button
                      onClick={() => exportAnalysisData('pdf')}
                      className="w-full bg-red-600 hover:bg-red-700 p-3 rounded text-left transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">PDF Report</div>
                          <div className="text-xs text-gray-300">Professional format</div>
                        </div>
                        <FileText className="w-4 h-4" />
                      </div>
                    </button>
                  </div>
                </section>
              )}

            </aside>
          </div>
        </main>
      </div>

      {/* Learning Resources Panel */}
      {showLearningPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-cyan-400" />
                Learning Resources
              </h2>
              <button
                onClick={() => setShowLearningPanel(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* FAQs Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    {learningResources.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-white mb-2">{faq.question}</h4>
                        <p className="text-xs text-gray-300 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Practices Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Best Practices
                  </h3>
                  <div className="space-y-2">
                    {learningResources.bestPractices.map((practice, idx) => (
                      <div key={idx} className="bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <p className="text-xs text-gray-300 leading-relaxed">{practice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Tips Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-yellow-400 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Quick Tips
                  </h3>
                  <div className="space-y-2">
                    {learningResources.quickTips.map((tip, idx) => (
                      <div key={idx} className="bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <p className="text-xs text-gray-300 leading-relaxed">{tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Resources */}
              <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-lg border border-purple-500/30">
                <h3 className="text-lg font-semibold text-purple-400 mb-4">Advanced Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-white mb-2">📊 Scenario-Specific Analysis</h4>
                    <p className="text-xs text-gray-300">Each scenario focuses on different behavioral markers relevant to that context.</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-white mb-2">🎯 Personalized Feedback</h4>
                    <p className="text-xs text-gray-300">Get actionable advice tailored to your specific situation and goals.</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-white mb-2">📝 Text-Based Analysis</h4>
                    <p className="text-xs text-gray-300">Describe situations in text when video isn't available for instant insights.</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-white mb-2">🔄 Continuous Learning</h4>
                    <p className="text-xs text-gray-300">Build your skills through practice mode and detailed explanations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* API Status */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">API Status</h3>
              <div className="space-y-2">
                {Object.entries(apiStatus).map(([api, connected]) => (
                  <div key={api} className="flex justify-between items-center text-xs">
                    <span className="capitalize">{api === 'claudeCode' ? 'Claude Code' : api}</span>
                    <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Features */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Advanced Features</h3>
              
              {/* Text Analysis Mode */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-400">Text-only analysis</span>
                <button
                  onClick={() => setShowTextMode(!showTextMode)}
                  className={`w-10 h-5 rounded-full transition-colors ${
                    showTextMode ? 'bg-cyan-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    showTextMode ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Cultural Context */}
              <div className="mb-4">
                <label className="text-xs text-gray-400 block mb-2">Cultural Context</label>
                <select
                  value={culturalContext}
                  onChange={(e) => setCulturalContext(e.target.value)}
                  className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-xs text-white"
                >
                  <option value="western">Western</option>
                  <option value="eastern">Eastern</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="african">African</option>
                  <option value="latin">Latin</option>
                  <option value="nordic">Nordic</option>
                </select>
              </div>
            </div>

            {/* Learning Resources */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowLearningPanel(!showLearningPanel);
                  setShowSettings(false);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-lg text-sm flex items-center justify-center space-x-2 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Learning Resources</span>
              </button>
            </div>

            {/* Export & Integration */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Export & Integration</h3>
              <div className="space-y-2">
                <button 
                  onClick={generateForensicReport}
                  disabled={!analysisData}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-2 rounded text-sm flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Forensic Report</span>
                </button>
                <button className="w-full bg-cyan-600 hover:bg-cyan-700 p-2 rounded text-sm flex items-center justify-center space-x-2">
                  <Terminal className="w-4 h-4" />
                  <span>Generate Claude Code Report</span>
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 p-2 rounded text-sm flex items-center justify-center space-x-2">
                  <GitBranch className="w-4 h-4" />
                  <span>Commit to GitHub</span>
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 p-2 rounded text-sm flex items-center justify-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>Save to Supabase</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Text Analysis Input */}
      {showTextMode && (
        <div className="fixed bottom-4 right-4 bg-gray-800 rounded-lg p-4 w-80 border border-gray-600">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Text Analysis</h3>
          <textarea
            value={textBasedInput}
            onChange={(e) => setTextBasedInput(e.target.value)}
            placeholder="Describe body language cues..."
            className="w-full h-20 p-2 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400 resize-none"
          />
          <button
            onClick={handleTextAnalysis}
            disabled={!textBasedInput.trim() || isAnalyzing}
            className="w-full mt-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-1 rounded text-sm flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-3 h-3" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
          </button>
        </div>
      )}

      {/* Forensic Report Modal */}
      {showForensicReport && forensicReport && (
        <ForensicReport 
          report={forensicReport}
          onClose={() => setShowForensicReport(false)}
        />
      )}
      
      {/* Toast Notifications */}
      {errorMessage && (
        <Toast 
          message={errorMessage} 
          type="error" 
          onClose={() => setErrorMessage(null)} 
        />
      )}
      {successMessage && (
        <Toast 
          message={successMessage} 
          type="success" 
          onClose={() => setSuccessMessage(null)} 
        />
      )}
    </div>
  );
};

export default Blindspots;
