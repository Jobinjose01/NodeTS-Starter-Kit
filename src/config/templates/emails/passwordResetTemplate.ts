/**
 * Password Reset Email Template
 * @param resetUrl - The URL to reset the password
 * @param token - The reset token
 */
export const passwordResetTemplate = (resetUrl: string, token: string): string => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .container {
                background-color: #f9f9f9;
                border-radius: 8px;
                padding: 30px;
                border: 1px solid #ddd;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #4a90e2;
                margin: 0;
            }
            .content {
                background-color: white;
                padding: 25px;
                border-radius: 6px;
                margin-bottom: 20px;
            }
            .button {
                display: inline-block;
                padding: 12px 30px;
                background-color: #4a90e2;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
            }
            .button:hover {
                background-color: #357abd;
            }
            .warning {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #666;
                margin-top: 20px;
            }
            .token-info {
                background-color: #e9ecef;
                padding: 10px;
                border-radius: 4px;
                font-family: monospace;
                word-break: break-all;
                margin: 15px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔒 Password Reset Request</h1>
            </div>
            
            <div class="content">
                <h2>Hello,</h2>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <div class="token-info">
                    ${resetUrl}
                </div>
                
                <div class="warning">
                    <strong>⏰ This link will expire in 1 hour.</strong>
                </div>
                
                <p><strong>If you didn't request this password reset:</strong></p>
                <ul>
                    <li>You can safely ignore this email</li>
                    <li>Your password will remain unchanged</li>
                    <li>Consider changing your password if you're concerned about account security</li>
                </ul>
            </div>
            
            <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
                <p>&copy; ${new Date().getFullYear()} StarterKit. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
