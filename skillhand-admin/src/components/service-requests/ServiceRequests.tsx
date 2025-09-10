import { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { ServiceRequestCard } from './ServiceRequestCard';
import { mockServiceRequests } from '@/data/mockData';
import { ServiceRequest } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ServiceRequests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filter requests based on search and filters
  const filteredRequests = mockServiceRequests.filter(request => {
    const matchesSearch = searchQuery === '' || 
      request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.customerLocation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleViewDetails = (request: ServiceRequest) => {
    console.log('View details for:', request);
    // In a real app, this would open a detailed view modal or navigate to a detail page
  };

  const handleAccept = (requestId: string) => {
    console.log('Accept request:', requestId);
    // In a real app, this would update the request status
  };

  const handleComplete = (requestId: string) => {
    console.log('Complete request:', requestId);
    // In a real app, this would mark the request as completed
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Service Requests</h1>
          <p className="text-muted-foreground">Manage and track all service requests from customers.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Request
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name, service type, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{mockServiceRequests.length}</div>
          <div className="text-sm text-muted-foreground">Total Requests</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-warning">{mockServiceRequests.filter(r => r.status === 'pending').length}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-info">{mockServiceRequests.filter(r => r.status === 'in-progress').length}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">{mockServiceRequests.filter(r => r.status === 'completed').length}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
      </div>

      {/* Service Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map((request) => (
          <ServiceRequestCard
            key={request.id}
            request={request}
            onViewDetails={handleViewDetails}
            onAccept={handleAccept}
            onComplete={handleComplete}
          />
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">No service requests found</div>
          <div className="text-muted-foreground text-sm mt-1">
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Service requests will appear here when customers submit them'
            }
          </div>
        </div>
      )}
    </div>
  );
}