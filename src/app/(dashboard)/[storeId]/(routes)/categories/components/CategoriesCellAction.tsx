"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/AlertModal";
import axios from "axios";

interface CategoriesCellActionProps {
  data: CategoriesColumn;
}

export const CategoriesCellAction = ({ data }: CategoriesCellActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const toggleModalVisibilityHandler = () => setIsOpen((prev) => !prev);

  const copyHandler = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("Category Id copied to clipboard.");
  };
  const updateHandler = () =>
    router.push(`/${params.storeId}/categories/${data.id}`);

  const deleteHandler = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
      toast.success("Category deleted.");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={toggleModalVisibilityHandler}
        isLoading={isLoading}
        onConfirm={deleteHandler}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={copyHandler}>
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={updateHandler}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleModalVisibilityHandler}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
