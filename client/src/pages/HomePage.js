import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Users, BarChart3 } from 'lucide-react';
import styled from 'styled-components';

// TODO: Implement responsive design for mobile devices
// TODO: Add loading states and error handling
// TODO: Connect to authentication context for conditional rendering

// Styled components for the hero section
const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
  /* TODO: Add animation effects for better user experience */
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  /* TODO: Implement better responsive breakpoints */
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
  /* TODO: Add text animation on page load */
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  /* TODO: Add fade-in animation */
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  /* TODO: Add stagger animation for buttons */
`;

const CTAButton = styled(Link)`
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;

  &.primary {
    background: white;
    color: #667eea;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  &.secondary {
    background: transparent;
    color: white;
    border: 2px solid white;

    &:hover {
      background: white;
      color: #667eea;
    }
  }
  /* TODO: Add click animation and loading states */
`;

// Styled components for the features section
const FeaturesSection = styled.section`
  padding: 4rem 0;
  background: #f8fafc;
  /* TODO: Add parallax scrolling effect */
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 3rem;
  color: #1a202c;
  /* TODO: Add scroll-triggered animation */
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  /* TODO: Add stagger animation for grid items */
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
  /* TODO: Add entrance animation when scrolled into view */
`;

const FeatureIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background: #e0e7ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #667eea;
  /* TODO: Add icon animation on hover */
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a202c;
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

/**
 * HomePage Component
 * @desc Main landing page component that displays hero section and features
 * @returns {JSX.Element} HomePage component with hero and features sections
 */
const HomePage = () => {
  // TODO: Connect to authentication context to show different content for logged-in users
  // TODO: Add state management for loading and error states
  // TODO: Implement analytics tracking for user interactions

  // Sample features data - TODO: Move to a separate constants file or fetch from API
  const features = [
    {
      id: 'link-verification', // TODO: Use unique IDs instead of array index for keys
      icon: <Search size={24} />,
      title: 'Link Verification',
      description: 'Instantly check the credibility of news articles and information sources with our advanced verification system.'
    },
    {
      id: 'reliable-sources',
      icon: <Shield size={24} />,
      title: 'Reliable Sources',
      description: 'Get information from trusted news outlets and fact-checking organizations to ensure accuracy.'
    },
    {
      id: 'credibility-scoring',
      icon: <BarChart3 size={24} />,
      title: 'Credibility Scoring',
      description: 'Receive detailed credibility scores and analysis to help you make informed decisions about information.'
    },
    {
      id: 'community-driven',
      icon: <Users size={24} />,
      title: 'Community Driven',
      description: 'Join a community of fact-checkers and contribute to fighting misinformation together.'
    }
  ];

  // TODO: Add useEffect hooks for:
  // - Page view analytics
  // - Loading animations
  // - Scroll-triggered animations

  return (
    <>
      {/* Hero Section - TODO: Add loading skeleton while content loads */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Fight Misinformation with FactCheck</HeroTitle>
          <HeroSubtitle>
            Verify the credibility of news and information sources instantly.
            Join the fight against fake news and misinformation.
          </HeroSubtitle>
          <CTAButtons>
            {/* TODO: Add click tracking and loading states */}
            <CTAButton to="/register" className="primary">
              Get Started Free
            </CTAButton>
            <CTAButton to="/login" className="secondary">
              Sign In
            </CTAButton>
          </CTAButtons>
        </HeroContent>
      </HeroSection>

      {/* Features Section - TODO: Add intersection observer for animations */}
      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>Why Choose FactCheck?</SectionTitle>
          <FeaturesGrid>
            {/* TODO: Add error boundary for feature cards */}
            {features.map((feature) => (
              <FeatureCard key={feature.id}>
                <FeatureIcon>
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      {/* TODO: Add additional sections:
          - Testimonials
          - Statistics/metrics
          - Call-to-action footer
          - Newsletter signup
      */}
    </>
  );
};

export default HomePage;