"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { processTweets } from "@/lib/tweet-utils";
import { Input } from "@/components/ui/input";

interface TweetProcessorProps {
  onProcessed: (fileContent: string) => void;
}

export default function TweetProcessor({ onProcessed }: TweetProcessorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsProcessed(false);
    }
  };

  const processFile = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const fileText = await file.text();
      
      // Process the file content
      const result = await processTweets(fileText);
      
      setIsProcessed(true);
      onProcessed(result);
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Error processing file", {
        description: error.message || "Please try again with a valid tweets.js file",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept=".js"
          onChange={handleFileChange}
          disabled={isProcessing}
          className="flex-1"
        />
        <Button 
          onClick={processFile} 
          disabled={!file || isProcessing}
        >
          {isProcessing ? "Processing..." : "Process"}
        </Button>
      </div>
      
      {isProcessed && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700 flex items-center">
            <span className="mr-2">✅</span> 
            Posts processed successfully! Continue to Step 2.
          </p>
        </div>
      )}
    </div>
  );
} 