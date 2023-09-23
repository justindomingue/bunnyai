import { Topic } from "@/components/Topic";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePrivy } from '@privy-io/react-auth';
import Head from "next/head";
"use client";

export default function Home() {
  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-between p-8">
      <Tabs defaultValue="feed" className="flex flex-col flex-1 gap-8">
        <TabsContent value="feed" className="flex-1">
          <Topic label="This is the topic" />
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

function Profile() {
  const { login, logout, authenticated } = usePrivy();

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