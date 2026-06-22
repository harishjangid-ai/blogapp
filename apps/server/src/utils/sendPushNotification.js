import admin from "../config/firebase.js";

export const sendPushNotification = async ({ token, tokens, title, body, data = {}, }) => {
  try {
    const payload = {
      notification: {
        title,
        body,
      },
      data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)]))
    };

    if (token) {
      const response = await admin.messaging().send({
        token,
        ...payload,
      });
    }
    if (tokens?.length) {
      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        ...payload,
      });
    }
  } catch (error) {
    console.log("Push Error:", error);
  }
};