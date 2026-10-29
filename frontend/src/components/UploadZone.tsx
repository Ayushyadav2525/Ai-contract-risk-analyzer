import React, { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isAnalyzing }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (ext !== '.pdf' && ext !== '.docx' && ext !== '.doc' && ext !== '.txt') {
        setError('Unsupported file type. Please select a PDF, DOCX, or TXT file.');
        setSelectedFile(null);
        return;
      }
      setError(null);
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (ext !== '.pdf' && ext !== '.docx' && ext !== '.doc' && ext !== '.txt') {
        setError('Unsupported file type. Please select a PDF, DOCX, or TXT file.');
        setSelectedFile(null);
        return;
      }
      setError(null);
      setSelectedFile(file);
    }
  };

  const handleStartAnalysis = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
      <h2 className="text-sm font-bold text-slate-900 mb-1">Upload contract for analysis</h2>
      <p className="text-xs text-slate-400 mb-4">Upload PDF, DOCX, or TXT file for intelligent risk detection and section parsing.</p>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-200 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/20 rounded-xl p-8 text-center cursor-pointer transition-all"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,.doc,.txt"
          className="hidden"
        />

        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-xs font-semibold text-slate-700">
          Drag and drop your file here or <span className="text-purple-600 hover:underline">Choose file</span>
        </p>
        <p className="text-[11px] text-slate-400 mt-1">Supported formats: PDF, DOCX, TXT (Max 50MB)</p>
      </div>

      {error && (
        <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {selectedFile && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-4 p-3 bg-purple-50/50 border border-purple-200 rounded-lg flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <File className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-xs font-semibold text-slate-800">{selectedFile.name}</p>
              <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Contract'}
          </button>
        </div>
      )}
    </div>
  );
};
