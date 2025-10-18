export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'meeting' | 'competition' | 'workshop' | 'social';
  attendees: number;
  isRegistered: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: 'announcement' | 'achievement' | 'reminder' | 'update';
  imageUrl?: string;
  likes: number;
  isLiked: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'guide' | 'template' | 'presentation' | 'document';
  fileType: 'pdf' | 'doc' | 'ppt' | 'xlsx';
  size: string;
  uploadDate: string;
  downloads: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  chapter: string;
  position: string;
  memberSince: string;
  eventsAttended: number;
  avatar?: string;
  bio: string;
  phone: string;
}

export interface DashboardStats {
  upcomingEvents: number;
  unreadNews: number;
  savedResources: number;
  membershipDays: number;
}