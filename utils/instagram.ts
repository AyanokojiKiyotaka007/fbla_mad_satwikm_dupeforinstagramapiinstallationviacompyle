import { SocialPost } from '../types';

// Instagram public API endpoints
const INSTAGRAM_BASE = 'https://www.instagram.com';

// Format timestamp to relative time
function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp * 1000) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Fetch Instagram posts using public API
async function fetchInstagramPosts(username: string): Promise<SocialPost[]> {
  try {
    // Use Instagram's public JSON endpoint
    const response = await fetch(`${INSTAGRAM_BASE}/${username}/?__a=1&__d=dis`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract posts from the response
    const posts = extractPostsFromData(data, username);
    return posts;
  } catch (error) {
    console.error(`Error fetching Instagram posts for @${username}:`, error);
    
    // Try alternative method using RSS-like scraping
    return await fetchInstagramPostsAlternative(username);
  }
}

// Extract posts from Instagram API response
function extractPostsFromData(data: any, username: string): SocialPost[] {
  const posts: SocialPost[] = [];
  
  try {
    const user = data?.graphql?.user || data?.data?.user;
    if (!user) return [];

    const edges = user.edge_owner_to_timeline_media?.edges || [];
    
    for (let i = 0; i < Math.min(edges.length, 10); i++) {
      const node = edges[i].node;
      
      const post: SocialPost = {
        id: node.id || `ig_${i}`,
        username: username === 'fbla_pbl' ? 'FBLA National' : 'FBLA NCHS',
        handle: `@${username}`,
        content: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
        timestamp: getRelativeTime(node.taken_at_timestamp),
        likes: node.edge_liked_by?.count || 0,
        retweets: 0, // Instagram doesn't have retweets
        replies: node.edge_media_to_comment?.count || 0,
        isLiked: false,
        isRetweeted: false,
      };

      // Add media if available
      if (node.is_video) {
        post.videoThumbnail = node.thumbnail_src || node.display_url;
        post.videoUrl = `${INSTAGRAM_BASE}/p/${node.shortcode}/`;
      } else if (node.display_url) {
        post.images = [node.display_url];
      }

      posts.push(post);
    }
  } catch (error) {
    console.error('Error extracting posts from data:', error);
  }

  return posts;
}

// Alternative method using web scraping
async function fetchInstagramPostsAlternative(username: string): Promise<SocialPost[]> {
  try {
    const response = await fetch(`${INSTAGRAM_BASE}/${username}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract JSON data from HTML
    const scriptMatch = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/);
    if (scriptMatch) {
      const jsonData = JSON.parse(scriptMatch[1]);
      return parseInstagramJSON(jsonData, username);
    }

    // Try to extract from window._sharedData
    const sharedDataMatch = html.match(/window\._sharedData = ({.*?});/);
    if (sharedDataMatch) {
      const sharedData = JSON.parse(sharedDataMatch[1]);
      return extractPostsFromData(sharedData, username);
    }

    return [];
  } catch (error) {
    console.error('Error in alternative fetch:', error);
    return [];
  }
}

// Parse Instagram JSON-LD data
function parseInstagramJSON(data: any, username: string): SocialPost[] {
  const posts: SocialPost[] = [];
  
  try {
    if (data['@type'] === 'ProfilePage' && data.mainEntity) {
      const items = data.mainEntity.interactionStatistic || [];
      // This is limited data, but we can create basic posts
      // In reality, we'd need more sophisticated scraping
    }
  } catch (error) {
    console.error('Error parsing Instagram JSON:', error);
  }

  return posts;
}

// Fetch posts for FBLA National Instagram
export async function fetchNationalPosts(): Promise<SocialPost[]> {
  return fetchInstagramPosts('fbla_pbl');
}

// Fetch posts for FBLA NCHS Instagram
export async function fetchChapterPosts(): Promise<SocialPost[]> {
  return fetchInstagramPosts('fbla.nchs');
}

// Main export function
export async function fetchInstagramPostsByUsername(username: string): Promise<SocialPost[]> {
  return fetchInstagramPosts(username);
}