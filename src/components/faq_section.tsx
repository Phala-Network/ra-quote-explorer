import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    id: "how-to-verify",
    question: "How do I verify an Intel SGX or TDX attestation quote?",
    answer: (
      <>
        Paste your hex-encoded quote into the text field on the{" "}
        <a href="/" className="underline hover:text-foreground transition-colors">
          home page
        </a>
        , or drag and drop the raw binary file. Click <strong>Verify</strong> — the tool will parse
        all fields and run DCAP verification instantly. The report page shows the full measurement
        breakdown, TCB status, and lets you run additional on-chain verification via Automata or
        zkVerify. For automated verification, use the{" "}
        <a href="/docs" className="underline hover:text-foreground transition-colors">
          REST API
        </a>
        .
      </>
    ),
  },
  {
    id: "what-is-tee-attestation",
    question: "What is TEE Remote Attestation?",
    answer: (
      <>
        Remote Attestation is the process by which a Trusted Execution Environment (TEE)
        cryptographically proves to a remote party that specific, unmodified code is running inside
        genuine hardware. The TEE generates a signed "Quote" containing measurements of the entire
        software stack. A verifier can check this quote against Intel's certificate chain (via the
        Provisioning Certification Service) to confirm that the code has not been tampered with and
        that the hardware is legitimate.
      </>
    ),
  },
  {
    id: "supported-formats",
    question: "Which TEE formats and quote types does this tool support?",
    answer: (
      <>
        The tool supports Intel SGX ECDSA (DCAP) quotes and Intel TDX quotes. Both use the DCAP
        (Data Center Attestation Primitives) infrastructure with ECDSA-based signatures. The older
        Intel EPID attestation scheme is not supported, as Intel has deprecated EPID for new
        deployments in favor of DCAP.
      </>
    ),
  },
  {
    id: "measurement-fields",
    question: "What do the measurement fields mean?",
    answer: (
      <ul className="space-y-1.5 list-none">
        <li>
          <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">MRTD</span> — Initial
          measurement of the Trust Domain contents at boot time (TDX).
        </li>
        <li>
          <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">MRCONFIG</span> —
          Measurement of the Trust Domain configuration parameters.
        </li>
        <li>
          <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">RTMR0–RTMR3</span> —
          Runtime Measurement Registers, updated progressively during boot. RTMR0 covers firmware,
          RTMR1 the OS kernel, RTMR2 system-level components, and RTMR3 application-level
          components (e.g., app-id, compose-hash, key-provider in dstack workloads).
        </li>
        <li>
          <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">TEE TCB SVN</span> —
          Security Version Number of the TEE Trusted Computing Base; indicates the firmware patch
          level.
        </li>
        <li>
          <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">MRSEAM</span> —
          Measurement of the SEAM (Secure Arbitration Mode) module responsible for managing Trust
          Domains.
        </li>
        <li>
          <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">USER DATA</span> —
          Application-specific data embedded in the quote at generation time (up to 64 bytes, or a
          SHA-256 hash of longer data).
        </li>
      </ul>
    ),
  },
  {
    id: "verification-methods",
    question: "What is the difference between Phala, Automata, and zkVerify verification?",
    answer: (
      <ul className="space-y-2 list-none">
        <li>
          <strong>Phala DCAP</strong> — Direct verification against Intel's Provisioning
          Certification Service. Checks the full certificate chain and TCB status. Fast, runs on
          Phala's backend infrastructure.
        </li>
        <li>
          <strong>Automata On-Chain</strong> — Verifies the quote against DCAP smart contracts
          deployed on Ethereum (Sepolia, Holesky) or Automata networks. The verification result is
          permanently recorded on-chain, providing a tamper-proof audit trail.
        </li>
        <li>
          <strong>zkVerify</strong> — Generates a zero-knowledge proof of the attestation
          verification using Risc Zero, then submits it to the zkVerify network. Useful when you
          need a compact, cryptographically verifiable proof without exposing the full quote data.
        </li>
      </ul>
    ),
  },
  {
    id: "unverified-status",
    question: 'What does "UNVERIFIED" status mean?',
    answer: (
      <>
        The quote could not be cryptographically verified. Common causes: the quote was generated
        by a simulator or development tool (not real TEE hardware), the platform's TCB is outdated
        and requires a firmware update, or the quote data is malformed. An UNVERIFIED quote should
        not be trusted for any security-sensitive purpose.
      </>
    ),
  },
  {
    id: "proof-of-cloud",
    question: "What is Proof of Cloud?",
    answer: (
      <>
        Proof of Cloud is a multi-organization hardware registry that verifies TEE workloads are
        running on legitimate cloud hardware in independently-audited physical facilities. It adds a
        physical layer of assurance on top of cryptographic TEE attestation. Alliance members
        (including Phala, Automata, Secret Network, iExec, and others) independently verify
        hardware locations. If a device is not in the registry, the report page will show a "not in
        verified facilities registry" notice.
      </>
    ),
  },
  {
    id: "data-storage",
    question: "Is my submitted quote data stored?",
    answer: (
      <>
        Submitted quotes are stored and indexed by a SHA-256 checksum, making the report
        persistently accessible at{" "}
        <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
          /reports/&#123;checksum&#125;
        </span>
        . Do not submit quotes whose <code>reportData</code> field contains sensitive information
        you need to keep private.
      </>
    ),
  },
  {
    id: "dcap-vs-epid",
    question: "What is DCAP? How is it different from EPID?",
    answer: (
      <>
        DCAP (Data Center Attestation Primitives) uses ECDSA signatures and allows organizations to
        run their own Provisioning Certificate Caching Service (PCCS) for collateral — no
        per-attestation Intel connectivity required. EPID (Enhanced Privacy ID) was Intel's earlier
        scheme offering stronger anonymity guarantees, but it required Intel's attestation service
        for every verification and has been deprecated for data-center use. This tool only supports
        DCAP-based quotes.
      </>
    ),
  },
  {
    id: "sgx-vs-tdx",
    question: "What is the difference between Intel SGX and Intel TDX?",
    answer: (
      <>
        Intel SGX (Software Guard Extensions) protects individual application processes inside
        isolated "enclaves." It requires code to be written specifically for the SGX programming
        model, has strict memory limits, and has accumulated a significant number of known
        side-channel vulnerabilities over the years. Intel TDX (Trust Domain Extensions) operates
        at the virtual machine level, protecting entire VMs as "Trust Domains." TDX supports legacy
        applications without code modification, has fewer architectural constraints, and is Intel's
        primary direction for confidential computing going forward. Both produce DCAP-format
        attestation quotes verifiable by this tool.
      </>
    ),
  },
  {
    id: "api-automation",
    question: "Can I automate attestation verification with the API?",
    answer: (
      <>
        Yes. POST a binary quote file or hex-encoded string to{" "}
        <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
          https://proof.t16z.com/api/upload
        </span>
        . No API key is required. Rate limits: 10 requests per minute per IP; 5 validation errors
        per hour before a 24-hour block. The response returns a checksum and a direct URL to the
        report. See the{" "}
        <a href="/docs" className="underline hover:text-foreground transition-colors">
          API documentation
        </a>{" "}
        for full details and code examples in Python, Node.js, and JavaScript.
      </>
    ),
  },
];

export function FaqSection() {
  return (
    <div id="faq" className="max-w-4xl mx-auto mt-12">
      <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="bg-background rounded-lg border px-4">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
            <AccordionContent>
              <div className="text-muted-foreground leading-relaxed">{item.answer}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
