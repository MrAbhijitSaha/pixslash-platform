"use client";

import { authClient } from "@/lib/auth-client";
import { CommentSchemaType } from "@/lib/type";
import { commentSchema } from "@/lib/zodSchema";
import comment from "@/server/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../../shadcnui/button";
import { Field, FieldError } from "../../shadcnui/field";
import { Input } from "../../shadcnui/input";
import { Spinner } from "../../shadcnui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../shadcnui/tooltip";
type CommentBoxProps = {
  wallpaperId: string;
};

const CommentBox = ({ wallpaperId }: CommentBoxProps) => {
  const { data } = authClient.useSession();
  const { refresh } = useRouter();

  const maxCommentLength = 300;

  const { handleSubmit, control, formState, reset } =
    useForm<CommentSchemaType>({
      resolver: zodResolver(commentSchema),

      defaultValues: {
        commentText: "",
      },

      mode: "onChange",
    });

  // Watch comment field value
  const commentText = useWatch({
    control,
    name: "commentText",
    defaultValue: "",
  });

  const currentLength = commentText.length;
  const remaining = maxCommentLength - currentLength;

  const submitComment = async ({ commentText }: CommentSchemaType) => {
    const { isSuccess, message } = await comment({ wallpaperId, commentText });

    if (!isSuccess) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success(message);
      reset();
      refresh();
    }
  };

  const cancelHandler = () => {
    reset();
  };

  return (
    <form
      className="w-full space-y-3"
      noValidate
      onSubmit={handleSubmit(submitComment)}>
      <Controller
        name="commentText"
        control={control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            className="gap-0">
            <Input
              {...field}
              type="text"
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Add a comment..."
              maxLength={maxCommentLength}
              className="rounded-none border-x-0 border-t-0 bg-transparent! shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:ring-0"
              autoComplete="email"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

            <div
              className={`flex justify-end ${fieldState.invalid ? "mt-0" : "mt-2"}`}>
              <span
                className={`text-xs ${
                  remaining <= 20 ? "text-red-500" : "text-muted-foreground"
                }`}>
                {currentLength}/{maxCommentLength}
              </span>
            </div>
          </Field>
        )}
      />

      {/* When user not authentic  */}
      {!data && formState.isValid && (
        <Tooltip>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={cancelHandler}>
              Cancel
            </Button>

            <TooltipTrigger
              render={<Button variant="default">Comment</Button>}
            />
          </div>
          <TooltipContent>Please Login First</TooltipContent>
        </Tooltip>
      )}

      {/* When user  authentic */}
      {data && formState.isValid && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={cancelHandler}>
            Cancel
          </Button>

          <Button
            variant="default"
            type="submit"
            disabled={formState.isSubmitting}>
            {formState.isSubmitting ?
              <Spinner />
            : "Comment"}
          </Button>
        </div>
      )}
    </form>
  );
};

export default CommentBox;
