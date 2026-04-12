# BiteBridge Security Guidelines

## 🔒 Sensitive Information Management

### Environment Variables (DO NOT COMMIT)
All sensitive credentials are managed through environment variables. **NEVER** hardcode them in the repository.

**Protected Files:**
- `.env` - Local development credentials ✅ Ignored by git
- `.env.local` - Local overrides ✅ Ignored by git
- `.env.production` - Production secrets ✅ Ignored by git

### Credentials Currently Secured
1. **MongoDB Connection String**
   - Location: `SPRING_DATA_MONGODB_URI` env var
   - Never hardcoded in source code ✅
   - Database password protected ✅

2. **JWT Secret Key**
   - Location: `JWT_SECRET` env var
   - Current length: 64+ characters ✅
   - Algorithm: HS512 ✅
   - Rotation: Should be rotated quarterly

3. **Email Service (Gmail SMTP)**
   - Location: `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD` env vars
   - Using app-specific passwords ✅
   - Not stored in code ✅

4. **CORS Configuration**
   - Restricted to specific domains ✅
   - Uses `APP_CORS_ALLOWED_ORIGIN_PATTERNS` env var

### Admin Accounts
- **Default Admin Email:** `admin@bitebridge.com`
- **Password:** Stored in MongoDB with bcrypt hashing
- **MFA:** Recommended to enable after deployment

## 📋 Deployment Checklist

### Before Production Deployment
- [ ] Verify all `.env*` files are in `.gitignore`
- [ ] Change `JWT_SECRET` to a strong random string (minimum 64 chars)
- [ ] Update `SPRING_DATA_MONGODB_URI` with production database
- [ ] Configure `APP_CORS_ALLOWED_ORIGIN_PATTERNS` for your domain
- [ ] Update `SPRING_MAIL_PASSWORD` with app-specific Gmail password
- [ ] Set `APP_SEED_ENABLED=false` in production
- [ ] Enable HTTPS with proper SSL certificates
- [ ] Review and update `SecurityConfig.java` for production
- [ ] Rotate all credentials after deployment

### Environment Variables Required
```bash
# MongoDB
SPRING_DATA_MONGODB_URI=mongodb+srv://<user>:<password>@<host>/bitebridge

# JWT
JWT_SECRET=<strong-random-64-char-string>

# Email
SPRING_MAIL_USERNAME=<gmail@gmail.com>
SPRING_MAIL_PASSWORD=<app-specific-password>

# CORS
APP_CORS_ALLOWED_ORIGIN_PATTERNS=https://yourdomain.com

# Server
SERVER_PORT=8080
APP_SEED_ENABLED=false
```

## 🚨 Security Best Practices

### API Security
1. All endpoints require JWT authentication (except login/register)
2. Admin endpoints require `ADMIN` role
3. Rate limiting recommended for auth endpoints
4. HTTPS enforced in production

### Database Security
1. MongoDB Atlas IP whitelist configured
2. Database user has limited permissions
3. Connection uses TLS/SSL encryption
4. Regular backups enabled

### Code Security
1. No hardcoded secrets in source code ✅
2. Dependencies regularly updated
3. SQL injection prevention through MongoDB parameterization
4. XSS protection via React's built-in escaping

### Credential Rotation Schedule
- **JWT Secret:** Quarterly or after security incident
- **Database Password:** Quarterly
- **API Keys:** Annually or after rotation policy change
- **Admin Passwords:** After onboarding and on suspicion of compromise

## 🔑 Accessing Secrets Locally

### For Development
1. Copy `.env.example` to `.env`
2. Fill in local MongoDB URI (local or Atlas dev instance)
3. Use a test JWT secret
4. Use a test Gmail app password

### For Production (Render/Deployment)
1. Set environment variables in deployment platform settings
2. Never commit `.env` files
3. Rotate secrets after initial setup

## 📞 Security Incident Response
1. If credentials are exposed, immediately rotate them
2. If code changes are unauthorized, review git history
3. If database is compromised, alert all users
4. Document all incidents for audit trail

## Links
- [Environment Variables Setup Guide](./README.md)
- [Backend Configuration](./backend/src/main/resources/application.properties)
- [Production Configuration](./backend/src/main/resources/application-prod.properties)
