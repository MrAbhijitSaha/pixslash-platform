"use client";

import { ProfileInformationSchemaType } from "@/lib/type";
import { profileInformationSchema } from "@/lib/zodSchema";
import upadteProfileDetails from "@/server/profile/actions/upadteProfileDetails";
import { UserGetPayload } from "@generated/prisma/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../shadcnui/button";
import { Field, FieldError, FieldLabel } from "../shadcnui/field";
import { Input } from "../shadcnui/input";
import { Spinner } from "../shadcnui/spinner";
import { Textarea } from "../shadcnui/textarea";

type AddProfileInformationProps = {
  info: UserGetPayload<{
    select: {
      id: true;
      bio: true;
      image: true;
      name: true;
      mobileNumber: true;
      email: true;
    };
  }>;
};

const AddProfileInformation = ({ info }: AddProfileInformationProps) => {
  const maxBioLength = 100;

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileInformationSchema),
    defaultValues: {
      name: info.name,
      bio: info.bio ?? "",
      mobileNumber: info.mobileNumber ?? "",
    },
    mode: "onChange",
  });

  // Watch comment field value
  const bioText = useWatch({
    control,
    name: "bio",
    defaultValue: info.bio ?? "",
  });

  const currentLength = (bioText ?? "").length;
  const remaining = maxBioLength - currentLength;

  const submitProfileInformation = async (
    sData: ProfileInformationSchemaType,
  ) => {
    const formData = new FormData();

    formData.append("name", sData.name);
    formData.append("bio", sData.bio ?? "");
    formData.append("mobileNumber", sData.mobileNumber ?? "");

    const { isSuccess, message } = await upadteProfileDetails(formData);

    if (!isSuccess) {
      toast.error(message);
    } else {
      toast.success(message);
      reset();
      window.location.reload();
    }
  };
  return (
    <form
      className="space-y-4 text-right"
      onSubmit={handleSubmit(submitProfileInformation)}
      noValidate>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
            <Input
              {...field}
              type="text"
              id={field.name}
              aria-invalid={fieldState.invalid}
              autoComplete="name"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="mobileNumber"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="tel"
              aria-invalid={fieldState.invalid}
              autoComplete="tel"
              placeholder="Phone number"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="bio"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              placeholder="Add your bio"
              className="pb-14"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

            <div
              className={`flex justify-end ${fieldState.invalid ? "mt-0" : "mt-2"}`}>
              <span
                className={`text-xs ${
                  remaining <= 20 ? "text-red-500" : "text-muted-foreground"
                }`}>
                {currentLength}/{maxBioLength}
              </span>
            </div>
          </Field>
        )}
      />

      <Button
        type="submit"
        disabled={isSubmitting || !isDirty}>
        {isSubmitting ?
          <>
            <Spinner /> Save changes...
          </>
        : <>Save changes</>}
      </Button>
    </form>
  );
};

export default AddProfileInformation;
