import { useEffect, useMemo, useState } from "react";
import {
  serviceCategoriesApi,
  type ServiceCategory,
} from "@/lib/api.serviceCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ServiceCategories() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceCategory | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    iconUrl: "",
    isActive: true,
    price: 0,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) =>
      [c.name, c.description || ""].some((v) => v.toLowerCase().includes(q))
    );
  }, [categories, query]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await serviceCategoriesApi.list();
      if (res.success) setCategories(res.data || []);
    } catch (e: any) {
      toast({
        title: "Failed to load categories",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      iconUrl: "",
      isActive: true,
      price: 0,
    });
    setFormOpen(true);
  };

  const openEdit = (cat: ServiceCategory) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      description: cat.description || "",
      iconUrl: cat.iconUrl || "",
      isActive: !!cat.isActive,
      price: typeof (cat as any).price === "number" ? (cat as any).price : 0,
    });
    setFormOpen(true);
  };

  const submit = async () => {
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    try {
      if (editing) {
        const res = await serviceCategoriesApi.update(editing._id, form);
        if (res.success && res.data) {
          toast({ title: "Category updated" });
          setFormOpen(false);
          await load();
        }
      } else {
        const res = await serviceCategoriesApi.create(form);
        if (res.success) {
          toast({ title: "Category created" });
          setFormOpen(false);
          await load();
        }
      }
    } catch (e: any) {
      toast({
        title: "Save failed",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  const remove = async (cat: ServiceCategory) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    try {
      const res = await serviceCategoriesApi.remove(cat._id);
      if (res.success) {
        toast({ title: "Category deleted" });
        await load();
      }
    } catch (e: any) {
      toast({
        title: "Delete failed",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 pt-8 px-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold"></h1>
        <div className="flex flex-wrap items-center gap-2 justify-end w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={load}
            disabled={loading}
            className="whitespace-nowrap"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Button onClick={openCreate} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" /> New Category
          </Button>
        </div>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cat) => (
            <Card key={cat._id} className="p-4 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {cat.description || "—"}
                  </p>
                </div>
                <span
                  className={
                    (cat as any).isActive
                      ? "inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5"
                      : "inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-xs px-2 py-0.5"
                  }
                >
                  {(cat as any).isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="font-medium">
                  {typeof (cat as any).price === "number"
                    ? `$${(cat as any).price.toFixed(2)}`
                    : "—"}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(cat)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(cat)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-6">
            {loading ? "Loading..." : "No categories found"}
          </div>
        )}
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Category" : "New Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iconUrl">Icon URL (optional)</Label>
              <Input
                id="iconUrl"
                value={form.iconUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, iconUrl: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={String(form.price)}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: Number(e.target.value) }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ServiceCategories;
