import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface SendAccountCredentialsParams {
  to: string;
  fullName: string;
  username: string;
  password: string;
}

export async function sendAccountCredentials({
  to,
  fullName,
  username,
  password,
}: SendAccountCredentialsParams): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!resend) {
    console.error("RESEND_API_KEY is not configured. Email not sent.");
    return {
      success: false,
      error: "Email service not configured",
    };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Nebuloid Games</h1>
  </div>
  <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-top: 0;">Access Approved!</h2>
    <p>Hello ${fullName},</p>
    <p>Your access to Nebuloid Games has been approved. Here are your login credentials:</p>
    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Username:</strong> <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${username}</code></p>
      <p style="margin: 5px 0;"><strong>Password:</strong> <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${password}</code></p>
    </div>
    <p style="text-align: center; margin: 20px 0;">
      <a href="${appUrl}/login" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Now</a>
    </p>
    <p style="color: #666; font-size: 14px;"><strong>Important:</strong> Please keep these credentials private and do not share them with anyone.</p>
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
    <p style="color: #999; font-size: 12px; text-align: center;">Regards,<br>Nebuloid Games</p>
  </div>
</body>
</html>
`;

  try {
    const { error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM || "Nebuloid Games <shivamgoswami258@gmail.com>",
      to,
      subject: "Your Nebuloid Games Access",
      html,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error: "Failed to send email" };
    }

    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

interface SendResendCredentialsParams {
  to: string;
  fullName: string;
  username: string;
  password: string;
}

export async function sendResendCredentials({
  to,
  fullName,
  username,
  password,
}: SendResendCredentialsParams): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!resend) {
    console.error("RESEND_API_KEY is not configured. Email not sent.");
    return {
      success: false,
      error: "Email service not configured",
    };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #66ead4 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Nebuloid Games</h1>
  </div>
  <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-top: 0;">New Login Credentials</h2>
    <p>Hello ${fullName},</p>
    <p>A new set of login credentials has been generated for your Nebuloid Games account. Please use the following details to log in:</p>
    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Username:</strong> <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${username}</code></p>
      <p style="margin: 5px 0;"><strong>Password:</strong> <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${password}</code></p>
    </div>
    <p style="text-align: center; margin: 20px 0;">
      <a href="${appUrl}/login" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Now</a>
    </p>
    <p style="color: #666; font-size: 14px;"><strong>Important:</strong> Your previous password has been invalidated. Please keep these new credentials private and do not share them with anyone.</p>
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
    <p style="color: #999; font-size: 12px; text-align: center;">Regards,<br>Nebuloid Games</p>
  </div>
</body>
</html>
`;

  try {
    const { error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM || "Nebuloid Games <shivamgoswami258@gmail.com>",
      to,
      subject: "Your Nebuloid Games Account Credentials",
      html,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error: "Failed to send email" };
    }

    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: "Failed to send email" };
  }
}
