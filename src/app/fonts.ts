import localFont from "next/font/local";

/** Mona Sans — the project's brand family, self-hosted via next/font. */
export const monaSans = localFont({
  display: "swap",
  src: [
    {
      path: "../fonts/Mona-Sans-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../fonts/Mona-Sans-RegularItalic.woff2",
      style: "italic",
      weight: "400",
    },
    { path: "../fonts/Mona-Sans-Medium.woff2", style: "normal", weight: "500" },
    {
      path: "../fonts/Mona-Sans-SemiBold.woff2",
      style: "normal",
      weight: "600",
    },
    { path: "../fonts/Mona-Sans-Bold.woff2", style: "normal", weight: "700" },
  ],
  variable: "--font-mona-sans",
});
