import { SocialPost } from '../types';

// Twitter API v2 endpoint
const TWITTER_API_BASE = 'https://api.twitter.com/2';

// Note: In production, you would store this in environment variables
// For now, we'll use a proxy or fallback to RSS feeds
const NITTER_INSTANCES = [
  'https://nitter.net',
  'https://nitter.poast.org',
  'https://nitter.privacydev.net',
];

interface TwitterUser {
  id: string;
  name: string;
  username: string;
}

interface TwitterMedia {
  type: string;
  url?: string;
  preview_image_url?: string;
}

interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
  };
  attachments?: {
    media_keys: string[];
  };
}

// Format timestamp to relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Fetch tweets using Nitter RSS (fallback method)
async function fetchFromNitter(username: string): Promise<SocialPost[]> {
  try {
    // Try multiple Nitter instances
    for (const instance of NITTER_INSTANCES) {
      try {
        const response = await fetch(`${instance}/${username}/rss`, {
          headers: {
            'Accept': 'application/rss+xml, application/xml, text/xml',
          },
        });

        if (!response.ok) continue;

        const xmlText = await response.text();
        
        // Parse RSS XML
        const posts = parseRSSFeed(xmlText, username);
        if (posts.length > 0) {
          return posts;
        }
      } catch (error) {
        console.log(`Failed to fetch from ${instance}, trying next...`);
        continue;
      }
    }

    throw new Error('All Nitter instances failed');
  } catch (error) {
    console.error('Error fetching from Nitter:', error);
    return [];
  }
}

// Parse RSS XML feed
function parseRSSFeed(xmlText: string, username: string): SocialPost[] {
  const posts: SocialPost[] = [];
  
  try {
    // Extract items from RSS feed
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const items = xmlText.match(itemRegex) || [];

    for (let i = 0; i < Math.min(items.length, 10); i++) {
      const item = items[i];
      
      // Extract data from each item
      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
      const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
      const linkMatch = item.match(/<link>(.*?)<\/link>/);
      
      if (!titleMatch || !descMatch || !dateMatch) continue;

      const content = titleMatch[1];
      const description = descMatch[1];
      const pubDate = dateMatch[1];
      const link = linkMatch ? linkMatch[1] : '';

      // Extract tweet ID from link
      const tweetIdMatch = link.match(/status\/(\d+)/);
      const tweetId = tweetIdMatch ? tweetIdMatch[1] : `nitter_${i}`;

      // Check for media in description
      const hasImage = description.includes('<img') || description.includes('pic.twitter.com');
      const hasVideo = description.includes('video') || description.includes('player');

      // Extract clean text (remove HTML tags)
      const cleanText = content
        .replace(/<[^>]*>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();

      posts.push({
        id: tweetId,
        username: username === 'FBLA_National' ? 'FBLA National' : 'FBLA NCHS',
        handle: `@${username}`,
        content: cleanText,
        timestamp: getRelativeTime(pubDate),
        likes: 0, // RSS doesn't provide metrics
        retweets: 0,
        replies: 0,
        videoThumbnail: hasVideo ? 'video' : undefined,
        videoUrl: hasVideo ? link : undefined,
        isLiked: false,
        isRetweeted: false,
      });
    }
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
  }

  return posts;
}

// Main function to fetch tweets
export async function fetchTweets(username: string): Promise<SocialPost[]> {
  try {
    // Use Nitter RSS as the primary method
    const posts = await fetchFromNitter(username);
    
    if (posts.length > 0) {
      return posts;
    }

    // If all methods fail, return empty array
    console.warn(`Could not fetch tweets for @${username}`);
    return [];
  } catch (error) {
    console.error('Error in fetchTweets:', error);
    return [];
  }
}

// Fetch tweets for FBLA National
export async function fetchNationalTweets(): Promise<SocialPost[]> {
  return fetchTweets('FBLA_National');
}

// Fetch tweets for FBLA NCHS
export async function fetchChapterTweets(): Promise<SocialPost[]> {
  return fetchTweets('FBLA.NCHS');
}