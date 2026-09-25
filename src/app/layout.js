import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "MapPulse | AI-Powered Google Maps Scraper & B2B Lead Engine",
    template: "%s | MapPulse Lead Engine",
  },
  description: "Enterprise Google Maps scraping, B2B lead discovery CRM, and automated outreach platform.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="h-full bg-[#F8FAFC] text-slate-800 font-sans selection:bg-indigo-500/30 selection:text-indigo-600"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
