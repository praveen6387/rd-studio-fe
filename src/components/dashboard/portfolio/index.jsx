"use client";
import DashboardPageLayout from "@/components/utils/DashboardPagelayout";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const PortfolioIndex = ({ current_user }) => {
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      email: current_user?.user?.email || "",
      first_name: current_user?.user?.first_name || "",
      last_name: current_user?.user?.last_name || "",
      phone: current_user?.user?.phone || "",
      gender: current_user?.user?.gender ?? "",
      date_of_birth: current_user?.user?.date_of_birth || "",
      role_name: current_user?.user?.role_name || "",
      is_active: Boolean(current_user?.user?.is_active),
      created_at: current_user?.user?.created_at || "",
    },
  });

  const onSubmit = (values) => {
    toast({
      title: "Profile updated",
      description: "Your changes have been saved.",
    });
  };

  return (
    <DashboardPageLayout title="Portfolio" description="Manage your portfolio">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
          <CardDescription>Edit your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value ?? ""}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Male</SelectItem>
                            <SelectItem value="1">Female</SelectItem>
                            <SelectItem value="2">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Active</FormLabel>
                      <FormControl>
                        <div className="flex h-9 items-center gap-3 rounded-md border border-input px-3">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                          <span className="text-sm text-muted-foreground">{field.value ? "Enabled" : "Disabled"}</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </DashboardPageLayout>
  );
};

export default PortfolioIndex;
