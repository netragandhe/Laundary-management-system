import React, { useState } from 'react';
import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiCheck, 
  FiStar, 
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
  FiMapPin,
  FiMenu,
  FiX,
  FiCamera,
  FiInstagram,
  FiLinkedin,
  FiYoutube
} from 'react-icons/fi';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Legal Modal State (Privacy Policy / Terms & Conditions) */
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState('privacy'); // 'privacy' or 'terms'

  const handleOpenLegalModal = (type) => {
    setLegalModalType(type);
    setLegalModalOpen(true);
  };

  /* Purchase Modal State */
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
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState('');

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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError('');
    try {
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      const payload = {
        laundryName: purchaseForm.laundryName,
        city: purchaseForm.city,
        email: purchaseForm.email,
        mobile: purchaseForm.mobile,
        password: purchaseForm.password,
        planName: selectedPlanName,
        startDate: purchaseForm.startDate
      };

      if (selectedPlanName.includes('Free')) {
        // Direct Registration for Free Trial
        await axios.post(`${API_BASE}/auth/register`, payload);
        setRegisterSuccess(true);
        setRegisterLoading(false);
      } else {
        // Paid Plan - Init Payment
        const initRes = await axios.post(`${API_BASE}/auth/register-payment-init`, {
          planName: selectedPlanName,
          email: purchaseForm.email
        });

        if (!initRes.data.success) {
          throw new Error('Failed to initialize payment');
        }

        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error('Razorpay SDK failed to load. Are you online?');
        }

        const options = {
          key: initRes.data.key_id || process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_live_T2CGGz8NLUuopj',
          amount: initRes.data.amount,
          currency: initRes.data.currency,
          name: 'Kiaan Technology',
          description: `Subscription for ${selectedPlanName}`,
          order_id: initRes.data.order_id,
          handler: async function (response) {
            try {
              setRegisterLoading(true);
              // Finalize registration
              await axios.post(`${API_BASE}/auth/register`, {
                ...payload,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              });
              setRegisterSuccess(true);
            } catch (err) {
              setRegisterError(err.response?.data?.message || 'Registration verification failed.');
            } finally {
              setRegisterLoading(false);
            }
          },
          prefill: {
            name: purchaseForm.laundryName,
            email: purchaseForm.email,
            contact: purchaseForm.mobile
          },
          theme: {
            color: '#13111c'
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response) {
          setRegisterError(response.error.description || 'Payment failed.');
          setRegisterLoading(false);
        });
        paymentObject.open();
        // Don't set loading to false here, wait for modal close or callback
      }
    } catch (err) {
      setRegisterError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
      setRegisterLoading(false);
    }
  };

  const handleCloseAfterSuccess = () => {
    setRegisterSuccess(false);
    setPurchaseModalOpen(false);
    setRegisterError('');
    setPurchaseForm({ laundryName: '', city: '', email: '', mobile: '', password: '', startDate: new Date().toISOString().split('T')[0] });
    navigate('/login');
  };

  return (
    <div className="zealth-landing-root">
      {/* Background Ambient Glow Lights */}
      <div className="zealth-ambient-bg">
        <div className="zealth-glow-spot zealth-glow-1"></div>
        <div className="zealth-glow-spot zealth-glow-2"></div>
        <div className="zealth-glow-spot zealth-glow-3"></div>
        <div className="zealth-glow-spot zealth-glow-4"></div>
      </div>
      
      {/* Radial Grid Overlay */}
      <div className="zealth-grid-pattern"></div>

      {/* ================= NAVBAR ================= */}
      <header className="zealth-header">
        <div className="zealth-container">
          <div className="zealth-nav-wrapper">
            <Link to="/" className="zealth-brand">
              <div className="zealth-logo-img-wrapper" style={{ width: '46px', height: '46px', padding: '4px', background: '#070714', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(6, 182, 212, 0.35)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                <img src="/logo.png" alt="KT Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }} />
              </div>
              <span className="zealth-brand-name">
                KIAAN <span>TECHNOLOGY</span>
              </span>
            </Link>

            <ul className="zealth-nav-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#portals">Portals</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#benefits">Benefits</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><Link to="/brochure" style={{ color: '#ff5500', fontWeight: '700' }}>Brochure</Link></li>
              <li><a href="#contact">Contact</a></li>
            </ul>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Link to="/login" className="zealth-btn-login">
                Login
              </Link>
              <button
                type="button"
                onClick={() => handleOpenPurchaseModal('7-Day Free Trial')}
                className="zealth-btn-start-free"
              >
                Start Free
              </button>
              <button 
                className="zealth-mobile-toggle" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section id="home" className="zealth-hero" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
        <div className="zealth-container">
          <div className="zealth-hero-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
            
            {/* Left Content */}
            <div className="zealth-hero-content" style={{ flex: '1 1 500px' }}>
              <div className="zealth-hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.2)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '1rem' }}>
                ✦ #1 Laundry Management Software
              </div>

              <h1 className="zealth-hero-title" style={{ fontSize: '3.5rem', lineHeight: '1.1', fontWeight: '800', marginTop: '1rem', marginBottom: '1.5rem', color: '#fff' }}>
                Transform Your <br />
                <span className="zealth-gradient-text" style={{ background: 'linear-gradient(135deg, #67e8f9 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Laundry Business</span>
              </h1>

              <p className="zealth-hero-subtitle" style={{ fontSize: '1.1rem', color: '#a1a1aa', maxWidth: '480px', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                The all-in-one solution for modern laundry and dry-cleaning centers. Automate operations, boost customer retention, and grow your business with our powerful management system.
              </p>
              
              <div className="zealth-hero-buttons" style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                <button className="zealth-btn-start-free" onClick={() => handleOpenPurchaseModal('Growth')} style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}>
                  Get Started Now <FiArrowRight />
                </button>
                <a href="#features" className="zealth-btn-login" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
                  View Demo
                </a>
              </div>

              {/* Stat Bubbles Row */}
              <div className="zealth-hero-stats-row" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}><FiUsers size={24}/></div>
                  <strong style={{ fontSize: '1.2rem', color: '#fff' }}>500+</strong>
                  <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Happy Clients</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}><FiMapPin size={24}/></div>
                  <strong style={{ fontSize: '1.2rem', color: '#fff' }}>150+</strong>
                  <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Active Branches</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}><FiTrendingUp size={24}/></div>
                  <strong style={{ fontSize: '1.2rem', color: '#fff' }}>99.9%</strong>
                  <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Uptime</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}><FiClock size={24}/></div>
                  <strong style={{ fontSize: '1.2rem', color: '#fff' }}>24/7</strong>
                  <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Support</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="zealth-hero-image-wrapper" style={{ flex: '1 1 500px', position: 'relative' }}>
              <div style={{ padding: '6px', background: 'linear-gradient(135deg, rgba(6,182,212,0.4), rgba(6,182,212,0.05))', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 50px rgba(6,182,212,0.15)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Laundry Dashboard" 
                  style={{ width: '100%', height: 'auto', borderRadius: '18px', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BUILT-IN ROLE PORTALS SHOWCASE ================= */}
      <section id="portals" className="zealth-section" style={{ background: 'rgba(10, 12, 30, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="zealth-container">
          <div className="zealth-section-header">
            <span className="zealth-section-badge">âœ¦ ENTERPRISE ROLE-BASED ARCHITECTURE</span>
            <h2 className="zealth-section-title">
              4 Specialized Portals for <span className="zealth-gradient-text">Complete Operational Control</span>
            </h2>
            <p className="zealth-section-desc">
              Every stakeholder in your laundry business gets a dedicated, role-tailored dashboard designed for speed, clarity, and security.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
            {/* Portal 1: Super Admin */}
            <div style={{ background: 'rgba(13, 14, 38, 0.9)', border: '1px solid rgba(6, 182, 212, 0.35)', borderRadius: '20px', padding: '1.8rem', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1.2rem', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                ðŸ‘‘
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#67e8f9', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>SUPER ADMIN PORTAL</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.8rem' }}>Multi-Branch Command Center</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.2rem' }}>
                Centralized control across all laundry branches. Manage branch outlets, assign user permissions, track global revenue, and inspect live audit logs.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> Multi-Branch Outlets Management</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> User & Role Access Control</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> Global Financial Analytics</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> System Audit Logs</li>
              </ul>
            </div>

            {/* Portal 2: Branch Manager */}
            <div style={{ background: 'rgba(13, 14, 38, 0.9)', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '20px', padding: '1.8rem', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1.2rem', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                ðŸ¢
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>BRANCH ADMIN PORTAL</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.8rem' }}>Outlet Operations Manager</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.2rem' }}>
                Complete operational dashboard for store managers. Configure laundry service rates, track staff QR attendance, manage detergent stock, and view daily sales.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> Custom Service Rate List</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> Staff QR Shift Attendance</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> Detergent & Supplies Stock</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> Daily Settlement Reports</li>
              </ul>
            </div>

            {/* Portal 3: Counter POS */}
            <div style={{ background: 'rgba(13, 14, 38, 0.9)', border: '1px solid rgba(99, 102, 241, 0.35)', borderRadius: '20px', padding: '1.8rem', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1.2rem', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                ðŸ·ï¸
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#818cf8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>COUNTER POS SYSTEM</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.8rem' }}>Fast Garment Intake & Tagging</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.2rem' }}>
                Ultra-fast 30-second customer order intake. Generate barcode thermal tags, send instant WhatsApp PDF bills, and record express turnaround requests.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> 30-Sec Intake & Thermal Printing</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> WhatsApp PDF Bill Link Auto-Send</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> Barcode & Defect Tagging</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> Express Turnaround Handler</li>
              </ul>
            </div>

            {/* Portal 4: Driver Fleet App */}
            <div style={{ background: 'rgba(13, 14, 38, 0.9)', border: '1px solid rgba(244, 114, 182, 0.35)', borderRadius: '20px', padding: '1.8rem', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1.2rem', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                ðŸšš
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>DRIVER FLEET APP</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.8rem' }}>Pickup & Delivery Dispatch</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.2rem' }}>
                Dedicated app for delivery drivers. Receive pickup requests, navigate live customer routes, verify deliveries via OTP, and collect Cash/UPI payments.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> Live Customer Route GPS</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> On-Door OTP Delivery Verification</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> COD & Instant UPI QR Payments</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck style={{ color: '#00f2fe' }} /> Real-time Dispatch Status</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="zealth-section" style={{ backgroundColor: '#070714', padding: '80px 0' }}>
        <div className="zealth-container">
          <div className="zealth-section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="zealth-section-badge" style={{ color: '#22d3ee', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>âœ¦ Powerful Features</span>
            <h2 className="zealth-section-title" style={{ fontSize: '2.5rem', fontWeight: '700', marginTop: '1rem', color: '#fff' }}>
              Everything You Need to <span style={{ color: '#22d3ee' }}>Manage Your Laundry</span>
            </h2>
            <p className="zealth-section-desc" style={{ color: '#a1a1aa', maxWidth: '600px', margin: '1rem auto 0' }}>
              Comprehensive tools designed to scale operations and accelerate growth.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {/* Feature 1 */}
            <div style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <FiLayers size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.8rem' }}>Order Management</h3>
              <p style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: '1.5' }}>
                Status tracking from washing to ironing, barcoded garment tags, and express workflows.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <FiCpu size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.8rem' }}>Counter POS</h3>
              <p style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: '1.5' }}>
                Lightning-fast counter intake, visual item selection, and barcode scanning.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <FiFileText size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.8rem' }}>WhatsApp Invoices</h3>
              <p style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: '1.5' }}>
                Instant electronic invoices, auto-sent WhatsApp receipts, and UPI QR collections.
              </p>
            </div>

            {/* Feature 4 */}
            <div style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <FiTrendingUp size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.8rem' }}>Live Analytics</h3>
              <p style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: '1.5' }}>
                Deep operational metrics, revenue per service, and branch comparison.
              </p>
            </div>

            {/* Feature 5 */}
            <div style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <FiSmartphone size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.8rem' }}>Driver Fleet App</h3>
              <p style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: '1.5' }}>
                Manage driver pickup assignment, and live delivery routes easily.
              </p>
            </div>

            {/* Feature 6 */}
            <div style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <FiGlobe size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.8rem' }}>Customer Portal</h3>
              <p style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: '1.5' }}>
                Empower your clients to check their order status live, and view receipts.
              </p>
            </div>

            {/* Feature 7 */}
            <div style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <FiUsers size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.8rem' }}>Staff Management</h3>
              <p style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: '1.5' }}>
                Manage staff permissions, attendance, and role-based access control.
              </p>
            </div>

            {/* Feature 8 */}
            <div style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <FiCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.8rem' }}>Multi-Branch Control</h3>
              <p style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: '1.5' }}>
                Centralized dashboard for multi-location performance tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY STANDS OUT SECTION ================= */}
      <section id="benefits" className="zealth-section" style={{ padding: '80px 0' }}>
        <div className="zealth-container">
          <div className="zealth-stands-out-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div style={{ flex: '1' }}>
              <span className="zealth-section-badge" style={{ color: '#22d3ee', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>âœ¦ Why Tuhama Laundry</span>
              <h2 className="zealth-section-title" style={{ fontSize: '2.5rem', fontWeight: '700', marginTop: '1rem', color: '#fff' }}>
                Why <span style={{ color: '#22d3ee' }}>Tuhama Laundry</span> Stands Out
              </h2>
              <p className="zealth-section-desc" style={{ color: '#a1a1aa', margin: '1rem 0 2rem' }}>
                Our laundry management software is architected to reduce operational overhead, keep customers coming back, and scale your business effortlessly.
              </p>

              <div className="zealth-benefits-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: '#22d3ee' }}><FiCheck size={20} /></div>
                  <span style={{ color: '#d4d4d8', fontSize: '0.95rem' }}>Increase customer retention by up to 45%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: '#22d3ee' }}><FiCheck size={20} /></div>
                  <span style={{ color: '#d4d4d8', fontSize: '0.95rem' }}>Save 15+ hours per week on administrative tasks</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: '#22d3ee' }}><FiCheck size={20} /></div>
                  <span style={{ color: '#d4d4d8', fontSize: '0.95rem' }}>Track unlimited garments, products & branches</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: '#22d3ee' }}><FiCheck size={20} /></div>
                  <span style={{ color: '#d4d4d8', fontSize: '0.95rem' }}>Automated billing, invoicing & WhatsApp reminders</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: '#22d3ee' }}><FiCheck size={20} /></div>
                  <span style={{ color: '#d4d4d8', fontSize: '0.95rem' }}>Enhanced customer experience with self-service receipt portal</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: '#22d3ee' }}><FiCheck size={20} /></div>
                  <span style={{ color: '#d4d4d8', fontSize: '0.95rem' }}>Dedicated onboarding & 24/7 priority support</span>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => handleOpenPurchaseModal('7-Day Free Trial')} 
                className="zealth-btn-start-free"
                style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}
              >
                See All Benefits <FiArrowRight />
              </button>
            </div>

            <div className="zealth-stat-card-box" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="zealth-stats-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'rgba(13, 14, 38, 0.7)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#22d3ee', marginBottom: '0.5rem' }}><FiTrendingUp size={24} style={{ margin: '0 auto' }}/></div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>49%</div>
                  <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Lower Ops Costs</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#22d3ee', marginBottom: '0.5rem' }}><FiClock size={24} style={{ margin: '0 auto' }}/></div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>15+</div>
                  <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Hours Saved / Wk</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#22d3ee', marginBottom: '0.5rem' }}><FiShield size={24} style={{ margin: '0 auto' }}/></div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>99.9%</div>
                  <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>System Uptime</div>
                </div>
              </div>

              <div className="zealth-quote-box" style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '2rem', borderRadius: '20px', borderLeft: '4px solid #a855f7' }}>
                <p className="zealth-quote-text" style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#d4d4d8', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  "Tuhama Laundry Co. reduced our garment tracking errors to zero. Order intake is 3x faster, and automated WhatsApp billing keeps our customers delighted."
                </p>
                <div className="zealth-quote-author" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="zealth-avatar" style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#a855f7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>DS</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Dr. Sanya Gupta</div>
                    <div style={{ fontSize: '0.8rem', color: '#22d3ee' }}>Head Operations, CleanCare Linen</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section id="testimonials" className="zealth-section" style={{ backgroundColor: '#070714', padding: '80px 0' }}>
        <div className="zealth-container">
          <div className="zealth-section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="zealth-section-badge" style={{ color: '#22d3ee', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>âœ¦ CLIENT REVIEWS</span>
            <h2 className="zealth-section-title" style={{ fontSize: '2.5rem', fontWeight: '700', marginTop: '1rem', color: '#fff' }}>
              What Our <span style={{ color: '#22d3ee' }}>Clients Say</span>
            </h2>
            <p className="zealth-section-desc" style={{ color: '#a1a1aa', maxWidth: '600px', margin: '1rem auto 0' }}>
              Real reviews and feedback from clients around the world working with Kiaan Technology.
            </p>
          </div>
          <div style={{ overflow: 'hidden', position: 'relative' }}>
            <style>{`
              @keyframes scrollReviews {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .zealth-reviews-marquee {
                display: flex;
                gap: 1rem;
                animation: scrollReviews 25s linear infinite;
                width: max-content;
              }
              .zealth-reviews-marquee:hover {
                animation-play-state: paused;
              }
              .zealth-reviews-marquee > .zealth-review-card {
                min-width: 260px;
                max-width: 280px;
                flex-shrink: 0;
                padding: 1rem !important;
                border-radius: 12px !important;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
              }
              .zealth-reviews-marquee > .zealth-review-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 30px rgba(6, 182, 212, 0.15);
              }
            `}</style>
            <div className="zealth-reviews-marquee">
            {/* Real Review 1: hansdjabs */}
            <div className="zealth-review-card" style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="zealth-review-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="zealth-avatar" style={{ background: '#6366f1', color: '#ffffff', fontWeight: 800, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>H</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>hansdjabs</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Rwanda</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.6rem' }}>
                  <div className="zealth-stars" style={{ color: '#22d3ee', display: 'flex', gap: '1px' }}>
                    <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>5</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>• 7 months ago</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: '1.55' }}>
                  "my experience working with this company is very great, i highly recommend everyone to work with this amazing team. everything is smooth and they have expert in software development."
                </p>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                <span>12 days</span>
                <span style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', padding: '0.15rem 0.5rem', borderRadius: '5px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                  Full Stack Web
                </span>
              </div>
            </div>

            {/* Real Review 2: fahimhyder310 */}
            <div className="zealth-review-card" style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="zealth-review-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="zealth-avatar" style={{ background: '#3b82f6', color: '#ffffff', fontWeight: 800, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>F</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>fahimhyder310</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>India</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.6rem' }}>
                  <div className="zealth-stars" style={{ color: '#22d3ee', display: 'flex', gap: '1px' }}>
                    <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>5</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>• 5 months ago</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: '1.55' }}>
                  "They demonstrated strong command over both frontend and backend development, ensuring performance, security, and smooth functionality. Milestones delivered on time, communication was clear and structured."
                </p>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                <span>9 days</span>
                <span style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', padding: '0.15rem 0.5rem', borderRadius: '5px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                  Full Stack Web
                </span>
              </div>
            </div>

            {/* Real Review 3: truman42lewis (4 months) */}
            <div className="zealth-review-card" style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="zealth-review-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="zealth-avatar" style={{ background: '#3b82f6', color: '#ffffff', fontWeight: 800, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>T</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>truman42lewis</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>United States</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.6rem' }}>
                  <div className="zealth-stars" style={{ color: '#22d3ee', display: 'flex', gap: '1px' }}>
                    <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>5</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>• 4 months ago</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: '1.55' }}>
                  "Kiaan And His Team are truly professional and I am honored to work with them. They delivered our agency a state of the art software! Thank you."
                </p>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                <span>1 day</span>
                <span style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', padding: '0.15rem 0.5rem', borderRadius: '5px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                  Full Stack Web
                </span>
              </div>
            </div>

            {/* Real Review 4: truman42lewis (5 months) */}
            <div className="zealth-review-card" style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="zealth-review-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="zealth-avatar" style={{ background: '#06b6d4', color: '#ffffff', fontWeight: 800, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>T</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>truman42lewis</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>United States</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.6rem' }}>
                  <div className="zealth-stars" style={{ color: '#22d3ee', display: 'flex', gap: '1px' }}>
                    <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>5</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>• 5 months ago</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: '1.55' }}>
                  "Kiaan and his team showed up and handled business. Excellent work, professional, and on point. I highly recommend them."
                </p>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                <span>5 days</span>
                <span style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', padding: '0.15rem 0.5rem', borderRadius: '5px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                  Full Stack Web
                </span>
              </div>
            </div>

            {/* DUPLICATE SET for seamless infinite loop */}
            <div className="zealth-review-card" style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: '#6366f1', color: '#fff', fontWeight: 800, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>H</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>hansdjabs</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Rwanda</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.6rem' }}>
                  <div style={{ color: '#22d3ee', display: 'flex', gap: '1px' }}><FiStar /><FiStar /><FiStar /><FiStar /><FiStar /></div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>5</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>• 7 months ago</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: '1.55' }}>
                  "my experience working with this company is very great, i highly recommend everyone to work with this amazing team. everything is smooth and they have expert in software development."
                </p>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                <span>12 days</span>
                <span style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', padding: '0.15rem 0.5rem', borderRadius: '5px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>Full Stack Web</span>
              </div>
            </div>

            <div className="zealth-review-card" style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: '#3b82f6', color: '#fff', fontWeight: 800, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>F</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>fahimhyder310</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>India</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.6rem' }}>
                  <div style={{ color: '#22d3ee', display: 'flex', gap: '1px' }}><FiStar /><FiStar /><FiStar /><FiStar /><FiStar /></div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>5</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>• 5 months ago</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: '1.55' }}>
                  "They demonstrated strong command over both frontend and backend development, ensuring performance, security, and smooth functionality. Milestones delivered on time."
                </p>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                <span>9 days</span>
                <span style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', padding: '0.15rem 0.5rem', borderRadius: '5px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>Full Stack Web</span>
              </div>
            </div>

            <div className="zealth-review-card" style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: '#3b82f6', color: '#fff', fontWeight: 800, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>T</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>truman42lewis</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>United States</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.6rem' }}>
                  <div style={{ color: '#22d3ee', display: 'flex', gap: '1px' }}><FiStar /><FiStar /><FiStar /><FiStar /><FiStar /></div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>5</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>• 4 months ago</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: '1.55' }}>
                  "Kiaan And His Team are truly professional and I am honored to work with them. They delivered our agency a state of the art software! Thank you."
                </p>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                <span>1 day</span>
                <span style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', padding: '0.15rem 0.5rem', borderRadius: '5px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>Full Stack Web</span>
              </div>
            </div>

            <div className="zealth-review-card" style={{ background: 'rgba(13, 14, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: '#06b6d4', color: '#fff', fontWeight: 800, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>T</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>truman42lewis</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>United States</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.6rem' }}>
                  <div style={{ color: '#22d3ee', display: 'flex', gap: '1px' }}><FiStar /><FiStar /><FiStar /><FiStar /><FiStar /></div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>5</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>• 5 months ago</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: '1.55' }}>
                  "Kiaan and his team showed up and handled business. Excellent work, professional, and on point. I highly recommend them."
                </p>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                <span>5 days</span>
                <span style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', padding: '0.15rem 0.5rem', borderRadius: '5px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>Full Stack Web</span>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRICING SECTION ================= */}
      <section id="pricing" className="zealth-section">
        <div className="zealth-container">
          <div className="zealth-section-header">
            <span className="zealth-section-badge">✦ PRICING PLANS</span>
            <h2 className="zealth-section-title">
              Simple, <span className="zealth-gradient-text">transparent pricing.</span>
            </h2>
            <p className="zealth-section-desc">
              Flexible plans that grow with your laundry network.
            </p>
          </div>

          <div className="zealth-pricing-grid">
            {/* 7-Day Free Trial */}
            <div className="zealth-price-card">
              <div>
                <div className="zealth-price-tier">7-Day Free Trial</div>
                <div className="zealth-price-amount">₹0 <span>/ week</span></div>
                <p style={{ fontSize: '0.85rem', color: 'var(--z-text-muted)' }}>Perfect for testing single laundry outlet counter.</p>
                <ul className="zealth-price-features">
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Up to 50 Garment Orders</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> 3 Staff Accounts</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> 1 Laundry Branch</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> 1 Admin User</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Order & Garment Management</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Attendance (QR & Manual)</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Payment & Invoicing</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Expense Management</li>
                </ul>
              </div>
              <button 
                type="button" 
                onClick={() => handleOpenPurchaseModal('7-Day Free Trial')} 
                className="zealth-btn-start-free" style={{ width: '100%', marginTop: '2rem' }}
              >
                Activate Free Trial
              </button>
            </div>

            {/* Starter Plan */}
            <div className="zealth-price-card">
              <div>
                <div className="zealth-price-tier">Starter</div>
                <div className="zealth-price-amount">₹999 <span>/ month</span></div>
                <p style={{ fontSize: '0.85rem', color: 'var(--z-text-muted)' }}>Great for single busy laundry outlet store.</p>
                <ul className="zealth-price-features">
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Up to 300 Garments / Month</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> 10 Staff Accounts</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> 1 Laundry Branch</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> 2 Admin Users</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Garment & Order Management</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Attendance (Manual Only)</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Payment & Invoicing</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Expense Management</li>
                </ul>
              </div>
              <button 
                type="button" 
                onClick={() => handleOpenPurchaseModal('Starter Plan (₹999/mo)')} 
                className="zealth-btn-start-free" style={{ width: '100%', marginTop: '2rem' }}
              >
                Select Starter Plan
              </button>
            </div>

            {/* Growth Plan (Popular) */}
            <div className="zealth-price-card popular">
              <div className="zealth-popular-badge">Most Popular</div>
              <div>
                <div className="zealth-price-tier" style={{ color: '#22d3ee' }}>Growth</div>
                <div className="zealth-price-amount">₹1,299 <span>/ month</span></div>
                <p style={{ fontSize: '0.85rem', color: 'var(--z-text-muted)' }}>Complete suite for multi-branch operations.</p>
                <ul className="zealth-price-features">
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Up to 750 Garments / Month</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> 25 Staff Accounts</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> 2 Laundry Branches</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> 5 Admin Users</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Order & Garment Management</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Attendance (QR & Manual)</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> WhatsApp & SMS Receipts</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Payment & Expense Analytics</li>
                </ul>
              </div>
              <button 
                type="button" 
                onClick={() => handleOpenPurchaseModal('Growth Plan (₹1,299/mo)')} 
                className="zealth-btn-start-free" style={{ width: '100%', marginTop: '2rem' }}
              >
                Select Growth Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="zealth-price-card">
              <div>
                <div className="zealth-price-tier">Pro</div>
                <div className="zealth-price-amount">₹1,499 <span>/ month</span></div>
                <p style={{ fontSize: '0.85rem', color: 'var(--z-text-muted)' }}>Custom solutions for large commercial networks.</p>
                <ul className="zealth-price-features">
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Up to 1,500 Garments / Month</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> 50 Staff Accounts</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> 5 Laundry Branches</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> 10 Admin Users</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Garment & Order Management</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Attendance (QR & Biometric)</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Driver Fleet App</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Dedicated Account Manager</li>
                </ul>
              </div>
              <button 
                type="button" 
                onClick={() => handleOpenPurchaseModal('Pro Plan (₹1,499/mo)')} 
                className="zealth-btn-start-free" style={{ width: '100%', marginTop: '2rem' }}
              >
                Select Pro Plan
              </button>
            </div>

            {/* Custom Plan */}
            <div className="zealth-price-card">
              <div>
                <div className="zealth-price-tier">Custom Plan</div>
                <div className="zealth-price-amount">Custom</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--z-text-muted)' }}>Tailored software solution for your laundry network.</p>
                <ul className="zealth-price-features">
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> SaaS with Customization</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Personal / Custom Domain</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Personal Branding & Logo</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> 🤖 AI Laundry & Automation</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Custom POS & Hardware Sync</li>
                  <li className="zealth-price-feature"><FiCheck style={{ color: '#22d3ee' }} /> Dedicated Server & 24/7 SLA</li>
                </ul>
              </div>
              <button 
                type="button" 
                onClick={() => handleOpenPurchaseModal('Custom Enterprise Plan')} 
                className="zealth-btn-start-free" style={{ width: '100%', marginTop: '2rem' }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section id="contact" className="zealth-section" style={{ paddingBottom: '2rem' }}>
        <div className="zealth-container">
          <div className="zealth-cta-box">
            <span className="zealth-section-badge">✦ READY TO SWITCH</span>
            <h2 className="zealth-hero-title" style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>
              Ready to scale your <span className="zealth-gradient-text">laundry business?</span>
            </h2>
            <p className="zealth-hero-subtitle" style={{ marginBottom: '1rem' }}>
              Join hundreds of satisfied laundry owners who modernized their operations with Tuhama Laundry Co.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="zealth-footer">
        <div className="zealth-container">
          <div className="zealth-footer-grid" style={{ gridTemplateColumns: '2fr 1fr 1.5fr', gap: '3.5rem', alignItems: 'start' }}>
            {/* Column 1: Brand & Description */}
            <div>
              <Link to="/" className="zealth-brand" style={{ marginBottom: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '42px', height: '42px', padding: '4px', background: '#070714', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(168, 85, 247, 0.4)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                  <img src="/logo.png" alt="KT Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }} />
                </div>
                <span style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '0.5px', color: '#ffffff' }}>
                  KIAAN <span style={{ color: '#22d3ee', fontWeight: '800' }}>TECHNOLOGY</span>
                </span>
              </Link>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', maxWidth: '320px', lineHeight: 1.55, marginBottom: '1.5rem' }}>
                The ultimate super admin platform to manage all your business softwares from one centralized, intelligent dashboard.
              </p>

              {/* Social Buttons Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <a href="https://www.instagram.com/kiaan_technology4/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Instagram"><FiInstagram /></a>
                <a href="https://www.linkedin.com/company/kiaan-technology-pvt-ltd/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="LinkedIn"><FiLinkedin /></a>
                <a href="https://www.youtube.com/@kiaantechnology-r3p" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="YouTube"><FiYoutube /></a>
                <a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Website"><FiGlobe /></a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="zealth-footer-col">
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.4rem' }}>Quick Links</h4>
              <ul className="zealth-footer-links-cyan">
                <li><a href="#home">Home</a></li>
                <li><a href="#portals">Portals</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            {/* Column 3: Contact Us */}
            <div className="zealth-footer-col">
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.4rem' }}>Contact Us</h4>
              <ul className="zealth-footer-contact-list">
                <li>
                  <FiMapPin className="footer-contact-icon" />
                  <span>2341/E, Sudama Nagar, Indore, M.P.</span>
                </li>
                <li>
                  <FiPhone className="footer-contact-icon" />
                  <span>+91-97521 00980</span>
                </li>
                <li>
                  <FiMail className="footer-contact-icon" />
                  <a href="mailto:info@kiaantechnology.com" style={{ color: 'inherit', textDecoration: 'none' }}>info@kiaantechnology.com</a>
                </li>
                <li>
                  <FiGlobe className="footer-contact-icon" />
                  <a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#22d3ee', textDecoration: 'none', fontWeight: '600' }}>kiaantechnology.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="zealth-footer-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {/* Left Side Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', textAlign: 'left' }}>
              <div style={{ color: '#ffffff', fontSize: '0.98rem', fontWeight: '600', letterSpacing: '0.3px' }}>
                &copy; {new Date().getFullYear()} Master Hub SaaS. All rights reserved.
              </div>
              <div style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '800', letterSpacing: '0.3px' }}>
                Powered by <a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#22d3ee', textDecoration: 'none', fontWeight: '800' }}>Kiaan Technology</a>
              </div>
            </div>

            {/* Right Side Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }}>
              <button 
                type="button" 
                onClick={() => handleOpenLegalModal('privacy')} 
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
              >
                Privacy Policy
              </button>
              <button 
                type="button" 
                onClick={() => handleOpenLegalModal('terms')} 
                style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer', padding: 0 }}
              >
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= COMPLETE YOUR PURCHASE MODAL ================= */}
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
              {/* â”€â”€ SUCCESS SCREEN â”€â”€ */}
              {registerSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00c851, #007e33)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 0 30px rgba(0, 200, 81, 0.4)'
                  }}>
                    <span style={{ fontSize: '2.2rem' }}>âœ“</span>
                  </div>
                  <h3 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.75rem' }}>
                    ðŸŽ‰ Registration Successful!
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 0.5rem' }}>
                    Your account has been created for <strong style={{ color: '#fff' }}>{purchaseForm.laundryName}</strong>.
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 2rem' }}>
                    ðŸ“§ A <strong style={{ color: '#00c851' }}>welcome email with your login credentials</strong> has been sent to<br />
                    <strong style={{ color: '#00f2fe' }}>{purchaseForm.email}</strong>
                  </p>
                  <div style={{ background: 'rgba(0, 200, 81, 0.08)', border: '1px solid rgba(0, 200, 81, 0.25)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                      ðŸ“‹ Plan: <strong style={{ color: '#fff' }}>{selectedPlanName}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseAfterSuccess}
                    style={{
                      width: '100%', padding: '0.9rem',
                      background: 'linear-gradient(135deg, #00c851, #007e33)',
                      border: 'none', borderRadius: '10px',
                      color: '#fff', fontSize: '1rem', fontWeight: 700,
                      cursor: 'pointer', letterSpacing: '0.5px'
                    }}
                  >
                    Go to Login â†’
                  </button>
                </div>
              ) : (
              <form onSubmit={handlePurchaseSubmit}>
                {/* Photo Upload Section */}
                <div className="purchase-photo-upload-section">
                  <label htmlFor="purchase-photo-input" className="purchase-photo-circle">
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
                    id="purchase-photo-input" 
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

                {/* Error Message */}
                {registerError && (
                  <div style={{
                    background: 'rgba(220, 53, 69, 0.12)',
                    border: '1px solid rgba(220, 53, 69, 0.35)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    marginBottom: '1rem',
                    color: '#ff6b7a',
                    fontSize: '0.88rem'
                  }}>
                    âš ï¸ {registerError}
                  </div>
                )}

                <button
                  type="submit"
                  className="purchase-btn-submit"
                  disabled={registerLoading}
                  style={{ opacity: registerLoading ? 0.7 : 1, cursor: registerLoading ? 'not-allowed' : 'pointer' }}
                >
                  {registerLoading
                    ? 'Creating your account...'
                    : selectedPlanName.includes('Free') ? 'Activate Free Trial' : 'Proceed to Payment (Razorpay)'
                  }
                </button>
              </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= LEGAL PRIVACY & TERMS MODAL POPUP ================= */}
      {legalModalOpen && (
        <div className="purchase-modal-backdrop" onClick={() => setLegalModalOpen(false)} style={{ zIndex: 1000 }}>
          <div className="purchase-modal-card legal-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px', width: '92%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', background: 'rgba(15, 12, 28, 0.98)', border: '1px solid rgba(0, 242, 254, 0.35)', borderRadius: '22px', boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.15)' }}>
            <div className="purchase-modal-header" style={{ padding: '1.4rem 2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  {legalModalType === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
                  Last Updated: 8/15/2026
                </div>
              </div>
              <button 
                type="button" 
                className="purchase-modal-close-btn"
                onClick={() => setLegalModalOpen(false)}
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
              >
                <FiX style={{ fontSize: '1.2rem' }} />
              </button>
            </div>

            <div className="legal-modal-body" style={{ padding: '2rem', overflowY: 'auto', color: '#cbd5e1', fontSize: '0.94rem', lineHeight: '1.65' }}>
              {legalModalType === 'privacy' ? (
                <>
                  <p style={{ marginBottom: '1.8rem', color: '#e2e8f0', fontSize: '1rem', lineHeight: '1.7' }}>
                    Welcome to <strong>Kiaan Technology Private Limited</strong>. This Privacy Policy outlines how we collect, use, process, and protect your personal information when you use our website (<a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#00f2fe', textDecoration: 'none' }}>https://kiaantechnology.com/</a>), SaaS platforms, mobile applications, and services (including Laundry SaaS, Payroll Management, HRMS, Job Portals, and Payment Integration). By using our services, you agree to the collection and use of information in accordance with this policy. This policy complies with the <strong>Indian IT Act 2000</strong>, <strong>DPDP Act 2023</strong>, <strong>GDPR</strong>, and app store guidelines.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>1. Information Collection</h4>
                      <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <li><strong>Personal Data:</strong> Name, email address, phone number, physical address, KYC documents, etc.</li>
                        <li><strong>Professional Data:</strong> Employee ID, designation, salary details, and resume data for HRMS and Job portals.</li>
                        <li><strong>Usage Data:</strong> IP address, browser type, device identifiers, and platform usage metrics.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>2. Personal Data Usage</h4>
                      <p style={{ marginBottom: '0.4rem' }}>We use your data to:</p>
                      <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <li>Provide, operate, and maintain our software solutions.</li>
                        <li>Process payroll, attendance, garment tracking, and recruitment functionalities.</li>
                        <li>Improve and personalize user experience.</li>
                        <li>Communicate regarding updates, security alerts, and support.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>3. Cookies Policy</h4>
                      <p>We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>4. Data Retention</h4>
                      <p>We retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy, complying with legal obligations, resolving disputes, and enforcing our legal agreements.</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>5. Data Security</h4>
                      <p>We implement industry-standard security measures (including encryption and secure server infrastructure) to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>6. User Rights</h4>
                      <p style={{ marginBottom: '0.4rem' }}>Depending on your jurisdiction (e.g., GDPR, DPDP), you have the right to:</p>
                      <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <li>Access, update, or delete your personal data.</li>
                        <li>Withdraw consent at any time.</li>
                        <li>Object to the processing of your data.</li>
                        <li>Request data portability.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>7. Third-Party Services</h4>
                      <p>We may employ third-party companies (such as Razorpay for payments) to facilitate our service. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>8. Analytics & Tracking</h4>
                      <p>We may use third-party Service Providers to monitor and analyze the use of our service to improve our offerings.</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>9. Children's Privacy</h4>
                      <p>Our services are not intended for use by children under the age of 18. We do not knowingly collect personally identifiable information from children.</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>10. International Data Transfers</h4>
                      <p>Your information, including Personal Data, may be transferred to â€” and maintained on â€” computers located outside of your state or country where data protection laws may differ. By consenting to this policy, you agree to that transfer.</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>11. Changes to Policy</h4>
                      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
                    </div>

                    {/* Section 12: Contact Box */}
                    <div style={{ background: 'rgba(20, 16, 38, 0.9)', border: '1px solid rgba(6, 182, 212, 0.35)', borderRadius: '16px', padding: '1.6rem 1.8rem', marginTop: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.8rem' }}>12. Contact Information</h4>
                      <p style={{ marginBottom: '1rem', color: '#cbd5e1' }}>If you have any questions about this Privacy Policy, please contact us:</p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.92rem', color: '#e2e8f0' }}>
                        <div><strong>Company:</strong> Kiaan Technology Private Limited</div>
                        <div><strong>Address:</strong> 2341/E, Sudama Nagar, Indore, Madhya Pradesh, India</div>
                        <div><strong>Phone:</strong> <a href="tel:+919752100980" style={{ color: '#00f2fe', textDecoration: 'none' }}>+91-97521 00980</a></div>
                        <div><strong>Email:</strong> <a href="mailto:info@kiaantechnology.com" style={{ color: '#00f2fe', textDecoration: 'none' }}>info@kiaantechnology.com</a></div>
                        <div><strong>Website:</strong> <a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#00f2fe', textDecoration: 'none' }}>https://kiaantechnology.com/</a></div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Terms & Conditions Content */
                <>
                  <p style={{ marginBottom: '1.8rem', color: '#e2e8f0', fontSize: '1rem', lineHeight: '1.7' }}>
                    Welcome to <strong>Kiaan Technology Private Limited</strong>. These Terms & Conditions govern your access to and use of our website (<a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#00f2fe', textDecoration: 'none' }}>https://kiaantechnology.com/</a>), SaaS platforms, mobile applications, and laundry management services. By accessing or using our services, you agree to comply with these terms.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>1. User Account & Registration</h4>
                      <p>To access SaaS features, users must register an account with accurate business details. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>2. Subscription Plans & Payment Terms</h4>
                      <p>Subscription fees are payable in advance based on the plan selected. All payment processing is securely handled via integrated payment gateways (such as Razorpay). Rates and taxes comply with Indian IT Act 2000 guidelines.</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>3. Free Trial Policy</h4>
                      <p>Free trial accounts are provided for demonstration purposes. Trial access duration is strictly limited (1 Day or as specified). Each email address is eligible for only one free trial. Upon expiration, access requires plan subscription.</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>4. Acceptable Use</h4>
                      <p>You agree not to use the services for any unlawful purpose, interfere with system operations, reverse engineer components, or transmit unauthorized data under DPDP Act 2023 and GDPR guidelines.</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>5. Intellectual Property</h4>
                      <p>All software code, visual design, logos, trademarks, and content provided by Kiaan Technology Private Limited remain the exclusive property of Kiaan Technology.</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#00f2fe', marginBottom: '0.6rem' }}>6. Termination & Limitation of Liability</h4>
                      <p>We reserve the right to suspend or terminate service access for violations of these terms. In no event shall Kiaan Technology be liable for indirect or consequential damages arising out of service usage.</p>
                    </div>

                    {/* Section 7: Contact Box */}
                    <div style={{ background: 'rgba(20, 16, 38, 0.9)', border: '1px solid rgba(6, 182, 212, 0.35)', borderRadius: '16px', padding: '1.6rem 1.8rem', marginTop: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.8rem' }}>7. Contact Information</h4>
                      <p style={{ marginBottom: '1rem', color: '#cbd5e1' }}>For any queries regarding these Terms & Conditions, please reach out to us:</p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.92rem', color: '#e2e8f0' }}>
                        <div><strong>Company:</strong> Kiaan Technology Private Limited</div>
                        <div><strong>Address:</strong> 2341/E, Sudama Nagar, Indore, Madhya Pradesh, India</div>
                        <div><strong>Phone:</strong> <a href="tel:+919752100980" style={{ color: '#00f2fe', textDecoration: 'none' }}>+91-97521 00980</a></div>
                        <div><strong>Email:</strong> <a href="mailto:info@kiaantechnology.com" style={{ color: '#00f2fe', textDecoration: 'none' }}>info@kiaantechnology.com</a></div>
                        <div><strong>Website:</strong> <a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#00f2fe', textDecoration: 'none' }}>https://kiaantechnology.com/</a></div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
