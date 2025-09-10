import { 
  MapPin, 
  Phone, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { ServiceRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onViewDetails?: (request: ServiceRequest) => void;
  onAccept?: (requestId: string) => void;
  onComplete?: (requestId: string) => void;
}

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
    default:
      return 'status-pending';
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'priority-high';
    case 'medium':
      return 'priority-medium';
    case 'low':
      return 'priority-low';
    default:
      return 'priority-low';
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-AE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ServiceRequestCard({ request, onViewDetails, onAccept, onComplete }: ServiceRequestCardProps) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">{request.customerName}</h3>
            <p className="text-sm text-muted-foreground">#{request.id}</p>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className={cn("h-4 w-4", getPriorityColor(request.priority))} />
            <Badge className={`status-badge ${getStatusBadgeClass(request.status)}`}>
              {request.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Service Details */}
        <div>
          <h4 className="font-medium text-sm text-foreground mb-1">{request.serviceType}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
        </div>

        {/* Customer Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{request.customerPhone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{request.customerLocation}</span>
          </div>
        </div>

        {/* Dates and Cost */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Requested</p>
            <div className="flex items-center space-x-1 text-sm">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-foreground">{formatDate(request.requestedDate)}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Estimated Cost</p>
            <div className="flex items-center space-x-1 text-sm">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium text-foreground">{request.estimatedCost} AED</span>
            </div>
          </div>
        </div>

        {request.scheduledDate && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Scheduled</p>
            <div className="flex items-center space-x-1 text-sm">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-foreground">{formatDate(request.scheduledDate)}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(request)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Details
          </Button>
          
          {request.status === 'pending' && (
            <Button
              size="sm"
              onClick={() => onAccept?.(request.id)}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Accept
            </Button>
          )}
          
          {request.status === 'in-progress' && (
            <Button
              size="sm"
              onClick={() => onComplete?.(request.id)}
              className="flex-1 bg-success hover:bg-success/90"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}