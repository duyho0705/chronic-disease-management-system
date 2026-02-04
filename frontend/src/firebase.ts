import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

const isPlaceholder = (val: string) => val.startsWith("YOUR_");

export const requestForToken = async () => {
    if (isPlaceholder(firebaseConfig.apiKey) || isPlaceholder("YOUR_VAPID_KEY")) {
        console.warn("FCM placeholders detected. Skipping token request.");
        return null;
    }
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: "YOUR_VAPID_KEY",
        });
        if (currentToken) {
            console.log("Current token for client: ", currentToken);
            return currentToken;
        } else {
            console.log(
                "No registration token available. Request permission to generate one."
            );
            return null;
        }
    } catch (err) {
        console.log("An error occurred while retrieving token. ", err);
        return null;
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload: any) => {
            console.log("Payload received: ", payload);
            resolve(payload);
        });
    });
