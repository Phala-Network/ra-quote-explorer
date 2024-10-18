import { use } from "react";
import { ofetch } from "ofetch";
import { UploadView } from "@/components/upload_view";
import { RecentAttestations } from "@/components/recent_attestations";

export default function Home() {
  const items = use(
    ofetch(`${process.env.API_PREFIX}/api/attestations/recent`),
  );
  return (
    <>
      <UploadView />
      <RecentAttestations items={items} />
    </>
  );
}
