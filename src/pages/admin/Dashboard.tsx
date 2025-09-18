const AdminDashboard = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Total Bookings</p>
          <p className="text-2xl font-bold">128</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Active Services</p>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Users</p>
          <p className="text-2xl font-bold">1,245</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Revenue</p>
          <p className="text-2xl font-bold">$12,560</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
