"use client";

import deleteComment from "@/server/deleteComment";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../shadcnui/button";
import { Spinner } from "../../shadcnui/spinner";

type DeleteCommentButtonProps = {
  commentId: string;
};

const DeleteCommentButton = ({ commentId }: DeleteCommentButtonProps) => {
  const { refresh } = useRouter();
  const [loading, setLoading] = useState(false);
  const deleteCommentHandler = async () => {
    setLoading(true);

    try {
      const { isSuccess, message } = await deleteComment(commentId);

      if (!isSuccess) {
        toast.error(message);
        return;
      }

      toast.success(message);
      refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="destructive"
      className="w-full"
      disabled={loading}
      onClick={deleteCommentHandler}>
      {loading ?
        <>
          <Spinner />
          Deleting...
        </>
      : <>
          <Trash2Icon />
          Delete
        </>
      }
    </Button>
  );
};

export default DeleteCommentButton;
