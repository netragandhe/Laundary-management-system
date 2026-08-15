import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiShield, 
  FiCpu, 
  FiClock, 
  FiFileText, 
  FiTrendingUp, 
  FiUsers, 
  FiLayers, 
  FiSmartphone, 
  FiGlobe,
  FiMail,
  FiPhone,
  FiZap,
  FiDollarSign,
  FiActivity,
  FiBarChart2,
  FiGrid,
  FiMessageSquare,
  FiCamera,
  FiCheckCircle,
  FiXCircle,
  FiX
} from 'react-icons/fi';
import './BrochurePage.css';

const BrochurePage = () => {
  const navigate = useNavigate();
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState('7-Day Free Trial');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [purchaseForm, setPurchaseForm] = useState({
    laundryName: '',
    city: '',
    email: '',
    mobile: '',
    password: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleOpenPurchaseModal = (plan) => {
    setSelectedPlanName(plan);
    setPurchaseModalOpen(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    alert(`🎉 Registration Activated!\nPlan: ${selectedPlanName}\nLaundry: ${purchaseForm.laundryName || 'Tuhama Laundry'}`);
    setPurchaseModalOpen(false);
    navigate('/login');
  };

  return (
    <div className="brochure-root">
      {/* Background Ambient Violet & Cyan Glows */}
      <div style={{ position: 'absolute', top: 0, left: '20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, transparent 70%)', filter: 'blur(120px)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', top: '40%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, transparent 70%)', filter: 'blur(120px)', pointerEvents: 'none' }}></div>

      {/* ================= HEADER ================= */}
      <header className="brochure-header">
        <div className="brochure-container">
          <div className="brochure-nav-wrapper">
            <Link to="/" className="brochure-brand">
              <div style={{ width: '46px', height: '46px', padding: '4px', background: '#000000', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(245, 158, 11, 0.35)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <img src="/logo.png" alt="KT Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff' }}>
                KIAAN <span style={{ color: '#00f2fe' }}>TECHNOLOGY</span>
              </span>
            </Link>

            <ul className="brochure-nav-links">
              <li><Link to="/">Home</Link></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#benefits">Benefits</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><Link to="/brochure" className="active">Brochure</Link></li>
              <li><a href="#contact">Contact</a></li>
            </ul>

            <Link to="/login" className="brochure-btn-login">
              Login <span>↗</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="brochure-hero">
        <div className="brochure-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '2.5rem', alignItems: 'center' }}>
            {/* Left Column: Hero Text & CTAs */}
            <div>
              <div className="brochure-badge">
                ✦ #1 LAUNDRY MANAGEMENT SAAS PLATFORM
              </div>

              <h1 className="brochure-hero-title">
                Transform Your <br />
                <span>Laundry Business</span>
              </h1>

              <p className="brochure-hero-subtitle">
                All-in-one laundry & dry cleaning management software to manage orders, garments, staff, attendance, payments, drivers, counter POS, and grow your business effortlessly.
              </p>

              <div className="brochure-hero-features-row">
                <div className="brochure-hero-feat-item"><FiShield className="brochure-hero-feat-icon" /> Secure & Reliable</div>
                <div className="brochure-hero-feat-item"><FiZap className="brochure-hero-feat-icon" /> Fast & Scalable</div>
                <div className="brochure-hero-feat-item"><FiClock className="brochure-hero-feat-icon" /> 24/7 Support</div>
                <div className="brochure-hero-feat-item"><FiGlobe className="brochure-hero-feat-icon" /> Cloud Based</div>
              </div>

              <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={() => handleOpenPurchaseModal('7-Day Free Trial')} 
                  className="brochure-btn-primary"
                >
                  Start 7-Day Free Trial <FiArrowRight />
                </button>
                <button 
                  type="button" 
                  onClick={() => handleOpenPurchaseModal('Demo Session')} 
                  className="brochure-btn-secondary"
                >
                  Request a Demo
                </button>
              </div>
            </div>

            {/* Right Column: Software Dashboard & Mobile App Mockup Preview (Fills the blank space!) */}
            <div style={{ position: 'relative', background: 'rgba(13, 14, 38, 0.95)', border: '1px solid rgba(139, 92, 246, 0.35)', borderRadius: '24px', padding: '1rem', boxShadow: '0 25px 90px rgba(0, 0, 0, 0.8)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '1rem', alignItems: 'center' }}>
                {/* Laptop Screen View with User's Actual Dashboard Image */}
                <div style={{ background: '#0a0a14', borderRadius: '14px', border: '1px solid rgba(139, 92, 246, 0.3)', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
                  {/* Laptop Top Browser Header */}
                  <div style={{ background: '#111326', padding: '0.5rem 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)', width: '60%', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      https://laundry.kiaantechnology.com/superadmin/dashboard
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#00f2fe', fontWeight: 800 }}>LIVE DEMO</div>
                  </div>

                  {/* Dashboard Image */}
                  <div style={{ position: 'relative', overflow: 'hidden', maxHeight: '360px' }}>
                    <img 
                      src="/dashboard_preview.png" 
                      alt="Tuhama Laundry Super Admin Dashboard" 
                      style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', objectPosition: 'top' }} 
                    />
                  </div>
                </div>

                {/* Mobile App View */}
                <div style={{ background: '#08091a', borderRadius: '20px', padding: '1rem 0.8rem', border: '2px solid rgba(139, 92, 246, 0.4)', textAlign: 'left', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#00f2fe', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '0.5px' }}>DRIVER & COUNTER APP</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.6rem' }}>Super Admin Portal 👋</div>
                  <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.7rem', borderRadius: '10px', border: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '0.6rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total Branches</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>8 Outlets</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.7rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Active Users</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80' }}>11 Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMPARISON SECTION ================= */}
      <section className="brochure-container">
        <div className="brochure-comparison-grid">
          {/* Left: Software Comparison */}
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#00f2fe', letterSpacing: '1px', marginBottom: '1.2rem' }}>
              USING OUR SOFTWARE VS NOT USING IT
            </div>
            
            <div className="brochure-vs-wrapper">
              <div className="brochure-vs-badge">VS</div>

              {/* Using Software */}
              <div className="brochure-box-using">
                <div className="brochure-box-title">USING OUR SOFTWARE</div>
                <ul className="brochure-vs-list">
                  <li className="brochure-vs-item"><FiCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> Centralized order & garment management</li>
                  <li className="brochure-vs-item"><FiCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> Automated WhatsApp status tracking</li>
                  <li className="brochure-vs-item"><FiCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> Timely pickup & delivery reminders</li>
                  <li className="brochure-vs-item"><FiCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> Easy payment & UPI QR collection</li>
                  <li className="brochure-vs-item"><FiCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> Organized staff & driver management</li>
                  <li className="brochure-vs-item"><FiCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> Itemized garment barcode tagging</li>
                  <li className="brochure-vs-item"><FiCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> Real-time reports & financial analytics</li>
                  <li className="brochure-vs-item"><FiCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> Better customer experience & retention</li>
                  <li className="brochure-vs-item"><FiCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> Increased revenue & profit margin</li>
                  <li className="brochure-vs-item"><FiCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> Easy to scale multi-branch outlets</li>
                </ul>
              </div>

              {/* Not Using Software */}
              <div className="brochure-box-not-using">
                <div className="brochure-box-title">NOT USING OUR SOFTWARE</div>
                <ul className="brochure-vs-list">
                  <li className="brochure-vs-item"><FiXCircle style={{ color: '#ef4444', flexShrink: 0 }} /> Scattered paper tags & manual logbooks</li>
                  <li className="brochure-vs-item"><FiXCircle style={{ color: '#ef4444', flexShrink: 0 }} /> Manual order entry & lost garment errors</li>
                  <li className="brochure-vs-item"><FiXCircle style={{ color: '#ef4444', flexShrink: 0 }} /> Missed delivery schedules & phone calls</li>
                  <li className="brochure-vs-item"><FiXCircle style={{ color: '#ef4444', flexShrink: 0 }} /> Payment tracking & cash difficulties</li>
                  <li className="brochure-vs-item"><FiXCircle style={{ color: '#ef4444', flexShrink: 0 }} /> Unorganized staff & driver routes</li>
                  <li className="brochure-vs-item"><FiXCircle style={{ color: '#ef4444', flexShrink: 0 }} /> No garment status tracking</li>
                  <li className="brochure-vs-item"><FiXCircle style={{ color: '#ef4444', flexShrink: 0 }} /> No business reports or revenue insights</li>
                  <li className="brochure-vs-item"><FiXCircle style={{ color: '#ef4444', flexShrink: 0 }} /> Poor customer experience</li>
                  <li className="brochure-vs-item"><FiXCircle style={{ color: '#ef4444', flexShrink: 0 }} /> Loss of revenue & customer churn</li>
                  <li className="brochure-vs-item"><FiXCircle style={{ color: '#ef4444', flexShrink: 0 }} /> Hard to scale & manage multi-branch</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Key Highlights */}
          <div className="brochure-highlights-box">
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#00f2fe', letterSpacing: '1px', textTransform: 'uppercase' }}>
              KEY HIGHLIGHTS
            </div>
            
            <div className="brochure-highlights-grid">
              <div className="brochure-hl-card">
                <div className="brochure-hl-icon"><FiLayers /></div>
                <div>
                  <div className="brochure-hl-title">All-in-One Platform</div>
                  <div className="brochure-hl-desc">Manage all laundry operations from one centralized system.</div>
                </div>
              </div>

              <div className="brochure-hl-card">
                <div className="brochure-hl-icon"><FiShield /></div>
                <div>
                  <div className="brochure-hl-title">Secure & Compliant</div>
                  <div className="brochure-hl-desc">Role-based access and advanced security to keep data safe.</div>
                </div>
              </div>

              <div className="brochure-hl-card">
                <div className="brochure-hl-icon"><FiCpu /></div>
                <div>
                  <div className="brochure-hl-title">Automation & Efficiency</div>
                  <div className="brochure-hl-desc">Automate order updates, save time and reduce manual work.</div>
                </div>
              </div>

              <div className="brochure-hl-card">
                <div className="brochure-hl-icon"><FiTrendingUp /></div>
                <div>
                  <div className="brochure-hl-title">Scalable & Flexible</div>
                  <div className="brochure-hl-desc">Built to grow with your laundry business & multi-branches.</div>
                </div>
              </div>

              <div className="brochure-hl-card">
                <div className="brochure-hl-icon"><FiActivity /></div>
                <div>
                  <div className="brochure-hl-title">Real-Time Insights</div>
                  <div className="brochure-hl-desc">Powerful dashboards for better decisions and growth.</div>
                </div>
              </div>

              <div className="brochure-hl-card">
                <div className="brochure-hl-icon"><FiSmartphone /></div>
                <div>
                  <div className="brochure-hl-title">Mobile Friendly</div>
                  <div className="brochure-hl-desc">Access your laundry data anytime, anywhere from any device.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EVERYTHING YOU NEED SECTION ================= */}
      <section className="brochure-container">
        <div className="brochure-section-title-center">
          <div className="brochure-sec-badge">EVERYTHING YOU NEED TO MANAGE YOUR LAUNDRY</div>
          <h2 className="brochure-sec-heading">Complete <span>Feature Matrix</span></h2>
        </div>

        <div className="brochure-cards-7col">
          {/* 1. Member/Customer Mgmt */}
          <div className="brochure-7col-card">
            <div className="brochure-7col-icon"><FiUsers /></div>
            <div className="brochure-7col-title">Customer Mgmt</div>
            <ul className="brochure-7col-list">
              <li>• Customer Profiles</li>
              <li>• Phone Lookup</li>
              <li>• Order History</li>
              <li>• Special Pricing</li>
              <li>• Bulk Import/Export</li>
            </ul>
          </div>

          {/* 2. Garment Tagging */}
          <div className="brochure-7col-card">
            <div className="brochure-7col-icon"><FiLayers /></div>
            <div className="brochure-7col-title">Garment Tagging</div>
            <ul className="brochure-7col-list">
              <li>• Thermal Print Tags</li>
              <li>• Barcode Scanning</li>
              <li>• Wash Status Flow</li>
              <li>• Item Photos</li>
              <li>• Defect Tagging</li>
            </ul>
          </div>

          {/* 3. Counter POS & Billing */}
          <div className="brochure-7col-card">
            <div className="brochure-7col-icon"><FiDollarSign /></div>
            <div className="brochure-7col-title">Counter POS</div>
            <ul className="brochure-7col-list">
              <li>• Quick Billing POS</li>
              <li>• WhatsApp Receipts</li>
              <li>• UPI QR Collection</li>
              <li>• Discounts & Coupons</li>
              <li>• Daily Cash Settlement</li>
            </ul>
          </div>

          {/* 4. Multi-Branch Operations */}
          <div className="brochure-7col-card">
            <div className="brochure-7col-icon"><FiGrid /></div>
            <div className="brochure-7col-title">Multi-Branch</div>
            <ul className="brochure-7col-list">
              <li>• Branch Outlets Sync</li>
              <li>• Staff Roles</li>
              <li>• Inter-Branch Transfer</li>
              <li>• Central Inventory</li>
              <li>• Global Reports</li>
            </ul>
          </div>

          {/* 5. Driver Fleet */}
          <div className="brochure-7col-card">
            <div className="brochure-7col-icon"><FiSmartphone /></div>
            <div className="brochure-7col-title">Driver Fleet</div>
            <ul className="brochure-7col-list">
              <li>• Pickup Assignments</li>
              <li>• Delivery Routes</li>
              <li>• Live Driver Map</li>
              <li>• OTP Delivery Verification</li>
              <li>• Driver Performance</li>
            </ul>
          </div>

          {/* 6. Customer Portal */}
          <div className="brochure-7col-card">
            <div className="brochure-7col-icon"><FiGlobe /></div>
            <div className="brochure-7col-title">Customer Portal</div>
            <ul className="brochure-7col-list">
              <li>• Live Order Tracking</li>
              <li>• Web Invoice Download</li>
              <li>• Home Pickup Request</li>
              <li>• Instant Feedback</li>
              <li>• SMS Notifications</li>
            </ul>
          </div>

          {/* 7. Reports & Analytics */}
          <div className="brochure-7col-card">
            <div className="brochure-7col-icon"><FiBarChart2 /></div>
            <div className="brochure-7col-title">Reports & Analytics</div>
            <ul className="brochure-7col-list">
              <li>• Revenue Overview</li>
              <li>• Daily Wash Load</li>
              <li>• Category Breakdown</li>
              <li>• Driver Earnings</li>
              <li>• Export PDF & Excel</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= HOW SOFTWARE WORKS ================= */}
      <section className="brochure-container">
        <div className="brochure-section-title-center">
          <div className="brochure-sec-badge">SIMPLE 5-STEP WORKFLOW</div>
          <h2 className="brochure-sec-heading">How Our <span>Software Works</span></h2>
        </div>

        <div className="brochure-steps-row">
          <div className="brochure-step-card">
            <div className="brochure-step-num">01. REGISTER</div>
            <div className="brochure-step-title">Create Account</div>
            <div className="brochure-step-desc">Create your laundry business account in just a few seconds.</div>
          </div>

          <div className="brochure-step-card">
            <div className="brochure-step-num">02. SETUP LAUNDRY</div>
            <div className="brochure-step-title">Configure Services</div>
            <div className="brochure-step-desc">Add services, pricing tags, staff roles and outlet settings.</div>
          </div>

          <div className="brochure-step-card">
            <div className="brochure-step-num">03. ADD ORDERS</div>
            <div className="brochure-step-title">Counter Intake</div>
            <div className="brochure-step-desc">Create counter orders, print tags, and send WhatsApp receipts.</div>
          </div>

          <div className="brochure-step-card">
            <div className="brochure-step-num">04. MANAGE OPS</div>
            <div className="brochure-step-title">Process & Deliver</div>
            <div className="brochure-step-desc">Track washing, dry cleaning, driver pickups, and deliveries.</div>
          </div>

          <div className="brochure-step-card">
            <div className="brochure-step-num">05. ANALYZE & GROW</div>
            <div className="brochure-step-title">Scale Business</div>
            <div className="brochure-step-desc">Use live analytics & revenue reports to expand your network.</div>
          </div>
        </div>
      </section>

      {/* ================= 50+ POWERFUL FEATURES ================= */}
      <section className="brochure-container">
        <div className="brochure-section-title-center">
          <div className="brochure-sec-badge">50+ POWERFUL FEATURES & UPGRADES WE CAN ADD</div>
        </div>

        <div className="brochure-features-50-grid">
          <div className="brochure-feat-chip"><FiCpu className="brochure-chip-icon" /> AI Laundry Assistant</div>
          <div className="brochure-feat-chip"><FiSmartphone className="brochure-chip-icon" /> Customer Mobile App</div>
          <div className="brochure-feat-chip"><FiBarChart2 className="brochure-chip-icon" /> Advanced POS Dashboards</div>
          <div className="brochure-feat-chip"><FiDollarSign className="brochure-chip-icon" /> UPI & Online Payments</div>
          <div className="brochure-feat-chip"><FiMessageSquare className="brochure-chip-icon" /> WhatsApp Automated Receipts</div>
          
          <div className="brochure-feat-chip"><FiLayers className="brochure-chip-icon" /> Barcode Garment Tagging</div>
          <div className="brochure-feat-chip"><FiUsers className="brochure-chip-icon" /> Multi-Branch Driver App</div>
          <div className="brochure-feat-chip"><FiGlobe className="brochure-chip-icon" /> Custom Domain Support</div>
          <div className="brochure-feat-chip"><FiClock className="brochure-chip-icon" /> Express Turnaround Mode</div>
          <div className="brochure-feat-chip"><FiShield className="brochure-chip-icon" /> Role-Based Access Control</div>

          <div className="brochure-feat-chip"><FiTrendingUp className="brochure-chip-icon" /> Revenue Analytics</div>
          <div className="brochure-feat-chip"><FiZap className="brochure-chip-icon" /> Automated SMS Reminders</div>
          <div className="brochure-feat-chip"><FiActivity className="brochure-chip-icon" /> Live Driver Route Map</div>
          <div className="brochure-feat-chip"><FiGrid className="brochure-chip-icon" /> Multi-Outlet Syncing</div>
          <div className="brochure-feat-chip"><FiFileText className="brochure-chip-icon" /> Export Reports to PDF/Excel</div>

          <div className="brochure-feat-chip"><FiCheckCircle className="brochure-chip-icon" /> OTP Delivery Receipt</div>
          <div className="brochure-feat-chip"><FiCamera className="brochure-chip-icon" /> Garment Defect Photo Tagging</div>
          <div className="brochure-feat-chip"><FiDollarSign className="brochure-chip-icon" /> Expense Management</div>
          <div className="brochure-feat-chip"><FiUsers className="brochure-chip-icon" /> Customer Loyalty Rewards</div>
          <div className="brochure-feat-chip"><FiShield className="brochure-chip-icon" /> Automated Audit Logs</div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#00f2fe', fontStyle: 'italic' }}>
          We continuously innovate and add new features based on customer feedback and industry trends.
        </div>
      </section>

      {/* ================= REAL IMPACT ================= */}
      <section className="brochure-container">
        <div className="brochure-section-title-center">
          <div className="brochure-sec-badge">REAL IMPACT. REAL RESULTS.</div>
        </div>

        <div className="brochure-impact-row">
          <div className="brochure-impact-card">
            <div className="brochure-impact-icon"><FiZap /></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>Less Manual Work</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Automate tags & billing tasks effortlessly.</div>
            </div>
          </div>

          <div className="brochure-impact-card">
            <div className="brochure-impact-icon"><FiUsers /></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>Better Retention</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Keep customers happy with WhatsApp updates.</div>
            </div>
          </div>

          <div className="brochure-impact-card">
            <div className="brochure-impact-icon"><FiDollarSign /></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>Faster Payments</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Get paid on time with instant UPI QR receipts.</div>
            </div>
          </div>

          <div className="brochure-impact-card">
            <div className="brochure-impact-icon"><FiActivity /></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>Higher Productivity</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Process 3x more laundry orders daily.</div>
            </div>
          </div>

          <div className="brochure-impact-card">
            <div className="brochure-impact-icon"><FiTrendingUp /></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>Business Growth</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Smarter decisions to expand your outlets.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="brochure-container">
        <div className="brochure-cta-banner">
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ffffff', marginBottom: '0.8rem' }}>
            Ready to Transform Your <span style={{ color: '#00f2fe' }}>Laundry Business?</span>
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '650px', margin: '0 auto 2rem' }}>
            Start your 7-day free trial today and experience the power of automation, organized management and business growth.
          </p>

          <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              onClick={() => handleOpenPurchaseModal('7-Day Free Trial')} 
              className="brochure-btn-primary"
            >
              Start 7-Day Free Trial <FiArrowRight />
            </button>
            <button 
              type="button" 
              onClick={() => handleOpenPurchaseModal('Demo Session')} 
              className="brochure-btn-secondary"
            >
              Request a Demo
            </button>
          </div>

          <div className="brochure-cta-contact-bar">
            <a href="tel:+919752100980" className="brochure-contact-item"><FiPhone style={{ color: '#00f2fe' }} /> +91-97521 00980</a>
            <a href="mailto:info@kiaantechnology.com" className="brochure-contact-item"><FiMail style={{ color: '#00f2fe' }} /> info@kiaantechnology.com</a>
            <a href="https://tuhamalaundry.com" className="brochure-contact-item" target="_blank" rel="noreferrer"><FiGlobe style={{ color: '#00f2fe' }} /> https://tuhamalaundry.com/</a>
          </div>
        </div>
      </section>

      {/* ================= PURCHASE MODAL ================= */}
      {purchaseModalOpen && (
        <div className="purchase-modal-backdrop" onClick={() => setPurchaseModalOpen(false)}>
          <div className="purchase-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="purchase-modal-header">
              <h3>Complete Your Purchase</h3>
              <button 
                type="button" 
                className="purchase-modal-close-btn"
                onClick={() => setPurchaseModalOpen(false)}
              >
                <FiX />
              </button>
            </div>

            <div className="purchase-modal-body">
              <form onSubmit={handlePurchaseSubmit}>
                {/* Photo Upload Section */}
                <div className="purchase-photo-upload-section">
                  <label htmlFor="brochure-photo-input" className="purchase-photo-circle">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <>
                        <FiCamera style={{ fontSize: '1.4rem' }} />
                        <span>Photo</span>
                      </>
                    )}
                  </label>
                  <input 
                    type="file" 
                    id="brochure-photo-input" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    style={{ display: 'none' }} 
                  />
                  <div className="purchase-photo-label">Upload Photo (Optional)</div>
                </div>

                {/* Form Fields Grid */}
                <div className="purchase-form-grid">
                  {/* Selected Plan */}
                  <div className="purchase-form-group purchase-field-full">
                    <label>Selected Plan</label>
                    <input 
                      type="text" 
                      className="purchase-form-input filled" 
                      value={selectedPlanName} 
                      readOnly 
                    />
                  </div>

                  {/* Laundry Name */}
                  <div className="purchase-form-group">
                    <label>Laundry Name *</label>
                    <input 
                      type="text" 
                      className={`purchase-form-input ${purchaseForm.laundryName ? 'filled' : ''}`}
                      placeholder="Laundry name" 
                      required
                      value={purchaseForm.laundryName}
                      onChange={(e) => setPurchaseForm({ ...purchaseForm, laundryName: e.target.value })}
                    />
                  </div>

                  {/* City */}
                  <div className="purchase-form-group">
                    <label>City *</label>
                    <input 
                      type="text" 
                      className={`purchase-form-input ${purchaseForm.city ? 'filled' : ''}`}
                      placeholder="Your city" 
                      required
                      value={purchaseForm.city}
                      onChange={(e) => setPurchaseForm({ ...purchaseForm, city: e.target.value })}
                    />
                  </div>

                  {/* Email Address */}
                  <div className="purchase-form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      className={`purchase-form-input ${purchaseForm.email ? 'filled' : ''}`}
                      placeholder="you@email.com" 
                      required
                      value={purchaseForm.email}
                      onChange={(e) => setPurchaseForm({ ...purchaseForm, email: e.target.value })}
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="purchase-form-group">
                    <label>Mobile Number *</label>
                    <input 
                      type="tel" 
                      className={`purchase-form-input ${purchaseForm.mobile ? 'filled' : ''}`}
                      placeholder="Mobile number" 
                      required
                      value={purchaseForm.mobile}
                      onChange={(e) => setPurchaseForm({ ...purchaseForm, mobile: e.target.value })}
                    />
                  </div>

                  {/* Password */}
                  <div className="purchase-form-group">
                    <label>Password *</label>
                    <input 
                      type="password" 
                      className={`purchase-form-input ${purchaseForm.password ? 'filled' : ''}`}
                      placeholder="Password" 
                      required
                      value={purchaseForm.password}
                      onChange={(e) => setPurchaseForm({ ...purchaseForm, password: e.target.value })}
                    />
                  </div>

                  {/* Start Date */}
                  <div className="purchase-form-group">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      className="purchase-form-input" 
                      value={purchaseForm.startDate}
                      onChange={(e) => setPurchaseForm({ ...purchaseForm, startDate: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="purchase-btn-submit">
                  {selectedPlanName.includes('Free') ? 'Activate Free Trial' : 'Proceed to Activate Plan'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrochurePage;
