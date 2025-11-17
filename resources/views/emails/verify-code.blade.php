<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Email Verification Code</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Basic reset */
        body,
        table,
        td,
        p {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
        }

        body {
            background-color: #f3f4f6;
            color: #111827;
        }

        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f3f4f6;
            padding: 24px 0;
        }

        .main {
            width: 100%;
            max-width: 480px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 18px 45px rgba(15, 23, 42, 0.1);
        }

        .header {
            padding: 20px 24px 12px 24px;
            background: linear-gradient(135deg, #4f46e5, #6366f1);
            color: #ffffff;
        }

        .header-title {
            font-size: 18px;
            font-weight: 600;
        }

        .header-subtitle {
            font-size: 13px;
            opacity: 0.85;
            margin-top: 4px;
        }

        .content {
            padding: 24px 24px 20px 24px;
        }

        .greeting {
            font-size: 15px;
            margin-bottom: 8px;
        }

        .message {
            font-size: 14px;
            line-height: 1.6;
            color: #4b5563;
            margin-bottom: 20px;
        }

        .code-box {
            text-align: center;
            padding: 18px 16px;
            border-radius: 12px;
            background-color: #f3f4ff;
            border: 1px solid #e0e7ff;
            margin-bottom: 18px;
        }

        .code-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #6b7280;
            margin-bottom: 6px;
        }

        .code-value {
            font-size: 26px;
            font-weight: 700;
            letter-spacing: 0.35em;
            color: #111827;
        }

        .hint {
            font-size: 12px;
            color: #6b7280;
            line-height: 1.5;
            margin-bottom: 18px;
        }

        .button-wrapper {
            text-align: center;
            margin-bottom: 10px;
        }

        .primary-btn {
            display: inline-block;
            padding: 10px 22px;
            border-radius: 999px;
            background: linear-gradient(135deg, #4f46e5, #6366f1);
            color: #ffffff !important;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            letter-spacing: 0.04em;
        }

        .footer {
            padding: 14px 24px 20px 24px;
            border-top: 1px solid #e5e7eb;
            font-size: 11px;
            color: #9ca3af;
            line-height: 1.6;
            text-align: center;
        }

        @media (max-width: 600px) {
            .main {
                border-radius: 0;
            }

            .content,
            .header,
            .footer {
                padding-left: 18px;
                padding-right: 18px;
            }
        }
    </style>
</head>

<body>
    <table class="wrapper" role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
        <tr>
            <td align="center">
                <table class="main" role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <!-- Header -->
                    <tr>
                        <td class="header">
                            <div class="header-title">Verify your email</div>
                            <div class="header-subtitle">
                                Use the code below to complete your sign-up and secure your account.
                            </div>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td class="content">
                            <p class="greeting">Hi,</p>

                            <p class="message">
                                Thanks for creating an account. To finish setting things up, please enter this
                                verification
                                code in the app:
                            </p>

                            <div class="code-box">
                                <div class="code-label">Your verification code</div>
                                <div class="code-value">{{ $code }}</div>
                            </div>

                            <p class="hint">
                                This code will expire in <strong>15 minutes</strong>. If you didn’t request this
                                verification,
                                you can safely ignore this email.
                            </p>

                            <div class="button-wrapper">
                                <a href="#" class="primary-btn">
                                    Open verification page
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="footer">
                            You’re receiving this email because a new account was created using this address.<br>
                            If this wasn’t you, no further action is required.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>