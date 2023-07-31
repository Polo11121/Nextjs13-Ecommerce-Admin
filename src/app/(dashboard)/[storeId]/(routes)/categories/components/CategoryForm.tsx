"use client";

import { useState } from "react";
import { Billboard, Category } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import axios from "axios";

interface CategoryFormProps {
  initialCategory: Category | null;
  billboards: Billboard[];
}

type CategoryFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  billboardId: z.string().nonempty("Billboard Id is required"),
});

export const CategoryForm = ({
  initialCategory,
  billboards,
}: CategoryFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();

  const title = initialCategory ? "Edit Category" : "New Category";
  const toastMessage = initialCategory
    ? "Category updated."
    : "Category created.";
  const description = initialCategory
    ? "Edit a category"
    : "Add a new category";
  const buttonText = initialCategory ? "Save changes" : "Create category";

  const form = useForm<CategoryFormValues>({
    defaultValues: initialCategory
      ? {
          name: initialCategory.name,
          billboardId: initialCategory.billboardId,
        }
      : {
          name: "",
          billboardId: "",
        },
    resolver: zodResolver(formSchema),
  });

  const submitHandler = async (values: CategoryFormValues) => {
    try {
      setIsLoading(true);

      if (initialCategory) {
        await axios.patch(
          `/api/${params.storeId}/categories/${initialCategory.id}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, values);
      }

      router.refresh();
      router.push(`/${params.storeId}/categories`);
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
        `/api/${params.storeId}/categories/${initialCategory?.id}`
      );

      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Category deleted.");
    } catch (error) {
      toast.error(
        "Make sure you remove all products using this category first."
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
        {initialCategory && (
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
                      placeholder="Category name"
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
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map(({ id, label }) => (
                        <SelectItem key={id} value={id}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={
              isLoading ||
              (initialCategory?.name === form.getValues().name &&
                initialCategory?.billboardId === form.getValues().billboardId)
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
