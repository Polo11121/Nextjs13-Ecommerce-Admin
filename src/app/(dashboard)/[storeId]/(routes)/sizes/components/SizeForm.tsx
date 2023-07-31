"use client";

import { useState } from "react";
import { Size } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
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
import axios from "axios";

interface SizeFormProps {
  initialSize: Size | null;
}

type SizeFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  value: z.string().nonempty("Value URL is required"),
});

export const SizeForm = ({ initialSize }: SizeFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();

  const title = initialSize ? "Edit Size" : "New Size";
  const toastMessage = initialSize ? "Size updated." : "Size created.";
  const description = initialSize ? "Edit a size" : "Add a new size";
  const buttonText = initialSize ? "Save changes" : "Create size";

  const form = useForm<SizeFormValues>({
    defaultValues: initialSize
      ? initialSize
      : {
          name: "",
          value: "",
        },
    resolver: zodResolver(formSchema),
  });

  const submitHandler = async (values: SizeFormValues) => {
    try {
      setIsLoading(true);

      if (initialSize) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${initialSize.id}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, values);
      }

      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHandler = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/${params.storeId}/sizes/${initialSize?.id}`);

      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success("Size deleted.");
    } catch (error) {
      toast.error("Make sure you remove all products using this size first.");
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
        <Heading title={title} description={description} />
        {initialSize && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="sm"
            onClick={toggleModalVisibilityHandler}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
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
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.name?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Size value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.value?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={
              isLoading ||
              (initialSize?.value === form.getValues().value &&
                initialSize?.name === form.getValues().name)
            }
            className="ml-auto"
            type="submit"
          >
            {buttonText}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
