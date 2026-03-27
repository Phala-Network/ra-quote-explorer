export function IntroSection() {
  return (
    <div className="mb-6 space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        TEE Attestation Explorer is an open-source tool for verifying and analyzing Intel SGX and
        TDX attestation quotes in DCAP (ECDSA) format. Submit a quote to inspect all measurement
        fields — MRTD, MRCONFIG, RTMR0–3, TEE TCB SVN, MRSEAM — and verify it through multiple
        independent channels. Over one million attestation quotes have been processed to date.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border bg-background px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Parse &amp; Analyze
          </p>
          <p className="text-sm text-foreground">
            View MRTD, MRCONFIG, RTMR0–3, TCB status, and all attestation fields in a structured,
            human-readable format.
          </p>
        </div>

        <div className="rounded-lg border bg-background px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Multi-Party Verification
          </p>
          <p className="text-sm text-foreground">
            Verify via Phala DCAP, Automata on-chain smart contracts (Ethereum / Automata networks),
            or zkVerify zero-knowledge proofs.
          </p>
        </div>

        <div className="rounded-lg border bg-background px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Public API
          </p>
          <p className="text-sm text-foreground">
            Automate attestation verification with the REST API — no API key required. Supports
            binary file upload and hex-encoded quote strings.
          </p>
        </div>
      </div>
    </div>
  );
}
