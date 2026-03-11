import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Hamrophone" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your Hamrophone account",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;overflow:hidden;max-width:600px;">
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#001827 0%,#005f73 100%);padding:32px 40px;">
                      <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
                        Hamro<span style="color:#00E5FF;">phone</span>
                      </h1>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:700;">
                        Welcome, ${name}! 👋
                      </h2>
                      <p style="margin:0 0 24px;color:#999;font-size:15px;line-height:1.6;">
                        Thanks for signing up on Hamrophone — Nepal's most trusted second-hand phone marketplace. 
                        Click the button below to verify your email and activate your account.
                      </p>
                      <a href="${verifyUrl}" 
                         style="display:inline-block;background:#00E5FF;color:#000;font-weight:700;font-size:15px;padding:14px 32px;border-radius:100px;text-decoration:none;">
                        Verify My Account →
                      </a>
                      <p style="margin:24px 0 0;color:#555;font-size:12px;">
                        This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
                      </p>
                      <hr style="border:none;border-top:1px solid #1a1a1a;margin:32px 0;" />
                      <p style="margin:0;color:#333;font-size:11px;">
                        © ${new Date().getFullYear()} Hamrophone · Kathmandu, Nepal
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}
