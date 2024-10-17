import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "dstack Confidant | Trusted Execution Environment Analyzer",
    template: "%s | dstack Confidant",
  },
  description:
    "Secure and comprehensive analysis tool for TEE attestation reports. Verify and gain insights into your trusted computing environments with dstack Confidant.",
  keywords: [
    "TEE",
    "Trusted Execution Environment",
    "Attestation",
    "Security",
    "Analysis",
    "dstack",
    "Confidant",
  ],
  authors: [{ name: "PhalaNetwork" }],
  creator: "PhalaNetwork",
  publisher: "PhalaNetwork",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    // url: 'https://www.example.com',
    siteName: "dstack Confidant",
    title: "dstack Confidant | Trusted Execution Environment Analyzer",
    description:
      "Secure and comprehensive analysis tool for TEE attestation reports. Verify and gain insights into your trusted computing environments.",
    // images: [
    //   {
    //     url: 'https://www.example.com/og-image.jpg',
    //     width: 1200,
    //     height: 630,
    //     alt: 'dstack Confidant logo',
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "dstack Confidant | TEE Attestation Analyzer",
    description:
      "Secure and comprehensive analysis for TEE attestation reports.",
    // images: ['https://www.example.com/twitter-image.jpg'],
    creator: "@PhalaNetwork",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  themeColor: "#ccff55", // Your brand color
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
