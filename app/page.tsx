import { Profile } from "@/components/Profile";
import { Topic } from "@/components/Topic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-between p-8">
      <Tabs defaultValue="feed" className="flex flex-col flex-1 gap-8">
        <TabsContent value="feed" className="flex-1">
          <Topic label="This is the topic" onTurn={function (): void {
            throw new Error("Function not implemented.");
          }} />
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