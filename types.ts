export type ContentType = 'music' | 'news' | 'search' | 'podcast' | 'video';

export interface UserDetail {
  id: string;
  minutes: number;
  binge: boolean;
  hour: number;
  recommended: boolean;
  completed: boolean;
}

export interface DataPoint {
  id: string;
  // Dimensions
  content_type: ContentType;
  day_type: string;     // Dimension X
  device: string;       // Dimension Y
  
  // Metrics
  avg_session_minutes: number; // Primary Metric
  total_session_minutes: number;
  user_count: number;
  binge_rate: number;
  completion_rate: number;
  recommendation_rate: number;
  
  // Drill down data
  contributing_users: UserDetail[];

  coordinates: [number, number, number]; // Calculated 3D position
}

export interface AxisConfig {
  x: string[];
  y: string[];
  z: ContentType[];
}

export interface CubeState {
  hoveredCellId: string | null;
  selectedCellId: string | null;
}

export interface TooltipData {
  x: number;
  y: number;
  data: DataPoint | null;
}