import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { QuoteUpload } from "@/components/quote_upload";
import { SiteHeader } from "@/components/site_header";

export function UploadView() {
  return (
    <div className="max-w-4xl mx-auto">
      <SiteHeader />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Submit Attestation Report</CardTitle>
          <CardDescription>
            Upload your attestation quote as a binary file or hex text
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuoteUpload />
        </CardContent>
      </Card>
    </div>
  );
}
