import React, { useState } from "react";
import { useGSAP, animations } from '../hooks/useGSAP';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const blogPosts = [
  {
    id: 1,
    title: "5 mẹo đơn giản để giữ nhà luôn thơm mát",
    summary: "Khám phá các bí quyết tự nhiên giúp không gian sống của bạn luôn dễ chịu và thơm mát suốt ngày.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Mẹo vặt",
    readTime: "5 phút",
    date: "15/12/2024"
  },
  {
    id: 2,
    title: "Cách tẩy vết ố lâu ngày trong nhà tắm",
    summary: "Những nguyên liệu dễ kiếm và hiệu quả bất ngờ giúp làm sạch nhà tắm sáng bóng như mới.",
    image: "https://images.unsplash.com/photo-1572742482459-e04d6cfdd6f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Vệ sinh",
    readTime: "7 phút",
    date: "12/12/2024"
  },
  {
    id: 3,
    title: "Bí quyết giặt chăn ga sạch như mới",
    summary: "Bạn có biết cách giặt mà vẫn giữ được màu sắc và độ mềm mại của chăn ga? Hãy khám phá ngay!",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Giặt giũ",
    readTime: "6 phút",
    date: "10/12/2024"
  },
  {
    id: 4,
    title: "Hướng dẫn dọn dẹp bếp hiệu quả trong 30 phút",
    summary: "Công thức dọn dẹp bếp nhanh chóng và hiệu quả, giúp không gian nấu nướng luôn sạch sẽ.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Dọn dẹp",
    readTime: "8 phút",
    date: "08/12/2024"
  },
  {
    id: 5,
    title: "Cách bảo quản đồ da bền đẹp",
    summary: "Những phương pháp đơn giản giúp đồ da của bạn luôn mới và bền đẹp theo thời gian.",
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Bảo quản",
    readTime: "4 phút",
    date: "05/12/2024"
  },
  {
    id: 6,
    title: "Mẹo vệ sinh máy lạnh tại nhà",
    summary: "Hướng dẫn chi tiết cách vệ sinh máy lạnh đúng cách để tăng tuổi thọ và hiệu quả làm mát.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80",
    category: "Vệ sinh",
    readTime: "10 phút",
    date: "03/12/2024"
  }
];

const categories = ["Tất cả", "Mẹo vặt", "Vệ sinh", "Giặt giũ", "Dọn dẹp", "Bảo quản"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  const blogRef = useGSAP((gsap, element) => {
    animations.fadeInUp(element, '.blog-header', 0.2);
    animations.fadeInUp(element, '.blog-filters', 0.3);
    animations.staggerChildren(element, '.blog-card', 0.1);
  });

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "Tất cả" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-20 pb-16 bg-gradient-to-br from-neutral-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={blogRef} className="blog-header text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            Mẹo Vặt <span className="text-primary-600">Dọn Dẹp</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Khám phá những bí quyết hữu ích giúp không gian sống của bạn luôn sạch sẽ và ngăn nắp
          </p>
        </div>

        {/* Search and Filters */}
        <div className="blog-filters mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <Card key={post.id} className="blog-card group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex items-center space-x-2 text-white text-sm">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {post.readTime}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-neutral-500 mb-3">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {post.date}
                </div>
                
                <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-neutral-600 mb-4 line-clamp-3">
                  {post.summary}
                </p>
                
                <Button variant="ghost" className="group-hover:bg-primary-50 group-hover:text-primary-600">
                  Đọc thêm
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Không tìm thấy bài viết</h3>
            <p className="text-neutral-600 mb-6">Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
            <Button onClick={() => { setSearchTerm(""); setSelectedCategory("Tất cả"); }}>
              Xem tất cả bài viết
            </Button>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 lg:p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Đăng ký nhận mẹo vặt hàng tuần
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Nhận những bí quyết dọn dẹp mới nhất và ưu đãi đặc biệt từ MyMaid
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 rounded-lg text-neutral-900 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <Button variant="secondary" size="lg">
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
