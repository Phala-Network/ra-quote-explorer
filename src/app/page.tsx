import React from "react";
import { Upload, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            SGX/TD Attestation Report Analyzer
          </h1>
          <p className="mt-5 text-xl text-gray-500">
            Verify and analyze Intel SGX and TD attestation reports with
            precision
          </p>
        </div>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Submit Attestation Report</CardTitle>
            <CardDescription>
              Upload your attestation quote as a binary file or hex text
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Upload className="mr-2 h-5 w-5" />
              Upload Attestation Quote
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <Shield className="inline-block mr-2 h-6 w-6" />
                Secure Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              We process your attestation reports securely, ensuring the
              integrity of the verification process
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <FileText className="inline-block mr-2 h-6 w-6" />
                Comprehensive Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              Obtain detailed insights from your SGX/TD attestation reports,
              including enclave measurements and platform information
            </CardContent>
          </Card>
        </div>

        <Accordion type="single" collapsible className="mt-8">
          <AccordionItem value="attestation">
            <AccordionTrigger>What is Remote Attestation?</AccordionTrigger>
            <AccordionContent>
              <p>
                Remote Attestation is a process that allows a remote party
                (verifier) to verify the integrity and authenticity of a secure
                environment, such as an Intel SGX enclave or a Trust Domain
                (TD). It involves:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>
                  Generating cryptographic evidence (quote) of the secure
                  environment's state
                </li>
                <li>
                  Verifying this evidence to ensure the environment is genuine
                  and untampered
                </li>
                <li>
                  Establishing trust in the secure environment's integrity and
                  the code running within it
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="dcap">
            <AccordionTrigger>What is DCAP?</AccordionTrigger>
            <AccordionContent>
              <p>
                DCAP (Data Center Attestation Primitives) is an Intel technology
                designed for scalable remote attestation in data center
                environments. It's part of the Intel SGX ecosystem and offers:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>
                  Flexible attestation quote verification for data center
                  operators
                </li>
                <li>Support for custom attestation infrastructure</li>
                <li>Enhanced security through a hardware-rooted trust chain</li>
                <li>
                  Compatibility with both SGX enclaves and Trust Domains (TDX)
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions (FAQ)</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple">
              <AccordionItem value="sgx">
                <AccordionTrigger>What is Intel SGX?</AccordionTrigger>
                <AccordionContent>
                  Intel SGX (Software Guard Extensions) is a set of
                  security-related instruction codes built into modern Intel
                  CPUs. It allows user-level code to allocate private regions of
                  memory, called enclaves, which are protected from processes
                  running at higher privilege levels.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="td">
                <AccordionTrigger>
                  What is a Trust Domain (TD)?
                </AccordionTrigger>
                <AccordionContent>
                  A Trust Domain (TD) is a hardware-isolated environment
                  provided by Intel Trust Domain Extensions (TDX) technology. It
                  offers confidentiality and integrity protection for virtual
                  machines in cloud environments, similar to how SGX protects
                  applications.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="quote">
                <AccordionTrigger>
                  What is an attestation quote?
                </AccordionTrigger>
                <AccordionContent>
                  An attestation quote is a cryptographically signed structure
                  containing information about the secure environment (SGX
                  enclave or TD). It includes measurements of the code and data
                  within the environment, as well as information about the
                  platform it's running on. This quote is used in the remote
                  attestation process to verify the integrity and authenticity
                  of the environment.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="mrenclave">
                <AccordionTrigger>What is MRENCLAVE?</AccordionTrigger>
                <AccordionContent>
                  MRENCLAVE is a measurement unique to a specific enclave
                  version. It represents a cryptographic hash of the enclave's
                  code, initial data, and the order and details of how the
                  enclave was built. It's used to identify and verify the
                  integrity of an enclave during the attestation process.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="mrsigner">
                <AccordionTrigger>What is MRSIGNER?</AccordionTrigger>
                <AccordionContent>
                  MRSIGNER is a measurement of the entity that signed the
                  enclave. It's derived from the public key of the RSA key pair
                  used to sign the enclave. MRSIGNER is used to identify the
                  author or publisher of an enclave and can be used to establish
                  trust in the enclave's source.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
