import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, fullName, jobTitle } = await req.json();

    const data = await resend.emails.send({
      from: 'The Propels <onboarding@resend.dev>', // Update this with your verified domain later
      to: [email],
      subject: `Application Received: ${jobTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h1 style="color: #0891b2;">Hello ${fullName},</h1>
          <p style="font-size: 16px; color: #334155; line-height: 1.6;">
            Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>The Propels</strong>.
          </p>
          <p style="font-size: 16px; color: #334155; line-height: 1.6;">
            We have successfully received your application. Our recruitment team will review your profile and get back to you soon.
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 14px; color: #64748b;">Best regards,<br><strong>The Propels Team</strong></p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
