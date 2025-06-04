import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { linkAPI } from '../services/api';
import { Search, ExternalLink, Calendar, User, Globe, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import styled from 'styled-components';
import toast from 'react-hot-toast';

const CheckLinkContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
`;

const CheckForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 2px solid ${props => props.error ? '#ef4444' : '#d1d5db'};
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ResultHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CredibilityBadge = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 1.125rem;
  background: ${props => {
    if (props.score >= 80) return '#dcfce7';
    if (props.score >= 60) return '#fef3c7';
    if (props.score >= 40) return '#fed7aa';
    return '#fecaca';
  }};
  color: ${props => {
    if (props.score >= 80) return '#166534';
    if (props.score >= 60) return '#92400e';
    if (props.score >= 40) return '#c2410c';
    return '#dc2626';
  }};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ResultTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a202c;
  flex: 1;
`;

const ResultContent = styled.div`
  padding: 1.5rem;
`;

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const SummarySection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.75rem;
`;

const Summary = styled.p`
  color: #4b5563;
  line-height: 1.6;
`;

const SourcesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SourceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
`;

const SourceInfo = styled.div`
  flex: 1;
`;

const SourceName = styled.div`
  font-weight: 500;
  color: #1a202c;
`;

const SourceUrl = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    text-decoration: underline;
  }
`;

const SourceCredibility = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  background: ${props => {
    if (props.level === 'high') return '#dcfce7';
    if (props.level === 'medium') return '#fef3c7';
    return '#fecaca';
  }};
  color: ${props => {
    if (props.level === 'high') return '#166534';
    if (props.level === 'medium') return '#92400e';
    return '#dc2626';
  }};
`;

const schema = yup.object({
  url: yup
    .string()
    .url('Please enter a valid URL')
    .required('URL is required')
});

const CheckLinkPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await linkAPI.checkLink(data.url);
      setResult(response.data.result);
      toast.success('Link checked successfully!');
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to check link';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getCredibilityIcon = (score) => {
    if (score >= 80) return <CheckCircle size={20} />;
    if (score >= 40) return <AlertTriangle size={20} />;
    return <XCircle size={20} />;
  };

  const getCredibilityText = (score) => {
    if (score >= 80) return 'High Credibility';
    if (score >= 60) return 'Good Credibility';
    if (score >= 40) return 'Moderate Credibility';
    return 'Low Credibility';
  };

  return (
    <CheckLinkContainer>
      <PageHeader>
        <PageTitle>Check Link Credibility</PageTitle>
        <PageSubtitle>
          Enter a URL to verify the credibility of news articles and information sources
        </PageSubtitle>
      </PageHeader>

      <CheckForm onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Label htmlFor="url">URL to Check</Label>
          <InputContainer>
            <InputIcon>
              <Globe size={20} />
            </InputIcon>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/article"
              error={errors.url}
              {...register('url')}
            />
          </InputContainer>
          {errors.url && (
            <ErrorMessage>{errors.url.message}</ErrorMessage>
          )}
        </InputGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="spinner" style={{ width: '1rem', height: '1rem' }} />
              Checking...
            </>
          ) : (
            <>
              <Search size={20} />
              Check Link
            </>
          )}
        </SubmitButton>
      </CheckForm>

      {result && (
        <ResultCard>
          <ResultHeader>
            <CredibilityBadge score={result.credibilityScore}>
              {getCredibilityIcon(result.credibilityScore)}
              {result.credibilityScore}% - {getCredibilityText(result.credibilityScore)}
            </CredibilityBadge>
          </ResultHeader>

          <ResultContent>
            <ResultTitle>{result.metadata?.title}</ResultTitle>
            
            <MetadataGrid>
              <MetadataItem>
                <Globe size={16} />
                {result.metadata?.domain}
              </MetadataItem>
              <MetadataItem>
                <Calendar size={16} />
                {result.metadata?.publishDate ? 
                  new Date(result.metadata.publishDate).toLocaleDateString() : 
                  'Date unknown'
                }
              </MetadataItem>
              <MetadataItem>
                <User size={16} />
                {result.metadata?.author || 'Author unknown'}
              </MetadataItem>
              <MetadataItem>
                <ExternalLink size={16} />
                <a href={result.url} target="_blank" rel="noopener noreferrer">
                  View Original
                </a>
              </MetadataItem>
            </MetadataGrid>

            <SummarySection>
              <SectionTitle>Analysis Summary</SectionTitle>
              <Summary>{result.summary}</Summary>
            </SummarySection>

            {result.sources && result.sources.length > 0 && (
              <div>
                <SectionTitle>Sources</SectionTitle>
                <SourcesList>
                  {result.sources.map((source, index) => (
                    <SourceItem key={index}>
                      <SourceInfo>
                        <SourceName>{source.name}</SourceName>
                        <SourceUrl href={source.url} target="_blank" rel="noopener noreferrer">
                          {source.url} <ExternalLink size={12} />
                        </SourceUrl>
                      </SourceInfo>
                      <SourceCredibility level={source.credibility}>
                        {source.credibility}
                      </SourceCredibility>
                    </SourceItem>
                  ))}
                </SourcesList>
              </div>
            )}
          </ResultContent>
        </ResultCard>
      )}
    </CheckLinkContainer>
  );
};

export default CheckLinkPage;
