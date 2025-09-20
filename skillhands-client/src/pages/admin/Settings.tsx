import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Mail,
  Globe,
  Database,
  Save,
  RefreshCw,
} from "lucide-react";

export function Settings() {
  const [settings, setSettings] = useState({
    // General Settings
    companyName: "SkillHand",
    companyEmail: "admin@skillhand.com",
    companyPhone: "+1 (555) 123-4567",
    companyAddress: "123 Business St, City, State 12345",
    timezone: "America/New_York",
    currency: "USD",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newRequestNotifications: true,
    employeeApplicationNotifications: true,
    paymentNotifications: true,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordPolicy: "strong",

    // Service Settings
    defaultServiceRadius: "25",
    autoAssignEmployees: false,
    requireCustomerConfirmation: true,
    allowRescheduling: true,

    // Payment Settings
    paymentMethod: "stripe",
    taxRate: "8.5",
    lateFeePercentage: "5",

    // Email Settings
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "noreply@skillhand.com",
    smtpPassword: "********",
    fromEmail: "noreply@skillhand.com",
    fromName: "SkillHand",
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving settings:", settings);
  };

  const handleTestEmail = () => {
    // Handle email test logic here
    console.log("Testing email configuration");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure your application settings and preferences
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5" />
            <span>General Settings</span>
          </CardTitle>
          <CardDescription>
            Basic company information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) =>
                  handleSettingChange("companyName", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={settings.companyEmail}
                onChange={(e) =>
                  handleSettingChange("companyEmail", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Company Phone</Label>
              <Input
                id="companyPhone"
                value={settings.companyPhone}
                onChange={(e) =>
                  handleSettingChange("companyPhone", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) =>
                  handleSettingChange("timezone", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    Pacific Time
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) =>
                  handleSettingChange("currency", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Company Address</Label>
            <Textarea
              id="companyAddress"
              value={settings.companyAddress}
              onChange={(e) =>
                handleSettingChange("companyAddress", e.target.value)
              }
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Settings</span>
          </CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("emailNotifications", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via SMS
                </p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("smsNotifications", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications in browser
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("pushNotifications", checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Notification Types</h4>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Service Requests</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new service requests are submitted
                </p>
              </div>
              <Switch
                checked={settings.newRequestNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("newRequestNotifications", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Employee Applications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new employee applications are submitted
                </p>
              </div>
              <Switch
                checked={settings.employeeApplicationNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange(
                    "employeeApplicationNotifications",
                    checked
                  )
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Payment Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about payment updates
                </p>
              </div>
              <Switch
                checked={settings.paymentNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("paymentNotifications", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Settings</span>
          </CardTitle>
          <CardDescription>
            Configure security and authentication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) =>
                handleSettingChange("twoFactorAuth", checked)
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Select
                value={settings.sessionTimeout}
                onValueChange={(value) =>
                  handleSettingChange("sessionTimeout", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordPolicy">Password Policy</Label>
              <Select
                value={settings.passwordPolicy}
                onValueChange={(value) =>
                  handleSettingChange("passwordPolicy", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="strong">Strong</SelectItem>
                  <SelectItem value="very-strong">Very Strong</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Service Settings</span>
          </CardTitle>
          <CardDescription>Configure service-related settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="defaultServiceRadius">
                Default Service Radius (miles)
              </Label>
              <Input
                id="defaultServiceRadius"
                type="number"
                value={settings.defaultServiceRadius}
                onChange={(e) =>
                  handleSettingChange("defaultServiceRadius", e.target.value)
                }
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Assign Employees</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically assign employees to new service requests
                </p>
              </div>
              <Switch
                checked={settings.autoAssignEmployees}
                onCheckedChange={(checked) =>
                  handleSettingChange("autoAssignEmployees", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Customer Confirmation</Label>
                <p className="text-sm text-muted-foreground">
                  Require customer confirmation before scheduling services
                </p>
              </div>
              <Switch
                checked={settings.requireCustomerConfirmation}
                onCheckedChange={(checked) =>
                  handleSettingChange("requireCustomerConfirmation", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Rescheduling</Label>
                <p className="text-sm text-muted-foreground">
                  Allow customers to reschedule their appointments
                </p>
              </div>
              <Switch
                checked={settings.allowRescheduling}
                onCheckedChange={(checked) =>
                  handleSettingChange("allowRescheduling", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Payment Settings</span>
          </CardTitle>
          <CardDescription>
            Configure payment processing settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={settings.paymentMethod}
                onValueChange={(value) =>
                  handleSettingChange("paymentMethod", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.1"
                value={settings.taxRate}
                onChange={(e) => handleSettingChange("taxRate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lateFeePercentage">Late Fee (%)</Label>
              <Input
                id="lateFeePercentage"
                type="number"
                step="0.1"
                value={settings.lateFeePercentage}
                onChange={(e) =>
                  handleSettingChange("lateFeePercentage", e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Email Settings</span>
          </CardTitle>
          <CardDescription>
            Configure SMTP settings for sending emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={settings.smtpHost}
                onChange={(e) =>
                  handleSettingChange("smtpHost", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                value={settings.smtpPort}
                onChange={(e) =>
                  handleSettingChange("smtpPort", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpUsername">SMTP Username</Label>
              <Input
                id="smtpUsername"
                value={settings.smtpUsername}
                onChange={(e) =>
                  handleSettingChange("smtpUsername", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={settings.smtpPassword}
                onChange={(e) =>
                  handleSettingChange("smtpPassword", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                type="email"
                value={settings.fromEmail}
                onChange={(e) =>
                  handleSettingChange("fromEmail", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={settings.fromName}
                onChange={(e) =>
                  handleSettingChange("fromName", e.target.value)
                }
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleTestEmail}>
              Test Email Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;
