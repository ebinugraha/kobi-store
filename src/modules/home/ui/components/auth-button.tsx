import { Button } from "@/components/ui/button";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserButton } from "./user-button";

export const AuthButton = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      {session ? (
        <UserButton />
      ) : (
        <div className="flex items-center gap-2">
          <Button size={"sm"} variant={"ghost"} className="text-sm">
            Register
          </Button>
          |
          <Button size={"sm"} variant={"secondary"} className="text-sm">
            Login
          </Button>
        </div>
      )}
    </>
  );
};
