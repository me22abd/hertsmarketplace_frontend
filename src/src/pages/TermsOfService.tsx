import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section className="mb-12">
            <p className="text-gray-700 leading-relaxed mb-6">
              Welcome to HertsMarketplace ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of our peer-to-peer marketplace platform designed exclusively for University of Hertfordshire students.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              By accessing or using HertsMarketplace, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access or use our platform.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please read these Terms carefully before using our service. We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By creating an account, accessing, or using HertsMarketplace, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy, which is incorporated herein by reference.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you do not agree to these Terms, you must not use our platform. Your continued use of the platform after changes to these Terms constitutes acceptance of those changes.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility and Account Registration</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.1 Eligibility</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              HertsMarketplace is exclusively available to current students, faculty, and staff of the University of Hertfordshire. To use our platform, you must:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Be at least 18 years of age</li>
              <li>Have a valid University of Hertfordshire email address (@herts.ac.uk)</li>
              <li>Be currently enrolled or employed at the University</li>
              <li>Have the legal capacity to enter into binding agreements</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Account Registration</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To create an account, you must provide accurate, current, and complete information. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Ensuring your account information remains accurate and up-to-date</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              You may not create multiple accounts or share your account with others. We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Platform Use and User Conduct</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.1 Permitted Use</h3>
            <p className="text-gray-700 leading-relaxed mb-4">You may use HertsMarketplace to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Browse and search for items listed by other users</li>
              <li>Create listings for items you wish to sell</li>
              <li>Communicate with other users about listings</li>
              <li>Save listings for later viewing</li>
              <li>Report inappropriate content or behavior</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Prohibited Activities</h3>
            <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Use the platform for any illegal purpose or in violation of any laws</li>
              <li>Post false, misleading, or fraudulent listings</li>
              <li>List prohibited items (see Section 4)</li>
              <li>Harass, abuse, threaten, or harm other users</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Spam, send unsolicited messages, or engage in phishing</li>
              <li>Interfere with or disrupt the platform's operation</li>
              <li>Attempt to gain unauthorized access to the platform or other users' accounts</li>
              <li>Use automated systems (bots, scrapers) to access the platform without permission</li>
              <li>Circumvent any security measures or access controls</li>
              <li>Collect or harvest information about other users without consent</li>
              <li>Post content that infringes on intellectual property rights</li>
              <li>Post offensive, discriminatory, or inappropriate content</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prohibited Items</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You may not list the following items on HertsMarketplace:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Illegal Items:</strong> Drugs, controlled substances, weapons, stolen goods, or any item whose sale is prohibited by law</li>
              <li><strong>Dangerous Items:</strong> Explosives, flammable materials, or items that pose a safety risk</li>
              <li><strong>Counterfeit Goods:</strong> Fake or replica items that infringe on trademarks or copyrights</li>
              <li><strong>Adult Content:</strong> Pornographic or sexually explicit materials</li>
              <li><strong>Personal Information:</strong> Data, accounts, or credentials belonging to others</li>
              <li><strong>Services:</strong> Professional services, tutoring, or other non-physical offerings (unless specifically permitted)</li>
              <li><strong>Animals:</strong> Live animals or pets</li>
              <li><strong>Alcohol and Tobacco:</strong> Alcoholic beverages or tobacco products</li>
              <li><strong>Prescription Medications:</strong> Prescription drugs or medical devices</li>
              <li><strong>Hazardous Materials:</strong> Chemicals, batteries, or other hazardous substances</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to remove any listing that violates these restrictions or that we determine is inappropriate for our platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Listings and Content</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.1 Listing Requirements</h3>
            <p className="text-gray-700 leading-relaxed mb-4">When creating a listing, you must:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Provide accurate and complete information about the item</li>
              <li>Use clear, high-quality images that accurately represent the item</li>
              <li>Set a fair and reasonable price</li>
              <li>Accurately describe the item's condition</li>
              <li>Select the appropriate category</li>
              <li>Respond promptly to inquiries from potential buyers</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 Content Ownership</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You retain ownership of content you post on HertsMarketplace. However, by posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, reproduce, and distribute your content for the purpose of operating and promoting the platform.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.3 Content Moderation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to review, edit, remove, or refuse to post any content that violates these Terms or that we determine is inappropriate, harmful, or violates the rights of others.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Transactions and Payments</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.1 Transaction Facilitation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              HertsMarketplace is a platform that connects buyers and sellers. We do not participate in transactions, process payments, or handle the exchange of goods. All transactions are conducted directly between users.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.2 User Responsibilities</h3>
            <p className="text-gray-700 leading-relaxed mb-4">Buyers and sellers are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Negotiating the terms of sale, including price, payment method, and delivery/pickup arrangements</li>
              <li>Completing transactions in good faith</li>
              <li>Resolving disputes directly with each other</li>
              <li>Ensuring compliance with all applicable laws and regulations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.3 No Warranty</h3>
            <p className="text-gray-700 leading-relaxed">
              We do not guarantee the quality, safety, legality, or accuracy of listings. We are not responsible for the condition of items, the accuracy of descriptions, or the completion of transactions. All transactions are at your own risk.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The HertsMarketplace platform, including its design, features, functionality, and content (excluding user-generated content), is owned by us and protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Copy, modify, or create derivative works of the platform</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use our trademarks, logos, or branding without permission</li>
              <li>Remove any copyright or proprietary notices</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              You retain ownership of content you post, but grant us a license to use it as described in Section 5.2.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers and Limitation of Liability</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.1 Platform Disclaimer</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              HertsMarketplace is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>The platform will be uninterrupted, secure, or error-free</li>
              <li>Defects will be corrected</li>
              <li>The platform is free of viruses or harmful components</li>
              <li>Listings are accurate, complete, or reliable</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.2 Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the maximum extent permitted by law, HertsMarketplace and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages arising from transactions between users</li>
              <li>Damages resulting from unauthorized access to your account</li>
              <li>Damages resulting from platform downtime or technical issues</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Our total liability for any claims arising from your use of the platform shall not exceed the amount you paid us (if any) in the 12 months preceding the claim, or £100, whichever is greater.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify, defend, and hold harmless HertsMarketplace, its operators, employees, and affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Your use of the platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another user or third party</li>
              <li>Content you post on the platform</li>
              <li>Transactions you conduct through the platform</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Account Termination</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">10.1 Termination by You</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may terminate your account at any time by contacting us or using account deletion features (if available). Upon termination, your access to the platform will cease, but some information may be retained as required by law or for legitimate business purposes.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">10.2 Termination by Us</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to suspend or terminate your account immediately, without notice, if you:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Violate these Terms or our policies</li>
              <li>Engage in fraudulent, illegal, or harmful activities</li>
              <li>No longer have a valid University of Hertfordshire email address</li>
              <li>Fail to respond to our communications regarding violations</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              We may also suspend or terminate accounts for any reason, with or without notice, at our sole discretion.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">11.1 User Disputes</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Disputes between users regarding transactions should be resolved directly between the parties involved. We are not responsible for mediating or resolving disputes between users.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">11.2 Disputes with Us</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have a dispute with us, you agree to first contact us to attempt to resolve the dispute informally. If we cannot resolve the dispute within 60 days, you agree to resolve disputes through binding arbitration in accordance with the laws of England and Wales, unless prohibited by law.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the courts of England and Wales.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of material changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Posting the updated Terms on this page</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending email notifications for significant changes (when possible)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Your continued use of the platform after changes become effective constitutes acceptance of the modified Terms. If you do not agree to the changes, you must stop using the platform and may terminate your account.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Entire Agreement</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and HertsMarketplace regarding your use of the platform and supersede all prior agreements and understandings.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-2"><strong>HertsMarketplace</strong></p>
              <p className="text-gray-700 mb-2">Email: legal@hertsmarketplace.com</p>
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
