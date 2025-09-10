import { useState } from 'react';
import { Search, Filter, Plus, Users } from 'lucide-react';
import { EmployeeApplicationCard } from './EmployeeApplicationCard';
import { mockEmployeeApplications } from '@/data/mockData';
import { EmployeeApplication } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function EmployeeApplications() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');

  // Filter applications based on search and filters
  const filteredApplications = mockEmployeeApplications.filter(application => {
    const matchesSearch = searchQuery === '' || 
      application.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      application.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    const matchesExperience = experienceFilter === 'all' || application.experienceLevel === experienceFilter;
    
    return matchesSearch && matchesStatus && matchesExperience;
  });

  const handleViewDetails = (application: EmployeeApplication) => {
    console.log('View details for:', application);
    // In a real app, this would open a detailed view modal or navigate to a detail page
  };

  const handleApprove = (applicationId: string) => {
    console.log('Approve application:', applicationId);
    // In a real app, this would update the application status
  };

  const handleReject = (applicationId: string) => {
    console.log('Reject application:', applicationId);
    // In a real app, this would update the application status
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employee Applications</h1>
          <p className="text-muted-foreground">Review and manage employee applications and hirings.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Invite Employee
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, skills, or location..."
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
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={experienceFilter} onValueChange={setExperienceFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Expert">Expert</SelectItem>
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
          <div className="text-2xl font-bold text-foreground">{mockEmployeeApplications.length}</div>
          <div className="text-sm text-muted-foreground">Total Applications</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-warning">{mockEmployeeApplications.filter(a => a.status === 'pending').length}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">{mockEmployeeApplications.filter(a => a.status === 'approved').length}</div>
          <div className="text-sm text-muted-foreground">Approved</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-destructive">{mockEmployeeApplications.filter(a => a.status === 'rejected').length}</div>
          <div className="text-sm text-muted-foreground">Rejected</div>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplications.map((application) => (
          <EmployeeApplicationCard
            key={application.id}
            application={application}
            onViewDetails={handleViewDetails}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">No applications found</div>
          <div className="text-muted-foreground text-sm mt-1">
            {searchQuery || statusFilter !== 'all' || experienceFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Employee applications will appear here when people apply for positions'
            }
          </div>
        </div>
      )}
    </div>
  );
}