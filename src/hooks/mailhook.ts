// mailhook.ts (ye file src/hooks ya src/utils me rakh sakte ho)

import emailjs from '@emailjs/browser';

export const sendSOSMail = async (messageType: "medical" | "safety" | "general"): Promise<void> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const latitude = pos.coords.latitude.toFixed(6);
      const longitude = pos.coords.longitude.toFixed(6);

      const templateParams = {
        to_email: "jiadu4979@gmail.com", // 🔁 future me dynamic bhi kar sakte ho
        latitude,
        longitude,
        location_link: `https://www.google.com/maps?q=${latitude},${longitude}`,
        message_type: messageType.toUpperCase() + " SOS",
      };

      try {
        await emailjs.send(
          'service_e6vdbbf',
          'template_azq1t1s',
          templateParams,
          'uIUZ0HxEtfzAhDQ9S'
        );
        resolve();
      } catch (error) {
        console.error("❌ Error sending email:", error);
        reject(error);
      }
    }, (err) => {
      console.error("❌ Location error:", err);
      reject(err);
    });
  });
};
