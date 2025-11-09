import { SocialPost } from '../types';

// Instagram base URL
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

// Fetch Instagram posts using web scraping
async function fetchInstagramPosts(username: string): Promise<SocialPost[]> {
  try {
    console.log(`🔍 Fetching Instagram posts for @${username}...`);
    
    // Fetch the Instagram profile page
    const response = await fetch(`${INSTAGRAM_BASE}/${username}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    console.log(`✅ Fetched HTML for @${username} (${html.length} chars)`);

    // Extract JSON data from the HTML
    const posts = extractPostsFromHTML(html, username);
    
    if (posts.length > 0) {
      console.log(`✅ Successfully extracted ${posts.length} posts from @${username}`);
      return posts;
    }

    console.log(`⚠️ No posts found for @${username}`);
    return [];
  } catch (error) {
    console.error(`❌ Error fetching Instagram posts for @${username}:`, error);
    throw error;
  }
}

// Extract posts from HTML
function extractPostsFromHTML(html: string, username: string): SocialPost[] {
  const posts: SocialPost[] = [];
  
  try {
    // Method 1: Extract from window._sharedData
    const sharedDataStart = html.indexOf('window._sharedData = ');
    if (sharedDataStart !== -1) {
      const jsonStart = sharedDataStart + 'window._sharedData = '.length;
      const jsonEnd = html.indexOf(';</script>', jsonStart);
      
      if (jsonEnd !== -1) {
        try {
          const jsonStr = html.substring(jsonStart, jsonEnd);
          const sharedData = JSON.parse(jsonStr);
          console.log('📦 Found window._sharedData');
          const extractedPosts = extractFromSharedData(sharedData, username);
          if (extractedPosts.length > 0) {
            return extractedPosts;
          }
        } catch (parseError) {
          console.log('⚠️ Failed to parse _sharedData');
        }
      }
    }

    // Method 2: Look for embedded JSON in script tags
    const scriptStart = html.indexOf('<script type="application/json"');
    if (scriptStart !== -1) {
      const contentStart = html.indexOf('>', scriptStart) + 1;
      const contentEnd = html.indexOf('</script>', contentStart);
      
      if (contentEnd !== -1) {
        try {
          const jsonStr = html.substring(contentStart, contentEnd);
          const jsonData = JSON.parse(jsonStr);
          console.log('🔍 Found embedded JSON data');
          const extractedPosts = extractFromEmbeddedData(jsonData, username);
          if (extractedPosts.length > 0) {
            return extractedPosts;
          }
        } catch (parseError) {
          console.log('⚠️ Failed to parse embedded JSON');
        }
      }
    }

    console.log('⚠️ Could not extract posts from HTML');
  } catch (error) {
    console.error('Error extracting posts from HTML:', error);
  }

  return posts;
}

// Extract posts from _sharedData
function extractFromSharedData(data: any, username: string): SocialPost[] {
  const posts: SocialPost[] = [];
  
  try {
    const user = data?.entry_data?.ProfilePage?.[0]?.graphql?.user;
    if (!user) return [];

    const edges = user.edge_owner_to_timeline_media?.edges || [];
    
    for (let i = 0; i < Math.min(edges.length, 10); i++) {
      const node = edges[i].node;
      const post = createPostFromNode(node, username);
      if (post) posts.push(post);
    }
  } catch (error) {
    console.error('Error extracting from shared data:', error);
  }

  return posts;
}

// Extract posts from embedded data
function extractFromEmbeddedData(data: any, username: string): SocialPost[] {
  const posts: SocialPost[] = [];
  
  try {
    // Navigate through the data structure to find posts
    const findPosts = (obj: any): any[] => {
      if (!obj || typeof obj !== 'object') return [];
      
      // Check if this object has edges (Instagram's post structure)
      if (obj.edges && Array.isArray(obj.edges)) {
        return obj.edges;
      }
      
      // Check for timeline_media
      if (obj.edge_owner_to_timeline_media?.edges) {
        return obj.edge_owner_to_timeline_media.edges;
      }
      
      // Recursively search through the object
      for (const key in obj) {
        const result = findPosts(obj[key]);
        if (result.length > 0) return result;
      }
      
      return [];
    };

    const edges = findPosts(data);
    
    for (let i = 0; i < Math.min(edges.length, 10); i++) {
      const node = edges[i].node || edges[i];
      const post = createPostFromNode(node, username);
      if (post) posts.push(post);
    }
  } catch (error) {
    console.error('Error extracting from embedded data:', error);
  }

  return posts;
}

// Create a SocialPost from an Instagram node
function createPostFromNode(node: any, username: string): SocialPost | null {
  try {
    // Extract caption
    const captionEdges = node.edge_media_to_caption?.edges || [];
    const caption = captionEdges.length > 0 ? captionEdges[0].node.text : '';

    const post: SocialPost = {
      id: node.shortcode || node.id || `ig_${Date.now()}`,
      username: username === 'fbla_pbl' ? 'FBLA National' : 'FBLA NCHS',
      handle: `@${username}`,
      content: caption || 'View this post on Instagram',
      timestamp: getRelativeTime(node.taken_at_timestamp || Date.now() / 1000),
      likes: node.edge_liked_by?.count || node.edge_media_preview_like?.count || 0,
      retweets: 0,
      replies: node.edge_media_to_comment?.count || node.edge_media_preview_comment?.count || 0,
      isLiked: false,
      isRetweeted: false,
    };

    // Add media
    if (node.is_video) {
      post.videoThumbnail = node.thumbnail_src || node.display_url;
      post.videoUrl = `${INSTAGRAM_BASE}/p/${node.shortcode}/`;
    } else if (node.display_url || node.thumbnail_src) {
      post.images = [node.display_url || node.thumbnail_src];
    }

    return post;
  } catch (error) {
    console.error('Error creating post from node:', error);
    return null;
  }
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