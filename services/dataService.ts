import { DataPoint, ContentType, UserActivity } from '../types';
import { X_AXIS_VALUES, Y_AXIS_VALUES, Z_AXIS_VALUES } from '../constants';

const CIS_COUNTRIES = ['Russia', 'Kazakhstan', 'Belarus', 'Uzbekistan', 'Kyrgyzstan', 'Armenia'];

export const generateCubeData = (): DataPoint[] => {
  const data: DataPoint[] = [];

  // Generate 3x3x3 = 27 cells
  X_AXIS_VALUES.forEach((xVal, xIdx) => {
    Y_AXIS_VALUES.forEach((yVal, yIdx) => {
      Z_AXIS_VALUES.forEach((zVal, zIdx) => {
        
        // Map grid index 0,1,2 to coordinates -1,0,1
        const xPos = xIdx - 1;
        const yPos = yIdx - 1;
        const zPos = zIdx - 1;

        // Randomize metrics
        // Center of cube (0,0,0) tends to have higher stats for visualization interest
        const distFromCenter = Math.sqrt(xPos*xPos + yPos*yPos + zPos*zPos);
        const centerBias = 1.5 - (distFromCenter * 0.3);

        const avgSession = Math.max(2, Math.random() * 45 * centerBias);
        
        // LIMIT: Max 40 users per segment
        // Base range 2-30, multiplied by bias (up to 1.5x), clamped at 40
        const rawCount = (Math.random() * 30 + 2) * centerBias;
        const userCount = Math.floor(Math.max(2, Math.min(40, rawCount)));
        
        // Assign color type based on Z-axis but vary slightly for realism
        // If Z is Music, mostly Music, but sometimes Podcast
        let type: ContentType = zVal;
        if (zVal === 'Music' && Math.random() > 0.8) type = 'Podcast';
        if (zVal === 'News' && Math.random() > 0.8) type = 'Search';

        // Pick a dominant country for this segment to make data look realistic
        const dominantCountry = CIS_COUNTRIES[Math.floor(Math.random() * CIS_COUNTRIES.length)];

        // Generate mock user data matching the userCount
        const contributingUsers: UserActivity[] = Array.from({ length: userCount }).map((_, i) => ({
          id: `USR-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          hour: Math.floor(Math.random() * 24),
          minutes: Math.floor(Math.random() * 60) + 5,
          recommended: Math.random() > 0.5,
          completed: Math.random() > 0.4,
          binge: Math.random() > 0.85,
          // 70% chance to be from the dominant country, else random
          country: Math.random() > 0.3 ? dominantCountry : CIS_COUNTRIES[Math.floor(Math.random() * CIS_COUNTRIES.length)]
        }));

        data.push({
          id: `${xVal}-${yVal}-${zVal}`,
          x_dim: xVal,
          y_dim: yVal,
          z_dim: zVal,
          colorType: type,
          avg_session_minutes: avgSession,
          user_count: userCount,
          total_revenue: avgSession * userCount * 0.05,
          position: [xPos, yPos, zPos],
          contributing_users: contributingUsers
        });
      });
    });
  });

  return data;
};