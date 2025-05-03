import type { PlasmoMessaging } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";

import "@plasmohq/messaging/background";

const handler: PlasmoMessaging.MessageHandler = async (req, response) => {
  if (req.name !== "onboarding-handler") {
    console.error("this is not the right handler");
    return;
  }

  const storage = new Storage();
  const onboarded = await storage.get<boolean>("onboarded");
  response.send({ isOnboarded: onboarded });
};

export default handler;
