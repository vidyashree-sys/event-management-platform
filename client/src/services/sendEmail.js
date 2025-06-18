// services/sendEmail.js
import emailjs from "emailjs-com";

export const sendRSVPConfirmation = async (userEmail, eventTitle) => {
  try {
    const result = await emailjs.send(
      "your_service_id",      // replace with actual ID
      "your_template_id",     // replace with actual ID
      {
        to_email: userEmail,
        event_title: eventTitle,
      },
      "your_public_key"       // replace with actual key
    );
    console.log("Email sent ✅", result.text);
  } catch (error) {
    console.error("Email sending failed ❌", error);
  }
};
