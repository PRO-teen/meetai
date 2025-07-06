"use client";

import React, { useState } from 'react';

import {Button} from "@/components/ui/button" ;
import {Input} from "@/components/ui/input" ;
import { authClient } from '@/lib/auth-client';


export default function Home() {
  const {data: session} = authClient.useSession();
  const [email , setEmail] = useState("");
  const [name , setName] = useState("");
  const [password , setPassword]= useState("");

  const onSubmit = ()=>{
    authClient.signUp.email({
      email,
      name,
      password,
    },{
      onError:()=>{
        window.alert("something went wrong");
      },
      onSuccess:()=>{
        window.alert("success")
      }
    })
  }

  const onLogin = ()=>{
    authClient.signIn.email({
      email,
      password,
    },{
      onError:()=>{
        window.alert("something went wrong");
      },
      onSuccess:()=>{
        window.alert("success")
      }
    })
  }

  if(session){
    return(
      <div>
        <p>Logged in as {session.user.name}</p>
        <Button onClick={()=> authClient.signOut()}  >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    
   <div className="p-4 flex flex-col gap-y-4">
    <Input 
    placeholder="name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    />

    <Input 
    placeholder="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    />

    <Input 
    placeholder="password"
    type="pasword"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    />

    <Button onClick={onSubmit}>Click me</Button>

   

   <div className="p-4 flex flex-col gap-y-4">
    <Input 
    placeholder="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    />

    <Input 
    placeholder="password"
    type="pasword"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    />

    <Button onClick={onLogin}>Click me</Button>
    </div>

   
   </div>
   
  )
}