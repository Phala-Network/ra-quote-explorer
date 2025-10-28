import { ofetch } from "ofetch";
import { ReportView } from "@/components/report_view";
import { ReportNotFound } from "@/components/report_not_found";

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
