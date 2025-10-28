import Link from "next/link";
import {
  Shield,
  ShieldOff,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge'
import { TimeDisplay } from './time_display'

export function RecentAttestations({
  items,
}: { items: { checksum: string; created_at: string; verified: boolean }[] }) {
  return (
    <Card className="max-w-4xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle>Recent Attestations</CardTitle>
      </CardHeader>
      <CardContent className="overflow-visible">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="uppercase font-thin">Report Hash</TableHead>
              <TableHead className="uppercase font-thin">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono flex flex-row gap-1.5 items-center">
                  {item.verified ? (
                    <div className="rounded-md bg-primary-200 border border-primary p-1">
                      <Shield className="h-3.5 w-3.5 text-primary-700" />
                    </div>
                  ) : (
                    <div className="rounded-md border border-border p-1">
                      <ShieldOff className="h-3.5 w-3.5 text-destructive" />
                    </div>
                  )}
                  <Link href={`/reports/${item.checksum}`} className="ml-1.5 hover:text-primary-800 hover:underline transition-colors">
                    {item.checksum}
                  </Link>
                </TableCell>
                <TableCell className="min-w-24"><TimeDisplay isoString={item.created_at} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
