import React, { useState, useRef, useEffect } from 'react';
import { Code2, Upload, Loader2, FileCode, Languages, Copy, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { geminiService } from '../services/gemini';

const LangueToCode = () => {
  const [inputText, setInputText] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('json');
  const [targetLanguage, setTargetLanguage] = useState('react');
  const [targetFramework, setTargetFramework] = useState('react-i18next');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const fileInputRef = useRef(null);

  const sourceFormats = [
    { value: 'json', label: 'JSON', extension: '.json' },
    { value: 'xml', label: 'XML', extension: '.xml' },
    { value: 'yaml', label: 'YAML', extension: '.yaml, .yml' },
    { value: 'properties', label: 'Properties', extension: '.properties' },
    { value: 'strings', label: 'iOS Strings', extension: '.strings' }
  ];

  const targetLanguages = [
    { value: 'react', label: 'React', frameworks: ['react-i18next', 'react-intl', 'next-intl'] },
    { value: 'vue', label: 'Vue.js', frameworks: ['vue-i18n', 'vue-intl'] },
    { value: 'angular', label: 'Angular', frameworks: ['ngx-translate', '@angular/localize'] },
    { value: 'flutter', label: 'Flutter', frameworks: ['flutter_localizations', 'easy_localization'] },
    { value: 'swift', label: 'Swift UI', frameworks: ['SwiftGen', 'Localize-Swift'] }
  ];

  useEffect(() => {
    // Reset framework when target language changes
    const languageData = targetLanguages.find(lang => lang.value === targetLanguage);
    if (languageData) {
      setTargetFramework(languageData.frameworks[0]);
    }
  }, [targetLanguage]);

  const validateInput = (text) => {
    try {
      switch (sourceLanguage) {
        case 'json':
          JSON.parse(text);
          break;
        case 'xml':
          // Basic XML validation
          if (!text.match(/<[^>]+>/)) throw new Error('Invalid XML');
          break;
        // Add other format validations
      }
      setValidationStatus('valid');
      return true;
    } catch (err) {
      setValidationStatus('invalid');
      setError(`Invalid ${sourceLanguage.toUpperCase()} format: ${err.message}`);
      return false;
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const text = await file.text();
        setInputText(text);
        
        // Detect format from extension
        const extension = file.name.split('.').pop().toLowerCase();
        const format = sourceFormats.find(f => f.extension.includes(extension));
        if (format) {
          setSourceLanguage(format.value);
        }
        
        validateInput(text);
      } catch (err) {
        setError('Error reading file');
        setValidationStatus('invalid');
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const generateCode = async () => {
    if (!inputText || !validateInput(inputText) || !sourceCode) {
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedCode('');

    try {
      const prompt = `Generate a ${targetLanguage} component using ${targetFramework} with these requirements:
1. Convert this ${sourceLanguage.toUpperCase()} translation file
2. Implement full i18n support
3. Include proper error handling and validation
4. Implement best practices for ${targetLanguage} and ${targetFramework}
5. Give me  only the code don't put any extra information.

Translation file:
${inputText}

Source code to translate:
${sourceCode}`;

      const result = await geminiService.programmerChat(prompt);
      setGeneratedCode(result);
    } catch (err) {
      setError('Failed to generate code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center gap-3">
            <Languages className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">Translation to Code</h1>
              <p className="text-blue-100 mt-2">
                Convert translation files into fully internationalized components with error handling
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          {/* Format Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Source Format</label>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                {sourceFormats.map(format => (
                  <option key={format.value} value={format.value}>
                    {format.label} ({format.extension})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Target Language</label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                {targetLanguages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Framework</label>
              <select
                value={targetFramework}
                onChange={(e) => setTargetFramework(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                {targetLanguages
                  .find(lang => lang.value === targetLanguage)
                  ?.frameworks.map(framework => (
                    <option key={framework} value={framework}>{framework}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-6">
            {/* Translation File Content */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-gray-700">Translation File Content</label>
                <button
                  onClick={triggerFileUpload}
                  className="px-4 py-2 text-sm border rounded-lg flex items-center gap-2 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </button>
              </div>
              
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (e.target.value) validateInput(e.target.value);
                  }}
                  placeholder={`Paste your ${sourceLanguage.toUpperCase()} translation file content here...`}
                  className={`w-full h-64 p-4 border rounded-lg bg-white shadow-sm resize-none font-mono text-sm
                    focus:ring-2 focus:outline-none ${
                      validationStatus === 'valid' ? 'focus:ring-green-400 border-green-200' :
                      validationStatus === 'invalid' ? 'focus:ring-red-400 border-red-200' :
                      'focus:ring-blue-400'
                    }`}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.xml,.yaml,.yml,.properties,.strings"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {validationStatus && (
                  <div className={`absolute top-2 right-2 p-2 rounded-full ${
                    validationStatus === 'valid' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {validationStatus === 'valid' ? 
                      <Check className="w-5 h-5" /> : 
                      <AlertCircle className="w-5 h-5" />
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Source Code to Translate */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Source Code to Translate</label>
              <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                placeholder="Paste your source code here..."
                className="w-full h-64 p-4 border rounded-lg bg-white shadow-sm resize-none font-mono text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={generateCode}
              disabled={isLoading || !inputText || validationStatus !== 'valid' || !sourceCode}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium ${
                isLoading || !inputText || validationStatus !== 'valid' || !sourceCode
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white transition-colors'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Code2 className="w-4 h-4" />
              )}
              {isLoading ? 'Generating...' : 'Generate Component'}
            </button>

            {generatedCode && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm border text-gray-600 hover:bg-gray-50"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Show Preview
                  </>
                )}
              </button>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Generated Code */}
          {generatedCode && (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-medium text-gray-700">Generated Component</h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                    {targetLanguage} + {targetFramework}
                  </span>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
              <pre className="p-4 bg-white overflow-x-auto">
                <code className="text-sm font-mono text-gray-800">{generatedCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LangueToCode;