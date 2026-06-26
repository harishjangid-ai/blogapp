import admin from "../config/firebase";

interface SendPushNotificationParams {
  token?: string;
  tokens?: string[];
  title: string;
  body: string;
  data?: Record<string, string | number | boolean>;
}

export const sendPushNotification = async ({
  token,
  tokens,
  title,
  body,
  data = {},
}: SendPushNotificationParams): Promise<void> => {
  try {
    const payload = {
      notification: {
        title,
        body,
      },
      data: Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, String(value)])
      ),
    };

    if (token) {
      const response = await admin.messaging().send({
        token,
        ...payload,
      });

      console.log("Single notification sent:", response);
    }

    if (tokens && tokens.length > 0) {
      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        ...payload,
      });

      console.log(
        `Success: ${response.successCount}, Failed: ${response.failureCount}`
      );
    }
  } catch (error) {
    console.error("Push Error:", error);
  }
};