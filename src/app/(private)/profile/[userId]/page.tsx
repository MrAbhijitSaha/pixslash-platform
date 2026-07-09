import AddImage from "@/components/Profile/AddImage";
import { Card, CardDescription, CardTitle } from "@/components/shadcnui/card";
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
      Bio: true,
    },
  });

  if (!user) {
    notFound();
  }

  return {
    title: `Profile | ${user.name} `,
    description: user.Bio,
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
      <div className="w-full max-w-2xl space-y-4">
        {/* Heading of  the page  */}
        <Card className="gap-0 bg-transparent py-0 pt-4 ring-0">
          <CardTitle className="text-3xl font-bold">Profile</CardTitle>
          <CardDescription className="md:text-[16px]">
            Manage your profile information and account settings.
          </CardDescription>
        </Card>

        <Separator />

        <AddImage info={userInfo} />
      </div>
    </section>
  );
};

export default Page;
