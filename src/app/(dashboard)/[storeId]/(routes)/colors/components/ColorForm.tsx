"use client";

import { useState } from "react";
import { Color } from "@prisma/client";
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

interface ColorFormProps {
  initialColor: Color | null;
}

type ColorFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  value: z
    .string()
    .nonempty("Value URL is required")
    .regex(/^#[0-9A-F]{6}$/, {
      message: "Value must be a valid hex color",
    }),
});

export const ColorForm = ({ initialColor }: ColorFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();

  const title = initialColor ? "Edit Color" : "New Color";
  const toastMessage = initialColor ? "Color updated." : "Color created.";
  const description = initialColor ? "Edit a color" : "Add a new color";
  const buttonText = initialColor ? "Save changes" : "Create color";

  const form = useForm<ColorFormValues>({
    defaultValues: initialColor
      ? {
          name: initialColor.name,
          value: initialColor.value,
        }
      : {
          name: "",
          value: "",
        },
    resolver: zodResolver(formSchema),
  });

  const submitHandler = async (values: ColorFormValues) => {
    try {
      setIsLoading(true);

      if (initialColor) {
        await axios.patch(
          `/api/${params.storeId}/colors/${initialColor.id}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, values);
      }

      router.refresh();
      router.push(`/${params.storeId}/colors`);
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

      await axios.delete(`/api/${params.storeId}/colors/${initialColor?.id}`);

      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success("Color deleted.");
    } catch (error) {
      toast.error("Make sure you remove all products using this color first.");
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
        {initialColor && (
          <Button
            disabled={isLoading}
            variant="destructive"
            color="sm"
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
                      placeholder="Color name"
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
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={isLoading}
                        placeholder="Color value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{
                          backgroundColor: form.getValues().value,
                        }}
                      />
                    </div>
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
              (initialColor?.value === form.getValues().value &&
                initialColor?.name === form.getValues().name)
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
