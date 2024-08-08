import { auth } from "@/lib/auth";
import { verifyUserBasicAuth } from "@/lib/authenticate";
import { db } from "@/lib/db";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const payout = await db.payout.findUnique({
    where: {
      id: params.id,
    },
    include: {
      payment: true,
    },
  });

  const _session = await auth();
  const session = _session ? verifyUserBasicAuth(_session) : null;
  if (!payout)
    return <h1 className="container md:mt-12 mt-6">Payout not found 404 :(</h1>;

  return (
    <div className="container md:mt-12 mt-6">
      <h1 className="md:text-2xl font-bold">Payout </h1>
      <p className="text-sm text-muted-foreground">Check the payout status</p>
      <div className="mt-6 space-y-4">
        <p>
          Amount: $<span>{payout.amount}</span>
        </p>
        <p>
          Winner: <span>{payout.generatedTo}</span>
        </p>
        <p>
          Anounced By: <span>{payout.generatedBy}</span>
        </p>
        <p>
          Status:{" "}
          <span className="capitalize">
            {payout.status.split("_").join(" ").toLowerCase()}
          </span>
        </p>

        {payout.payment && (
          <p className="break-all">
            Signature: <span className="">{payout.payment.signature}</span>
          </p>
        )}
        <p>
          Created At:{" "}
          <span className="capitalize">
            {payout.createdAt.toLocaleDateString()}{" "}
            {payout.createdAt.toLocaleTimeString()}
          </span>
        </p>
        <p>
          Updated At:{" "}
          <span className="capitalize">
            {payout.updatedAt.toLocaleDateString()}{" "}
            {payout.updatedAt.toLocaleTimeString()}
          </span>
        </p>
      </div>
    </div>
  );
};

export default page;
