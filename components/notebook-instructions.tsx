"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { generatePrompt } from "@/utils/prompt";

interface NotebookInstructionsProps {
  processedFile: string | null;
  promptText?: string | null;
  intro?: string;
  topic?: string;
}

export default function NotebookInstructions({ processedFile, intro, topic }: NotebookInstructionsProps) {
  const finalPrompt = intro && topic ? generatePrompt(intro, topic) : null;

  const downloadFile = () => {
    if (!processedFile) return;
    
    const blob = new Blob([processedFile], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "posts.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!finalPrompt) return;
    
    try {
      await navigator.clipboard.writeText(finalPrompt);
      toast.success("Copied to clipboard", {
        description: "The prompt has been copied to your clipboard.",
      });
    } catch (error) {
      toast.error("Failed to copy", {
        description: "Please try copying manually.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: Generate Your Podcast with Notebook LM</CardTitle>
        <CardDescription>Use your processed posts and prompt with Google's Notebook LM</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Follow these steps to generate your podcast:</p>
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <strong>Go to <a href="https://notebooklm.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Notebook LM</a></strong>
            </li>
            <li>
              <strong>Create a new notebook</strong>
            </li>
            <li>
              <strong>Download the processed posts file</strong>
              {processedFile && (
                <div className="mt-2 border border-gray-300 rounded overflow-hidden">
                  <div className="flex items-center justify-between bg-gray-200 p-2">
                    <div className="font-medium text-sm">posts.txt</div>
                    <Button 
                      onClick={downloadFile} 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 flex items-center gap-1"
                      title="Download posts.txt"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                  <div className="bg-gray-100 p-3 max-h-40 overflow-y-auto">
                    <pre className="text-xs">{processedFile.substring(0, 200)}...</pre>
                  </div>
                </div>
              )}
            </li>
            <li>
              <strong>Upload posts.txt as a source to Notebook LM</strong>
              <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
                <Image 
                  src="/images/upload-source.png" 
                  alt="Upload source to Notebook LM" 
                  width={500} 
                  height={250} 
                  className="w-full max-w-lg object-contain"
                />
              </div>
            </li>
            <li>
              <strong>Copy and paste your generated prompt</strong>
              {finalPrompt && (
                <div className="mt-2 border border-gray-300 rounded overflow-hidden">
                  <div className="flex items-center justify-between bg-gray-200 p-2">
                    <div className="font-medium text-sm">Generated Prompt</div>
                    <Button 
                      onClick={copyToClipboard} 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 flex items-center gap-1"
                      title="Copy prompt"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </Button>
                  </div>
                  <div className="bg-gray-100 p-3 max-h-40 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-xs">{finalPrompt}</pre>
                  </div>
                </div>
              )}
            </li>
            <li>
              <strong>Customize the podcast prompt</strong>
              <p className="mt-2 text-sm text-gray-600">Under Studio → Audio Overview click Customize</p>
              <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
                <Image 
                  src="/images/audio-customize.png" 
                  alt="Studio Audio Overview customization" 
                  width={500} 
                  height={250} 
                  className="w-full max-w-lg object-contain"
                />
              </div>
            </li>
            <li>
              <strong>Paste your prompt and click Generate</strong>
              <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
                <Image 
                  src="/images/prompt-generate.png" 
                  alt="Paste prompt and generate" 
                  width={500} 
                  height={250} 
                  className="w-full max-w-lg object-contain"
                />
              </div>
            </li>
            <li>
              <strong>Wait for your podcast content to be generated</strong>
              <p className="mt-2 text-sm text-gray-600">Notebook LM will analyze your posts and create podcast content based on your prompt</p>
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
} 