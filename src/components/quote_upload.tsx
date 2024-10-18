'use client'

import { Upload } from "lucide-react";
import { ofetch } from "ofetch";

import { Button } from "@/components/ui/button";
import { type TDXQuote } from '@/components/report_view'

export function QuoteUpload({ onSuccess }: {
  onSuccess: (i: TDXQuote) => unknown
}) {
  return (
    <form>
      <input
        type="file"
        id="attestation-file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const formData = new FormData();
            formData.append('file', file);
            ofetch('/api/upload', {
              method: 'POST',
              body: formData,
            })
              .then(response => {
                onSuccess(response.quote)
                console.log('Upload successful:', response);
              })
              .catch(error => {
                console.error('Upload failed:', error);
              });
          }
        }}
      />
      <Button asChild>
        <label htmlFor="attestation-file">
          <Upload className="mr-2 h-5 w-5" />
          Upload Attestation Quote
        </label>
      </Button>
    </form>
  )
}
