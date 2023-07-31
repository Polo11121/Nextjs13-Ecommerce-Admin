"use client";

import { useState } from "react";
import { Store } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/AlertModal";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { ApiAlert } from "@/components/ApiAlert";
import { useOrigin } from "@/hooks/useOrigin";
import axios from "axios";

interface SettingsFormProps {
  initialStore: Store;
}

type SettingsFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
});

export const SettingsForm = ({ initialStore }: SettingsFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const origin = useOrigin();

  const form = useForm<SettingsFormValues>({
    defaultValues: initialStore,
    resolver: zodResolver(formSchema),
  });

  const submitHandler = async (values: SettingsFormValues) => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/stores/${initialStore.id}`, values);

      router.refresh();
      toast.success("Store updated.");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHandler = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/stores/${initialStore.id}`);

      router.refresh();
      router.push("/");
      toast.success("Store deleted.");
    } catch (error) {
      toast.error("Make sure you remove all products and categories first.");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const toggleModalVisibilityHandler = () =>
    setIsOpen((prevState) => !prevState);

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={toggleModalVisibilityHandler}
        isLoading={isLoading}
        onConfirm={deleteHandler}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          disabled={isLoading}
          variant="destructive"
          size="sm"
          onClick={toggleModalVisibilityHandler}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitHandler)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.name?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isLoading || initialStore.name === form.getValues().name}
            className="ml-auto"
            type="submit"
          >
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        description={`${origin}/api/${initialStore.id}`}
        title="NEXT_PUBLIC_API_URL"
        variant="admin"
      />
    </>
  );
};
