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

// Configure the content script to run only on pages matching chat.qwen.ai
export const config: PlasmoCSConfig = {
  matches: ["https://claude.ai/*"]
};

const ProtectButton = () => {
  const appTheme = useAppTheme();
  const [showMissingSettingsModal, setShowMissingSettingsModal] = useState(false);

  // Memoize the button classes and tooltip styles to ensure they update only when the theme changes
  // this will prevent unnecessary recalculations on re-renders which is important for performance.
  const parentClasses = useMemo(() => getParentClasses(appTheme, "claude"), [appTheme]);
  const buttonClasses = useMemo(() => getButtonClasses(appTheme, "claude"), [appTheme]);
  const spanClasses = useMemo(() => getSpanClasses(appTheme, "claude"), [appTheme]);
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
      const promptDiv = document.querySelector(".ProseMirror") as HTMLDivElement | null;
      if (promptDiv) {
        // Prepare the replacement mapping for first name and last name.
        const replacements = buildReplacements(personalData as PersonalInfo[]);

        // Get current text and loop to replace each occurrence of the names (case-insensitive).
        let updatedText = promptDiv.innerText;
        for (const [key, replacement] of Object.entries(replacements)) {
          updatedText = updatedText.replace(new RegExp(escapeString(key), "gi"), replacement);
        }

        // Update the prompt textarea with the protected text.
        promptDiv.innerText = updatedText;
        promptDiv.dispatchEvent(new Event("input", { bubbles: true }));
        promptDiv.focus();

        // Let ProseMirror process the edit with a slight delay
        setTimeout(() => {
          document.execCommand("selectAll", false, undefined);
          document.execCommand("insertText", false, updatedText);
          promptDiv.dispatchEvent(new Event("input", { bubbles: true }));
          promptDiv.dispatchEvent(new Event("change", { bubbles: true }));
        }, 50);
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

const ClaudeButtonInjector = () => {
  useEffect(() => {
    // Initialize a MutationObserver to watch for DOM changes in order to inject our buttons when the correct container becomes available.
    const observer = new MutationObserver((_mutations, obs) => {
      const modelSelectorButton = document.querySelector('[data-testid="model-selector-dropdown"]');
      const sendButton = document.querySelector<HTMLButtonElement>('button[aria-label="Send message"]');

      const modelWrapper = modelSelectorButton?.parentElement;
      const sendWrapper = sendButton?.parentElement?.parentElement;

      const parent = modelWrapper?.parentElement;

      // Inject our buttons only if the container hasn’t already been injected.
      if (modelWrapper && sendWrapper && parent && !parent.querySelector(".protect-button")) {
        const container = document.createElement("div");
        container.className = "protect-button";

        // Prefer inserting next to the modelSelector, fallback to before sendWrapper
        if (modelWrapper.nextSibling) {
          parent.insertBefore(container, modelWrapper.nextSibling);
        } else {
          parent.insertBefore(container, sendWrapper);
        }

        // Create a React 18's root on the container and render our component for concurrent mode compatibility.
        const root = createRoot(container);
        root.render(<ProtectButton />);

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

export default ClaudeButtonInjector;
