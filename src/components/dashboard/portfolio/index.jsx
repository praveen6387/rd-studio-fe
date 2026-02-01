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
import { Progress } from "@/components/ui/progress";
import { Instagram as InstagramIcon, Facebook, Twitter, Linkedin, Youtube, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import EditSocialLinks from "./_builder/EditSocialLinks";

const PortfolioIndex = ({ current_user }) => {
  console.log(current_user);
  const { toast } = useToast();
  const initials =
    (
      ((current_user?.user?.first_name || "").trim()[0] || "") +
      ((current_user?.user?.last_name || "").trim()[0] || "")
    ).toUpperCase() || (current_user?.user?.email || "?")[0].toUpperCase();

  const [isEditing, setIsEditing] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  const [socialLinks, setSocialLinks] = useState({
    social_whatsapp: current_user?.user?.social_whatsapp || "",
    social_facebook: current_user?.user?.social_facebook || "",
    social_twitter: current_user?.user?.social_twitter || "",
    social_linkedin: current_user?.user?.social_linkedin || "",
    social_instagram: current_user?.user?.social_instagram || "",
    social_youtube: current_user?.user?.social_youtube || "",
  });

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
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="rounded-full w-60 h-60">
                  <AvatarImage
                    src={current_user?.user?.profile_image || undefined}
                    alt={current_user?.user?.first_name || "User avatar"}
                  />
                  <AvatarFallback className="flex h-full w-full items-center justify-center font-semibold bg-gray-200 text-gray-600 text-3xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  {current_user?.user?.role_name && (
                    <Badge variant={current_user?.user?.role_name === "admin" ? "purple" : "default"}>
                      {current_user?.user?.role_name}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 p-3 rounded-md border border-gray-200 bg-gray-50">
                  <div className="text-sm text-gray-500">Full Name</div>
                  <div className="col-span-2 font-medium text-gray-900">
                    {current_user?.user?.first_name} {current_user?.user?.last_name}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 p-3 rounded-md border border-gray-200 bg-gray-50">
                  <div className="text-sm text-gray-500">
                    {current_user?.user?.role == 2
                      ? "Lab Name"
                      : current_user?.user?.role == 1
                      ? "Studio Name"
                      : "Organization Name"}
                  </div>
                  <div className="col-span-2 font-medium text-gray-900">
                    {current_user?.user?.organization_name || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 p-3 rounded-md border border-gray-200 bg-gray-50">
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="col-span-2 font-medium text-gray-900">{current_user?.user?.email || "-"}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 p-3 rounded-md border border-gray-200 bg-gray-50">
                  <div className="text-sm text-gray-500">Mobile</div>
                  <div className="col-span-2 font-medium text-gray-900">{current_user?.user?.phone || "-"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social link  */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                {(() => {
                  const iconClasses = "w-4 h-4 text-white";
                  const items = [
                    {
                      name: "WhatsApp",
                      value: socialLinks.social_whatsapp,
                      icon: <MessageCircle className={iconClasses} />,
                      bg: "bg-gradient-to-br from-green-500 to-emerald-600",
                    },
                    {
                      name: "Facebook",
                      value: socialLinks.social_facebook,
                      icon: <Facebook className={iconClasses} />,
                      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
                    },
                    {
                      name: "Twitter",
                      value: socialLinks.social_twitter,
                      icon: <Twitter className={iconClasses} />,
                      bg: "bg-gradient-to-br from-sky-400 to-sky-500",
                    },
                    {
                      name: "LinkedIn",
                      value: socialLinks.social_linkedin,
                      icon: <Linkedin className={iconClasses} />,
                      bg: "bg-gradient-to-br from-sky-600 to-blue-700",
                    },
                    {
                      name: "Instagram",
                      value: socialLinks.social_instagram,
                      icon: <InstagramIcon className={iconClasses} />,
                      bg: "bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500",
                    },
                    {
                      name: "YouTube",
                      value: socialLinks.social_youtube,
                      icon: <Youtube className={iconClasses} />,
                      bg: "bg-gradient-to-br from-red-500 to-rose-600",
                    },
                  ];
                  return items.map((item, idx) => {
                    const row = (
                      <div key={item.name} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.bg} shadow-md ring-1 ring-white/20 transition-transform duration-200 hover:scale-105`}
                          >
                            {item.icon}
                          </div>
                          <div className="text-sm text-gray-700 font-medium">{item.name}</div>
                        </div>
                        <div className={`text-xs font-semibold ${item.value ? "text-emerald-600" : "text-rose-500"}`}>
                          {item.value ? "Set" : "Not Set"}
                        </div>
                      </div>
                    );
                    return (
                      <div key={item.name} className={idx < items.length - 1 ? "border-b border-gray-200" : ""}>
                        {row}
                      </div>
                    );
                  });
                })()}
              </div>
              <div className="pt-4">
                <Button
                  size="sm"
                  className="bg-blue-500 text-white hover:bg-blue-400"
                  style={{ color: "#ffffff", textShadow: "0 0 6px rgba(255,255,255,0.6)" }}
                  onClick={() => setIsSocialModalOpen(true)}
                >
                  Edit Social Links
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 border border-gray-200 shadow-sm rounded-2xl">
            {(() => {
              const transactions = current_user?.user?.user_payment_transactions || [];
              const approved = [...transactions].filter((t) => t.transaction_status === 1);
              approved.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
              const latest = approved[0];
              const trialDaysTotal = 7;
              const operationsTotal = 3;
              const activeFrom = latest?.transaction_active_from_date
                ? new Date(latest.transaction_active_from_date)
                : null;
              const now = new Date();
              const daysPassed = activeFrom
                ? Math.min(trialDaysTotal, Math.max(0, Math.ceil((now - activeFrom) / (1000 * 60 * 60 * 24))))
                : 0;
              const isActive = activeFrom ? daysPassed < trialDaysTotal : false;
              const expireOn = activeFrom
                ? new Date(activeFrom.getTime() + trialDaysTotal * 24 * 60 * 60 * 1000)
                : null;
              const usedOps = latest?.operation_count ?? 0;
              const creditsLeft = Math.max(0, operationsTotal - usedOps);
              const remainingDays = activeFrom ? Math.max(0, trialDaysTotal - daysPassed) : 0;
              const pad2 = (n) =>
                String(n || 0)
                  .toString()
                  .padStart(2, "0");

              return (
                <>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Plan Details</CardTitle>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-500 text-white"
                      }`}
                    >
                      {isActive ? "Active" : "Expired"}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                        <div className="text-gray-500 font-medium">Active Plan</div>
                        <div className="text-gray-900 font-semibold">{latest ? "Recharge" : "-"}</div>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                        <div className="text-gray-500 font-medium">Credits Left</div>
                        <div className="text-gray-900 font-semibold">{creditsLeft} Credits</div>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                        <div className="text-gray-500 font-medium">Days Passed</div>
                        <div className="text-gray-900 font-semibold">{pad2(daysPassed)}</div>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="text-gray-500 font-medium">Expiry On</div>
                        <div className="text-gray-900 font-semibold">{expireOn ? pad2(remainingDays) : "00"}</div>
                      </div>
                    </div>
                    <div className="pt-6 flex justify-center">
                      <Button
                        className="rounded-full bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 px-8 py-3 shadow-lg"
                        style={{ color: "#ffffff", textShadow: "0 0 6px rgba(255,255,255,0.6)" }}
                      >
                        Recharge Now
                      </Button>
                    </div>
                  </CardContent>
                </>
              );
            })()}
          </Card>
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
        {isSocialModalOpen && (
          <EditSocialLinks
            open={isSocialModalOpen}
            initialLinks={socialLinks}
            onClose={() => setIsSocialModalOpen(false)}
            onSave={(values) => {
              setSocialLinks((prev) => ({ ...prev, ...values }));
              // TODO: call API to persist social links server-side if available
            }}
          />
        )}
      </div>
    </DashboardPageLayout>
  );
};

export default PortfolioIndex;
