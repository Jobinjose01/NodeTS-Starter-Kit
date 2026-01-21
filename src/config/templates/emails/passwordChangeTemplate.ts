/**
 * Password Change Confirmation Email Template
 */
export const passwordChangeTemplate = (): string => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed Successfully</title>
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
                color: #28a745;
                margin: 0;
            }
            .content {
                background-color: white;
                padding: 25px;
                border-radius: 6px;
                margin-bottom: 20px;
            }
            .success-icon {
                text-align: center;
                font-size: 48px;
                margin: 20px 0;
            }
            .info-box {
                background-color: #d4edda;
                border-left: 4px solid #28a745;
                padding: 15px;
                margin: 20px 0;
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
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Password Changed Successfully</h1>
            </div>
            
            <div class="content">
                <div class="success-icon">🎉</div>
                
                <h2>Your password has been updated</h2>
                
                <div class="info-box">
                    <strong>✓ Password changed successfully</strong><br>
                    Time: ${new Date().toLocaleString()}<br>
                    You can now log in with your new password.
                </div>
                
                <p>If you made this change, no further action is required.</p>
                
                <div class="warning">
                    <strong>⚠️ Didn't make this change?</strong><br>
                    If you did not change your password, please contact our support team immediately and secure your account.
                </div>
                
                <p><strong>Security Tips:</strong></p>
                <ul>
                    <li>Never share your password with anyone</li>
                    <li>Use a unique password for each account</li>
                    <li>Enable two-factor authentication if available</li>
                    <li>Change your password regularly</li>
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
