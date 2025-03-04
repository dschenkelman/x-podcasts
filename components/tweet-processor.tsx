"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { processTweets } from "@/lib/tweet-utils";
import { Download } from "lucide-react";

interface TweetProcessorProps {
  onProcessed: (fileContent: string) => void;
}

export default function TweetProcessor({ onProcessed }: TweetProcessorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputContent, setOutputContent] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setOutputContent(null);
    }
  };

  const processFile = async () => {
    if (!file) {
      toast.error("No file selected", {
        description: "Please select a tweets.js file to process.",
      });
      return;
    }

    setProcessing(true);
    setProgress(10);

    try {
      const fileText = await file.text();
      setProgress(30);
      
      // Process the file content
      const result = await processTweets(fileText);
      setProgress(90);
      
      setOutputContent(result);
      onProcessed(result);
      
      toast.success("Processing complete", {
        description: "Your tweets have been processed successfully.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Processing failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setProcessing(false);
      setProgress(100);
    }
  };

  const downloadFile = () => {
    if (!outputContent) return;
    
    const blob = new Blob([outputContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "posts.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="file"
          accept=".js"
          onChange={handleFileChange}
          className="flex-1 border rounded p-2"
          disabled={processing}
        />
        <Button onClick={processFile} disabled={!file || processing}>
          Process
        </Button>
      </div>

      {processing && (
        <div className="space-y-2">
          <div className="text-sm text-gray-500">Processing tweets...</div>
          <Progress value={progress} />
        </div>
      )}

      {outputContent && (
        <div className="border border-gray-300 rounded overflow-hidden">
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
            <pre className="text-xs">{outputContent.substring(0, 200)}...</pre>
          </div>
        </div>
      )}
    </div>
  );
} 