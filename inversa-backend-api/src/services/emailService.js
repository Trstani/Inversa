import { Resend } from 'resend';

const resend =
  new Resend(
    process.env.RESEND_API_KEY
  );

export const sendOTPEmail =
async (
  email,
  otp
) => {

  const response =
    await resend.emails.send({

      from:
        'INVERSA <onboarding@resend.dev>',

      to: email,

      subject:
        'INVERSA Email Verification',

      html: `
        <h2>Email Verification</h2>

        <p>Your verification code:</p>

        <h1>${otp}</h1>

        <p>
          This code expires in 10 minutes.
        </p>
      `
    });

  console.log(
    'RESEND RESPONSE:',
    response
  );

};