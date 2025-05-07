import type { PlasmoMessaging } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";

import "@plasmohq/messaging/background";

console.log("Environment:", process.env.NODE_ENV);
console.log("Target:", process.env.PLASMO_TARGET);
console.log("Browser:", process.env.PLASMO_BROWSER);
console.log("Extension:", process.env.PLASMO_PUBLIC_EXTENSION);

const handler: PlasmoMessaging.MessageHandler = async (req, response) => {
  if (req.name !== "settings-handler") {
    console.error("this is not the right handler");
    return;
  }

  const storage = new Storage();
  const storedData = await storage.get("personalData");

  let personalData = [];
  if (storedData) {
    try {
      personalData = JSON.parse(storedData);
    } catch (e) {
      response.send({ error: "No PII fields configured." });
      return;
    }
  }
  if (Array.isArray(personalData)) {
    response.send({ personalData });
    return;
  }

  response.send({ error: "Invalid personalData format" });
  return;
};

export default handler;
