import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";

interface SiteHeaderProps {
  showBackButton?: boolean;
  children?: ReactNode;
}

export function SiteHeader({ showBackButton = false, children }: SiteHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1 className="text-4xl font-black tracking-tight word-spacing-wide mb-2">
          TEE Attestation Explorer
        </h1>
        <p className="text-muted-foreground font-lighter tracking-wide">
          Verify and analyze Intel SGX and TDX attestation reports with ❤️ by{" "}
          <a
            href="https://phala.network"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            Phala
          </a>
        </p>
      </div>

      {(showBackButton || children) && (
        <div className="flex items-center justify-between">
          {showBackButton && (
            <Button
              asChild
              variant="outline"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          )}
          {children && <div>{children}</div>}
        </div>
      )}
    </div>
  );
}
