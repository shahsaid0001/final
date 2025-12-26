
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening';
export type DeviceType = 'Mobile' | 'Desktop' | 'Tablet';
export type ContentType = 'Music' | 'Video' | 'News' | 'Podcast' | 'Search';

// For the Z-axis structure, we select 3 main types to form the grid
export type AxisContentType = 'Music' | 'Video' | 'News'; 

export interface UserActivity {
  id: string;
  hour: number;
  minutes: number;
  recommended: boolean;
  completed: boolean;
  binge: boolean;
  country: string;
}

export interface DataPoint {
  id: string;
  // Dimensions (Coordinates)
  x_dim: TimeOfDay;
  y_dim: DeviceType;
  z_dim: AxisContentType;
  
  // Visual Properties
  colorType: ContentType; // Actual content type for coloring
  
  // Metrics
  avg_session_minutes: number; // Controls Scale
  user_count: number;          // Controls Opacity
  total_revenue: number;
  
  // 3D Position [-1, 0, 1]
  position: [number, number, number];

  // Raw Data for Grid View
  contributing_users: UserActivity[];
}

export interface CubeState {
  hoveredCell: DataPoint | null;
  selectedCell: DataPoint | null;
}