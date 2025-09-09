"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Handbag } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchemas } from "../../types";
import { FcGoogle } from "react-icons/fc";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export const SignInViews = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signInSchemas>>({
    resolver: zodResolver(signInSchemas),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (
    data?: z.infer<typeof signInSchemas>,
    options?: "social" | "email"
  ) => {
    if (options === "email" && data) {
      authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    } else {
      // Handle social login
      authClient.signIn.social({
        provider: "google",
      });
    }
  };

  return (
    <div className="flex flex-col w-full gap-y-6 max-w-md mx-auto">
      <Card className="shadow-lg border border-gray-100 rounded-2xl">
        <CardHeader>
          <div className="flex flex-col gap-y-2 text-center">
            <div className="flex gap-x-2 items-center justify-center">
              <Handbag size={20} className="text-primary" />
              <h1 className="text-lg font-semibold">Welcome Back</h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Login with your account to continue
            </p>
          </div>
        </CardHeader>
        <CardContent className="w-full flex flex-col gap-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() =>
                onSubmit(form.getValues(), "email")
              )}
              className="flex flex-col gap-4"
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="username"
                        className="rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Password
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="rounded-lg"
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full rounded-lg bg-primary hover:bg-primary/90"
              >
                Sign in
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-muted-foreground/20" />
            <span>OR</span>
            <div className="flex-1 h-px bg-muted-foreground/20" />
          </div>

          {/* Social Login */}
          <Button
            className="w-full rounded-lg border flex items-center gap-2 hover:bg-gray-50"
            variant="outline"
            onClick={() => onSubmit(undefined, "social")}
          >
            <FcGoogle size={20} />
            Sign in with Google
          </Button>

          {/* Sign Up Link */}
          <p className="text-xs text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link
              className="underline underline-offset-4 text-primary"
              href={"/sign-up"}
            >
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
