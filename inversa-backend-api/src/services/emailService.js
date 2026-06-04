import nodemailer from 'nodemailer';

const transporter =
  nodemailer.createTransport({

    service: 'gmail',

    auth: {
      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },

  });

export const sendOTPEmail =
async (
  email,
  otp
) => {

  await transporter.sendMail({

    from:
      `"INVERSA" <${process.env.EMAIL_USER}>`,

    to:
      email,

    subject:
      'INVERSA Email Verification',

    html: `
      <h2>Email Verification</h2>

      <p>
        Your verification code:
      </p>

      <h1>${otp}</h1>

      <p>
        This code expires in 10 minutes.
      </p>
    `,

  });

};