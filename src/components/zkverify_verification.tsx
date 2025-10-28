"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ExternalLink } from "lucide-react";

interface ZkVerifyVerificationProps {
  checksum: string;
}

const useZkVerify = () => {
  const [zkVerifyStatus, setZkVerifyStatus] = useState("Verify with zkVerify");
  const [zkVerifyTxHash, setZkVerifyTxHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const zkVerify = useCallback(async (checksum: string) => {
    if (!checksum) {
      setError("Checksum is missing.");
      return;
    }

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    setIsLoading(true);
    setError(null);
    setZkVerifyTxHash(null);
    setZkVerifyStatus("Fetching quote...");

    try {
      const response = await fetch(`/raw/${checksum}`, { signal });
      if (!response.ok) {
        throw new Error(`Failed to fetch quote: ${response.status} ${response.statusText}`);
      }

      const quoteBuffer = await response.arrayBuffer();
      const quoteHex = `0x${Buffer.from(quoteBuffer).toString("hex")}`;

      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "quote": quoteHex }),
        signal,
      };

      let zkVerifyResponse = await fetch(`${process.env.NEXT_PUBLIC_ZKVERIFY_URL}/prove`, options);
      let resData = await zkVerifyResponse.json();

      if (resData.status === "Completed") {
        setZkVerifyStatus("Verification completed");
        setZkVerifyTxHash(resData.data.tx_hash);
        return;
      }

      const taskId = resData.task_id;
      setZkVerifyStatus("Validating quote...");

      while (true) {
        if (signal.aborted) throw new Error('Aborted');

        zkVerifyResponse = await fetch(`${process.env.NEXT_PUBLIC_ZKVERIFY_URL}/status/${taskId}`, { signal });
        resData = await zkVerifyResponse.json();

        if (resData.status === "Processing") {
          setZkVerifyStatus("Proving quote...");
        } else if (resData.status === "Verifying") {
          setZkVerifyStatus("Verification in progress...");
        } else if (resData.status === "Completed") {
          setZkVerifyStatus("Verification completed");
          setZkVerifyTxHash(resData.data.tx_hash);
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name !== 'AbortError') {
        setError(error.message || "An unknown error occurred during zkVerify.");
        setZkVerifyStatus("Verification Failed");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { zkVerify, zkVerifyStatus, zkVerifyTxHash, isLoading, error };
};

export const ZkVerifyVerification = ({ checksum }: ZkVerifyVerificationProps) => {
  const {
    zkVerify,
    zkVerifyStatus,
    zkVerifyTxHash,
    isLoading,
    error
  } = useZkVerify();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button
          onClick={() => zkVerify(checksum)}
          disabled={isLoading}
          className="w-full"
        >
          {zkVerifyStatus}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {zkVerifyStatus === "Verification completed" && zkVerifyTxHash && (
          <Alert
            variant="default"
            className="border-success bg-success/10"
          >
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div className="space-y-3 w-full">
                <AlertTitle className="flex items-center justify-between">
                  <span>Verification Result</span>
                  <Badge variant="default" className="bg-success">
                    Valid
                  </Badge>
                </AlertTitle>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Transaction</div>
                  <a
                    href={`https://zkverify-testnet.subscan.io/extrinsic/${zkVerifyTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
                  >
                    <span className="font-mono text-xs break-all">
                      {zkVerifyTxHash}
                    </span>
                    <ExternalLink className="h-4 w-4 flex-shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </Alert>
        )}
      </div>
    </div>
  );
};
