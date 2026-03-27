"use client";

import Link from "next/link";
import { Download, ChevronDown, UploadCloud, Terminal, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type TDXQuote } from "@/types";
import { ReportDetail } from "./report_detail";
import { SiteHeader } from "./site_header";

const handleDownload = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download failed:', error);
  }
};

export function ReportView({
  report,
  checksum,
}: { report: TDXQuote; checksum: string }) {
  return (
    <div className="min-h-screen bg-muted py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto pb-6">
        {/* Header */}
        <SiteHeader showBackButton>
          {/* Downloads Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={!report.can_download}>
              <Button variant="outline" disabled={!report.can_download}>
                <Download className="h-4 w-4 mr-2" />
                Downloads
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleDownload(`/raw/${checksum}`, `${checksum}_quote.bin`)}
              >
                Quote Binary
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDownload(`/api/collateral/${checksum}`, `${checksum}_quote_collateral.json`)}
              >
                Collateral JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SiteHeader>

        {/* Report Content */}
        <ReportDetail report={report} />

        {/* Internal navigation */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3 hover:bg-accent transition-colors"
          >
            <UploadCloud className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">Verify another quote</p>
              <p className="text-xs text-muted-foreground">Submit a new attestation report</p>
            </div>
          </Link>
          <Link
            href="/docs"
            className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3 hover:bg-accent transition-colors"
          >
            <Terminal className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">API documentation</p>
              <p className="text-xs text-muted-foreground">Automate verification via REST API</p>
            </div>
          </Link>
          <Link
            href="/#faq"
            className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3 hover:bg-accent transition-colors"
          >
            <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">What do these fields mean?</p>
              <p className="text-xs text-muted-foreground">MRTD, RTMR, TCB SVN explained</p>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-8">
          <div className="inline-flex gap-1.5 justify-center items-center w-full">
            <img src="/apple-touch-icon.png" className="w-5 h-5 rounded-full overflow-hidden" alt="Phala" />
            <p className="text-muted-foreground text-sm">
              Developed by the{" "}
              <a href="https://phala.network" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
                Phala team
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
