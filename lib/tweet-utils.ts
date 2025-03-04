interface Tweet {
    tweet: {
      full_text?: string;
      text?: string;
      created_at?: string;
      favorite_count?: number | string;
      retweet_count?: number | string;
      id?: string;
      id_str?: string;
      edit_info?: any;
    };
  }
  
  export async function processTweets(fileContent: string): Promise<string> {
    // Extract JSON data from the file
    // The file starts with window.YTD.tweets.part0 =
    const jsonStart = fileContent.indexOf('[');
    const jsonEnd = fileContent.lastIndexOf(']');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Invalid file format. Cannot find JSON array.");
    }
    
    const jsonString = fileContent.substring(jsonStart, jsonEnd + 1);
    
    // Parse the tweets
    let posts: Tweet[];
    try {
      posts = JSON.parse(jsonString);
    } catch (error) {
      throw new Error("Failed to parse tweet data. Invalid format.");
    }
    
    // Create CSV header
    const header = ['full_text', 'created_at', 'favorite_count', 'retweet_count'].join(',');
    
    // Convert each post to CSV row, excluding retweets and old versions of edited tweets
    const rows = posts
      .filter(post => {
        // Skip retweets
        const text = post.tweet.full_text || post.tweet.text || '';
        if (text.startsWith('RT @')) { return false; }
  
        // Check if this is the latest version of an edited tweet
        const editInfo = post.tweet.edit_info;
  
        if (!editInfo) { 
          return true; 
        }
        
        if (editInfo.initial?.editTweetIds) { 
          return editInfo.initial.editTweetIds.length === 1;
        }
        
        const edit = editInfo?.edit;
        if (edit) {
          const editIds = edit.editControlInitial.editTweetIds;
          const latestId = editIds[editIds.length - 1];
          // Only keep if this is the latest version
          return post.tweet.id === latestId;
        }
  
        // Keep tweets that were never edited
        return true;
      })
      .map(post => {
        const tweet = post.tweet;
        // Clean the text: replace newlines with spaces and escape quotes
        const cleanText = (tweet.full_text || tweet.text || '')
          .replace(/[\n\r]+/g, ' ')  // Replace newlines with space
          .replace(/"/g, '""');      // Escape quotes
        
        return [
          `"${cleanText}"`,
          `"${tweet.created_at || ''}"`,
          tweet.favorite_count || 0,
          tweet.retweet_count || 0
        ].join(',');
      });
  
    // Combine header and rows
    return [header, ...rows].join('\n');
  } 