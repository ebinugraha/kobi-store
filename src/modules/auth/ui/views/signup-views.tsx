"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Handbag } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchemas, signUpSchemas } from "../../types";
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
import { useState } from "react";

export const SignUpViews = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof signUpSchemas>>({
    resolver: zodResolver(signUpSchemas),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof signUpSchemas>) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col w-full gap-y-6 gap-6">
      <Card className="shadow-lg border border-gray-100 rounded-2xl">
        <CardHeader>
          <div className="flex flex-col gap-y-2 text-center">
            <div className="flex gap-x-2 items-center justify-center">
              <Handbag size={20} className="text-primary" />
              <h1 className="text-lg font-semibold">Create your accont</h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Sign up to get started
            </p>
          </div>
        </CardHeader>
        <CardContent className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your full name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                          autoComplete="username"
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
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute right-0 inset-y-0 pr-3 items-center text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </button>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  name="confirmPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute right-0 inset-y-0 pr-3 items-center text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Sign-up
                </Button>
              </form>
            </Form>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-full h-[0.2px] bg-muted-foreground" />
            <span className="text-muted-foreground mb-1s">atau</span>
            <div className="w-full h-[0.2px] bg-muted-foreground" />
          </div>
          <div className="flex flex-col gap-3">
            <Button className="w-full" variant={"outline"}>
              <FcGoogle />
              Google
            </Button>
            <p className="text-xs text-center">
              Allready have an account?{" "}
              <Link className="underline underline-offset-4F" href={"/sign-in"}>
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
