import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, DollarSign } from "lucide-react";
import { type EmployeeProfileData } from "@/lib/api";

interface ProfessionalInfoTabProps {
  form: EmployeeProfileData;
  onFormChange: (field: keyof EmployeeProfileData, value: any) => void;
}

const ProfessionalInfoTab = ({
  form,
  onFormChange,
}: ProfessionalInfoTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-green-600" />
            Professional Information
          </CardTitle>
          <CardDescription>
            Set your professional level and salary expectations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="level" className="text-sm font-medium">
                Experience Level *
              </Label>
              <Select
                value={form.level || ""}
                onValueChange={(v) => onFormChange("level", v as any)}
              >
                <SelectTrigger id="level" className="h-11">
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      Beginner
                    </div>
                  </SelectItem>
                  <SelectItem value="Intermediate">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      Intermediate
                    </div>
                  </SelectItem>
                  <SelectItem value="Expert">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      Expert
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedSalary" className="text-sm font-medium">
                Expected Salary (USD)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="expectedSalary"
                  type="number"
                  value={form.expectedSalary ?? ""}
                  onChange={(e) =>
                    onFormChange("expectedSalary", Number(e.target.value))
                  }
                  placeholder="Enter expected salary"
                  className="h-11 pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalInfoTab;
