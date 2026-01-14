import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Truck, Smartphone, Shield, GraduationCap, Star, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      navigate('/register', { state: { email } });
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center group-hover:bg-primary-dark transition-colors"
            >
              <ShoppingBag className="text-white" size={24} />
            </motion.div>
            <div className="text-2xl font-bold">
              <span className="text-primary">Herts</span>
              <span className="text-gray-800">Marketplace</span>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Log in
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md inline-block">
                Sign up
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-28 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Main content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 hover:bg-primary/15 transition-colors">
                "Saved £500 on textbooks this semester!"
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight"
            >
              Buy and Sell <span className="text-primary block mt-1">Anything</span> <span className="block mt-1">on Campus</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Connect with verified students, find great deals, and make campus life easier.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleGetStarted}
              className="space-y-4 mb-8"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your @herts.ac.uk email"
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg transition-all focus:scale-[1.01]"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl group"
              >
                <span className="inline-flex items-center gap-2">
                  Get started
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </motion.form>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-500 fill-yellow-500" size={20} />
                <span className="font-semibold">4.9/5 Student Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="text-primary" size={20} />
                <span className="font-semibold">150+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="text-primary" size={20} />
                <span className="font-semibold">Same day delivery and pick up</span>
              </div>
            </div>
          </div>

          {/* Right side - SaaS Style Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative flex items-center justify-center"
          >
            {/* Background accent */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent rounded-full blur-3xl"></div>
            </div>

            {/* Main illustration container */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl"
            >
              <img
                src="/3d-students-illustration.png"
                alt="3D student marketplace illustration"
                className="w-full h-auto rounded-2xl"
                loading="eager"
              />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-max"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-full px-6 py-3 shadow-xl border border-primary/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <GraduationCap className="text-primary" size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-500 font-medium">Active students</p>
                      <p className="text-sm font-bold text-primary">150+ trading now</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">How it works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Get anything and everything you need for your campus life in three simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Search, title: "Browse & Search", desc: "Find textbooks, electronics, supplies, and more by searching our vast student marketplace.", delay: 0 },
              { icon: ShoppingCart, title: "Add to Cart", desc: "Connect directly with student sellers and arrange deals for the best price on campus.", delay: 0.1 },
              { icon: Truck, title: "Choose pickup/delivery", desc: "Get campus delivery or arrange pickup from students directly on your schedule.", delay: 0.2 },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: item.delay }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/15 transition-colors"
                >
                  <item.icon className="text-primary" size={40} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What students are buying */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">What students are buying</h2>
            <p className="text-xl text-gray-600">Popular items across all campus categories</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { emoji: "📚", icon: "📖", title: "Textbooks", desc: "Buy or sell used books and rent digital versions", delay: 0 },
              { emoji: "💻", icon: "💻", title: "Electronics", desc: "Laptops, tablets, and gadgets from fellow students", delay: 0.1 },
              { emoji: "🛋️", icon: "🏠", title: "Dorm Essentials", desc: "Furniture, decor, and everything you need for your room", delay: 0.2 },
              { emoji: "☕", icon: "☕", title: "Food & Snacks", desc: "Grab snacks, meal prep, and campus dining deals", delay: 0.3 },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: item.delay }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center text-7xl"
                  >
                    {item.emoji}
                  </motion.div>
                  <div className="absolute top-4 left-4 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why students choose */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">Why students choose HertsMarketplace</h2>
            <p className="text-xl text-gray-600">Built by students, for students. We understand what you need.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Smartphone, title: "Easy to Use", desc: "Simple and intuitive interface designed for students", delay: 0 },
              { icon: GraduationCap, title: "Campus Community", desc: "Connect with verified students from your campus", delay: 0.1 },
              { icon: Shield, title: "Safe Trading", desc: "Secure transactions within your trusted campus network", delay: 0.2 },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: item.delay }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/15 transition-colors"
                >
                  <item.icon className="text-primary" size={40} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">Join 150+ students already saving</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8 hover:shadow-2xl transition-shadow"
          >
            <p className="text-xl text-gray-700 mb-4 italic">"I saved over £800 on textbooks during my first year. The app made buying from other students so easy. 10/10 would recommend!"</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 hover:shadow-2xl transition-shadow"
          >
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                >
                  <Star className="text-primary fill-primary" size={24} />
                </motion.div>
              ))}
            </div>
            <p className="text-2xl font-bold text-gray-900 text-center mb-2">"This is a game changer"</p>
            <p className="text-gray-600 text-center">— Student, University of Hertfordshire</p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Friendly & Minimal */}
      <section className="bg-gradient-to-b from-white to-primary/5 py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Friendly Mascot Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <img
                src="/student-mascot.png"
                alt="Friendly student mascot"
                className="w-64 h-auto md:w-80"
                loading="lazy"
              />
            </motion.div>
          </motion.div>

          {/* Friendly Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Ready to start trading?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-600 mb-8 max-w-xl mx-auto"
          >
            Join your fellow students and discover great deals today
          </motion.p>

          {/* Single CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Create your account
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Subtle tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-sm text-gray-500 mt-6"
          >
            Free to join • Student-verified • Safe & secure
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo and Brand */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4 group">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:bg-primary-dark transition-colors">
                  <ShoppingBag className="text-white" size={20} />
                </div>
                <div className="text-xl font-bold">
                  <span className="text-primary">Herts</span>
                  <span className="text-gray-800">Marketplace</span>
                </div>
              </Link>
              <p className="text-sm text-gray-600">
                Built for University of Hertfordshire students
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-primary transition-colors text-sm"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-gray-600 hover:text-primary transition-colors text-sm"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-600 hover:text-primary transition-colors text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-600 hover:text-primary transition-colors text-sm"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:support@hertsmarketplace.com"
                    className="text-gray-600 hover:text-primary transition-colors text-sm"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} HertsMarketplace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
