import { Button } from "@/components/ui/button";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserButton } from "./user-button";
import { LogIn } from "lucide-react";
import Link from "next/link";

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
          <Link href={"/sign-up"}>
            <Button size={"sm"} variant={"ghost"} className="text-sm">
              Register
            </Button>
          </Link>
          |
          <Link href={"/sign-in"}>
            <Button
              size={"sm"}
              variant={"secondary"}
              className="text-sm flex gap-2"
            >
              <LogIn />
              <span>Login</span>
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};
