"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface PromptGeneratorProps {
  onGenerated?: (promptText: string) => void;
}

export default function PromptGenerator({ onGenerated }: PromptGeneratorProps) {
  const [intro, setIntro] = useState("");
  const [topic, setTopic] = useState("");
  const [charCount, setCharCount] = useState(0);

  const MAX_CHARS = 500;

  useEffect(() => {
    setCharCount(intro.length + topic.length);
  }, [intro, topic]);

  const generatePrompt = () => {
    if (charCount > MAX_CHARS) {
      toast.error("Too many characters", {
        description: `Please reduce your text by ${charCount - MAX_CHARS} characters.`,
      });
      return;
    }

    if (!intro || !topic) {
      toast.error("Missing information", {
        description: "Please provide both an introduction and a topic.",
      });
      return;
    }

    const prompt = `${intro} I am sharing my X/twitter feed.\nThe topic we are discussing in today's episode is: ${topic}\n\nDiscuss top posts only related to this topic, not as an interview, but as a discussion. Don't mention the post content as a post, just discuss the topic.\n\nKeep it short. Less than 10 minutes`;
    
    if (onGenerated) {
      onGenerated(prompt);
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
          placeholder="The rise of AI and implocations for developers"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="h-24"
        />
      </div>

      <div className={`text-sm ${charCount > MAX_CHARS ? 'text-red-500' : 'text-gray-500'}`}>
        {charCount} / {MAX_CHARS} characters
      </div>

      <Button onClick={generatePrompt} disabled={!intro || !topic || charCount > MAX_CHARS}>
        Generate Prompt
      </Button>
    </div>
  );
} 