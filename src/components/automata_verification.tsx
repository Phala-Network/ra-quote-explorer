"use client";

import { useState, useTransition } from "react";
import {
  createPublicClient,
  http,
  parseAbi,
  type Chain,
  type Hex,
} from "viem";
import { sepolia, holesky } from "viem/chains";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";

interface Deployment {
  network: Chain;
  contractAddress: Hex;
}

interface VerificationResult {
  isValid: boolean;
  rawData: Hex;
}

interface AutomataVerificationProps {
  checksum: string;
}

const automataTestnet: Chain = {
  id: 1398243,
  name: 'Automata Testnet',
  nativeCurrency: { name: 'ATA Coin', symbol: 'ATA', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://1rpc.io/ata/testnet'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Automata Testnet Explorer',
      url: 'https://explorer-testnet.ata.network',
      apiUrl: 'https://explorer-testnet.ata.network/api',
    },
  },
  testnet: true,
}

const automataMainnet: Chain = {
  id: 65536,
  name: 'Automata Mainnet',
  nativeCurrency: { name: 'ATA Coin', symbol: 'ATA', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.ata.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Automata Explorer',
      url: 'https://explorer.ata.network',
      apiUrl: 'https://explorer.ata.network/api',
    },
  },
}

const NETWORKS: Deployment[] = [
  {
    network: sepolia,
    contractAddress: "0x76A3657F2d6c5C66733e9b69ACaDadCd0B68788b",
  },
  {
    network: holesky,
    contractAddress: '0x133303659F51d75ED216FD98a0B70CbCD75339b2',
  },
  {
    network: automataTestnet,
    contractAddress: '0xefE368b17D137E86298eec8EbC5502fb56d27832',
  },
  {
    network: automataMainnet,
    contractAddress: '0xE26E11B257856B0bEBc4C759aaBDdea72B64351F',
  },
];

const DEFAULT_NETWORK = NETWORKS[0];

const abi = parseAbi([
  "function verifyAndAttestOnChain(bytes) public view returns (bool, bytes)",
]);

export const AutomataVerification = ({ checksum }: AutomataVerificationProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState<Deployment>(DEFAULT_NETWORK);
  const [isPending, startTransition] = useTransition();
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onChainDcapVerify = async (
    network: Deployment,
  ): Promise<VerificationResult> => {
    try {
      const response = await fetch(`/raw/${checksum}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch quote: ${response.status} ${response.statusText}`,
        );
      }

      const quoteBuffer = await response.arrayBuffer();
      const quoteHex = `0x${Buffer.from(quoteBuffer).toString("hex")}` as Hex;

      const client = createPublicClient({
        chain: network.network,
        transport: http(),
      });

      const [isValid, data] = (await client.readContract({
        address: network.contractAddress,
        abi,
        functionName: "verifyAndAttestOnChain",
        args: [quoteHex],
      })) as [boolean, Hex];

      return {
        isValid,
        rawData: data,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Verification failed: ${error.message}`);
      }
      throw error;
    }
  };

  const handleVerify = () => {
    setError(null);
    setVerificationResult(null);

    startTransition(async () => {
      try {
        const result = await onChainDcapVerify(selectedNetwork);
        setVerificationResult(result);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Powered by</span>
        <img
          src="https://raw.githubusercontent.com/automata-network/automata-brand-kit/main/PNG/ATA_Black%20Text%20with%20Color%20Logo.png"
          className="h-8"
          alt="Automata"
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Network</label>
          <Select
            value={selectedNetwork.network.id.toString()}
            onValueChange={(value) => {
              const network = NETWORKS.find(
                (n) => n.network.id.toString() === value,
              );
              if (network) {
                setSelectedNetwork(network);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a network" />
            </SelectTrigger>
            <SelectContent>
              {NETWORKS.map((network) => (
                <SelectItem
                  key={network.network.id}
                  value={network.network.id.toString()}
                >
                  {network.network.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Contract</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs">
              {selectedNetwork.contractAddress.slice(0, 10)}...{selectedNetwork.contractAddress.slice(-8)}
            </span>
            <a
              href={`${selectedNetwork.network.blockExplorers?.default.url}/address/${selectedNetwork.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <Button
          onClick={handleVerify}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Verifying..." : "Verify"}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {verificationResult && (
          <Alert
            variant={verificationResult.isValid ? "default" : "destructive"}
            className={
              verificationResult.isValid ? "border-success bg-success/10" : ""
            }
          >
            <div className="flex items-start space-x-2">
              {verificationResult.isValid ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <div className="flex-1">
                <AlertTitle className="flex items-center justify-between">
                  <span>Verification Result</span>
                  <Badge
                    variant={verificationResult.isValid ? "default" : "destructive"}
                    className={verificationResult.isValid ? "bg-success" : ""}
                  >
                    {verificationResult.isValid ? "Valid" : "Invalid"}
                  </Badge>
                </AlertTitle>
              </div>
            </div>
          </Alert>
        )}
      </div>
    </div>
  );
};
