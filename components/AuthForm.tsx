"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CostumForm from "./CostumForm";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import PlaidLink from './PlaidLink'

const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter()
  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsloading(true);
    try {
        //Signin with Appwriter and crate plaid text token
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          email: data.email,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          password: data.password,
        } 

        if (type === 'sign-up') {
            const newUser = await signUp(userData)
            setUser(newUser) 
          
        }

        if (type === 'sign-in') {
            const response = await signIn({
                email: data.email,
                password: data.password
            })

            if(response) router.push('/')
        }
      console.log(data);
      setIsloading(false);
    } catch (error) {
        console.log(error)
    }finally{
        setIsloading(false)
    }
  };
  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer items-center gap-1 flex">
          <Image
            src="/icons/logo.svg"
            width={30}
            height={30}
            alt="logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="text-26 text-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {user
              ? "Link your account to get stared"
              : "Please enter your details"}
          </p>
        </div>
      </header>
      {user ? ( 
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant='primary' />
        </div>
       ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CostumForm
                      name="firstName"
                      control={form.control}
                      label="First Name"
                      placeholder="Enter your first name"
                    />
                    <CostumForm
                      name="lastName"
                      control={form.control}
                      label="Last Name"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <CostumForm
                    name="address1"
                    control={form.control}
                    label="Address"
                    placeholder="Enter your specific address"
                  />

                  <CostumForm
                    name="city"
                    control={form.control}
                    label="City"
                    placeholder="Enter your city"
                  />

                  <div className="flex gap-4">
                    <CostumForm
                      name="state"
                      control={form.control}
                      label="State"
                      placeholder="Example: KN"
                    />
                    <CostumForm
                      name="postalCode"
                      control={form.control}
                      label="PostalCode"
                      placeholder="Example: 11101"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CostumForm
                      name="dateOfBirth"
                      control={form.control}
                      label="Date of Birth"
                      placeholder="yyyy-mm-dd"
                    />
                    <CostumForm
                      name="ssn"
                      control={form.control}
                      label="SSN"
                      placeholder="Example: 1234"
                    />
                  </div>
                </>
              )}
              <CostumForm
                name="email"
                control={form.control}
                label="Email"
                placeholder="Enter your email"
              />
              <CostumForm
                name="password"
                control={form.control}
                label="Password"
                placeholder="Enter your password"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading....
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex gap-1 justify-center">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
