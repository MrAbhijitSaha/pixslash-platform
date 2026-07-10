"use client";

import { authClient } from "@/lib/auth-client";
import accountDelete from "@/server/profile/actions/accountDelete";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../shadcnui/button";
import { CardDescription, CardTitle } from "../shadcnui/card";
import { Dialog, DialogContent, DialogTrigger } from "../shadcnui/dialog";
import { Spinner } from "../shadcnui/spinner";

const DeleteAcount = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const { isSuccess, message } = await accountDelete();

    if (!isSuccess) {
      toast.error(message);
    } else {
      toast.success(message);
      await authClient.signOut();
      window.location.reload();
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive">
            <Trash2Icon />
            Delete Account
          </Button>
        }
      />

      <DialogContent>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          This action cannot be undone. All your data including wallpapers,
          collections, and likes will be permanently deleted.
        </CardDescription>

        <div className="flex items-center justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}>
            {loading ?
              <>
                <Spinner /> Deleting...
              </>
            : "Delete my account"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAcount;
