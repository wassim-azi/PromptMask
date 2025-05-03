import type { Site } from "~contents/types/site";
import type { Theme } from "~contents/types/theme";

/**
 * Returns CSS classes for the parent container of the protect button.
 * These classes are tailored to match the styling of each supported AI platform.
 *
 * @param theme - The current application theme ("light" or "dark")
 * @param website - The AI platform where the button is being rendered
 * @returns CSS class string specific to the parent container on the given platform
 */
export const getParentClasses = (theme: Theme, website: Site) => {
  if (website === "chatgpt") {
    return "radix-state-open:bg-black/10 inline-flex h-9 rounded-full border text-[13px] font-medium text-token-text-secondary border-token-border-default can-hover:hover:bg-token-main-surface-secondary focus-visible:outline-black dark:focus-visible:outline-white";
  }

  if (website === "grok") {
    return "grow flex gap-1.5 max-w-full";
  }

  if (website === "qwen") {
    return "flex";
  }

  if (website === "claude") {
    return "flex items-center";
  }

  return "";
};

/**
 * Returns CSS classes for the protect button element itself.
 * These are platform-specific button styles that match each AI platform's UI.
 *
 * @param theme - The current application theme ("light" or "dark")
 * @param website - The AI platform where the button is being rendered
 * @returns CSS class string for the button that matches the platform's design language
 */
export const getButtonClasses = (theme: Theme, website: Site) => {
  if (website === "chatgpt") {
    return "flex h-full min-w-8 items-center justify-center p-2";
  }

  if (website === "grok") {
    return "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:brightness-50 disabled:cursor-default [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:-mx-0.5 text-primary h-9 rounded-full px-3.5 py-2 group/think-toggle transition-colors duration-100 relative overflow-hidden border bg-transparent hover:bg-button-ghost-hover border-border-l2";
  }

  if (website === "qwen") {
    return "chat-input-feature-btn";
  }

  if (website === "claude") {
    return "inline-flex items-center justify-center relative shrink-0 can-focus select-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none border-0.5 transition-all h-8 min-w-8 rounded-lg flex items-center px-[7.5px] group !pointer-events-auto text-text-300 border-border-300 active:scale-[0.98] hover:text-text-200/90 hover:bg-bg-100";
  }

  return "";
};

/**
 * Returns CSS classes for the text span inside the protect button.
 * Controls text appearance and layout within the button across platforms.
 *
 * @param theme - The current application theme ("light" or "dark")
 * @param website - The AI platform where the button is being rendered
 * @returns CSS class string for the text span element within the button
 */
export const getSpanClasses = (theme: Theme, website: Site) => {
  if (website === "chatgpt") {
    return "ps-1 pe-1 whitespace-nowrap";
  }

  if (website === "grok") {
    return "items-center";
  }

  if (website === "qwen") {
    return "chat-input-feature-btn-text";
  }

  if (website === "claude") {
    return "min-w-0 flex items-center";
  }

  return "";
};

/**
 * Generates Material UI tooltip style configuration for the protect button.
 * Adjusts tooltip appearance based on the current theme.
 *
 * @param theme - The current application theme ("light" or "dark")
 * @returns Object containing styles for both tooltip and arrow components compatible with MUI Tooltip's slotProps API
 */
export const getTooltipStyles = (theme: Theme) => ({
  tooltip: {
    sx: {
      backgroundColor: theme === "dark" ? "black" : "white",
      color: theme === "dark" ? "white" : "black",
      fontWeight: "bold",
      fontSize: "14px"
    }
  },
  arrow: {
    sx: {
      color: theme === "dark" ? "black" : "white"
    }
  }
});
