import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadZone } from '../components/UploadZone';
import { AnalysisProgressModal } from '../components/AnalysisProgressModal';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { uploadContractFile, fetchAnalysisStatus } from '../services/api';

export const UploadContract: React.FC = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressModal, setUploadProgressModal] = useState(false);
  const [stages, setStages] = useState<any[]>([]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgressModal(true);
    setStages([
      { name: 'Document Ingestion & Text Extraction', status: 'in_progress', detail: 'Extracting clause boundaries...' },
      { name: 'Deterministic Rule Engine', status: 'pending', detail: 'Applying playbook risk rules...' },
      { name: 'LLM Risk & Redline Assessment', status: 'pending', detail: 'Evaluating clause impacts...' },
      { name: 'Vector RAG Indexing', status: 'pending', detail: 'Indexing embeddings into vector store...' },
      { name: 'Final Risk Report Compilation', status: 'pending', detail: 'Computing health and composite risk scores...' },
    ]);

    try {
      const res = await uploadContractFile(file);
      const contractId = res.contract_id;

      setStages([
        { name: 'Document Ingestion & Text Extraction', status: 'completed', detail: 'Extracted text & sections' },
        { name: 'Deterministic Rule Engine', status: 'completed', detail: 'Rules evaluated' },
        { name: 'LLM Risk & Redline Assessment', status: 'completed', detail: 'AI Redlines generated' },
        { name: 'Vector RAG Indexing', status: 'completed', detail: 'Indexed in vector DB' },
        { name: 'Final Risk Report Compilation', status: 'completed', detail: 'Analysis complete' },
      ]);

      setTimeout(() => {
        setUploadProgressModal(false);
        setIsUploading(false);
        navigate(`/contracts/${contractId}`);
      }, 800);
    } catch (err) {
      console.error('Upload Error:', err);
      setIsUploading(false);
      setUploadProgressModal(false);
      alert('Error analyzing contract. Please check backend connection and try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <DisclaimerBanner />
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Contract Ingestion & Analysis</h2>
        <p className="text-xs text-slate-500 mb-6">
          Upload commercial agreements in PDF or DOCX format to trigger automated section parsing, RAG vector indexing, deterministic rule scoring, and AI redline generation.
        </p>

        <UploadZone onFileSelect={handleFileUpload} isAnalyzing={isUploading} />
      </div>

      <AnalysisProgressModal
        isOpen={uploadProgressModal}
        stages={stages}
        progressPercent={100}
      />
    </div>
  );
};
