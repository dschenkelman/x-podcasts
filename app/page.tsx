"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import TweetProcessor from "@/components/tweet-processor";
import PromptGenerator from "@/components/prompt-generator";
import NotebookInstructions from "@/components/notebook-instructions";

export default function Home() {
  const [processedFile, setProcessedFile] = useState<string | null>(null);
  const [intro, setIntro] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [promptGenerated, setPromptGenerated] = useState<boolean>(false);
  
  // Refs for scrolling
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  const handleFileProcessed = (fileContent: string) => {
    setProcessedFile(fileContent);
    // Add small delay to ensure DOM updates before scrolling
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handlePromptGenerated = (newIntro: string, newTopic: string) => {
    setIntro(newIntro);
    setTopic(newTopic);
    setPromptGenerated(true);
    // Add small delay to ensure DOM updates before scrolling
    setTimeout(() => {
      step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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
            <TweetProcessor onProcessed={handleFileProcessed} />
          </CardContent>
        </Card>

        {processedFile && (
          <Card ref={step2Ref}>
            <CardHeader>
              <CardTitle>Step 2: Create Your Podcast Prompt</CardTitle>
              <CardDescription>Customize how your podcast should sound and what topic to focus on</CardDescription>
            </CardHeader>
            <CardContent>
              <PromptGenerator onGenerated={handlePromptGenerated} />
            </CardContent>
          </Card>
        )}

        {promptGenerated && (
          <div ref={step3Ref}>
            <NotebookInstructions 
              processedFile={processedFile} 
              intro={intro}
              topic={topic}
            />
          </div>
        )}
      </div>
    </main>
  );
} 