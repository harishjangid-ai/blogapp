import { useEffect } from "react";
import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import { api } from "@/utils/api";

export const useFCM = ({userId}: {userId?: string }) => {
  useEffect(() => {
    if(!userId) return;
    const init = async () => {
      try {
        const permission =
        await Notification.requestPermission();
        
        if (permission !== "granted") return;
        console.log("Permission granted for notifications");
        const token = await getToken(messaging!, {
          vapidKey:
            process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        if (!token) return;
        await api.post("/save-fcm-token", {
          token,
        });
      } catch (err) {
        console.log(err);
      }
    };

    init();
  }, [userId]);
};