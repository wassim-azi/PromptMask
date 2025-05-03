import { useEffect, useState } from "react";
import { IoClose, IoSettings } from "react-icons/io5";

import { sendToBackground } from "@plasmohq/messaging";

import "./MissingSettingsModal.css";

const MissingSettingsModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [animationState, setAnimationState] = useState<"entering" | "entered" | "exiting" | "exited">("exited");

  useEffect(() => {
    if (open) {
      setAnimationState("entering");
      const timer = setTimeout(() => setAnimationState("entered"), 250); // faster animation
      return () => clearTimeout(timer);
    } else if (animationState === "entered" || animationState === "entering") {
      setAnimationState("exiting");
      const timer = setTimeout(() => setAnimationState("exited"), 200);
      return () => clearTimeout(timer);
    } else {
      setAnimationState("exited");
    }
  }, [open]);

  if (animationState === "exited") return null;

  return (
    <div className="backdrop">
      <div className={`modal ${animationState === "entering" ? "modal-entering" : animationState === "exiting" ? "modal-exiting" : "modal-entered"}`}>
        <button aria-label="close" onClick={onClose} className="icon-close-btn" type="button">
          <IoClose size={28} />
        </button>
        <div className="warning-icon">⚠️</div>
        <div className="title">{chrome.i18n.getMessage("modal_missing_settings_title")}</div>
        <button
          className="action-button"
          onClick={async () => {
            await sendToBackground({ name: "interactions-handler" });
            onClose();
          }}>
          <IoSettings size={18} className="action-button-icon" />
          {chrome.i18n.getMessage("modal_missing_settings_open_options")}
        </button>
      </div>
    </div>
  );
};

export default MissingSettingsModal;
