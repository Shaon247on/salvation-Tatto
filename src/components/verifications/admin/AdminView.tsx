"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import {
  selectCurrentUser,
  selectUserRole,
} from "@/redux/features/auth/authSlice";
import { useState } from "react";

// Mock data for verifications
const verificationStatsData = [
  {
    title: "Pending",
    value: "12",
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "Approved",
    value: "156",
    change: "+24",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Rejected",
    value: "8",
    change: "-3",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    title: "Total Processed",
    value: "176",
    icon: ClipboardCheck,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
];

const pendingVerificationsData = [
  {
    id: 1,
    type: "Employee Onboarding",
    requester: "Sarah Johnson",
    department: "Frontend",
    date: "2024-01-15",
    status: "pending",
    priority: "high",
  },
  {
    id: 2,
    type: "Leave Request",
    requester: "Michael Brown",
    department: "Backend",
    date: "2024-01-14",
    status: "pending",
    priority: "medium",
  },
  {
    id: 3,
    type: "Expense Claim",
    requester: "Emily Davis",
    department: "Design",
    date: "2024-01-14",
    status: "pending",
    priority: "low",
  },
  {
    id: 4,
    type: "Equipment Request",
    requester: "James Wilson",
    department: "Marketing",
    date: "2024-01-13",
    status: "pending",
    priority: "medium",
  },
  {
    id: 5,
    type: "Time-off Request",
    requester: "Lisa Anderson",
    department: "Support",
    date: "2024-01-13",
    status: "pending",
    priority: "high",
  },
];

const recentVerificationsData = [
  {
    id: 101,
    type: "Employee Onboarding",
    requester: "David Lee",
    department: "Sales",
    date: "2024-01-12",
    status: "approved",
    processedBy: "Admin",
  },
  {
    id: 102,
    type: "Expense Claim",
    requester: "Jennifer Taylor",
    department: "HR",
    date: "2024-01-12",
    status: "approved",
    processedBy: "Admin",
  },
  {
    id: 103,
    type: "Leave Request",
    requester: "Robert Garcia",
    department: "Frontend",
    date: "2024-01-11",
    status: "rejected",
    processedBy: "Admin",
  },
  {
    id: 104,
    type: "Equipment Request",
    requester: "Amanda Martinez",
    department: "Design",
    date: "2024-01-11",
    status: "approved",
    processedBy: "Admin",
  },
];

export default function VerificationsAdmin() {
  const user = useAppSelector(selectCurrentUser);
  const role = useAppSelector(selectUserRole);
  const [selectedTab, setSelectedTab] = useState<
    "pending" | "approved" | "rejected"
  >("pending");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-500/10";
      case "medium":
        return "text-amber-400 bg-amber-500/10";
      case "low":
        return "text-blue-400 bg-blue-500/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Verifications Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and process verification requests.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {verificationStatsData.map((stat, index) => (
          <Card
            key={index}
            className="bg-card border-border hover:border-primary/30 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                {stat.change && (
                  <span className="text-xs font-medium text-green-500">
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setSelectedTab("pending")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            selectedTab === "pending"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Pending ({pendingVerificationsData.length})
        </button>
        <button
          onClick={() => setSelectedTab("approved")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            selectedTab === "approved"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Approved
        </button>
        <button
          onClick={() => setSelectedTab("rejected")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            selectedTab === "rejected"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Rejected
        </button>
      </div>

      {/* Pending Verifications */}
      {selectedTab === "pending" && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Pending Verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Requester
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Department
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Priority
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingVerificationsData.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {row.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {row.requester}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {row.department}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {row.date}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            "px-2 py-1 text-xs font-medium rounded-full",
                            getPriorityColor(row.priority),
                          )}
                        >
                          {row.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approved Verifications */}
      {selectedTab === "approved" && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Approved Verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Requester
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Department
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Processed By
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentVerificationsData
                    .filter((r) => r.status === "approved")
                    .map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {row.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {row.requester}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {row.department}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {row.date}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {row.processedBy}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-400">
                            Approved
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rejected Verifications */}
      {selectedTab === "rejected" && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Rejected Verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Requester
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Department
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Processed By
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentVerificationsData
                    .filter((r) => r.status === "rejected")
                    .map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {row.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {row.requester}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {row.department}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {row.date}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {row.processedBy}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-400">
                            Rejected
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
