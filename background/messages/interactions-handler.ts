import type { PlasmoMessaging } from "@plasmohq/messaging";

import "@plasmohq/messaging/background";

const handler: PlasmoMessaging.MessageHandler = async (req, response) => {
  if (req.name !== "interactions-handler") {
    console.error("this is not the right handler");
    return;
  }

  chrome.runtime.openOptionsPage();
  response.send({ success: true });
};

export default handler;
