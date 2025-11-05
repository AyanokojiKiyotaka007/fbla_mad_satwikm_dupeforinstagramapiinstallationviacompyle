import { Linking, Platform, Alert } from 'react-native';
import { Event } from '../types';

/**
 * Formats a date string and time string into ISO format for calendar
 * @param dateStr - Date string like "Dec 15, 2024"
 * @param timeStr - Time string like "3:00 PM - 5:00 PM"
 * @returns Object with start and end dates in ISO format
 */
function parseEventDateTime(dateStr: string, timeStr: string): { start: string; end: string } {
  try {
    // Parse the date
    const dateParts = dateStr.replace(',', '').split(' ');
    const monthMap: { [key: string]: number } = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    const month = monthMap[dateParts[0]];
    const day = parseInt(dateParts[1]);
    const year = parseInt(dateParts[2]);
    
    // Parse the time
    const timeParts = timeStr.split(' - ');
    const startTime = timeParts[0].trim();
    const endTime = timeParts[1]?.trim() || startTime;
    
    // Convert to 24-hour format
    const parseTime = (time: string) => {
      const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return { hours: 12, minutes: 0 };
      
      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const period = match[3].toUpperCase();
      
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      return { hours, minutes };
    };
    
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    
    // Create Date objects
    const startDate = new Date(year, month, day, start.hours, start.minutes);
    const endDate = new Date(year, month, day, end.hours, end.minutes);
    
    // If end time is before start time, assume it's the next day
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
    
    return {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    };
  } catch (error) {
    console.error('Error parsing date/time:', error);
    // Fallback to current date + 1 hour
    const now = new Date();
    const later = new Date(now.getTime() + 60 * 60 * 1000);
    return {
      start: now.toISOString(),
      end: later.toISOString(),
    };
  }
}

/**
 * Formats date for Google Calendar URL (YYYYMMDDTHHMMSSZ format)
 */
function formatGoogleCalendarDate(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Adds an event to Google Calendar
 * @param event - The event object to add
 */
export async function addToGoogleCalendar(event: Event): Promise<void> {
  try {
    const { start, end } = parseEventDateTime(event.date, event.time);
    
    // Format dates for Google Calendar
    const startFormatted = formatGoogleCalendarDate(start);
    const endFormatted = formatGoogleCalendarDate(end);
    
    // Encode event details
    const title = encodeURIComponent(event.title);
    const description = encodeURIComponent(event.description || '');
    const location = encodeURIComponent(event.location);
    
    // Create Google Calendar URL
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&details=${description}&location=${location}&sf=true&output=xml`;
    
    // Check if URL can be opened
    const canOpen = await Linking.canOpenURL(googleCalendarUrl);
    
    if (canOpen) {
      await Linking.openURL(googleCalendarUrl);
    } else {
      Alert.alert(
        'Unable to Open Calendar',
        'Please make sure you have Google Calendar installed or use a web browser.',
        [{ text: 'OK' }]
      );
    }
  } catch (error) {
    console.error('Error adding to Google Calendar:', error);
    Alert.alert(
      'Error',
      'Failed to add event to Google Calendar. Please try again.',
      [{ text: 'OK' }]
    );
  }
}

/**
 * Shows options for adding event to calendar
 * @param event - The event object to add
 */
export function showCalendarOptions(event: Event): void {
  Alert.alert(
    'Add to Calendar',
    'Choose how you\'d like to add this event to your calendar:',
    [
      {
        text: 'Google Calendar',
        onPress: () => addToGoogleCalendar(event),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]
  );
}