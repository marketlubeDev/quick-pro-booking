import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Download,
  Filter,
} from "lucide-react";

// Mock data for reports
const monthlyRevenue = [
  { month: "Jan", revenue: 8500, requests: 45 },
  { month: "Feb", revenue: 9200, requests: 52 },
  { month: "Mar", revenue: 10800, requests: 61 },
  { month: "Apr", revenue: 12500, requests: 68 },
  { month: "May", revenue: 13200, requests: 72 },
  { month: "Jun", revenue: 11800, requests: 65 },
];

const serviceTypeStats = [
  { type: "Plumbing", count: 45, revenue: 5400, avgRating: 4.8 },
  { type: "Electrical", count: 38, revenue: 4560, avgRating: 4.9 },
  { type: "Cleaning", count: 52, revenue: 3120, avgRating: 4.7 },
  { type: "HVAC", count: 29, revenue: 5220, avgRating: 4.6 },
  { type: "Other", count: 15, revenue: 1200, avgRating: 4.5 },
];

const employeePerformance = [
  { name: "John Smith", completedJobs: 28, rating: 4.9, revenue: 4200 },
  { name: "Sarah Johnson", completedJobs: 24, rating: 4.8, revenue: 3600 },
  { name: "Mike Davis", completedJobs: 31, rating: 4.7, revenue: 4650 },
  { name: "Lisa Brown", completedJobs: 19, rating: 4.9, revenue: 2850 },
  { name: "Alex Thompson", completedJobs: 22, rating: 4.6, revenue: 3300 },
];

export function Reports() {
  const totalRevenue = monthlyRevenue.reduce(
    (sum, month) => sum + month.revenue,
    0
  );
  const totalRequests = monthlyRevenue.reduce(
    (sum, month) => sum + month.requests,
    0
  );
  const avgRevenuePerRequest = totalRevenue / totalRequests;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            View analytics and reports for your business
          </p>
        </div>
        <div className="flex space-x-2">
          <Select defaultValue="last-6-months">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Revenue/Request
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${avgRevenuePerRequest.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +3 new this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>
            Monthly revenue over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Revenue chart would be displayed here
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Integration with charting library needed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Type Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Service Type Performance</CardTitle>
          <CardDescription>Performance metrics by service type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceTypeStats.map((service) => (
              <div
                key={service.type}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{service.type}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{service.count} requests</span>
                      <span>${service.revenue} revenue</span>
                      <span>⭐ {service.avgRating}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${
                          (service.count /
                            Math.max(...serviceTypeStats.map((s) => s.count))) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Employee Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Employees</CardTitle>
          <CardDescription>Employee performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employeePerformance.map((employee, index) => (
              <div
                key={employee.name}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{employee.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {employee.completedJobs} completed jobs
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium">${employee.revenue}</p>
                    <p className="text-muted-foreground">Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">⭐ {employee.rating}</p>
                    <p className="text-muted-foreground">Rating</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Satisfaction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
            <CardDescription>Average ratings and feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">4.8</div>
                <p className="text-muted-foreground">Average Rating</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>5 stars</span>
                  <span>78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>4 stars</span>
                  <span>18%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: "18%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>3 stars</span>
                  <span>3%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: "3%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>2 stars</span>
                  <span>1%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-400 h-2 rounded-full"
                    style={{ width: "1%" }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
            <CardDescription>Latest customer reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex text-yellow-400">{"★".repeat(5)}</div>
                  <span className="text-sm font-medium">John Smith</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Excellent service! The plumber was professional and fixed the
                  issue quickly."
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex text-yellow-400">{"★".repeat(5)}</div>
                  <span className="text-sm font-medium">Sarah Johnson</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Great experience from start to finish. Highly recommend!"
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex text-yellow-400">{"★".repeat(4)}</div>
                  <span className="text-sm font-medium">Mike Davis</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Good service, arrived on time and completed the work as
                  promised."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Reports;
