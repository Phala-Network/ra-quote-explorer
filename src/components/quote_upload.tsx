"use client";

import { useState } from "react";
import { AlertCircle, Upload } from "lucide-react";
import { ofetch } from "ofetch";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const router = useRouter();
  return (
    <form>
      <Tabs defaultValue="hex" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hex" onClick={() => setHasError(false)}>
            Hex Text
          </TabsTrigger>
          <TabsTrigger value="file" onClick={() => setHasError(false)}>
            Binary File
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hex" className="space-y-4">
          {hasError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>The quote is invalid.</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium">Paste hex quote</label>
            <Textarea
              rows={10}
              className="font-mono text-xs"
              placeholder="0x03000200000000000a00..."
              onChange={(e) => setHex(e.target.value)}
            />
          </div>

          <Button
            onClick={async (evt) => {
              evt.preventDefault();
              try {
                const data = hexToUint8Array(hex);
                const { success, checksum } = await uploadUint8Array(data);
                if (success) {
                  router.push(`/reports/${checksum}`);
                } else {
                  setHasError(true);
                }
              } catch (error) {
                console.error(error);
                setHasError(true);
              }
            }}
          >
            Verify
          </Button>
        </TabsContent>

        <TabsContent value="file" className="space-y-4">
          {hasError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>The quote is invalid.</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium">Upload quote file</label>
            <input
              type="file"
              id="attestation-file"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const { success, checksum } = await uploadFile(file);
                    if (success) {
                      router.push(`/reports/${checksum}`);
                    } else {
                      setHasError(true);
                    }
                  } catch (error) {
                    console.error(error);
                    setHasError(true);
                  }
                }
              }}
            />
            <Button asChild className="w-full">
              <label htmlFor="attestation-file" className="cursor-pointer">
                <Upload className="mr-2 h-5 w-5" />
                Select File
              </label>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}
