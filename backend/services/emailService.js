const nodemailer = require('nodemailer');

// Configure your email provider here (Gmail, Outlook, SendGrid)
// For now, we log to console so it works without an API key immediately.
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, // e.g., 'yourname@gmail.com'
    pass: process.env.EMAIL_PASS  // App Password (not your login password)
  }
});

exports.sendAlertEmail = async (asteroid, reason) => {
  const subject = `🚨 COSMIC WATCH ALERT: ${asteroid.name}`;
  const text = `
    URGENT ALERT SYSTEM
    -------------------
    Target: ${asteroid.name} (ID: ${asteroid.id})
    Reason: ${reason}
    
    Details:
    - Miss Distance: ${parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km
    - Diameter: ~${Math.round(asteroid.estimated_diameter.meters.estimated_diameter_max)} meters
    - Velocity: ${parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString()} km/h
    
    Status: POTENTIALLY HAZARDOUS
    
    Login to Command Center for telemetry.
  `;

  if (!process.env.EMAIL_USER) {
    console.log('📧 [EMAIL SIMULATION] ------------------------------------------------');
    console.log(`To: admin@cosmic.watch`);
    console.log(`Subject: ${subject}`);
    console.log(text);
    console.log('----------------------------------------------------------------------');
    return;
  }

  try {
    await transporter.sendMail({
      from: '"Sentinel AI" <alert@cosmic.watch>',
      to: 'admin@cosmic.watch', // In a real app, loop through subscribed users
      subject,
      text
    });
    console.log(`📧 Email sent for ${asteroid.name}`);
  } catch (error) {
    console.error('Email failed:', error.message);
  }
};