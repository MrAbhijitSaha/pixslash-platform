import AddImage from "@/components/Profile/AddImage";
import AddProfileInformation from "@/components/Profile/AddProfileInformation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { Separator } from "@/components/shadcnui/separator";
import prisma from "@/lib/database/dbClient";
import getUserProfile from "@/server/profile/getUserProfile";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { userId } = await params;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      name: true,
      bio: true,
    },
  });

  if (!user) {
    notFound();
  }

  return {
    title: `Profile | ${user.name} `,
    description:
      user.bio ??
      `Explore ${user.name}'s profile on PixSlash. Discover high-quality wallpapers, uploads, collections, and creative contributions.`,
  };
};

const Page = async ({ params }: PageProps) => {
  const { userId } = await params;

  const userInfo = await getUserProfile({ userId });

  if (!userInfo) {
    return notFound();
  }

  return (
    <section className="grid place-items-center px-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Heading of  the page  */}
        <Card className="gap-0 bg-transparent py-0 pt-4 ring-0">
          <CardTitle className="text-3xl font-bold">Profile</CardTitle>
          <CardDescription className="md:text-[16px]">
            Manage your profile information and account settings.
          </CardDescription>
        </Card>

        <Separator />

        <AddImage info={userInfo} />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Profile Information
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="mb-4">
              <CardTitle>Email</CardTitle>
              <CardDescription>{userInfo.email}</CardDescription>
            </div>

            <AddProfileInformation info={userInfo} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Page;
