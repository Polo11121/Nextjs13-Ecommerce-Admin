"use client";

import { useState } from "react";
import { Billboard } from "@prisma/client";
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
import { ImageUploader } from "@/components/ui/ImageUploader";
import axios from "axios";

interface BillboardFormProps {
  initialBillboard: Billboard | null;
}

type BillboardFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  label: z.string().nonempty("Label is required"),
  imageUrl: z.string().nonempty("Image URL is required"),
});

export const BillboardForm = ({ initialBillboard }: BillboardFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();

  const title = initialBillboard ? "Edit Billboard" : "New Billboard";
  const toastMessage = initialBillboard
    ? "Billboard updated."
    : "Billboard created.";
  const description = initialBillboard
    ? "Edit a billboard"
    : "Add a new billboard";
  const buttonText = initialBillboard ? "Save changes" : "Create billboard";

  const form = useForm<BillboardFormValues>({
    defaultValues: initialBillboard
      ? {
          label: initialBillboard.label,
          imageUrl: initialBillboard.imageUrl,
        }
      : {
          label: "",
          imageUrl: "",
        },
    resolver: zodResolver(formSchema),
  });

  const submitHandler = async (values: BillboardFormValues) => {
    try {
      setIsLoading(true);

      if (initialBillboard) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${initialBillboard.id}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, values);
      }

      router.refresh();
      router.push(`/${params.storeId}/billboards`);
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

      await axios.delete(
        `/api/${params.storeId}/billboards/${initialBillboard?.id}`
      );

      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard deleted.");
    } catch (error) {
      toast.error(
        "Make sure you remove all categories using this billboard first."
      );
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
        {initialBillboard && (
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUploader
                    value={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.imageUrl?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.label?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={
              isLoading || initialBillboard?.label === form.getValues().label
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
