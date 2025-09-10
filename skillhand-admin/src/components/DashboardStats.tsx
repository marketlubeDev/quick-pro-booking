import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Wrench,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

const stats = [
  {
    title: "Total Service Requests",
    value: "247",
    change: "+12%",
    changeType: "positive",
    icon: Wrench,
  },
  {
    title: "Active Employees",
    value: "32",
    change: "+3",
    changeType: "positive",
    icon: Users,
  },
  {
    title: "Completed Today",
    value: "18",
    change: "+8%",
    changeType: "positive",
    icon: CheckCircle,
  },
  {
    title: "Pending Requests",
    value: "23",
    change: "-5%",
    changeType: "negative",
    icon: Clock,
  },
  {
    title: "Employee Applications",
    value: "8",
    change: "+2",
    changeType: "positive",
    icon: TrendingUp,
  },
  {
    title: "Urgent Requests",
    value: "5",
    change: "+1",
    changeType: "neutral",
    icon: AlertCircle,
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.changeType === "positive"
                  ? "text-green-600"
                  : stat.changeType === "negative"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

