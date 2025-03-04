"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TweetProcessor from "@/components/tweet-processor";
import PromptGenerator from "@/components/prompt-generator";

export default function Home() {
  const [processedFile, setProcessedFile] = useState<string | null>(null);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Podcast Tweet Processor</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Process Tweets</CardTitle>
          </CardHeader>
          <CardContent>
            <TweetProcessor onProcessed={setProcessedFile} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Podcast Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <PromptGenerator />
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 