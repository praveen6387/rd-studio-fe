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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { convertTime, convertToDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { X } from "lucide-react";
import { SaveIcon } from "lucide-react";

const PortfolioIndex = ({ current_user }) => {
  console.log(current_user);
  const { toast } = useToast();
  const initials =
    (
      ((current_user?.user?.first_name || "").trim()[0] || "") +
      ((current_user?.user?.last_name || "").trim()[0] || "")
    ).toUpperCase() || (current_user?.user?.email || "?")[0].toUpperCase();

  const [isEditing, setIsEditing] = useState(false);

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
    <DashboardPageLayout title="Profile" description="Manage your profile">
      <div className="space-y-6 over">
        <div className="flex items-center justify-center gap-x-20 gap-y-10 flex-wrap">
          <Avatar className="rounded-full w-68 h-68">
            <AvatarImage
              src={current_user?.user?.profile_image || undefined}
              alt={current_user?.user?.first_name || "User avatar"}
            />
            <AvatarFallback className="flex h-full w-full items-center justify-center font-semibold bg-gray-200 text-gray-600 text-4xl md:text-5xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-4">
            {/* name  */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <h2 className="text-6xl font-bold text-gray-900">
                {current_user?.user?.first_name} {current_user?.user?.last_name}
              </h2>
            </div>
            {/* organization name */}
            <div className="flex flex-wrap gap-4 items-center">
              {current_user?.user?.role_name && (
                <Badge variant={current_user?.user?.role_name === "admin" ? "purple" : "default"} className="text-xl">
                  {current_user?.user?.role_name} User
                </Badge>
              )}
              {current_user?.user?.organization_name && (
                <div>
                  <span className="inline-flex items-center rounded-full bg-gray-100 text-xl text-gray-700">
                    {`${
                      current_user?.user?.role == 1
                        ? "Studio Name"
                        : current_user?.user?.role == 2
                        ? "Lab Name"
                        : "Organization Name"
                    } : ${current_user?.user?.organization_name}`}
                  </span>
                </div>
              )}
            </div>
            {/* contact details */}
            <div className="flex flex-wrap gap-2 text-xl text-gray-600">
              {current_user?.user?.phone && (
                <span className="inline-flex items-center rounded-md bg-gray-100">{current_user?.user?.phone}</span>
              )}
              {current_user?.user?.email && (
                <span className="inline-flex items-center rounded-md bg-gray-100">| {current_user?.user?.email}</span>
              )}
              {current_user?.user?.gender_name && (
                <span className="inline-flex items-center rounded-md bg-gray-100">
                  | {current_user?.user?.gender_name}
                </span>
              )}
              {current_user?.user?.date_of_birth && (
                <span className="inline-flex items-center rounded-md bg-gray-100">
                  | DOB: {convertToDate(current_user?.user?.date_of_birth)}
                </span>
              )}
              {current_user?.user?.created_at && (
                <span className="inline-flex items-center rounded-md bg-gray-100">
                  | Joined: {convertToDate(current_user?.user?.created_at)}
                </span>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div>
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
                              <SelectItem value={0}>Male</SelectItem>
                              <SelectItem value={1}>Female</SelectItem>
                              <SelectItem value={2}>Other</SelectItem>
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
                </div>
                <div className="flex items-center gap-3">
                  <Button type="submit">Save changes</Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </DashboardPageLayout>
  );
};

export default PortfolioIndex;
