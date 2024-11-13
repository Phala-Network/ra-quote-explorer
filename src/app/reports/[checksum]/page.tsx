import { ofetch } from "ofetch";
import { ReportView } from "@/components/report_view";
import { DcapVerifyForm } from "@/components/onchain_attestation";

export default async function ReportDisplayPage({
  params,
}: { params: { checksum: string } }) {
  try {
    const data = await ofetch(
      `${process.env.API_PREFIX}/api/attestations/view/${params.checksum}`,
    );
    if (!data) {
      return <div>Report not found</div>;
    }
    // return <DcapVerifyForm checksum={params.checksum} />
    return <ReportView report={data} checksum={params.checksum} />;
  } catch (_) {
    return <div>Report not found</div>;
  }
}
