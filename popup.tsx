import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import dangerImage from "data-base64:~assets/danger.png";
import safeImage from "data-base64:~assets/safe.png";
import { useEffect, useState } from "react";
import { FaChrome, FaGithub } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";

import { sendToBackground } from "@plasmohq/messaging";

import "./style.css";

function IndexPopup() {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { isOnboarded } = await sendToBackground<{ onboarding: boolean }>({ name: "onboarding-handler" });
      if (isOnboarded) {
        setIsOnboarded(true);
      } else {
        setIsOnboarded(false);
      }
    })();
  }, []);

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div
      className="flex flex-col items-center justify-between p-4 bg-white font-sans"
      style={{
        width: "300px",
        minHeight: "420px",
        border: "5px solid #e2e8f0"
      }}>
      {/* Title */}
      <h1 className="text-3xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-lg tracking-wide leading-tight">
        {chrome.i18n.getMessage("title")}
      </h1>

      {/* Illustration & captions */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <img
          src={isOnboarded ? safeImage : dangerImage}
          alt={isOnboarded ? chrome.i18n.getMessage("all_set_alt") : chrome.i18n.getMessage("setup_required_alt")}
          className="rounded-xl w-32 h-32 object-contain mb-2"
        />

        <div className="flex items-center gap-1 mb-1">
          <MdSecurity size={22} className={isOnboarded ? "text-green-600" : "text-red-600"} />
          <p className={`${isOnboarded ? "text-green-600" : "text-red-600"} text-base font-bold animate-pulse`}>
            {isOnboarded ? chrome.i18n.getMessage("all_set") : chrome.i18n.getMessage("setup_required")}
          </p>
        </div>

        {isOnboarded ? (
          <p className="text-sm text-gray-500 text-center">{chrome.i18n.getMessage("data_secured")}</p>
        ) : (
          <p className="text-sm text-amber-600 text-center">
            {chrome.i18n.getMessage("no_personal_data")}
            <br />
            {chrome.i18n.getMessage("please_add_data")}
          </p>
        )}
      </div>

      {/* Settings button */}
      <Button
        variant="contained"
        color="primary"
        onClick={openOptions}
        fullWidth
        sx={{
          mb: 2,
          py: 1,
          fontSize: "0.9rem",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
          textTransform: "uppercase",
          fontWeight: "bold",
          backgroundColor: "#7c3aed",
          "&:hover": { backgroundColor: "#6b21a8" }
        }}>
        {isOnboarded ? chrome.i18n.getMessage("update_your_data") : chrome.i18n.getMessage("add_your_data")}
      </Button>

      {/* Divider */}
      <Divider
        sx={{
          width: "100%",
          mb: 1,
          borderBottomWidth: 2,
          borderColor: "#cccccc"
        }}
      />

      {/* Social / utility links */}
      <div className="flex justify-center items-center gap-6">
        <div className="flex justify-center items-center gap-6">
          {/* GitHub */}
          <a
            href="https://github.com/your-org/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={chrome.i18n.getMessage("github")}
            className="flex flex-col items-center hover:scale-110 transition-all duration-200">
            <div className="flex flex-col items-center transition-all duration-200 text-[#24292e] hover:text-[#0366d6]">
              <FaGithub size={28} />
              <span className="text-xs mt-1">{chrome.i18n.getMessage("github")}</span>
            </div>
          </a>

          {/* Chrome Web Store */}
          <a
            href="https://chrome.google.com/webstore/detail/your-extension-id"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={chrome.i18n.getMessage("chrome")}
            className="flex flex-col items-center hover:scale-110 transition-all duration-200">
            <div className="flex flex-col items-center transition-all duration-200 text-[#4285F4] hover:text-[#0F9D58]">
              <FaChrome size={28} />
              <span className="text-xs mt-1">{chrome.i18n.getMessage("chrome")}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default IndexPopup;
