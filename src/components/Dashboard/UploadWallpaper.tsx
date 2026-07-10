"use client";

import { WallpaperUploadSchemaType } from "@/lib/type";
import { wallpaperUploadSchema } from "@/lib/zodSchema";
import wallpaperUploadAction from "@/server/wallpaperUploadAction";
import { Category, Tag } from "@generated/prisma/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderIcon, ImagePlusIcon, ShieldCheckIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useFilePicker } from "use-file-picker";
import { Button } from "../shadcnui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../shadcnui/card";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "../shadcnui/combobox";
import { Field, FieldError, FieldLabel } from "../shadcnui/field";
import { Input } from "../shadcnui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../shadcnui/select";
import { Spinner } from "../shadcnui/spinner";
import { Textarea } from "../shadcnui/textarea";

type UploadWallpaperType = {
  categoryInfo: Category[];
  tagInfo: Tag[];
};

const UploadWallpaper = ({ categoryInfo, tagInfo }: UploadWallpaperType) => {
  // states
  const [isFile, setFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refresh } = useRouter();
  //   form initilization
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isDirty, dirtyFields },
    reset,
  } = useForm({
    resolver: zodResolver(wallpaperUploadSchema),

    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: [],
    },

    mode: "onChange",
  });

  const requiredFieldsDirty = dirtyFields.title && dirtyFields.category;

  //   file picker initilization
  const { openFilePicker, filesContent, plainFiles, clear } = useFilePicker({
    multiple: false,
    accept: "image/*",
    readAs: "DataURL",
    onFilesSelected: () => setFile(true),
    onClear: () => setFile(false),
  });

  // submit function
  const submitWallpaper = async ({
    title,
    description,
    category,
    tags,
  }: WallpaperUploadSchemaType) => {
    if (plainFiles.length === 0) {
      return toast.error("Please select an image to upload.");
    }

    const formData = new FormData();

    // Image
    formData.append("image", plainFiles[0]);

    // Other fields
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", JSON.stringify(tags));

    const { isSuccess, message } = await wallpaperUploadAction(formData);

    if (!isSuccess) {
      toast.error(message);
    } else {
      toast.success(message);
      reset();
      clear();
      refresh();
    }
  };

  // cancel function
  const cancelHandler = () => {
    setLoading(true);
    reset();
    clear();
    setLoading(false);
  };

  // combox anchor variable
  const anchor = useComboboxAnchor();

  return (
    <Card className="w-auto max-w-200 gap-2 md:w-140 lg:w-full">
      <CardHeader>
        <CardTitle className="text-3xl">Upload To Pixslash</CardTitle>
        <CardDescription>
          Share Your Creativity with the community
        </CardDescription>
      </CardHeader>

      {/* starc form  */}
      <form
        onSubmit={handleSubmit(submitWallpaper)}
        className="grid grid-cols-1 gap-3"
        noValidate>
        <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* choose Image  */}
          <section className="grid place-items-center rounded-md">
            {!isFile && (
              <div
                onClick={openFilePicker}
                className="border-muted-foreground/30 bg-muted/20 hover:border-primary hover:bg-muted/40 flex h-72 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors">
                <div className="bg-primary/10 rounded-full p-4">
                  <ImagePlusIcon className="text-primary size-10" />
                </div>

                <h3 className="text-lg font-semibold">Upload Wallpaper</h3>

                <p className="text-muted-foreground text-center text-sm">
                  Click to browse your image
                </p>

                <Button
                  variant="default"
                  type="button">
                  <FolderIcon /> Choose Image
                </Button>

                <p className="text-muted-foreground text-center text-xs">
                  PNG, JPG, JPEG, WEBP <br /> Max size 10mb Recommended: 4k
                  reolution
                </p>
              </div>
            )}

            {/* Selected image preview */}
            {filesContent.map((file, index) => (
              <div
                className="border-muted-foreground/30 bg-muted/20 hover:border-primary hover:bg-muted/40 flex h-72 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors"
                key={index}>
                <Image
                  src={file.content}
                  alt={file.name}
                  height={450}
                  width={450}
                  onClick={openFilePicker}
                  className="mx-auto h-60 w-full cursor-pointer rounded-md object-contain"
                />
              </div>
            ))}
          </section>

          {/* form fill section  */}
          <div className="grid grid-cols-1 gap-2">
            {/*  Wallpaper Title  */}
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Title <span className="text-red-400">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter wallpaper title"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/*  Wallpaper description  */}
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Describe your wallpaper..."
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/*  Wallpaper Category  */}
            <Controller
              name="category"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Category <span className="text-red-400">*</span>
                  </FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}>
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      className="min-w-30">
                      <span data-slot="select-value">
                        {categoryInfo.find((cat) => cat.id === field.value)
                          ?.categoryName || "Select a category"}
                      </span>
                    </SelectTrigger>

                    <SelectContent>
                      {categoryInfo.length === 0 ?
                        <SelectItem
                          value=""
                          disabled>
                          No categories available
                        </SelectItem>
                      : categoryInfo.map((item) => (
                          <SelectItem
                            key={item.id}
                            value={item.id}>
                            {item.categoryName}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/*  Wallpaper tags  */}
            <Controller
              name="tags"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tags</FieldLabel>

                    <Combobox
                      multiple
                      autoHighlight
                      items={tagInfo}
                      value={field.value}
                      onValueChange={field.onChange}>
                      <ComboboxChips
                        ref={anchor}
                        className="w-full">
                        <ComboboxValue>
                          {(values: string[]) => (
                            <>
                              {values.map((id) => {
                                const tag = tagInfo.find((t) => t.id === id);

                                return (
                                  <ComboboxChip key={id}>
                                    {tag?.title}
                                  </ComboboxChip>
                                );
                              })}

                              <ComboboxChipsInput placeholder="Add tags(e.g. 4k, landscape, minimal)." />
                            </>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>

                      <ComboboxContent
                        anchor={anchor}
                        side="bottom"
                        className="absolute">
                        <ComboboxEmpty>No tags found.</ComboboxEmpty>

                        <ComboboxList>
                          {(tag) => (
                            <ComboboxItem
                              key={tag.id}
                              value={tag.id}>
                              {tag.title}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          {/* trust text section  */}
          <div className="flex items-center gap-2">
            <ShieldCheckIcon />
            By uploading, you accept our Terms of Service.
          </div>

          {/* button section  */}
          <div className="grid w-full gap-2 lg:w-auto lg:grid-cols-2">
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={cancelHandler}
              disabled={(!isFile && !isDirty) || loading}>
              {loading ?
                <>
                  <Spinner /> Caneling ...
                </>
              : <>Cancel</>}
            </Button>

            <Button
              type="submit"
              className="w-full"
              disabled={!requiredFieldsDirty || !isFile || isSubmitting}>
              {isSubmitting ?
                <>
                  <Spinner /> Uploading ...
                </>
              : <>Upload</>}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UploadWallpaper;
