import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiMail, FiPhone, FiMapPin, FiGlobe } from 'react-icons/fi';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  const location = useLocation();
  const isTerms = location.pathname.includes('/terms');

  return (
    <div className="privacy-page-root">
      {/* Background Glow Effects */}
      <div className="privacy-ambient-bg">
        <div className="privacy-glow-1"></div>
        <div className="privacy-glow-2"></div>
      </div>

      {/* Header */}
      <header className="privacy-header">
        <div className="privacy-container privacy-header-content">
          <Link to="/" className="privacy-brand">
            <div className="privacy-logo-box">
              <img src="/logo.png" alt="KT Logo" />
            </div>
            <span className="privacy-brand-name">
              KIAAN <span>TECHNOLOGY</span>
            </span>
          </Link>
          <Link to="/" className="privacy-back-btn">
            <FiArrowLeft /> Back to Landing Page
          </Link>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="privacy-container privacy-main-content">
        <div className="privacy-hero-badge">
          <FiShield /> LEGAL & COMPLIANCE
        </div>
        <h1 className="privacy-title">{isTerms ? 'Terms & Conditions' : 'Privacy Policy'}</h1>
        <p className="privacy-last-updated">Last Updated: August 15, 2026</p>

        <div className="privacy-card">
          {isTerms ? (
            <>
              <p className="privacy-intro">
                Welcome to <strong>Kiaan Technology Private Limited</strong>. These Terms & Conditions govern your access to and use of our website (<a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer">https://kiaantechnology.com/</a>), SaaS platforms, mobile applications, and laundry management services. By accessing or using our services, you agree to comply with these terms.
              </p>

              <div className="privacy-sections-grid">
                <div className="privacy-section-item">
                  <h2>1. User Account & Registration</h2>
                  <p>To access SaaS features, users must register an account with accurate business details. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</p>
                </div>

                <div className="privacy-section-item">
                  <h2>2. Subscription Plans & Payment Terms</h2>
                  <p>Subscription fees are payable in advance based on the plan selected. All payment processing is securely handled via integrated payment gateways (such as Razorpay). Rates and taxes comply with Indian IT Act 2000 guidelines.</p>
                </div>

                <div className="privacy-section-item">
                  <h2>3. Free Trial Policy</h2>
                  <p>Free trial accounts are provided for demonstration purposes. Trial access duration is strictly limited (1 Day or as specified). Each email address is eligible for only one free trial. Upon expiration, access requires plan subscription.</p>
                </div>

                <div className="privacy-section-item">
                  <h2>4. Acceptable Use</h2>
                  <p>You agree not to use the services for any unlawful purpose, interfere with system operations, reverse engineer components, or transmit unauthorized data under DPDP Act 2023 and GDPR guidelines.</p>
                </div>

                <div className="privacy-section-item">
                  <h2>5. Intellectual Property</h2>
                  <p>All software code, visual design, logos, trademarks, and content provided by Kiaan Technology Private Limited remain the exclusive property of Kiaan Technology.</p>
                </div>

                <div className="privacy-section-item">
                  <h2>6. Termination & Limitation of Liability</h2>
                  <p>We reserve the right to suspend or terminate service access for violations of these terms. In no event shall Kiaan Technology be liable for indirect or consequential damages arising out of service usage.</p>
                </div>

                <div className="privacy-section-item contact-box">
                  <h2>7. Contact Information</h2>
                  <p>For any queries regarding these Terms & Conditions, please reach out to us:</p>
                  
                  <div className="privacy-contact-details">
                    <div>
                      <strong>Company:</strong> Kiaan Technology Private Limited
                    </div>
                    <div>
                      <FiMapPin /> <strong>Address:</strong> 2341/E, Sudama Nagar, Indore, Madhya Pradesh, India
                    </div>
                    <div>
                      <FiPhone /> <strong>Phone:</strong> <a href="tel:+919752100980">+91-97521 00980</a>
                    </div>
                    <div>
                      <FiMail /> <strong>Email:</strong> <a href="mailto:info@kiaantechnology.com">info@kiaantechnology.com</a>
                    </div>
                    <div>
                      <FiGlobe /> <strong>Website:</strong> <a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer">https://kiaantechnology.com/</a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="privacy-intro">
                Welcome to <strong>Kiaan Technology Private Limited</strong>. This Privacy Policy outlines how we collect, use, process, and protect your personal information when you use our website (<a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer">https://kiaantechnology.com/</a>), SaaS platforms, mobile applications, and services (including Laundry SaaS, Payroll Management, HRMS, Job Portals, and Payment Integration). By using our services, you agree to the collection and use of information in accordance with this policy. This policy complies with the <strong>Indian IT Act 2000</strong>, <strong>DPDP Act 2023</strong>, <strong>GDPR</strong>, and app store guidelines.
              </p>

          <div className="privacy-sections-grid">
            {/* Section 1 */}
            <div className="privacy-section-item">
              <h2>1. Information Collection</h2>
              <ul>
                <li><strong>Personal Data:</strong> Name, email address, phone number, physical address, KYC documents, etc.</li>
                <li><strong>Professional Data:</strong> Employee ID, designation, salary details, and resume data for HRMS and Job portals.</li>
                <li><strong>Usage Data:</strong> IP address, browser type, device identifiers, and platform usage metrics.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="privacy-section-item">
              <h2>2. Personal Data Usage</h2>
              <p>We use your data to:</p>
              <ul>
                <li>Provide, operate, and maintain our software solutions.</li>
                <li>Process payroll, attendance, garment tracking, and recruitment functionalities.</li>
                <li>Improve and personalize user experience.</li>
                <li>Communicate regarding updates, security alerts, and support.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="privacy-section-item">
              <h2>3. Cookies Policy</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </div>

            {/* Section 4 */}
            <div className="privacy-section-item">
              <h2>4. Data Retention</h2>
              <p>
                We retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy, complying with legal obligations, resolving disputes, and enforcing our legal agreements.
              </p>
            </div>

            {/* Section 5 */}
            <div className="privacy-section-item">
              <h2>5. Data Security</h2>
              <p>
                We implement industry-standard security measures (including encryption and secure server infrastructure) to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </div>

            {/* Section 6 */}
            <div className="privacy-section-item">
              <h2>6. User Rights</h2>
              <p>Depending on your jurisdiction (e.g., GDPR, DPDP), you have the right to:</p>
              <ul>
                <li>Access, update, or delete your personal data.</li>
                <li>Withdraw consent at any time.</li>
                <li>Object to the processing of your data.</li>
                <li>Request data portability.</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div className="privacy-section-item">
              <h2>7. Third-Party Services</h2>
              <p>
                We may employ third-party companies (such as Razorpay for payments) to facilitate our service. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
            </div>

            {/* Section 8 */}
            <div className="privacy-section-item">
              <h2>8. Analytics & Tracking</h2>
              <p>
                We may use third-party Service Providers to monitor and analyze the use of our service to improve our offerings.
              </p>
            </div>

            {/* Section 9 */}
            <div className="privacy-section-item">
              <h2>9. Children's Privacy</h2>
              <p>
                Our services are not intended for use by children under the age of 18. We do not knowingly collect personally identifiable information from children.
              </p>
            </div>

            {/* Section 10 */}
            <div className="privacy-section-item">
              <h2>10. International Data Transfers</h2>
              <p>
                Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state or country where data protection laws may differ. By consenting to this policy, you agree to that transfer.
              </p>
            </div>

            {/* Section 11 */}
            <div className="privacy-section-item">
              <h2>11. Changes to Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </div>

            {/* Section 12 */}
            <div className="privacy-section-item contact-box">
              <h2>12. Contact Information</h2>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              
              <div className="privacy-contact-details">
                <div>
                  <strong>Company:</strong> Kiaan Technology Private Limited
                </div>
                <div>
                  <FiMapPin /> <strong>Address:</strong> 2341/E, Sudama Nagar, Indore, Madhya Pradesh, India
                </div>
                <div>
                  <FiPhone /> <strong>Phone:</strong> <a href="tel:+919752100980">+91-97521 00980</a>
                </div>
                <div>
                  <FiMail /> <strong>Email:</strong> <a href="mailto:info@kiaantechnology.com">info@kiaantechnology.com</a>
                </div>
                <div>
                  <FiGlobe /> <strong>Website:</strong> <a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer">https://kiaantechnology.com/</a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </main>

      {/* Footer */}
      <footer className="privacy-footer">
        <div className="privacy-container privacy-footer-content">
          <div>&copy; {new Date().getFullYear()} Master Hub SaaS. All rights reserved.</div>
          <div>Powered by <a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer">Kiaan Technology</a></div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
