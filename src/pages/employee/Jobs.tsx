import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const mockJobs = [
  {
    id: "JOB-1024",
    title: "Kitchen sink leak",
    address: "742 Evergreen Terrace, Springfield",
    scheduledFor: "2025-09-21 10:00 AM",
    status: "Assigned",
  },
  {
    id: "JOB-1027",
    title: "Light fixture install",
    address: "31 Spooner St, Quahog",
    scheduledFor: "2025-09-22 02:30 PM",
    status: "Pending",
  },
];

const statusToVariant: Record<string, any> = {
  Assigned: "default",
  Pending: "secondary",
  Completed: "outline",
};

const EmployeeJobs = () => {
  return (
    <div className="space-y-4">
      {mockJobs.map((job) => (
        <UICard key={job.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">{job.title}</CardTitle>
              <CardDescription>{job.address}</CardDescription>
            </div>
            <Badge variant={statusToVariant[job.status] || "secondary"}>
              {job.status}
            </Badge>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Scheduled: {job.scheduledFor}</span>
            <Link to={`/projects`} className="text-primary hover:underline">
              View details
            </Link>
          </CardContent>
        </UICard>
      ))}
      {mockJobs.length === 0 && (
        <p className="text-sm text-muted-foreground">No jobs assigned yet.</p>
      )}
    </div>
  );
};

export default EmployeeJobs;
