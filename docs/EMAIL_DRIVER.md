# Email Driver Configuration

This project supports multiple email drivers for flexibility during development and production.

## Available Drivers

### 1. **SMTP Driver** (Production)
Sends real emails via SMTP server (Gmail, SendGrid, Mailgun, etc.)

### 2. **LOG Driver** (Development/Testing)
Writes emails to log files instead of sending them. Perfect for:
- Local development without SMTP setup
- Testing email templates
- CI/CD pipelines
- Debugging email content

---

## Configuration

Set the `EMAIL_DRIVER` environment variable in your `.env` file:

```bash
# For development/testing - log emails to file
EMAIL_DRIVER="log"

# For production - send real emails via SMTP
EMAIL_DRIVER="smtp"
```

---

## LOG Driver

### How It Works

When `EMAIL_DRIVER=log`, emails are written to daily rotating log files:

```
logs/emails/
├── 2026-01-21-emails.log
├── 2026-01-22-emails.log
└── ...
```

### Log Format

Each email is logged with full details:

```
2026-01-21 10:30:45

📧 EMAIL LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TO: user@example.com
SUBJECT: Password Reset Request
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HTML CONTENT:
<!DOCTYPE html>
<html>
  ... full email HTML ...
</html>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
================================================================================
```

### Features

- ✅ **Daily Rotation**: New log file created each day
- ✅ **30-Day Retention**: Automatically deletes logs older than 30 days
- ✅ **Full HTML**: Complete email content including HTML templates
- ✅ **Console Output**: Shows when emails are logged
- ✅ **Winston Integration**: Uses same logger system as error logs

### Console Output

```bash
📧 Email driver set to LOG - Emails will be written to logs/emails/
Server is running on port 5000
📧 Email logged to file - TO: user@example.com, SUBJECT: Password Reset Request
```

---

## SMTP Driver

### Configuration

Set `EMAIL_DRIVER=smtp` and configure SMTP settings:

```bash
EMAIL_DRIVER="smtp"

# SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM_NAME="StarterKit"
SMTP_FROM_EMAIL="noreply@example.com"
FRONTEND_URL="http://localhost:3000"
```

### Supported Providers

- **Gmail**: `smtp.gmail.com:587` (requires App Password)
- **Outlook/Office365**: `smtp.office365.com:587`
- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailgun**: `smtp.mailgun.org:587`
- **Amazon SES**: Regional endpoints
- **Custom SMTP**: Any SMTP server

---

## Usage Examples

### Development Workflow

1. **Set LOG driver** for local development:
   ```bash
   EMAIL_DRIVER="log"
   ```

2. **Test password reset**:
   ```bash
   curl -X POST http://localhost:5000/api/v1/password/forgot \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com"}'
   ```

3. **Check the log file**:
   ```bash
   cat logs/emails/$(date +%Y-%m-%d)-emails.log
   ```

4. **Copy reset token** from the log and test reset endpoint

### Production Setup

1. **Set SMTP driver**:
   ```bash
   EMAIL_DRIVER="smtp"
   ```

2. **Configure SMTP credentials** (use environment variables)

3. **Test email delivery** before going live

---

## File Structure

```
src/
├── utils/
│   ├── emailService.ts       # Main email service with driver logic
│   └── emailLogger.ts        # Winston logger for email logs
└── config/
    └── templates/
        └── emails/            # Email HTML templates
            ├── passwordResetTemplate.ts
            └── passwordChangeTemplate.ts

logs/
└── emails/                    # Email log files (LOG driver)
    └── YYYY-MM-DD-emails.log
```

---

## API Reference

### emailService.ts

```typescript
// Automatically uses configured driver (smtp or log)
await sendEmail(to: string, subject: string, html: string): Promise<boolean>

// Helper functions
await sendPasswordResetEmail(to: string, resetToken: string): Promise<boolean>
await sendPasswordChangeConfirmation(to: string): Promise<boolean>
```

### emailLogger.ts

```typescript
// Used internally by LOG driver
logEmail(to: string, subject: string, html: string): void
```

---

## Troubleshooting

### LOG Driver Issues

**Problem**: Log files not created
- **Solution**: Check `logs/emails/` directory exists and has write permissions
- **Check**: `chmod 0777 logs/emails/`

**Problem**: Can't find emails in logs
- **Solution**: Check today's log file: `logs/emails/YYYY-MM-DD-emails.log`
- **Tip**: Use `tail -f logs/emails/$(date +%Y-%m-%d)-emails.log` to watch in real-time

### SMTP Driver Issues

**Problem**: SMTP connection error
- **Solution**: Verify SMTP credentials in `.env`
- **Gmail**: Use App Password, not account password
- **Firewall**: Ensure port 587 (or 465) is open

**Problem**: Emails not sending
- **Solution**: Check console for error messages
- **Test**: Try sending test email via curl/Postman

---

## Best Practices

### Development
- ✅ Use `EMAIL_DRIVER=log`
- ✅ Review email templates in log files
- ✅ Test all email scenarios without SMTP setup
- ✅ Commit `.env.example` with `EMAIL_DRIVER=log`

### Testing
- ✅ Use `EMAIL_DRIVER=log` in CI/CD
- ✅ Assert email content from log files
- ✅ No external email service dependencies

### Production
- ✅ Use `EMAIL_DRIVER=smtp`
- ✅ Use environment variables for SMTP credentials (never commit)
- ✅ Set up monitoring for email delivery
- ✅ Configure SPF/DKIM/DMARC for better deliverability

---

## Environment Variables

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| `EMAIL_DRIVER` | `smtp`, `log` | `smtp` | Email delivery method |
| `SMTP_HOST` | string | `smtp.gmail.com` | SMTP server hostname |
| `SMTP_PORT` | number | `587` | SMTP server port |
| `SMTP_SECURE` | `true`, `false` | `false` | Use SSL (true for 465) |
| `SMTP_USER` | string | - | SMTP username/email |
| `SMTP_PASS` | string | - | SMTP password |
| `SMTP_FROM_NAME` | string | `StarterKit` | Sender name |
| `SMTP_FROM_EMAIL` | string | - | Sender email address |
| `FRONTEND_URL` | string | - | Frontend URL for links |

---

## Migration Guide

### Switching from SMTP to LOG

1. Update `.env`:
   ```bash
   EMAIL_DRIVER="log"
   ```

2. Restart server

3. No code changes needed!

### Switching from LOG to SMTP

1. Update `.env`:
   ```bash
   EMAIL_DRIVER="smtp"
   SMTP_HOST="your-smtp-host"
   SMTP_USER="your-email"
   SMTP_PASS="your-password"
   ```

2. Restart server

3. No code changes needed!

---

## Future Enhancements

- [ ] Add Queue driver (Redis/Bull)
- [ ] Add Database driver (store in DB)
- [ ] Add Preview driver (local email preview UI)
- [ ] Add Test driver (assertions in tests)
- [ ] Add Postmark/Mailchimp drivers
- [ ] Email sending statistics/metrics

---

## Related Documentation

- [Password Management Feature](./PASSWORD_MANAGEMENT.md)
- [Winston Logger Configuration](../src/utils/logger.ts)
- [Email Templates](../src/config/templates/emails/)

---

## Support

For issues or questions about email configuration:
- Check log files: `logs/emails/`
- Review SMTP settings in `.env`
- Test with LOG driver first
- Contact development team
