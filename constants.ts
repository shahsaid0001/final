import { TimeOfDay, DeviceType, AxisContentType, ContentType } from './types';

// Visual Configuration
// Solid Cube Settings: Spacing very close to size to look like a solid block
export const CUBE_SPACING = 1.02; // 1.02 creates a hairline gap for definition, looking like a solid block
export const BASE_SIZE = 1.0; 

// Axis Values for 3x3x3 Grid
export const X_AXIS_VALUES: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening'];
export const Y_AXIS_VALUES: DeviceType[] = ['Mobile', 'Tablet', 'Desktop'];
export const Z_AXIS_VALUES: AxisContentType[] = ['Music', 'News', 'Video'];

// Color Mapping
export const TYPE_COLORS: Record<ContentType, string> = {
  Music: '#F43F5E',   // Rose
  Video: '#3B82F6',   // Blue
  News: '#10B981',    // Emerald
  Podcast: '#8B5CF6', // Violet
  Search: '#F59E0B'   // Amber
};

export const DIMENSION_LABELS = {
  x: 'Time of Day',
  y: 'Device Type',
  z: 'Content Category'
};