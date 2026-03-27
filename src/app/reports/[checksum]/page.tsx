import type { Metadata } from "next";
import { ofetch } from "ofetch";
import { ReportView } from "@/components/report_view";
import { ReportNotFound } from "@/components/report_not_found";

export async function generateMetadata({
  params,
}: { params: { checksum: string } }): Promise<Metadata> {
  const short = params.checksum.slice(0, 16);
  return {
    title: `Attestation Report ${short}…`,
    description: `TEE attestation report ${params.checksum}. View measurements, TCB status, and multi-party verification results.`,
    alternates: {
      canonical: `/reports/${params.checksum}`,
    },
  };
}

export default async function ReportDisplayPage({
  params,
}: { params: { checksum: string } }) {
  try {
    const data = await ofetch(
      `${process.env.API_PREFIX}/attestations/view/${params.checksum}`,
    );
    if (!data) {
      return <ReportNotFound />;
    }
    return <ReportView report={data} checksum={params.checksum} />;
  } catch (_) {
    return <ReportNotFound />;
  }
}
