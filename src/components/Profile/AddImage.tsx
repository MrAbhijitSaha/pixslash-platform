"use client";

import uploadProfilePicture from "@/server/profile/actions/uploadProfilePicture";
import { UserGetPayload } from "@generated/prisma/models";
import { CameraIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { useFilePicker } from "use-file-picker";
import UserAvatar from "../Dashboard/UserAvatar";
import { Button } from "../shadcnui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../shadcnui/card";
import { Spinner } from "../shadcnui/spinner";

type AddImageProps = {
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

const AddImage = ({ info }: AddImageProps) => {
  // states
  const [isFile, setFile] = useState(false);
  const [loading, setLoading] = useState(false);

  //   file picker initilization
  const { openFilePicker, filesContent, plainFiles, clear } = useFilePicker({
    multiple: false,
    accept: "image/*",
    readAs: "DataURL",
    onFilesSelected: () => setFile(true),
    onClear: () => setFile(false),
  });

  const imageHandler = async () => {
    setLoading(true);
    const { isSuccess, message } = await uploadProfilePicture(plainFiles[0]);

    if (!isSuccess) {
      toast.error(message);
    } else {
      toast.success(message);
      clear();
      window.location.reload();
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        {!isFile ?
          <UserAvatar
            name={info.name}
            image={info.image}
            size="lg"
          />
        : <>
            {filesContent.map((file, index) => (
              <Image
                key={index}
                src={file.content}
                alt={file.name}
                height={450}
                width={450}
                onClick={openFilePicker}
                className="h-10 w-10 cursor-pointer rounded-full object-cover"
              />
            ))}
          </>
        }

        <div className="">
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>JPEG, PNG, WebP Max 5MB.</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex items-center gap-4">
        <Button
          onClick={() => openFilePicker()}
          variant="outline">
          <CameraIcon /> {!isFile ? "Change Image" : "Choose Different"}
        </Button>

        {isFile && (
          <Button
            onClick={imageHandler}
            disabled={loading}
            variant="default">
            {loading ?
              <Spinner />
            : <>Save Photo</>}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AddImage;
