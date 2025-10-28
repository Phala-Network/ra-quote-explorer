"use client";

import { useState, useRef } from "react";
import { AlertCircle, Upload, Loader2, ShieldCheck } from "lucide-react";
import { ofetch } from "ofetch";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function hexToUint8Array(hex: string) {
  hex = hex.trim();
  if (!hex) {
    throw new Error("Invalid hex string");
  }
  if (hex.startsWith("0x")) {
    hex = hex.substring(2);
  }
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }

  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.slice(i, i + 2), 16);
    if (isNaN(byte)) {
      throw new Error("Invalid hex string");
    }
    array[i / 2] = byte;
  }
  return array;
}

async function uploadUint8Array(data: Uint8Array) {
  const blob = new Blob([data], { type: "application/octet-stream" });
  const file = new File([blob], "quote.bin", {
    type: "application/octet-stream",
  });
  const formData = new FormData();
  formData.append("file", file);

  return await ofetch("/api/upload", {
    method: "POST",
    body: formData,
  });
}

async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return await ofetch("/api/upload", {
    method: "POST",
    body: formData,
  });
}

export function QuoteUpload() {
  const [hex, setHex] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const { success, checksum } = await uploadFile(file);
      if (success) {
        router.push(`/reports/${checksum}`);
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setHasError(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  return (
    <form className="space-y-4">
      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>The quote is invalid.</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <label className="text-sm font-medium">Paste hex quote or drop file</label>
        <div
          className="relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Textarea
            rows={10}
            className={`font-mono text-xs relative z-10 ${
              isDragging ? "border-primary-300 border-2 bg-primary-50/50" : ""
            }`}
            placeholder="0x03000200000000000a00..."
            value={hex}
            disabled={isLoading}
            onChange={(e) => {
              setHex(e.target.value);
              setHasError(false);
            }}
          />
          {!hex && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <p className="text-gray-300 text-sm">
                Drag and drop your file here
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          className="font-bold"
          disabled={isLoading}
          onClick={async (evt) => {
            evt.preventDefault();
            setHasError(false);
            setIsLoading(true);
            try {
              const data = hexToUint8Array(hex);
              const { success, checksum } = await uploadUint8Array(data);
              if (success) {
                router.push(`/reports/${checksum}`);
              } else {
                setHasError(true);
                setIsLoading(false);
              }
            } catch (error) {
              console.error(error);
              setHasError(true);
              setIsLoading(false);
            }
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              Verify
            </>
          )}
        </Button>

        <span className="text-sm text-muted-foreground">or</span>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          disabled={isLoading}
          onChange={async (e) => {
            setHasError(false);
            const file = e.target.files?.[0];
            if (file) {
              await handleFileUpload(file);
            }
          }}
        />
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={(e) => {
            e.preventDefault();
            fileInputRef.current?.click();
          }}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>
    </form>
  );
}
