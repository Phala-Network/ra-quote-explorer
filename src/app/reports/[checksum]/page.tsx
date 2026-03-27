import type { Metadata } from "next";
import { ofetch } from "ofetch";
import { ReportView } from "@/components/report_view";
import { ReportNotFound } from "@/components/report_not_found";

export async function generateMetadata({
  params,
}: { params: Promise<{ checksum: string }> }): Promise<Metadata> {
  const { checksum } = await params;
  const short = checksum.slice(0, 16);
  return {
    title: `Attestation Report ${short}…`,
    description: `TEE attestation report ${checksum}. View measurements, TCB status, and multi-party verification results.`,
    alternates: {
      canonical: `/reports/${checksum}`,
    },
  };
}

export default async function ReportDisplayPage({
  params,
}: { params: Promise<{ checksum: string }> }) {
  const { checksum } = await params;
  try {
    const data = await ofetch(
      `${process.env.API_PREFIX}/attestations/view/${checksum}`,
    );
    if (!data) {
      return <ReportNotFound />;
    }
    return <ReportView report={data} checksum={checksum} />;
  } catch (_) {
    return <ReportNotFound />;
  }
}
