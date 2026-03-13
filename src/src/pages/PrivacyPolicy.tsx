import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:bg-primary-dark transition-colors">
              <ShoppingBag className="text-white" size={20} />
            </div>
            <div className="text-xl font-bold">
              <span className="text-primary">Herts</span>
              <span className="text-gray-800">Marketplace</span>
            </div>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section className="mb-12">
            <p className="text-gray-700 leading-relaxed mb-6">
              Welcome to HertsMarketplace ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, which is designed exclusively for University of Hertfordshire students.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using HertsMarketplace, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">1.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Account Information:</strong> When you register, we collect your email address (@herts.ac.uk), password, name, and optionally your course of study.</li>
              <li><strong>Profile Information:</strong> You may provide additional information such as a profile photo and course details.</li>
              <li><strong>Listing Information:</strong> When creating listings, we collect details about items you're selling, including descriptions, images, prices, and condition.</li>
              <li><strong>Communication Data:</strong> Messages sent through our platform between buyers and sellers.</li>
              <li><strong>Report Information:</strong> If you report a listing or user, we collect the details of your report.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">1.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Usage Data:</strong> Information about how you interact with our platform, including pages visited, time spent, and actions taken.</li>
              <li><strong>Device Information:</strong> IP address, browser type, device type, operating system, and unique device identifiers.</li>
              <li><strong>Location Data:</strong> General location information based on your IP address (we do not collect precise GPS location).</li>
              <li><strong>Cookies and Tracking:</strong> We use cookies and similar technologies to enhance your experience and analyze platform usage.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Platform Operation:</strong> To provide, maintain, and improve our marketplace services.</li>
              <li><strong>User Authentication:</strong> To verify your identity and ensure only University of Hertfordshire students can access the platform.</li>
              <li><strong>Communication:</strong> To facilitate messaging between buyers and sellers and send you important updates about your account or listings.</li>
              <li><strong>Transaction Facilitation:</strong> To help connect buyers and sellers and manage listings.</li>
              <li><strong>Safety and Security:</strong> To detect, prevent, and address fraud, abuse, and other harmful activities.</li>
              <li><strong>Moderation:</strong> To review and moderate content, handle reports, and enforce our Terms of Service.</li>
              <li><strong>Analytics:</strong> To understand how users interact with our platform and improve user experience.</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We do not sell your personal information. We may share your information only in the following circumstances:</p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.1 Public Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Your profile information (name, course, profile photo) is visible to other users on the platform.</li>
              <li>Your listings, including images and descriptions, are publicly visible to all platform users.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Service Providers</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may share information with third-party service providers who assist us in operating our platform, such as hosting providers, analytics services, and email services. These providers are contractually obligated to protect your information.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.3 Legal Requirements</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may disclose your information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect our rights, property, or safety, or that of our users.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.4 Business Transfers</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Security measures include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Secure password storage using industry-standard hashing</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication mechanisms</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Access:</strong> You can access and review your personal information through your account settings.</li>
              <li><strong>Correction:</strong> You can update or correct your profile information at any time.</li>
              <li><strong>Deletion:</strong> You can request deletion of your account and associated data, subject to legal retention requirements.</li>
              <li><strong>Data Portability:</strong> You can request a copy of your data in a machine-readable format.</li>
              <li><strong>Opt-Out:</strong> You can opt out of non-essential communications, though we may still send important account-related messages.</li>
              <li><strong>Cookie Preferences:</strong> You can manage cookie preferences through your browser settings.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to track activity on our platform and store certain information. Cookies are small data files stored on your device.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">We use cookies for:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Authentication and session management</li>
              <li>Remembering your preferences</li>
              <li>Analyzing platform usage and performance</li>
              <li>Improving user experience</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
            <p className="text-gray-700 leading-relaxed">
              When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal, regulatory, or legitimate business purposes.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              HertsMarketplace is designed for University of Hertfordshire students, who are typically 18 years or older. We do not knowingly collect personal information from individuals under 18 years of age. If you believe we have collected information from someone under 18, please contact us immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. By using our platform, you consent to the transfer of your information to these countries.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-2"><strong>HertsMarketplace</strong></p>
              <p className="text-gray-700 mb-2">Email: privacy@hertsmarketplace.com</p>
              <p className="text-gray-700">University of Hertfordshire</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
