import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Mail, Lock, User, Phone, MapPin, AlertCircle, Eye, EyeOff } from 'lucide-react';
import '../styles/pages/Auth.css';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'CUSTOMER',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone || !formData.address) {
      setError('Please fill in all fields');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: formData.role,
      });
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card large">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join BiteBridge and enjoy delicious food delivery</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                icon={User}
                required
              />
            </div>
            <div className="form-group">
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <div className="password-input">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  icon={Lock}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <div className="password-input">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  icon={Lock}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <Input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
                required
              />
            </div>
            <div className="form-group">
              <Input
                type="text"
                name="address"
                placeholder="Delivery Address"
                value={formData.address}
                onChange={handleChange}
                icon={MapPin}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        <Link to="/login">
          <Button
            type="button"
            variant="secondary"
            size="large"
            fullWidth
          >
            Sign In
          </Button>
        </Link>

        <div className="auth-footer">
          <p className="terms">
            By creating an account, you agree to our Terms & Conditions and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
