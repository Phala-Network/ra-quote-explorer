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
    "Free online tool to verify and analyze Intel SGX and TDX attestation quotes (DCAP format). Parse MRTD, MRCONFIG, RTMR measurements. Multi-party verification via Phala, Automata, and zkVerify.",
  keywords: [
    "TEE attestation",
    "SGX attestation",
    "TDX attestation",
    "DCAP quote verification",
    "Intel SGX remote attestation",
    "verify SGX quote",
    "TEE attestation explorer",
    "confidential computing",
    "MRTD",
    "MRCONFIG",
    "RTMR",
    "Trusted Execution Environment",
    "dstack",
    "RA Quote Explorer",
  ],
  authors: [{ name: "PhalaNetwork" }],
  creator: "PhalaNetwork",
  publisher: "PhalaNetwork",
  metadataBase: new URL("https://proof.t16z.com"),
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://proof.t16z.com",
    siteName: "TEE Attestation Explorer by Phala",
    title: "TEE Attestation Explorer by Phala",
    description:
      "Free online tool to verify Intel SGX and TDX attestation quotes. Parse measurements, check TCB status, and verify on-chain via Automata or zkVerify.",
  },
  twitter: {
    card: "summary",
    title: "TEE Attestation Explorer by Phala",
    description:
      "Free online tool to verify Intel SGX and TDX attestation quotes. Parse measurements, check TCB status, and verify on-chain.",
    creator: "@PhalaNetwork",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "TEE Attestation Explorer",
  url: "https://proof.t16z.com",
  description:
    "Free online tool to verify and analyze Intel SGX and TDX attestation quotes (DCAP format). Parse MRTD, MRCONFIG, RTMR measurements. Multi-party verification via Phala, Automata, and zkVerify.",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "Phala Network",
    url: "https://phala.network",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, no user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
