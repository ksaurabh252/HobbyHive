const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendEventReminder = async (to, eventTitle) => {
  try {
    await transporter.sendMail({
      from: `"HobbyHive" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Reminder: ${eventTitle} starts soon!`,
      html: `
        <h2>Don't forget your event!</h2>
        <p>Your "${eventTitle}" event is coming up soon.</p>
        <p>See you there!</p>
        <br/>
        <small>The HobbyHive Team</small>
      `,
    });
    console.log(`Reminder email sent to ${to}`);
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Failed to send email");
  }
};
