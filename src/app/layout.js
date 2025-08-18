import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from '@/components/Providers';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GitHub Analyzer - AI-Powered Repository Analysis",
  description: "A comprehensive platform for analyzing GitHub repositories with AI, managing API keys, and gaining development insights",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#7c3aed",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
