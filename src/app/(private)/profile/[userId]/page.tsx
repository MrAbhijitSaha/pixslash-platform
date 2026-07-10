import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    userId: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { userId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.id !== userId) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      email: true,
      image: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <section className="grid h-dvh place-items-center">
      <div>
        <h1 className="text-3xl font-bold">{user.name}</h1>
        <p>{user.email}</p>
      </div>
    </section>
  );
};

export default Page;
