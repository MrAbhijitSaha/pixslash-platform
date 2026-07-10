"use client";

import { authClient } from "@/lib/auth-client";
import { ChangePasswordSchemaType } from "@/lib/type";
import { changePasswordSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../shadcnui/button";
import { Field, FieldError, FieldLabel } from "../shadcnui/field";
import { Input } from "../shadcnui/input";
import { Spinner } from "../shadcnui/spinner";

const ChangePassword = () => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, dirtyFields },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const allFieldsDirty =
    dirtyFields.currentPassword &&
    dirtyFields.newPassword &&
    dirtyFields.confirmPassword;

  const submitPassword = async ({
    currentPassword,
    newPassword,
  }: ChangePasswordSchemaType) => {
    try {
      const { error } = await authClient.changePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message ?? "Failed to change password");
      } else {
        toast.success("Password changed successfully");
        reset();
      }
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";

      toast.error(message);
      console.error("Change password error:", error);
    }
  };

  return (
    <form
      className="space-y-3 text-right"
      onSubmit={handleSubmit(submitPassword)}
      noValidate>
      <Controller
        name="currentPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
            <Input
              {...field}
              type="password"
              id={field.name}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              placeholder="Type your current password"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="newPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
            <Input
              {...field}
              type="password"
              id={field.name}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              placeholder="Type your new password"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
            <Input
              {...field}
              type="password"
              id={field.name}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              placeholder="Type your confirm password"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button
        type="submit"
        disabled={isSubmitting || !allFieldsDirty}>
        {isSubmitting ?
          <>
            <Spinner /> Save changes...
          </>
        : "Save Password"}
      </Button>
    </form>
  );
};

export default ChangePassword;
