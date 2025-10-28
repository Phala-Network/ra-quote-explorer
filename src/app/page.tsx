import { use } from "react";
import { UploadView } from "@/components/upload_view";
import { RecentAttestations } from "@/components/recent_attestations";

export default function Home() {
  const items = use(
    fetch(`${process.env.API_PREFIX}/attestations/recent`, {
      cache: "no-store",
    }).then((res) => res.json()),
  );
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <UploadView />
      <div className="mt-12 max-w-4xl mx-auto">
        <RecentAttestations items={items} />
      </div>
      <footer className="mt-8 pb-4">
        <div className="flex flex-inline gap-1.5 justify-center items-center">
          <img src="/apple-touch-icon.png" className="w-5 h-5 rounded-full overflow-hidden" alt="Phala" />
          <p className="text-muted-foreground text-sm">
            Developed by the{" "}
            <a href="https://phala.network" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
              Phala team
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
