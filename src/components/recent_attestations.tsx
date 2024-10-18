import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecentAttestations({
  items,
}: { items: { checksum: string; created_at: string }[] }) {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Recent Attestations
        </h1>
        <div className="mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Checksum</TableHead>
                <TableHead>Submit Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono">
                    <Link href={`/reports/${item.checksum}`}>
                      {item.checksum}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {new Date(item.created_at).toUTCString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
