import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { maids, maidStats } from '../data/maids';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { useGSAP, animations } from '../hooks/useGSAP';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const SkillBar = ({ skill }) => {
  const { ref, hasIntersected } = useIntersectionObserver();
  
  const barRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      gsap.fromTo(element.querySelector('.skill-fill'),
        { width: '0%' },
        { width: `${skill.level}%`, duration: 1.5, ease: "power2.out", delay: 0.2 }
      );
    }
  }, [hasIntersected]);

  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-neutral-700">{skill.name}</span>
        <span className="text-neutral-500">{skill.level}%</span>
      </div>
      <div ref={barRef} className="w-full bg-neutral-200 rounded-full h-2">
        <div 
          className="skill-fill bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
          style={{ width: '0%' }}
        ></div>
      </div>
    </div>
  );
};

const MaidCard = ({ maid, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { ref, hasIntersected } = useIntersectionObserver();
  const navigate = useNavigate();
  
  const cardRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      animations.fadeInUp(element, index * 0.1);
      
      // Hover animations
      const handleMouseEnter = () => {
        gsap.to(element, {
          y: -8,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(element, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      };
      
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [hasIntersected]);

  const handleContact = () => {
    navigate('/services', { state: { selectedMaid: maid.id } });
  };

  const handleViewProfile = () => {
    // Navigate to a detailed profile page or open modal
    console.log('View profile for:', maid.name);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div ref={ref}>
      <Card ref={cardRef} className="h-full hover:shadow-large transition-all duration-300 cursor-pointer" onClick={handleViewProfile}>
        {/* Header with avatar and basic info */}
        <CardHeader className="pb-4">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src={maid.avatar}
                alt={maid.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              {maid.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <CardTitle className="text-lg">{maid.name}</CardTitle>
              <p className="text-sm text-neutral-600">{maid.age} tuổi • {maid.experience}</p>
              <p className="text-sm text-neutral-500">{maid.location}</p>
              
              <div className="flex items-center mt-2">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-semibold">{maid.rating}</span>
                  <span className="text-neutral-500">({maid.reviews} đánh giá)</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {maid.badges.map((badge, idx) => (
              <Badge key={idx} variant="outline" size="sm">
                {badge}
              </Badge>
            ))}
          </div>

          {/* Specialties */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm text-neutral-900 mb-2">Chuyên môn:</h4>
            <div className="flex flex-wrap gap-1">
              {maid.specialties.map((specialty, idx) => (
                <Badge key={idx} variant="secondary" size="sm">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="text-neutral-500">Hoàn thành:</span>
              <span className="font-semibold ml-1">{maid.completedJobs}</span>
            </div>
            <div>
              <span className="text-neutral-500">Phản hồi:</span>
              <span className="font-semibold ml-1">{maid.responseTime}</span>
            </div>
          </div>

          {/* Expandable content */}
          {isExpanded && (
            <div className="space-y-4 animate-fadeInUp">
              {/* Background */}
              <div>
                <h4 className="font-semibold text-sm text-neutral-900 mb-2">Giới thiệu:</h4>
                <p className="text-sm text-neutral-600">{maid.background}</p>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-semibold text-sm text-neutral-900 mb-3">Kỹ năng:</h4>
                {maid.skills.map((skill, idx) => (
                  <SkillBar key={idx} skill={skill} />
                ))}
              </div>

              {/* Languages */}
              <div>
                <h4 className="font-semibold text-sm text-neutral-900 mb-2">Ngôn ngữ:</h4>
                <div className="flex flex-wrap gap-1">
                  {maid.languages.map((language, idx) => (
                    <Badge key={idx} variant="info" size="sm">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="font-semibold text-sm text-neutral-900 mb-2">Lịch làm việc:</h4>
                <p className="text-sm text-neutral-600">{maid.availability}</p>
              </div>
            </div>
          )}

          {/* Price and actions */}
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-2xl font-bold text-primary-600">
                  {maid.hourlyRate.toLocaleString()}đ
                </span>
                <span className="text-neutral-500">/giờ</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="text-primary-600 text-sm font-medium hover:text-primary-700"
              >
                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
              </button>
            </div>
            
            <div className="flex space-x-2">
                          <Button 
              className="flex-1 group"
              onClick={(e) => { e.stopPropagation(); navigate('/consultation'); }}
            >
              Liên hệ
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Button>
              <Button 
                variant="outline"
                onClick={handleFavorite}
                className={isFavorite ? 'text-red-500 border-red-500 hover:bg-red-50' : ''}
              >
                <svg className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MaidProfiles = () => {
  const { ref: sectionRef, hasIntersected } = useIntersectionObserver();
  const navigate = useNavigate();
  
  const titleRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      animations.fadeInUp(element);
    }
  }, [hasIntersected]);

  const statsRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      animations.staggerChildren(element, '.stat-item', 0.1);
      
      // Animate counter numbers
      const counters = element.querySelectorAll('.counter');
      counters.forEach((counter, index) => {
        const endValue = parseInt(counter.dataset.count);
        animations.countUp(counter, endValue, 2 + index * 0.2);
      });
    }
  }, [hasIntersected]);

  const handleViewAllMaids = () => {
    navigate('/services');
  };

  const handleBecomePartner = () => {
    navigate('/partner');
  };

  return (
    <section ref={sectionRef} className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Đội ngũ người giúp việc chuyên nghiệp
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Tất cả người giúp việc đều được xác minh danh tính, kiểm tra lý lịch 
            và đào tạo chuyên nghiệp
          </p>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="stat-item text-center">
            <div className="counter text-3xl lg:text-4xl font-bold text-primary-600" data-count={maidStats.totalMaids}>0</div>
            <div className="text-neutral-600 mt-1">Người giúp việc</div>
          </div>
          <div className="stat-item text-center">
            <div className="text-3xl lg:text-4xl font-bold text-secondary-600">
              <span className="counter" data-count={maidStats.averageRating * 10}>0</span>/50
            </div>
            <div className="text-neutral-600 mt-1">Đánh giá TB</div>
          </div>
          <div className="stat-item text-center">
            <div className="counter text-3xl lg:text-4xl font-bold text-accent-600" data-count={maidStats.totalBookings}>0</div>
            <div className="text-neutral-600 mt-1">Đơn hoàn thành</div>
          </div>
          <div className="stat-item text-center">
            <div className="text-3xl lg:text-4xl font-bold text-green-600">
              <span className="counter" data-count={maidStats.satisfactionRate}>0</span>%
            </div>
            <div className="text-neutral-600 mt-1">Hài lòng</div>
          </div>
        </div>

        {/* Maid Profiles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maids.map((maid, index) => (
            <MaidCard key={maid.id} maid={maid} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 space-y-4">
          <Button size="lg" variant="outline" onClick={handleViewAllMaids}>
            Xem tất cả người giúp việc
          </Button>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="ghost" onClick={handleBecomePartner}>
              Trở thành đối tác
            </Button>
                    <Button variant="ghost" onClick={() => navigate('/services')}>
          Xem dịch vụ
        </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaidProfiles;
