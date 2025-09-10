import { 
  ClipboardList, 
  Users, 
  CheckCircle, 
  Clock, 
  UserPlus, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin,
  Phone
} from 'lucide-react';
import { StatCard } from './StatCard';
import { mockDashboardStats, mockServiceRequests, mockEmployeeApplications } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceRequest, EmployeeApplication } from '@/types';

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'pending':
      return 'status-pending';
    case 'in-progress':
      return 'status-active';
    case 'completed':
      return 'status-completed';
    case 'cancelled':
      return 'status-cancelled';
    case 'approved':
      return 'status-completed';
    case 'rejected':
      return 'status-cancelled';
    default:
      return 'status-pending';
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-AE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function Dashboard() {
  const recentRequests = mockServiceRequests.slice(0, 4);
  const recentApplications = mockEmployeeApplications.slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your service platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Service Requests"
          value={mockDashboardStats.totalServiceRequests}
          icon={ClipboardList}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Employees"
          value={mockDashboardStats.activeEmployees}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Completed Today"
          value={mockDashboardStats.completedToday}
          icon={CheckCircle}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Pending Requests"
          value={mockDashboardStats.pendingRequests}
          icon={Clock}
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Employee Applications"
          value={mockDashboardStats.employeeApplications}
          icon={UserPlus}
          trend={{ value: 20, isPositive: true }}
        />
        <StatCard
          title="Urgent Requests"
          value={mockDashboardStats.urgentRequests}
          icon={AlertTriangle}
          trend={{ value: 10, isPositive: false }}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Service Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-semibold">Recent Service Requests</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{request.customerName}</h4>
                    <Badge className={`status-badge ${getStatusBadgeClass(request.status)}`}>
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{request.serviceType}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{request.customerLocation.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(request.requestedDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Employee Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-semibold">Recent Employee Applications</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApplications.map((application) => (
              <div key={application.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{application.name}</h4>
                    <Badge className={`status-badge ${getStatusBadgeClass(application.status)}`}>
                      {application.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {application.skills.slice(0, 2).join(', ')}
                    {application.skills.length > 2 && ` +${application.skills.length - 2} more`}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{application.rating} rating</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{application.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-auto p-4 flex-col space-y-2">
              <ClipboardList className="h-6 w-6" />
              <span>New Service Request</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>Add Employee</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span>View Reports</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <AlertTriangle className="h-6 w-6" />
              <span>Urgent Tasks</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}