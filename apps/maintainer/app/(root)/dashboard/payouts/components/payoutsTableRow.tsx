import React from "react";
import { TableCell, TableRow } from "@repo/ui/table";
import { Badge } from "@repo/ui/badge";
import { Payout } from "@repo/db";
import { Button } from "@repo/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown";
import Link from "next/link";
import { toast } from "sonner";
import { moveFailedToUnCollected } from "../_actions";

const PayoutsTableRow = ({ payout }: { payout: Payout }) => {
  return (
    <TableRow key={payout.id}>
      <TableCell>
        <div className="font-medium">
          <Link
            href={`https://github.com/${payout.generatedTo}`}
            target="__blank"
            className="underline hover:text-foreground text-muted-foreground"
          >
            {payout.generatedTo}
          </Link>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Link
          href={`https://github.com/${payout.generatedBy}`}
          target="__blank"
          className="underline hover:text-foreground text-muted-foreground"
        >
          {payout.generatedBy}
        </Link>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge className="text-xs capitalize" variant="secondary">
          {payout.status.toLocaleLowerCase().split("_").join(" ")}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="font-medium">
          {payout.createdAt.toLocaleDateString()}
        </div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          {payout.createdAt.toLocaleTimeString()}
        </div>
      </TableCell>
      <TableCell className="text-left">${payout.amount}</TableCell>
      <TableCell className="text-right">
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
              onClick={async () => {
                const toastId = toast.loading("Making payout uncollected");
                const res = await moveFailedToUnCollected(payout.id);
                if (res.status === 200) {
                  toast.success(res.message, { id: toastId });
                } else {
                  toast.error(res.message, { id: toastId });
                }
              }}
            >
              Make it uncollected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default PayoutsTableRow;
