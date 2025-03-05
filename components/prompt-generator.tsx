"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getTemplateLength } from "@/utils/prompt";

interface PromptGeneratorProps {
  onGenerated: (intro: string, topic: string) => void;
}

export default function PromptGenerator({ onGenerated }: PromptGeneratorProps) {
  const [intro, setIntro] = useState("");
  const [topic, setTopic] = useState("");
  const [remainingChars, setRemainingChars] = useState(500);

  const MAX_CHARS = 500 - getTemplateLength();

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
    
    onGenerated(intro, topic);
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
    </div>
  );
} 