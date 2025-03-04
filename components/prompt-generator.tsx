"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface PromptGeneratorProps {
  onGenerated?: () => void;
}

export default function PromptGenerator({ onGenerated }: PromptGeneratorProps) {
  const [intro, setIntro] = useState("");
  const [topic, setTopic] = useState("");
  const [remainingChars, setRemainingChars] = useState(500);
  const [fullPrompt, setFullPrompt] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);

  const prompt = `${intro} I am sharing my X/twitter feed.\nThe topic we are discussing in today's episode is: ${topic}\n\nDiscuss top posts only related to this topic, not as an interview, but as a discussion. Don't mention the post content as a post, just discuss the topic.\n\nKeep it short. Less than 10 minutes`;
  const MAX_CHARS = 500 - prompt.length;

  useEffect(() => {
    const usedChars = intro.length + topic.length;
    setRemainingChars(MAX_CHARS - usedChars);
  }, [intro, topic]);

  const generatePrompt = () => {
    if (remainingChars < 0) {
      toast.error("Too many characters", {
        description: `Please reduce your text by ${Math.abs(remainingChars)} characters.`,
      });
      return;
    }

    if (!intro || !topic) {
      toast.error("Missing information", {
        description: "Please provide both an introduction and a topic.",
      });
      return;
    }

    
    
    setFullPrompt(prompt);
    setShowPrompt(true);
    
    if (onGenerated) {
      onGenerated();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Introduction</label>
        <Textarea
          placeholder="I am Damian Schenkelman, an early engineer at Auth0, currently vp r&d at Okta"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          className="h-24"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Topic</label>
        <Textarea
          placeholder="The rise of AI and implications for developers"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="h-24"
        />
      </div>

      <div className={`text-sm ${remainingChars < 0 ? 'text-red-500' : 'text-gray-500'}`}>
        {remainingChars} characters remaining
      </div>

      <Button onClick={generatePrompt} disabled={!intro || !topic || remainingChars < 0}>
        Generate Prompt
      </Button>

      {showPrompt && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-sm font-medium mb-2">Generated Prompt:</h3>
          <div className="bg-white p-3 rounded border border-gray-300">
            <pre className="whitespace-pre-wrap text-sm">{fullPrompt}</pre>
          </div>
        </div>
      )}
    </div>
  );
} 