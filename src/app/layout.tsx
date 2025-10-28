import type { Metadata } from "next";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "@fontsource/lato/900.css";
import "@fontsource/rokkitt/400.css";
import "@fontsource/rokkitt/700.css";
import "@fontsource/rokkitt/900.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TEE Attestation Explorer by Phala",
    template: "%s | TEE Attestation Explorer by Phala",
  },
  description:
    "Secure and comprehensive analysis tool for TEE attestation reports. Verify and gain insights into your trusted computing environments with TEE Attestation Explorer.",
  keywords: [
    "TEE",
    "Trusted Execution Environment",
    "Attestation",
    "Security",
    "Analysis",
    "dstack",
    "TEE Attestation Explorer",
    "RA Quote Explorer",
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
    url: 'https://proof.t16z.com',
    siteName: "TEE Attestation Explorer by Phala",
    title: "TEE Attestation Explorer",
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
    title: "TEE Attestation Explorer by Phala",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
