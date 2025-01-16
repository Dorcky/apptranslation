import React, { useState, useRef } from 'react';
import { Code2, Upload, Languages, FileCode, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialisation de l'API Gemini
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

const CodeToLangue = () => {
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('swiftui');
  const [selectedFileType, setSelectedFileType] = useState('json');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const text = await file.text();
        setInputText(text);
        setError('');
      } catch (err) {
        setError('Error reading file');
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const generateFiles = async () => {
    if (!inputText) {
      setError('Please enter or upload code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Construction du prompt pour Gemini
      const prompt = `Extract all text strings from the following code and translate them into the following languages: ${selectedLanguages.join(', ')}. 
      Return ONLY a JSON file with the translations, where each key is a language and each value is the translated text. 
      Do not include any additional explanations or code. 
      Here is the code:\n\n${inputText}`;

      // Appel à l'API Gemini
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const generatedText = result.response.text();

      setGeneratedFiles([generatedText]); // Stocker le résultat dans l'état
    } catch (err) {
      setError('Failed to generate files');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center gap-2">
            <Code2 className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Code to Langue</h1>
              <p className="text-blue-100 mt-1">
                Translate your code across multiple languages
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="swiftui">SwiftUI</option>
              <option value="react">React</option>
              <option value="react-native">React Native</option>
              <option value="kotlin-android">Kotlin Android</option>
              <option value="jetpack-compose">Jetpack Compose</option>
            </select>

            <select
              value={selectedFileType}
              onChange={(e) => setSelectedFileType(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="json">JSON</option>
              <option value="xml">XML</option>
              <option value="yaml">YAML</option>
            </select>
          </div>

          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-48 p-4 border rounded-lg bg-white shadow-sm resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none font-mono text-sm"
            />
            <button
              onClick={triggerFileUpload}
              className="absolute top-2 right-2 px-4 py-2 bg-white hover:bg-blue-50 border rounded-md flex items-center gap-2 text-sm transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.xml,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <select
              value={selectedLanguages}
              onChange={(e) => setSelectedLanguages(Array.from(e.target.selectedOptions, option => option.value))}
              className="flex-grow p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              multiple
            >
              <option value="english">English</option>
              <option value="french">French</option>
              <option value="spanish">Spanish</option>
            </select>

            <button
              onClick={generateFiles}
              disabled={isLoading || !inputText}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                isLoading || !inputText
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Languages className="w-4 h-4" />
              )}
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              {error}
            </div>
          )}

          {generatedFiles.length > 0 && (
            <div className="space-y-4">
              {generatedFiles.map((file, index) => (
                <pre key={index} className="p-4 bg-gray-50 rounded-lg overflow-x-auto border border-gray-200 font-mono text-sm">
                  <code>{file}</code>
                </pre>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeToLangue;