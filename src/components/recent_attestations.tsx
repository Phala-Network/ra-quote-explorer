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
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Recent Attestations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Hash</TableHead>
              <TableHead>Submit Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono flex flex-row gap-1.5 items-center">
                  {item.verified ? (
                    <Badge className="flex flex-row gap-2" variant="success">
                      <Shield className="h-4 w-4 text-green-500" />
                    </Badge>
                  ) : (
                    <Badge className="flex flex-row gap-2" variant="destructive">
                      <ShieldOff className="h-4 w-4 text-white" />
                    </Badge>
                  )}
                  <Link href={`/reports/${item.checksum}`}>
                    {item.checksum}
                  </Link>
                </TableCell>
                <TableCell><TimeDisplay isoString={item.created_at} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
