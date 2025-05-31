const { google } = require("googleapis");

const createCalendarEvent = async (user, eventData) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const calendarEvent = {
      summary: eventData.title,
      description: eventData.description,
      start: { dateTime: eventData.startTime },
      end: { dateTime: eventData.endTime },
      reminders: { useDefault: true },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: calendarEvent,
    });

    return response.data;
  } catch (err) {
    console.error("Calendar error:", err);
    throw err;
  }
};

module.exports = { createCalendarEvent };
