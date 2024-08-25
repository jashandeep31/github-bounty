import { Payout } from "@repo/db";
import React from "react";
import { Badge } from "@repo/ui/badge";
import Link from "next/link";
import { TableCell, TableRow } from "@repo/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown";
import { Button } from "@repo/ui/button";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

const ActionMenu = ({ id }: { id: string }) => {
  const router = useRouter();
  const handleResendPayout = async ({ id }: { id: string }) => {
    const toastId = toast.loading("Resending Payout");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/app/process-payout/${id}`
      );
      toast.success("Payout Resent", { id: toastId });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Error Resending Payout", { id: toastId });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            handleResendPayout({ id });
          }}
        >
          Resend Payout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const PayoutTableRow = ({
  payout,
  index,
}: {
  payout: Payout;
  index: number;
}) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{++index}</TableCell>
      <TableCell>
        <Link
          href={payout.link}
          target="__blank"
          className="underline hover:text-foreground text-muted-foreground duration-300"
        >
          {payout.link}
        </Link>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-right">
        <Badge className="text-xs capitalize" variant="secondary">
          {payout.status.toLocaleLowerCase().split("_").join(" ")}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Link
          href={`https://github.com/${payout.generatedBy}`}
          target="__blank"
          className="underline hover:text-foreground text-muted-foreground duration-300"
        >
          {payout.generatedBy}
        </Link>
      </TableCell>
      <TableCell className="text-right">
        <div className="font-medium">
          {payout.createdAt.toLocaleDateString()}
        </div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          {payout.createdAt.toLocaleTimeString()}
        </div>
      </TableCell>
      <TableCell className="text-right">${payout.amount}</TableCell>
      <TableCell className="text-right">
        <ActionMenu id={payout.id} />
      </TableCell>
    </TableRow>
  );
};

export default PayoutTableRow;
