import React from "react";
import ReposTable from "./components/ReposTable";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getUserRespos(id: string) {
  return await db.repo.findMany({
    where: {
      organizationId: id,
    },
  });
}

const Page = async () => {
  const session = await auth();
  if (!session?.user || !session.organization) {
    redirect("/login");
  }
  return (
    <div className="container md:mt-12 mt-6">
      <div className="mt-6">
        <h1 className="text-lg font-medium">Your Public Repo&apos;s</h1>
        <p className="text-sm text-muted-foreground">
          Click the install button to add GitSolApp to your repository and start
          dispensing bounties directly from your repo.
        </p>
        <ReposTable
          userRepos={await getUserRespos(session.organization.id)}
          session={session}
        />
      </div>
    </div>
  );
};

export default Page;
