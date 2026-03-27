import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "dcap-qvl Library Documentation",
  description:
    "Use Phala's open-source dcap-qvl library to parse and verify Intel SGX/TDX DCAP quotes in Rust, JavaScript, Python, and Go.",
  alternates: {
    canonical: "/docs/dcap-qvl",
  },
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-muted rounded-md px-4 py-3 overflow-x-auto text-sm font-mono whitespace-pre">
      {children}
    </pre>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono">{children}</code>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            {headers.map((h) => (
              <th key={h} className="text-left py-2 pr-4 font-semibold text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="py-2 pr-4 font-mono text-xs align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DcapQvlDocsPage() {
  return (
    <div className="min-h-screen bg-muted py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-6">
            <Link href="/docs">
              <ArrowLeft className="h-4 w-4" />
              Back to API docs
            </Link>
          </Button>
          <h1 className="text-4xl font-black tracking-tight mb-2">dcap-qvl Library Docs</h1>
          <p className="text-muted-foreground font-light">
            Open-source DCAP quote verification libraries by Phala for Rust, JavaScript, Python,
            and Go.
          </p>
        </div>

        <div className="bg-background rounded-lg border p-6 sm:p-8 space-y-10">
          <section>
            <h2 className="text-xl font-semibold mb-3">Overview</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              <InlineCode>dcap-qvl</InlineCode> implements Intel DCAP quote verification logic in
              pure Rust, with bindings for multiple languages. It supports both SGX and TDX quotes,
              collateral retrieval from PCCS/PCS, quote parsing, and full cryptographic
              verification.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://github.com/Phala-Network/dcap-qvl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm underline hover:text-foreground transition-colors"
              >
                GitHub Repository
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://pccs.phala.network"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm underline hover:text-foreground transition-colors"
              >
                Default PCCS (Phala)
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </section>

          <hr />

          <section>
            <h2 className="text-xl font-semibold mb-3">Language Packages</h2>
            <Table
              headers={["Language", "Package", "Install"]}
              rows={[
                ["Rust", "crates.io: dcap-qvl", "cargo add dcap-qvl"],
                ["JavaScript/TypeScript", "npm: @phala/dcap-qvl", "npm install @phala/dcap-qvl"],
                ["Python", "python-bindings in repo", "make build_python"],
                ["Go", "github.com/Phala-Network/dcap-qvl/golang-bindings", "go get github.com/Phala-Network/dcap-qvl/golang-bindings"],
                ["CLI", "dcap-qvl/cli", "cargo run -- decode-quote ..."],
              ]}
            />
          </section>

          <hr />

          <section>
            <h2 className="text-xl font-semibold mb-3">Rust Quick Start</h2>
            <CodeBlock>{`use dcap_qvl::collateral::get_collateral;
use dcap_qvl::verify::ring::verify;
use dcap_qvl::PHALA_PCCS_URL;

#[tokio::main]
async fn main() {
    let quote = std::fs::read("quote.bin").expect("quote file not found");
    let collateral = get_collateral(PHALA_PCCS_URL, &quote)
        .await
        .expect("failed to get collateral");

    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();

    let report = verify(&quote, &collateral, now).expect("failed to verify quote");
    println!("Status: {:?}", report.status);
}`}</CodeBlock>
            <p className="text-sm text-muted-foreground mt-3">
              Tip: for predictable behavior in larger workspaces, call explicit backends via
              <InlineCode>dcap_qvl::verify::ring::verify</InlineCode> or
              <InlineCode>dcap_qvl::verify::rustcrypto::verify</InlineCode>.
            </p>
          </section>

          <hr />

          <section>
            <h2 className="text-xl font-semibold mb-3">JavaScript / TypeScript Quick Start</h2>
            <CodeBlock>{`import { getCollateralAndVerify } from "@phala/dcap-qvl";

const quote = await fetch("/quote.bin").then((r) => r.arrayBuffer());
const result = await getCollateralAndVerify(new Uint8Array(quote));

console.log("TCB Status:", result.status);
console.log("Advisories:", result.advisory_ids);`}</CodeBlock>
          </section>

          <hr />

          <section>
            <h2 className="text-xl font-semibold mb-3">Python Quick Start</h2>
            <CodeBlock>{`import asyncio
import dcap_qvl

async def main():
    quote = open("quote.bin", "rb").read()
    result = await dcap_qvl.get_collateral_and_verify(quote)
    print("Status:", result.status)

asyncio.run(main())`}</CodeBlock>
          </section>

          <hr />

          <section>
            <h2 className="text-xl font-semibold mb-3">Go Quick Start</h2>
            <CodeBlock>{`package main

import (
  "fmt"
  "os"

  dcap "github.com/Phala-Network/dcap-qvl/golang-bindings"
)

func main() {
  quote, _ := os.ReadFile("quote.bin")
  report, err := dcap.GetCollateralAndVerify(quote, dcap.PhalaPCCSURL)
  if err != nil {
    panic(err)
  }

  fmt.Println("Status:", report.Status)
}`}</CodeBlock>
          </section>

          <hr />

          <section>
            <h2 className="text-xl font-semibold mb-3">How this relates to this site</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This Explorer uses the same DCAP verification foundations. If you want to integrate
              quote verification directly into your own backend, agent, or chain service, use
              <InlineCode>dcap-qvl</InlineCode> in your target language. If you only need a hosted
              API endpoint, use <Link href="/docs" className="underline hover:text-foreground">/api/upload</Link>
              .
            </p>
          </section>
        </div>

        <footer className="mt-8 pb-4">
          <div className="inline-flex gap-1.5 justify-center items-center w-full">
            <img
              src="/apple-touch-icon.png"
              className="w-5 h-5 rounded-full overflow-hidden"
              alt="Phala"
            />
            <p className="text-muted-foreground text-sm">
              Developed by the{" "}
              <a
                href="https://phala.network"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                Phala team
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
