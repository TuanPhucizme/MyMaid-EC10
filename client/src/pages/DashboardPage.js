import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { userAPI } from '../services/api';
import { Search, BarChart3, Clock, TrendingUp, ExternalLink } from 'lucide-react';
import styled from 'styled-components';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bgColor || '#e0e7ff'};
  color: ${props => props.color || '#3b82f6'};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.875rem;
  font-weight: bold;
  color: #1a202c;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RecentLinksCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: between;
  align-items: center;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const LinkItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const LinkInfo = styled.div`
  flex: 1;
`;

const LinkUrl = styled.div`
  font-weight: 500;
  color: #1a202c;
  margin-bottom: 0.25rem;
  word-break: break-all;
`;

const LinkMeta = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CredibilityScore = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
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
`;

const QuickActionsCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  text-decoration: none;
  color: #374151;
  transition: all 0.2s;
  margin-bottom: 1rem;

  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ActionIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: #e0e7ff;
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ActionDescription = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const DashboardPage = () => {
  const { data: dashboardData, isLoading, error } = useQuery(
    'dashboard',
    userAPI.getDashboard,
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <DashboardContainer>
        <div className="card">
          <p>Error loading dashboard data. Please try again.</p>
        </div>
      </DashboardContainer>
    );
  }

  const { user, stats, recentLinks } = dashboardData?.data || {};

  return (
    <DashboardContainer>
      <DashboardHeader>
        <WelcomeTitle>Welcome back, {user?.firstName}!</WelcomeTitle>
        <WelcomeSubtitle>Here's your fact-checking activity overview</WelcomeSubtitle>
      </DashboardHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <Search size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats?.totalLinksChecked || 0}</StatValue>
            <StatLabel>Total Links Checked</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#fef3c7" color="#d97706">
            <Clock size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats?.linksThisWeek || 0}</StatValue>
            <StatLabel>This Week</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#dcfce7" color="#16a34a">
            <TrendingUp size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats?.averageCredibilityScore || 0}%</StatValue>
            <StatLabel>Avg. Credibility Score</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <RecentLinksCard>
          <CardHeader>
            <CardTitle>Recent Link Checks</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLinks && recentLinks.length > 0 ? (
              recentLinks.map((link) => (
                <LinkItem key={link.id}>
                  <LinkInfo>
                    <LinkUrl>{link.metadata?.title || link.url}</LinkUrl>
                    <LinkMeta>
                      <span>{new Date(link.checkedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{link.metadata?.domain}</span>
                    </LinkMeta>
                  </LinkInfo>
                  <CredibilityScore score={link.credibilityScore}>
                    {link.credibilityScore}%
                  </CredibilityScore>
                </LinkItem>
              ))
            ) : (
              <EmptyState>
                <p>No links checked yet.</p>
                <Link to="/check-link" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Check Your First Link
                </Link>
              </EmptyState>
            )}
          </CardContent>
        </RecentLinksCard>

        <QuickActionsCard>
          <CardTitle style={{ marginBottom: '1.5rem' }}>Quick Actions</CardTitle>
          
          <ActionButton to="/check-link">
            <ActionIcon>
              <Search size={20} />
            </ActionIcon>
            <ActionContent>
              <ActionTitle>Check New Link</ActionTitle>
              <ActionDescription>Verify a news article or information source</ActionDescription>
            </ActionContent>
          </ActionButton>

          <ActionButton to="/profile">
            <ActionIcon>
              <BarChart3 size={20} />
            </ActionIcon>
            <ActionContent>
              <ActionTitle>View Profile</ActionTitle>
              <ActionDescription>Update your account settings</ActionDescription>
            </ActionContent>
          </ActionButton>
        </QuickActionsCard>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default DashboardPage;
