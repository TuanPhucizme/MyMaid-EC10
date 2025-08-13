import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogPosts, blogCategories } from '../data/blog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { useGSAP, animations } from '../hooks/useGSAP';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const BlogCard = ({ post, index, featured = false }) => {
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

  const handleCardClick = () => {
    // Navigate to blog detail page
    navigate(`/blog/${post.id}`);
  };

  return (
    <div ref={ref} className={featured ? 'md:col-span-2' : ''}>
      <Card ref={cardRef} className="h-full group cursor-pointer hover:shadow-large transition-all duration-300" onClick={handleCardClick}>
        <div className="relative overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              featured ? 'h-64' : 'h-48'
            }`}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="primary" size="sm">
              {post.category}
            </Badge>
            {post.featured && (
              <Badge variant="warning" size="sm">
                Nổi bật
              </Badge>
            )}
          </div>
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
            {post.readTime}
          </div>
        </div>
        
        <CardHeader>
          <div className="flex items-center space-x-4 mb-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="text-sm">
              <p className="font-medium text-neutral-900">{post.author.name}</p>
              <p className="text-neutral-500">{post.author.role}</p>
            </div>
          </div>
          
          <CardTitle className={featured ? 'text-xl' : 'text-lg'}>
            {post.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-neutral-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="outline" size="sm">
                #{tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-neutral-500">
            <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{post.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{post.likes}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const BlogSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { ref: sectionRef, hasIntersected } = useIntersectionObserver();
  const navigate = useNavigate();
  
  const titleRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      animations.fadeInUp(element);
    }
  }, [hasIntersected]);

  const categoriesRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      animations.staggerChildren(element, '.category-item', 0.1);
    }
  }, [hasIntersected]);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured).slice(0, 4);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    navigate('/blog', { state: { category: categoryId } });
  };

  const handleViewAllPosts = () => {
    navigate('/blog');
  };

  const handleNewsletterSignup = () => {
    // Handle newsletter signup
    console.log('Newsletter signup');
  };

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Mẹo vặt & Kinh nghiệm
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Khám phá những mẹo hay, kinh nghiệm thực tế và hướng dẫn chi tiết 
            về dọn dẹp nhà cửa và chăm sóc gia đình
          </p>
        </div>

        {/* Categories */}
        <div ref={categoriesRef} className="flex flex-wrap justify-center gap-4 mb-12">
          <div 
            className={`category-item rounded-full px-4 py-2 text-sm font-medium hover:scale-105 transition-transform cursor-pointer ${
              selectedCategory === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            onClick={() => handleCategoryClick('all')}
          >
            Tất cả ({blogPosts.length})
          </div>
          {blogCategories.map((category, index) => (
            <div 
              key={category.id} 
              className={`category-item rounded-full px-4 py-2 text-sm font-medium hover:scale-105 transition-transform cursor-pointer ${
                selectedCategory === category.id 
                  ? 'bg-primary-600 text-white' 
                  : category.color
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name} ({category.count})
            </div>
          ))}
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-neutral-900 mb-8">Bài viết nổi bật</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} featured />
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-neutral-900 mb-8">Bài viết mới nhất</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regularPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-neutral-900 mb-4">
            Đăng ký nhận bài viết mới
          </h3>
          <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
            Nhận những mẹo vặt hữu ích, hướng dẫn chi tiết và ưu đãi đặc biệt 
            qua email mỗi tuần
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
            <Button onClick={handleNewsletterSignup}>
              Đăng ký ngay
            </Button>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 space-y-4">
          <Button size="lg" variant="outline" onClick={handleViewAllPosts}>
            Xem tất cả bài viết
          </Button>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="ghost" onClick={() => navigate('/services')}>
              Đặt dịch vụ ngay
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

export default BlogSection;
