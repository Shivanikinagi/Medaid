import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaFileUpload, FaFileMedical, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { reportAPI } from '../services/api';

const UploaderContainer = styled.div`
  width: 100%;
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => props.isDragActive ? '#4CAF50' : '#ddd'};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  background: ${props => props.isDragActive ? 'rgba(76, 175, 80, 0.05)' : '#fafafa'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #4CAF50;
    background: rgba(76, 175, 80, 0.05);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: #4CAF50;
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  margin: 0 0 1rem 0;
  color: #666;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  margin-top: 1rem;
`;

const FileName = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
  font-size: 1.2rem;
`;

const StatusMessage = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  &.success {
    background: #e8f5e9;
    color: #2E7D32;
    border-left: 4px solid #4CAF50;
  }
  
  &.error {
    background: #ffebee;
    color: #C62828;
    border-left: 4px solid #f44336;
  }
  
  &.processing {
    background: #fff3e0;
    color: #EF6C00;
    border-left: 4px solid #FF9800;
  }
`;

const AnalysisResults = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 12px;
`;

const ResultItem = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  h4 {
    margin: 0 0 0.5rem 0;
    color: #2E7D32;
  }
  
  p {
    margin: 0.25rem 0;
    color: #555;
  }
`;

const ValueHighlight = styled.span`
  font-weight: bold;
  color: ${props => {
    if (props.status === 'High') return '#f44336';
    if (props.status === 'Low') return '#2196F3';
    return '#4CAF50';
  }};
`;

const ReportUploader = ({ onReportProcessed }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    // Validate file type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setStatus({
        type: 'error',
        message: 'Please upload a valid file (PDF, PNG, JPG)'
      });
      return;
    }
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setStatus({
        type: 'error',
        message: 'File size exceeds 10MB limit'
      });
      return;
    }
    
    setFile(selectedFile);
    setStatus(null);
    setAnalysisResults(null);
  };

  const removeFile = () => {
    setFile(null);
    setStatus(null);
    setAnalysisResults(null);
  };

  const processReport = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setStatus({
      type: 'processing',
      message: 'Analyzing your medical report...'
    });
    
    try {
      const formData = new FormData();
      formData.append('report', file);
      
      const response = await reportAPI.processReport(formData);
      const results = response.data;
      
      setAnalysisResults(results);
      setStatus({
        type: 'success',
        message: 'Report analyzed successfully!'
      });
      
      // Pass results to parent component
      if (onReportProcessed) {
        onReportProcessed(results);
      }
    } catch (error) {
      console.error('Error processing report:', error);
      setStatus({
        type: 'error',
        message: 'Failed to process report. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <UploaderContainer>
      <UploadArea
        isDragActive={isDragActive}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadIcon>
          <FaFileMedical />
        </UploadIcon>
        <UploadText>
          <strong>Drag & drop your medical report here</strong>
        </UploadText>
        <UploadText>or click to browse files</UploadText>
        <p style={{ fontSize: '0.9rem', color: '#999' }}>
          Supports PDF, PNG, JPG files (Max 10MB)
        </p>
        
        <FileInput
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileInputChange}
        />
      </UploadArea>
      
      {file && (
        <FileInfo>
          <FileName>
            <FaFileUpload />
            {file.name}
          </FileName>
          <RemoveButton onClick={removeFile}>
            &times;
          </RemoveButton>
        </FileInfo>
      )}
      
      {status && (
        <StatusMessage className={status.type}>
          {status.type === 'success' && <FaCheckCircle />}
          {status.type === 'error' && <FaExclamationTriangle />}
          {status.type === 'processing' && (
            <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid #f3f3f3', borderTop: '2px solid #4CAF50', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          )}
          <span>{status.message}</span>
        </StatusMessage>
      )}
      
      {file && !isProcessing && !analysisResults && (
        <button
          onClick={processReport}
          disabled={isProcessing}
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(90deg, #4CAF50, #2E7D32)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '1rem',
            transition: 'all 0.3s ease'
          }}
        >
          Analyze Report
        </button>
      )}
      
      {analysisResults && (
        <AnalysisResults>
          <h3>Report Analysis Results</h3>
          
          {analysisResults.structured_data && Object.keys(analysisResults.structured_data).length > 0 ? (
            <>
              <h4>Extracted Medical Parameters</h4>
              {Object.entries(analysisResults.structured_data).map(([key, value]) => {
                const interpretation = analysisResults.interpretations?.[key];
                return (
                  <ResultItem key={key}>
                    <h4>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                    <p>
                      Value: <ValueHighlight status={interpretation?.status}>
                        {value} {interpretation?.unit || ''}
                      </ValueHighlight>
                    </p>
                    {interpretation && (
                      <p>
                        Status: <ValueHighlight status={interpretation.status}>
                          {interpretation.status}
                        </ValueHighlight>
                      </p>
                    )}
                  </ResultItem>
                );
              })}
            </>
          ) : (
            <p>No medical parameters could be extracted from your report.</p>
          )}
          
          {analysisResults.raw_text && (
            <>
              <h4>Raw Text Extracted</h4>
              <p style={{ 
                background: '#f0f0f0', 
                padding: '1rem', 
                borderRadius: '8px',
                fontSize: '0.9rem',
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                {analysisResults.raw_text}
              </p>
            </>
          )}
        </AnalysisResults>
      )}
    </UploaderContainer>
  );
};

export default ReportUploader;