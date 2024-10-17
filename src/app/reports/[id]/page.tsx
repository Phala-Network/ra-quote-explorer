import React from "react";
import { Shield, Cpu, Lock, Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ReportDisplayPage() {
  // This is mock data. In a real application, this would come from your backend
  const reportData = {
    type: "SGX",
    timestamp: "2024-10-17T14:30:00Z",
    mrenclave: "0x1234567890abcdef...",
    mrsigner: "0xabcdef1234567890...",
    isvprodid: "1",
    isvsvn: "2",
    reportData: "0xdeadbeefcafebabe...",
    cpusvn: "0x0102030405060708...",
    flags: ["INITTED", "DEBUG", "MODE64BIT"],
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Report Analysis Results
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Report Overview</CardTitle>
            <CardDescription>
              Key information about the analyzed report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-blue-500" />
                <span>Type: {reportData.type}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-green-500" />
                <span>
                  Timestamp: {new Date(reportData.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center">
                <Cpu className="mr-2 h-5 w-5 text-purple-500" />
                <span>CPU SVN: {reportData.cpusvn}</span>
              </div>
              <div className="flex items-center">
                <Lock className="mr-2 h-5 w-5 text-red-500" />
                <span>ISV SVN: {reportData.isvsvn}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Measurement Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attribute</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>MRENCLAVE</TableCell>
                  <TableCell className="font-mono">
                    {reportData.mrenclave}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>MRSIGNER</TableCell>
                  <TableCell className="font-mono">
                    {reportData.mrsigner}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Report Data</TableCell>
                  <TableCell className="font-mono">
                    {reportData.reportData}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {reportData.flags.map((flag, index) => (
                <Badge key={index} variant="secondary">
                  {flag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
