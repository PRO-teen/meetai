"use client";
import { useState } from "react";
import {z} from "zod";
import Link from "next/link";
import {useForm} from "react-hook-form";
import { OctagonAlertIcon } from "lucide-react";
import {FaGithub ,FaGoogle}   from "react-icons/fa"
import {zodResolver} from "@hookform/resolvers/zod";

import {Input} from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import {Button} from "@/components/ui/button";
import {Card , CardContent} from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage

} from "@/components/ui/form";
// import { _email } from "zod/v4/core";



const formSchema = z.object({
  name: z.string().min(1,{message:"Name is required"}),
  email:z.string().email(),
  password: z.string().min(1,{message:"Password is required"}),
  Confirmpassword: z.string().min(1,{message:"Password is required"}),
})
.refine((data)=>data.password === data.Confirmpassword,{
  message:"Passwords don't match",
  path:["confirmPassword"],
})

export const SignUpView = () => {
  const [pending , setPending] = useState(false);
  const [error , setError] = useState<string | null >(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      name:"",
      email:"",
      password:"",
      Confirmpassword:"",
    },
});


const onSubmit = (data: z.infer<typeof formSchema>) => {
  setError(null);
  setPending(true);

  authClient.signUp.email(
    {
      name:data.name,
      email: data.email,
      password: data.password,
      callbackURL:"/",
    },
    {
      onSuccess: () => {
        setPending(false)
      },
      onError: (error) => {
        setError(error.error?.message);
      },
    }
  );
};


const onSocial = (provider : "github" | "google") => {
  setError(null);
  setPending(true);

  authClient.signIn.social(
    {
     provider:provider,
     callbackURL:"/"
    },
    {
      onSuccess: () => {
        setPending(false)
      },
       onError: ({error}) => {
        setPending(false);
        setError(error.message);
      },
    }
  );
};




  return (
      <div className="flex flex-col gap-6" >
        <Card className="overflow-hidden p-0" >
          <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8" >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center" > 
                <h1 className="text-2xl font-bold"  >
                  Let&apos;s get started
                  </h1>  
                  <p className="text-muted-foreground text-balance">
                    Create your account
                  </p>
                 </div>

                 <div className="grid gap-3">
                  <FormField
                  control={form.control}
                 name="name"
               render={({ field }) => (
              <FormItem>
               <FormLabel>Name</FormLabel>
              <FormControl>
               <Input
               type="text"
               placeholder="MeetAI"
               {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                 </div>

                 <div className="grid gap-3">
                  <FormField
                  control={form.control}
                 name="email"
               render={({ field }) => (
              <FormItem>
               <FormLabel>Email</FormLabel>
              <FormControl>
               <Input
               type="email"
               placeholder="meet@example.com"
               {...field}
        />
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
               <FormLabel>password</FormLabel>
              <FormControl>
               <Input
               type="password"
               placeholder="********"
               {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                 </div>
                 <div className="grid gap-3">
                  <FormField
                  control={form.control}
                 name="Confirmpassword"
               render={({ field }) => (
              <FormItem>
               <FormLabel>Confirm Password</FormLabel>
              <FormControl>
               <Input
               type="password"
               placeholder="********"
               {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                 </div>

                 {!!error&& (
                  <Alert className="bg-destructive/10 border-none" >
                    <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                 )}

                 <Button 
                 disabled={pending}
                 type="submit"
                 className="w-full"
                  >Sign in
                  </Button>

                  <div className="relative text-center text-sm">
  <div className="after:border-border after:absolute after:inset-0 after:top-1/2 after:z-0 after:border-t" />
  <span className="bg-card text-muted-foreground relative z-10 px-2">
    Or continue with
  </span>
</div>
<div className="grid grid-cols-2 gap-4 mt-4">
  {/* Social login buttons would go here */}
  <Button 
   disabled={pending}
   onClick={()=>onSocial("google")}
  variant="outline"
  type="button"
  className="w-full"
  >
    <FaGoogle/>
  </Button>
  <Button 
   disabled={pending}
  onClick={()=>onSocial("github")}
  variant="outline"
  type="button"
  className="w-full"
  >
   <FaGithub/>
  </Button>
</div>
<div className="text-center text-sm" >
  Already have an account?{" "}
  <Link href="/sign-in" className="underline underline-offset-4" >Sign in</Link>
</div>




              </div>
              </form>
          </Form>
            
            <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center" >
              <img src="/logo.svg" alt="Image" className="h-[92px] w-[92px]" />
              <p className="text-2xl font-semibold text-white" >
                Meet.AI
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs
         text-balance *:[a]:underline *:[a]:underline-offset-4 " >
          By Clicking continue,you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
         </div>
      </div>
  )
}

