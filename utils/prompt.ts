export const PROMPT_TEMPLATE = `{intro} I am sharing my X/twitter feed.
The topic we are discussing in today's episode is: {topic}

Discuss top posts only related to this topic, not as an interview, but as a discussion. Don't mention the post content as a post, just discuss the topic.

Keep it short. Less than 10 minutes`;

export const generatePrompt = (intro: string, topic: string): string | null => {
  if (!intro || !topic) return null;
  return PROMPT_TEMPLATE
    .replace('{intro}', intro)
    .replace('{topic}', topic);
};

export const getTemplateLength = (): number => {
  // We subtract 13 because '{intro}' (7 chars) and '{topic}' (7 chars) will be replaced
  return PROMPT_TEMPLATE.length - 13;
}; 