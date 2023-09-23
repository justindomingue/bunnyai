"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Noun } from "@/components/Noun"
import {usePrivy} from '@privy-io/react-auth';
import Head from "next/head";

export default function Home() {
  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-between p-8">
      <Tabs defaultValue="feed" className="w-full flex flex-col flex-1 gap-8">
        <TabsContent value="feed" className="flex-1">
          <Feed />
        </TabsContent>
        <TabsContent value="profile">
          <Profile />
        </TabsContent>
        <TabsList>
          <TabsTrigger value="feed">for you</TabsTrigger>
          <TabsTrigger value="profile">profile
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </main>
  )
}

function Feed() {
  return <div className="flex-1 justify-between flex flex-col gap-6">
    {/* header */}
    <div className="flex flex-row justify-between">
      <Noun />
      <Button>420 $honk</Button>
    </div>
    {/* topic */}
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          This is the topic
        </h1>

        <p className="text-md text-muted-foreground">Level 1</p>
      </div>

      <div className="flex flex-col gap-4 font-bold">
        <p className="text-lg">This is the body text about the rabbit hole.</p>
        <p className="text-lg">This is the body text about the rabbit hole.</p>
        <p className="text-lg">This is the body text about the rabbit hole.</p>
        <p className="text-lg">This is the body text about the rabbit hole.</p>
      </div>
    </div>
    {/* actions */}
    <div className="flex flex-row justify-between">
      <Button>deeper</Button>
      <Button>turn</Button>
    </div>
  </div>
}

function Profile() {
  const {login, logout, authenticated} = usePrivy();

  return (
    <>
      <Head>
        <title>Login · Privy</title>
      </Head>
      {
        !authenticated ? 
          <Button onClick={login}>Login</Button>
        : <Button onClick={logout}>Logout</Button>
      }
    </>
  );

}