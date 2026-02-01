"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { updateSocialLinks } from "@/lib/api/client/auth/urls";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const EditSocialLinks = ({ open = true, initialLinks = {}, onClose = () => {}, onSave = () => {} }) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      social_whatsapp: initialLinks.social_whatsapp || "",
      social_facebook: initialLinks.social_facebook || "",
      social_twitter: initialLinks.social_twitter || "",
      social_linkedin: initialLinks.social_linkedin || "",
      social_instagram: initialLinks.social_instagram || "",
      social_youtube: initialLinks.social_youtube || "",
    },
  });

  const handleSave = async (values) => {
    try {
      setIsLoading(true);
      const payload = {
        ...values,
      };
      console.log(payload);
      await updateSocialLinks(payload);
      onSave(values);
      toast.success("Social links updated successfully", {
        duration: 3000,
        position: "bottom-right",
      });
      onClose();
    } catch (err) {
      toast.error("Failed to save social links", {
        duration: 3000,
        position: "bottom-right",
      });
    } finally {
      console.log("updated");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => (val ? undefined : onClose())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Social Links</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="social_whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890 or WhatsApp link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/yourpage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input placeholder="https://twitter.com/handle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/your-profile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input placeholder="https://instagram.com/yourprofile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_youtube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/channel/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <div className="flex gap-2">
                <Button type="submit">
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button variant="outline" onClick={() => onClose()}>
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSocialLinks;
