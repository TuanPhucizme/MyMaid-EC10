import React, { useState } from 'react';
import { 
  Star, Heart, Zap, Shield, Award, Sparkles, 
  Search, User, Mail, Phone, MapPin 
} from 'lucide-react';
import {
  PremiumButton,
  PremiumCard,
  PremiumLoader,
  PremiumModal,
  PremiumInput,
  PremiumAddressSelector
} from '../components/premium';

const PremiumShowcase = () => {
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-primary-500" size={32} />
            <h1 className="text-4xl font-bold text-neutral-900">Premium UI Showcase</h1>
            <Sparkles className="text-secondary-500" size={32} />
          </div>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Khám phá bộ sưu tập components premium với GSAP animations và TailwindCSS
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Premium Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PremiumCard className="p-6">
              <h3 className="font-semibold mb-4">Variants</h3>
              <div className="space-y-3">
                <PremiumButton variant="primary" className="w-full">Primary</PremiumButton>
                <PremiumButton variant="secondary" className="w-full">Secondary</PremiumButton>
                <PremiumButton variant="accent" className="w-full">Accent</PremiumButton>
                <PremiumButton variant="success" className="w-full">Success</PremiumButton>
              </div>
            </PremiumCard>

            <PremiumCard className="p-6">
              <h3 className="font-semibold mb-4">With Icons</h3>
              <div className="space-y-3">
                <PremiumButton variant="primary" icon={Star} className="w-full">
                  Rate Us
                </PremiumButton>
                <PremiumButton variant="error" icon={Heart} iconPosition="right" className="w-full">
                  Favorite
                </PremiumButton>
                <PremiumButton variant="warning" icon={Zap} className="w-full">
                  Quick Action
                </PremiumButton>
              </div>
            </PremiumCard>

            <PremiumCard className="p-6">
              <h3 className="font-semibold mb-4">States</h3>
              <div className="space-y-3">
                <PremiumButton variant="outline" className="w-full">Outline</PremiumButton>
                <PremiumButton variant="ghost" className="w-full">Ghost</PremiumButton>
                <PremiumButton variant="glass" className="w-full">Glass</PremiumButton>
                <PremiumButton variant="primary" loading className="w-full">
                  Loading
                </PremiumButton>
              </div>
            </PremiumCard>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Premium Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PremiumCard variant="default" className="p-6 text-center">
              <Shield className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Default Card</h3>
              <p className="text-sm text-neutral-600">Clean and minimal design</p>
            </PremiumCard>

            <PremiumCard variant="primary" className="p-6 text-center">
              <Award className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Primary Card</h3>
              <p className="text-sm text-primary-700">Branded color scheme</p>
            </PremiumCard>

            <PremiumCard variant="glass" className="p-6 text-center">
              <Sparkles className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">Glass Card</h3>
              <p className="text-sm text-white/80">Glassmorphism effect</p>
            </PremiumCard>

            <PremiumCard variant="gradient" className="p-6 text-center">
              <Zap className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Gradient Card</h3>
              <p className="text-sm text-white/90">Vibrant gradients</p>
            </PremiumCard>
          </div>
        </section>

        {/* Loaders Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Premium Loaders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            <PremiumCard className="p-6 text-center">
              <PremiumLoader type="spinner" />
              <p className="text-xs mt-2">Spinner</p>
            </PremiumCard>

            <PremiumCard className="p-6 text-center">
              <PremiumLoader type="dots" />
              <p className="text-xs mt-2">Dots</p>
            </PremiumCard>

            <PremiumCard className="p-6 text-center">
              <PremiumLoader type="pulse" />
              <p className="text-xs mt-2">Pulse</p>
            </PremiumCard>

            <PremiumCard className="p-6 text-center">
              <PremiumLoader type="bars" />
              <p className="text-xs mt-2">Bars</p>
            </PremiumCard>

            <PremiumCard className="p-6 text-center">
              <PremiumLoader type="wave" />
              <p className="text-xs mt-2">Wave</p>
            </PremiumCard>

            <PremiumCard className="p-6 text-center">
              <PremiumLoader type="ring" />
              <p className="text-xs mt-2">Ring</p>
            </PremiumCard>

            <PremiumCard className="p-6 text-center">
              <PremiumLoader type="gradient" />
              <p className="text-xs mt-2">Gradient</p>
            </PremiumCard>

            <PremiumCard className="p-6 text-center">
              <PremiumLoader type="morphing" />
              <p className="text-xs mt-2">Morphing</p>
            </PremiumCard>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Premium Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PremiumCard className="p-6">
              <h3 className="font-semibold mb-4">Default Inputs</h3>
              <div className="space-y-4">
                <PremiumInput
                  label="Full Name"
                  placeholder="Enter your name"
                  icon={User}
                  required
                />
                <PremiumInput
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  icon={Mail}
                />
                <PremiumInput
                  label="Phone"
                  type="tel"
                  placeholder="Enter your phone"
                  icon={Phone}
                />
              </div>
            </PremiumCard>

            <PremiumCard className="p-6">
              <h3 className="font-semibold mb-4">Variants</h3>
              <div className="space-y-4">
                <PremiumInput
                  variant="glass"
                  label="Glass Input"
                  placeholder="Glass effect"
                  icon={Search}
                />
                <PremiumInput
                  variant="minimal"
                  label="Minimal Input"
                  placeholder="Minimal design"
                />
                <PremiumInput
                  variant="filled"
                  label="Filled Input"
                  placeholder="Filled background"
                  success="Looks good!"
                />
              </div>
            </PremiumCard>
          </div>
        </section>

        {/* Address Selector Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Premium Address Selector</h2>
          <div className="max-w-2xl mx-auto">
            <PremiumCard className="p-8">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <MapPin className="text-primary-500" />
                Chọn địa chỉ Việt Nam
              </h3>
              <PremiumAddressSelector
                value={address}
                onChange={setAddress}
                placeholder="Nhập địa chỉ hoặc chọn từ gợi ý..."
                onAddressSelect={(data) => {
                  console.log('Selected address:', data);
                }}
              />
              {address && (
                <div className="mt-4 p-4 bg-primary-50 rounded-xl">
                  <p className="text-sm text-primary-700">
                    <strong>Địa chỉ đã chọn:</strong> {address}
                  </p>
                </div>
              )}
            </PremiumCard>
          </div>
        </section>

        {/* Modal Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Premium Modal</h2>
          <div className="text-center">
            <PremiumButton 
              variant="primary" 
              onClick={() => setShowModal(true)}
              icon={Sparkles}
            >
              Open Premium Modal
            </PremiumButton>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Interactive Demo</h2>
          <PremiumCard variant="gradient" className="p-8 text-center text-white">
            <Sparkles className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Premium Experience</h3>
            <p className="text-lg mb-6 text-white/90">
              Trải nghiệm giao diện premium với animations mượt mà và thiết kế hiện đại
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <PremiumButton variant="glass" icon={Star}>
                Rate Experience
              </PremiumButton>
              <PremiumButton variant="outline" className="border-white text-white hover:bg-white hover:text-neutral-900">
                Learn More
              </PremiumButton>
            </div>
          </PremiumCard>
        </section>
      </div>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Premium Modal"
        variant="glass"
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-center">
            <Sparkles className="w-16 h-16 text-primary-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Welcome to Premium UI</h3>
            <p className="text-neutral-600">
              This modal demonstrates the premium design system with GSAP animations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-xl">
              <Shield className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <h4 className="font-semibold">Secure</h4>
              <p className="text-sm text-neutral-600">Enterprise-grade security</p>
            </div>
            <div className="text-center p-4 bg-secondary-50 rounded-xl">
              <Zap className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
              <h4 className="font-semibold">Fast</h4>
              <p className="text-sm text-neutral-600">Lightning-fast performance</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <PremiumButton variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </PremiumButton>
            <PremiumButton variant="primary" onClick={() => setShowModal(false)}>
              Got it!
            </PremiumButton>
          </div>
        </div>
      </PremiumModal>
    </div>
  );
};

export default PremiumShowcase;
