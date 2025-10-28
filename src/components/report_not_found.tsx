import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "./site_header";

export function ReportNotFound() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto pb-6">
        <SiteHeader />

        <Card className="mt-8">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="rounded-full bg-destructive/10 p-6">
                <AlertCircle className="h-16 w-16 text-destructive" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  Report Not Found
                </h2>
                <p className="text-muted-foreground max-w-md">
                  The attestation report you're looking for doesn't exist or may have been removed.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <footer className="mt-8">
          <div className="flex flex-inline gap-1.5 justify-center items-center">
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
