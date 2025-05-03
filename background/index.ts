import "@plasmohq/messaging/background";

import { startHub } from "@plasmohq/messaging/pub-sub";

startHub();
console.log(`BackgroundService started`);
