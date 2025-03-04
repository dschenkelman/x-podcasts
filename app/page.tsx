"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import TweetProcessor from "@/components/tweet-processor";
import PromptGenerator from "@/components/prompt-generator";
import NotebookInstructions from "@/components/notebook-instructions";

export default function Home() {
  const [processedFile, setProcessedFile] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [promptGenerated, setPromptGenerated] = useState<boolean>(false);

  const handlePromptGenerated = (promptText: string) => {
    setGeneratedPrompt(promptText);
    setPromptGenerated(true);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">X Posts to Podcast Generator</h1>
      
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Process Your X Posts</CardTitle>
            <CardDescription>Upload your X archive file to extract and format your posts</CardDescription>
          </CardHeader>
          <CardContent>
            <TweetProcessor onProcessed={setProcessedFile} />
          </CardContent>
        </Card>

        {processedFile && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Create Your Podcast Prompt</CardTitle>
              <CardDescription>Customize how your podcast should sound and what topic to focus on</CardDescription>
            </CardHeader>
            <CardContent>
              <PromptGenerator onGenerated={handlePromptGenerated} />
            </CardContent>
          </Card>
        )}

        {promptGenerated && <NotebookInstructions processedFile={processedFile} promptText={generatedPrompt} />}
      </div>
    </main>
  );
} 