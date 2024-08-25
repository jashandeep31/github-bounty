"use client";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { updateAllowedDispancers } from "./_actions";
const Page = () => {
  const session = useSession();
  const [allowedDispancers, setAllowedDispancers] = useState<string[]>([]);
  const [submissionState, setSubmissionState] = useState("idle");

  const ref = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (session.status === "authenticated") {
      setAllowedDispancers(session.data.organization.allowedDispancers);
    }
  }, [session]);

  return (
    <div>
      <h1 className="md:text-3xl text-lg font-bold">Manage Access</h1>
      {session.status === "loading" ? (
        <div className="my-3">Loading...</div>
      ) : null}

      {session.status === "unauthenticated" ? (
        <div className="my-3">Please login to view this page</div>
      ) : null}

      {session.status === "authenticated" ? (
        <div className="mt-6">
          <h3 className="text-sm font-medium ">Allowed Dispancers</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {allowedDispancers.map((dispencer, index) => (
              <p className="bg-muted p-2  flex itmes-center gap-1" key={index}>
                <span>{dispencer}</span>
                <button
                  onClick={() => {
                    dispencer === session.data.user.username
                      ? toast.error("You can't remove yourself")
                      : setAllowedDispancers(
                          allowedDispancers.filter((item) => item !== dispencer)
                        );
                  }}
                >
                  <X size={16} />
                </button>
              </p>
            ))}
          </div>
          <div className="mt-6 p-2">
            <label className="text-sm block font-medium ">
              Add New Dispancer
            </label>
            <div className="flex gap-2 ">
              <Input ref={ref} className="mt-1 inline-block" />
              <Button
                onClick={() => {
                  setAllowedDispancers((prev) => {
                    if (ref.current?.value) {
                      return [...prev, ref.current?.value].filter(
                        (item, index) => {
                          return (
                            [...prev, ref.current?.value].indexOf(item) ===
                            index
                          );
                        }
                      );
                    }
                    return prev;
                  });
                }}
                variant={"secondary"}
              >
                Add User
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Please only enter the github username. ex: jashandeep31
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              disabled={submissionState === "submitting"}
              onClick={async () => {
                const id = toast.loading("Saving Changes");
                try {
                  setSubmissionState("submitting");
                  const res = await updateAllowedDispancers(allowedDispancers);
                  session.update({ ...session.data });
                  toast.success("success", { id });
                } catch (error) {
                  toast.error("Something wrong", { id });
                } finally {
                  setSubmissionState("idle");
                }
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Page;
