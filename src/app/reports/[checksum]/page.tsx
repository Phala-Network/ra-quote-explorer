import { ofetch } from "ofetch";
import { ReportView } from "@/components/report_view";

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
    return <ReportView report={data} />;
  } catch (_) {
    return <div>Report not found</div>;
  }
}
