import React, { useState } from 'react';
import { Mail, Phone, MapPin, HelpCircle, ChevronDown, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import useInViewStagger from '../hooks/useInViewStagger';
import notify from '../utils/toast';
import '../styles/pages/HelpSupport.css';

function HelpSupport() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const contactReveal = useInViewStagger();
  const faqReveal = useInViewStagger();
  const formReveal = useInViewStagger();

  const faqs = [
    {
      id: 1,
      question: 'How do I place an order?',
      answer: 'Browse restaurants, select your favorite dishes, add them to cart, and proceed to checkout. You can track your order in real-time once it\'s confirmed.',
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: 'We accept multiple payment methods including Credit/Debit cards, UPI, Digital wallets, and Cash on Delivery (where available).',
    },
    {
      id: 3,
      question: 'Can I cancel my order?',
      answer: 'You can cancel orders before the restaurant starts preparing. Once preparation begins, cancellation may not be possible. Contact support for assistance.',
    },
    {
      id: 4,
      question: 'How long does delivery take?',
      answer: 'Average delivery time is 30-45 minutes depending on your location and restaurant. You can see estimated delivery time before confirming your order.',
    },
    {
      id: 5,
      question: 'What if my food is damaged or incomplete?',
      answer: 'Contact our support team immediately with photos. We\'ll resolve the issue with a refund or replacement.',
    },
    {
      id: 6,
      question: 'How do coupons work?',
      answer: 'Apply coupon codes at checkout to get discounts. Coupons have minimum order requirements and validity periods. Check terms before applying.',
    },
  ];

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send to backend
    setSubmitted(true);
    notify.success('Message sent successfully. Our team will contact you shortly.');
    setTimeout(() => {
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <>
      <Navbar />

      <main className="help-support-page page-shell">
        <div className="help-support-container">
      {/* Header */}
          <div className="help-header">
            <h1>Help & Support</h1>
            <p>We're here to help. Find answers to common questions or contact us.</p>
          </div>

      {/* Contact Info Cards */}
          <div
            ref={contactReveal.ref}
            className={`contact-cards reveal-section stagger-children ${contactReveal.inView ? 'is-visible' : ''}`}
          >
            <Card className="contact-card">
              <div className="card-icon">
                <Phone size={32} />
              </div>
              <h3>Call Us</h3>
              <p className="info">+91-1234-567-890</p>
              <small>Mon-Sun, 9 AM - 10 PM</small>
            </Card>

            <Card className="contact-card">
              <div className="card-icon">
                <Mail size={32} />
              </div>
              <h3>Email Us</h3>
              <p className="info">support@bitebridge.com</p>
              <small>Response within 24 hours</small>
            </Card>

            <Card className="contact-card">
              <div className="card-icon">
                <MapPin size={32} />
              </div>
              <h3>Visit Us</h3>
              <p className="info">BiteBridge HQ, Mumbai</p>
              <small>By appointment only</small>
            </Card>
          </div>

      {/* FAQ Section */}
          <section ref={faqReveal.ref} className={`faq-section reveal-section ${faqReveal.inView ? 'is-visible' : ''}`}>
            <div className="section-header">
              <HelpCircle size={24} />
              <h2>Frequently Asked Questions</h2>
            </div>

            <div className="faq-list">
              {faqs.map(faq => (
                <div
                  key={faq.id}
                  className={`faq-item ${expandedFaq === faq.id ? 'expanded' : ''}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    aria-expanded={expandedFaq === faq.id}
                    aria-controls={`faq-panel-${faq.id}`}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={20} className="chevron" />
                  </button>
                  <div
                    id={`faq-panel-${faq.id}`}
                    className={`faq-answer ${expandedFaq === faq.id ? 'open' : ''}`}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

      {/* Contact Form */}
          <section
            ref={formReveal.ref}
            className={`contact-form-section reveal-section ${formReveal.inView ? 'is-visible' : ''}`}
          >
            <div className="form-container">
              <h2>Send us a Message</h2>
              <p>Couldn't find what you're looking for? Contact our support team.</p>

              {submitted && (
                <div className="success-message">
                  ✓ Thank you! We've received your message and will respond soon.
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <Input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <Input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Please describe your issue or question in detail..."
                    required
                  ></textarea>
                </div>

                <Button variant="primary" size="large" type="submit">
                  <Send size={18} /> Send Message
                </Button>
              </form>
            </div>
          </section>

          {/* Live Chat */}
          <section className="live-chat-section">
            <div className="chat-container">
              <h3>Need Immediate Assistance?</h3>
              <p>Chat with our support team</p>
              <Button
                variant="primary"
                onClick={() => notify.info('Live chat will be available in the next release.')}
              >
                <span className="chat-live-dot" aria-hidden="true" />
                Start Live Chat
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default HelpSupport;
