import React from "react";
import { useGSAP, animations } from '../hooks/useGSAP';
import Button from '../components/ui/Button';

export default function AboutUs() {
  const aboutRef = useGSAP((gsap, element) => {
    animations.fadeInUp(element, '.about-content', 0.2);
    animations.fadeInUp(element, '.about-image', 0.4);
  });

  return (
    <div className="pt-20 pb-16 bg-gradient-to-br from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            Về <span className="text-primary-600">MyMaid</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Dịch vụ dọn dẹp nhà chuyên nghiệp, uy tín và tiện lợi tại Việt Nam
          </p>
        </div>

        <div ref={aboutRef} className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="about-content space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-neutral-900">
                Giải pháp toàn diện cho không gian sống sạch sẽ
              </h2>
              <p className="text-lg text-neutral-700 leading-relaxed">
                <strong>MyMaid</strong> là dịch vụ dọn dẹp nhà chuyên nghiệp, uy tín
                và tiện lợi tại Việt Nam. Chúng tôi mang đến giải pháp giúp gia đình
                bạn luôn sạch sẽ, thoải mái mà không mất nhiều thời gian.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed">
                Dịch vụ của chúng tôi bao gồm dọn dẹp định kỳ, tổng vệ sinh, vệ sinh
                sofa, máy lạnh, chuyển nhà và nhiều tiện ích khác. Đội ngũ nhân viên
                thân thiện, được đào tạo kỹ lưỡng, mang đến trải nghiệm hài lòng
                tuyệt đối.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed">
                Hãy để <strong>MyMaid</strong> đồng hành cùng bạn trong hành trình xây dựng
                không gian sống sạch sẽ và ngăn nắp!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-neutral-100">
                <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
                <div className="text-sm text-neutral-600">Khách hàng hài lòng</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-neutral-100">
                <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                <div className="text-sm text-neutral-600">Nhân viên chuyên nghiệp</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1">
                Đặt dịch vụ ngay
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                Liên hệ tư vấn
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="about-image relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="MyMaid Service"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 max-w-xs">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">Chất lượng đảm bảo</div>
                  <div className="text-sm text-neutral-600">100% hài lòng</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Tiết kiệm thời gian</h3>
            <p className="text-neutral-600">Để chúng tôi lo việc dọn dẹp, bạn có thêm thời gian cho những điều quan trọng</p>
          </div>

          <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">An toàn & Đáng tin cậy</h3>
            <p className="text-neutral-600">Nhân viên được đào tạo kỹ lưỡng, bảo hiểm đầy đủ, đảm bảo an toàn tuyệt đối</p>
          </div>

          <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Dịch vụ linh hoạt</h3>
            <p className="text-neutral-600">Đa dạng gói dịch vụ, linh hoạt theo nhu cầu và ngân sách của bạn</p>
          </div>
        </div>
      </div>
    </div>
  );
}
