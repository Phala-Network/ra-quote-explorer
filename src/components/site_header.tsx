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
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          TEE Attestation Explorer
        </h1>
        <p className="text-sm text-muted-foreground">
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
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100"
              >
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground">Back</span>
            </div>
          )}
          {children && <div>{children}</div>}
        </div>
      )}
    </div>
  );
}
