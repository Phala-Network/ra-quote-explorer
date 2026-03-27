# TEE Attestation Explorer

Online tool for verifying and analyzing Intel SGX and TDX attestation quotes (DCAP/ECDSA format).

**Live at: https://proof.t16z.com** · [GitHub](https://github.com/Phala-Network/ra-quote-explorer)

Over one million attestation quotes have been processed since launch.

## What it does

Submit an attestation quote (binary file or hex-encoded string) to:

- **Parse all fields** — MRTD, MRCONFIG, RTMR0–3, TEE TCB SVN, MRSEAM, USER DATA, PPID, and more
- **Check TCB status** — validates the platform's firmware patch level against Intel's Provisioning Certification Service
- **Verify via multiple channels:**
  - Phala DCAP — direct verification against Intel PCS
  - Automata on-chain — DCAP smart contracts on Ethereum (Sepolia, Holesky) or Automata networks
  - zkVerify — zero-knowledge proof of verification via Risc Zero
- **Proof of Cloud** — checks whether the attesting hardware is registered in the multi-organization verified hardware registry
- **Download artifacts** — export the raw quote binary and collateral JSON

## Supported formats

- Intel TDX quotes (DCAP/ECDSA)
- Intel SGX ECDSA (DCAP) quotes

EPID-based SGX quotes are not supported.

## API

Automate attestation verification with the public REST API — no API key required.

```bash
# Submit a binary quote file
curl -X POST -F "file=@quote.bin" https://proof.t16z.com/api/upload

# Submit a hex-encoded quote
curl -X POST -F "hex=03000200..." https://proof.t16z.com/api/upload
```

Response:
```json
{
  "success": true,
  "checksum": "0x...",
  "url": "https://proof.t16z.com/reports/0x..."
}
```

Rate limits: 10 requests/minute per IP. See [API documentation](https://proof.t16z.com/docs) for full details and code examples in Python, Node.js, and JavaScript.

## Development

```bash
npm install
npm run dev
```

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + Radix UI
- Viem (on-chain verification)
- ioredis (rate limiting)

## Related projects

- [dstack](https://github.com/Dstack-TEE/dstack) — open framework for deploying confidential AI workloads on TEE hardware
- [Phala Cloud](https://cloud.phala.network) — managed confidential computing platform
- [Automata DCAP Attestation](https://github.com/automata-network/automata-dcap-attestation) — on-chain DCAP verification contracts
- [zkVerify](https://zkverify.io) — ZK proof verification network
- [Proof of Cloud](https://proofofcloud.org) — verified cloud hardware registry

## Contributing

Issues and pull requests are welcome. The repository is maintained by the [Phala Network](https://phala.network) team.

## License

[Apache 2.0](LICENSE)
