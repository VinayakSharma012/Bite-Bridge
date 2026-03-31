import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import '../styles/pages/Auth.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back!</h1>
          <p>Sign in to your BiteBridge account</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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

          <div className="form-group">
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              required
            />
          </div>

          <div className="auth-links">
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="auth-divider">
          <span>Don't have an account?</span>
        </div>

        <Link to="/register">
          <Button
            type="button"
            variant="secondary"
            size="large"
            fullWidth
          >
            Create Account
          </Button>
        </Link>

        <div className="auth-footer">
          <p>Continue as guest to browse restaurants</p>
          <Link to="/" className="guest-link">Browse as Guest</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
