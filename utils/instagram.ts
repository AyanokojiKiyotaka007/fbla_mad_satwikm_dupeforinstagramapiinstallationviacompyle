import { SocialPost } from '../types';

// Instagram public API endpoints
const INSTAGRAM_BASE = 'https://www.instagram.com';

// Proxy services to bypass CORS (these are public proxies)
const PROXY_SERVICES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

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

// Generate sample posts as fallback
function generateSamplePosts(username: string): SocialPost[] {
  const isNational = username === 'fbla_pbl';
  const displayName = isNational ? 'FBLA National' : 'FBLA NCHS';
  const handle = `@${username}`;

  const nationalSamples = [
    {
      id: 'sample_n1',
      username: displayName,
      handle,
      content: '🎉 Congratulations to all our National Leadership Conference qualifiers! Your hard work and dedication have paid off. See you this summer! #FBLA #NLC2024 #FutureLeaders',
      timestamp: '2h ago',
      likes: 1247,
      retweets: 0,
      replies: 89,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 'sample_n2',
      username: displayName,
      handle,
      content: '📢 Registration for the Spring Leadership Conference is now open! Don\'t miss this opportunity to network, learn, and compete. Early bird pricing ends March 1st. Link in bio! #FBLA #Leadership',
      timestamp: '5h ago',
      likes: 892,
      retweets: 0,
      replies: 54,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 'sample_n3',
      username: displayName,
      handle,
      content: '💼 Meet our Corporate Partner Spotlight: Microsoft! Learn how they\'re supporting FBLA members with internships, mentorship, and career opportunities. #FBLAPartners #CareerReady',
      timestamp: '1d ago',
      likes: 2156,
      retweets: 0,
      replies: 123,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 'sample_n4',
      username: displayName,
      handle,
      content: '🏆 Competitive Events Tip: Start preparing NOW! Review the guidelines, practice your presentation skills, and work with your team. Success comes from preparation. #FBLA #CompetitiveEvents',
      timestamp: '2d ago',
      likes: 1534,
      retweets: 0,
      replies: 67,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 'sample_n5',
      username: displayName,
      handle,
      content: '🌟 Scholarship Alert! Applications for the FBLA National Scholarship Program are now open. Over $100,000 in scholarships available. Apply by April 15th! #FBLAScholarships',
      timestamp: '3d ago',
      likes: 3421,
      retweets: 0,
      replies: 234,
      isLiked: false,
      isRetweeted: false,
    },
  ];

  const chapterSamples = [
    {
      id: 'sample_c1',
      username: displayName,
      handle,
      content: '🎊 HUGE congratulations to our members who placed at Regionals! 5 first place, 3 second place, and 2 third place finishes! We\'re heading to State! 🏆 #NCHSFBLA #RegionalChamps',
      timestamp: '3h ago',
      likes: 234,
      retweets: 0,
      replies: 45,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 'sample_c2',
      username: displayName,
      handle,
      content: '📅 Reminder: Chapter meeting THIS Thursday at 3:30 PM in Room 204. We\'ll be discussing State Competition prep and fundraising ideas. Pizza will be provided! 🍕',
      timestamp: '6h ago',
      likes: 156,
      retweets: 0,
      replies: 28,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 'sample_c3',
      username: displayName,
      handle,
      content: '💙 Thank you to everyone who participated in our community service project! We collected 500+ items for the local food bank. This is what FBLA is all about! #CommunityService',
      timestamp: '1d ago',
      likes: 289,
      retweets: 0,
      replies: 52,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 'sample_c4',
      username: displayName,
      handle,
      content: '🎤 Guest speaker alert! Next week, we\'re hosting Sarah Chen, CEO of TechStart Inc., for a workshop on entrepreneurship. This is a members-only event - don\'t miss it!',
      timestamp: '2d ago',
      likes: 198,
      retweets: 0,
      replies: 31,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 'sample_c5',
      username: displayName,
      handle,
      content: '📸 Throwback to our amazing networking social last month! Great connections were made and friendships formed. Can\'t wait for the next one! #NCHSFBLA #Networking',
      timestamp: '4d ago',
      likes: 267,
      retweets: 0,
      replies: 38,
      isLiked: false,
      isRetweeted: false,
    },
  ];

  return isNational ? nationalSamples : chapterSamples;
}

// Fetch Instagram posts with multiple fallback strategies
async function fetchInstagramPosts(username: string): Promise<SocialPost[]> {
  // Strategy 1: Try direct API call
  try {
    const response = await fetch(`${INSTAGRAM_BASE}/${username}/?__a=1&__d=dis`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const posts = extractPostsFromData(data, username);
      if (posts.length > 0) {
        console.log(`✅ Successfully fetched ${posts.length} posts from Instagram API`);
        return posts;
      }
    }
  } catch (error) {
    console.log('Direct API failed, trying proxy...');
  }

  // Strategy 2: Try with CORS proxy
  for (const proxy of PROXY_SERVICES) {
    try {
      const url = encodeURIComponent(`${INSTAGRAM_BASE}/${username}/?__a=1`);
      const response = await fetch(`${proxy}${url}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const posts = extractPostsFromData(data, username);
        if (posts.length > 0) {
          console.log(`✅ Successfully fetched ${posts.length} posts via proxy`);
          return posts;
        }
      }
    } catch (error) {
      console.log(`Proxy ${proxy} failed, trying next...`);
      continue;
    }
  }

  // Strategy 3: Use sample data as fallback
  console.log('⚠️ All API methods failed, using sample data');
  return generateSamplePosts(username);
}

// Extract posts from Instagram API response
function extractPostsFromData(data: any, username: string): SocialPost[] {
  const posts: SocialPost[] = [];
  
  try {
    // Try multiple data structures
    const user = data?.graphql?.user || data?.data?.user || data?.user;
    if (!user) return [];

    const edges = user.edge_owner_to_timeline_media?.edges || 
                  user.timeline_media?.edges ||
                  [];
    
    for (let i = 0; i < Math.min(edges.length, 10); i++) {
      const node = edges[i].node;
      
      // Extract caption
      const captionEdges = node.edge_media_to_caption?.edges || [];
      const caption = captionEdges.length > 0 ? captionEdges[0].node.text : '';

      const post: SocialPost = {
        id: node.shortcode || node.id || `ig_${i}`,
        username: username === 'fbla_pbl' ? 'FBLA National' : 'FBLA NCHS',
        handle: `@${username}`,
        content: caption,
        timestamp: getRelativeTime(node.taken_at_timestamp || Date.now() / 1000),
        likes: node.edge_liked_by?.count || node.like_count || 0,
        retweets: 0,
        replies: node.edge_media_to_comment?.count || node.comment_count || 0,
        isLiked: false,
        isRetweeted: false,
      };

      // Add media
      if (node.is_video) {
        post.videoThumbnail = node.thumbnail_src || node.display_url;
        post.videoUrl = `${INSTAGRAM_BASE}/p/${node.shortcode}/`;
      } else if (node.display_url) {
        post.images = [node.display_url];
      }

      posts.push(post);
    }
  } catch (error) {
    console.error('Error extracting posts:', error);
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