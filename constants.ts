import { ContentType } from './types';

// Visual Constants
export const CUBE_SPACING = 1.1; // Tight packing
export const CELL_SIZE = 1.0;
export const GLOW_INTENSITY = 0.6;

// Color Palette Mapped to Content Type
export const CONTENT_TYPE_COLORS: Record<ContentType, string> = {
  music: '#F43F5E',   // Rose
  news: '#3B82F6',    // Blue
  search: '#10B981',  // Emerald
  podcast: '#8B5CF6', // Violet
  video: '#F59E0B'    // Amber
};

// Dimensions extracted "from file"
export const DAY_TYPES = ['weekday', 'weekend'];
export const DEVICES = ['mobile', 'desktop'];
export const CONTENT_TYPES: ContentType[] = ['music', 'news', 'search', 'podcast', 'video'];

// Axis Labels
export const AXIS_LABELS = {
  x: 'Day Type',
  y: 'Device',
  z: 'Content Type'
};