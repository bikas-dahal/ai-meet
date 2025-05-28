"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

type FormSchema = z.infer<typeof formSchema>;

export const SignInView = () => {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: FormSchema) => {
    setError(null);
    setPending(true);
    try {
      authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            router.push("/");
          },
          onError: ({ error }) => {
            setError(error.message);
          },
        }
      );
    } catch (error) {
      setError(`Invalid email or password ${error}`);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-0 overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!!error && (
                  <Alert className="bg-destructive/10 text-destructive">
                    <OctagonAlert className="h-4 w-4" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <Button disabled={pending} type="submit" className="w-full cursor-pointer">
                  Sign In
                </Button>
                <div className="relative after:border-border after:border after:py-2 after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:z-0 after:justify-center after:border-t">
                  <span className="relative z-10 px-2">Or continue with</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button type="button" variant="outline">
                    Google
                  </Button>
                  <Button type="button" variant="outline">
                    Github
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-3"
                  >
                    Sign Up
                  </Link>
                </div>
                <div className="text-center text-xs text-muted-foreground *:[a]:underline *:[a]:hover:text-primary *:[a]:underline-offset-3">
                  By signing up, you agree to our{" "}
                  <a href="/terms">Terms of Service</a> and{" "}
                  <a href="/privacy">Privacy Policy</a>
                </div>
              </div>
            </form>
          </Form>
          <div className="hidden md:flex flex-col bg-radial from-[#111827] to-[#111827] items-center justify-center">
            <img src="/logo.svg" alt="" className="h-[92px] w-[92px]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
