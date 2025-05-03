import Tooltip from "@mui/material/Tooltip";
import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

import { sendToBackground } from "@plasmohq/messaging";

import escapeString from "~contents/helpers/regex";

import { buildReplacements } from "./helpers/replacements";
import { useAppTheme } from "./hooks/useAppTheme";
import { PersonalIcon } from "./shared/Icons";
import MissingSettingsModal from "./shared/MissingSettingsModal";
import type { PersonalInfo } from "./types/pii";
import { getButtonClasses, getParentClasses, getSpanClasses, getTooltipStyles } from "./utils/themeStyles";

// Configure the content script to run only on pages matching grok.com
export const config: PlasmoCSConfig = {
  matches: ["https://grok.com/*"]
};

const ProtectButton = () => {
  const appTheme = useAppTheme();
  const [showMissingSettingsModal, setShowMissingSettingsModal] = useState(false);

  // Memoize the button classes and tooltip styles to ensure they update only when the theme changes
  // this will prevent unnecessary recalculations on re-renders which is important for performance.
  const parentClasses = useMemo(() => getParentClasses(appTheme, "grok"), [appTheme]);
  const buttonClasses = useMemo(() => getButtonClasses(appTheme, "grok"), [appTheme]);
  const spanClasses = useMemo(() => getSpanClasses(appTheme, "grok"), [appTheme]);
  const tooltipStyles = useMemo(() => getTooltipStyles(appTheme), [appTheme]);

  // Handler for protecting text: communicates with the background script to fetch user information.
  const handleProtectClick = async () => {
    try {
      // Send a message to the background script to get the user's name details.
      const response = await sendToBackground({ name: "settings-handler" });
      const { personalData, error } = response;

      // Validation before processing: If there is an error or missing details, alert the user.
      if (error || !Array.isArray(personalData) || Object.keys(personalData).length === 0) {
        setShowMissingSettingsModal(true);
        return;
      }

      // Get the prompt textarea element where the message is written.
      const textarea = document.querySelector("textarea.bg-transparent") as HTMLTextAreaElement | null;
      if (textarea) {
        // Prepare the replacement mapping for first name and last name.
        const replacements = buildReplacements(personalData as PersonalInfo[]);

        // Get current text and loop to replace each occurrence of the names (case-insensitive).
        let updatedText = textarea.value;
        for (const [key, replacement] of Object.entries(replacements)) {
          updatedText = updatedText.replace(new RegExp(escapeString(key), "gi"), replacement);
        }

        // Update the prompt textarea with the protected text.
        textarea.value = updatedText;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } catch (error) {
      console.error("Protection failed:", error);
      alert("Protection failed. Please try again.");
    }
  };

  // Determine icon color based on the current theme.
  const iconColor = appTheme === "dark" ? "white" : "black";

  return (
    <div className={parentClasses}>
      {/* Protect Button with Tooltip */}
      <Tooltip title="Protect text" arrow slotProps={tooltipStyles}>
        <button onClick={handleProtectClick} className={buttonClasses} type="button">
          <PersonalIcon color={iconColor} />
          <span className={spanClasses}>Protect</span>
        </button>
      </Tooltip>
      <MissingSettingsModal open={showMissingSettingsModal} onClose={() => setShowMissingSettingsModal(false)} />
    </div>
  );
};

const GrokButtonInjector = () => {
  // MutationObserver for dynamic DOM insertion in Grok's complex UI
  useEffect(() => {
    // Initialize a MutationObserver to watch for DOM changes in order to inject our buttons when the correct container becomes available.
    const observer = new MutationObserver((_mutations, obs) => {
      // Look for the "Grok 3" button within grok.com's chat box.
      // We iterate over all buttons to find one whose text includes "Grok 3".
      const grokButton = Array.from(document.querySelectorAll("button")).find((btn) => btn.textContent && btn.textContent.trim().includes("Grok 3"));

      // Inject our buttons only if the container hasn’t already been injected.
      if (grokButton && !grokButton.parentElement?.querySelector(".protect-button")) {
        const container = document.createElement("div");
        container.className = "protect-button";

        // Insert our container immediately before the Grok 3 button.
        grokButton.parentElement?.insertBefore(container, grokButton);

        // Create a React 18's root on the container and render our component for concurrent mode compatibility.
        const root = createRoot(container);
        root.render(<ProtectButton />);

        // disconnect the observer after successful injection
        obs.disconnect();
      }
    });

    // start observing entire document body changes in the DOM.
    observer.observe(document.body, { childList: true, subtree: true });

    // cleanup the observer on unmount.
    return () => observer.disconnect();
  }, []);

  // This component does not render anything itself.
  return null;
};

export default GrokButtonInjector;
