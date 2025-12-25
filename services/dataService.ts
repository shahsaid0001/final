import { DataPoint, AxisConfig, ContentType } from '../types';
import { DAY_TYPES, DEVICES, CONTENT_TYPES } from '../constants';

const RAW_DATA = `user_id,hour,day_type,device,content_type,session_minutes,recommended,completed,is_binge
U01,8,weekday,mobile,music,7,no,0,0
U02,9,weekday,mobile,news,6,no,0,0
U03,10,weekday,desktop,search,9,no,1,0
U04,11,weekday,mobile,music,12,yes,1,0
U05,12,weekday,desktop,search,15,no,1,0
U06,13,weekday,mobile,podcast,18,yes,1,0
U07,14,weekday,mobile,music,10,no,0,0
U08,15,weekday,desktop,video,22,yes,1,0
U09,16,weekday,mobile,news,8,no,0,0
U10,17,weekday,desktop,video,28,yes,1,0
U11,18,weekday,mobile,video,25,yes,1,0
U12,19,weekday,desktop,video,40,yes,1,1
U13,20,weekday,desktop,video,55,yes,1,1
U14,21,weekday,mobile,video,34,yes,0,0
U15,22,weekday,desktop,video,70,yes,1,1
U16,23,weekday,mobile,video,45,yes,1,1
U17,0,weekday,mobile,video,30,no,0,0
U18,1,weekday,desktop,video,60,yes,1,1
U19,2,weekday,mobile,music,14,no,0,0
U20,3,weekday,mobile,music,9,no,0,0
U21,9,weekend,mobile,music,15,yes,1,0
U22,11,weekend,mobile,video,32,yes,1,0
U23,13,weekend,desktop,video,48,yes,1,1
U24,15,weekend,mobile,podcast,25,yes,1,0
U25,17,weekend,desktop,video,52,yes,1,1
U26,18,weekend,mobile,video,38,yes,1,0
U27,19,weekend,desktop,video,65,yes,1,1
U28,20,weekend,desktop,video,80,yes,1,1
U29,21,weekend,desktop,video,95,yes,1,1
U30,22,weekend,mobile,video,50,yes,0,1
U31,23,weekend,desktop,video,110,yes,1,1
U32,0,weekend,desktop,video,90,yes,1,1
U33,1,weekend,mobile,music,20,no,0,0
U34,2,weekend,mobile,music,18,no,0,0
U35,3,weekend,mobile,music,12,no,0,0
U36,10,weekend,mobile,news,14,yes,1,0
U37,12,weekend,desktop,search,18,no,1,0
U38,14,weekend,mobile,music,16,no,0,0
U39,16,weekend,desktop,video,35,yes,1,0
U40,18,weekend,desktop,video,60,yes,1,1`;

interface RawRow {
  user_id: string;
  hour: number;
  day_type: string;
  device: string;
  content_type: ContentType;
  session_minutes: number;
  recommended: boolean;
  completed: boolean;
  is_binge: boolean;
}

const parseCSV = (csv: string): RawRow[] => {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      user_id: values[0],
      hour: parseInt(values[1]),
      day_type: values[2],
      device: values[3],
      content_type: values[4] as ContentType,
      session_minutes: parseInt(values[5]),
      recommended: values[6] === 'yes',
      completed: parseInt(values[7]) === 1,
      is_binge: parseInt(values[8]) === 1
    };
  });
  return rows;
};

export const generateOlapData = (): { data: DataPoint[], axes: AxisConfig } => {
  const rawData = parseCSV(RAW_DATA);
  const data: DataPoint[] = [];
  let idCounter = 0;

  // Aggregate Data into Cube Cells
  // X: Day Type, Y: Device, Z: Content Type
  DAY_TYPES.forEach((dayType, xIndex) => {
    DEVICES.forEach((device, yIndex) => {
      CONTENT_TYPES.forEach((contentType, zIndex) => {
        
        const cellRows = rawData.filter(r => 
          r.day_type === dayType && 
          r.device === device && 
          r.content_type === contentType
        );

        if (cellRows.length > 0) {
          idCounter++;
          
          const totalMinutes = cellRows.reduce((acc, r) => acc + r.session_minutes, 0);
          const avgMinutes = totalMinutes / cellRows.length;
          
          const bingeCount = cellRows.filter(r => r.is_binge).length;
          const completionCount = cellRows.filter(r => r.completed).length;
          const recCount = cellRows.filter(r => r.recommended).length;

          // Extract row details for drill-down
          const contributingUsers = cellRows.map(r => ({
            id: r.user_id,
            minutes: r.session_minutes,
            binge: r.is_binge,
            hour: r.hour,
            recommended: r.recommended,
            completed: r.completed
          })).sort((a, b) => b.minutes - a.minutes);

          data.push({
            id: `cell-${idCounter}`,
            content_type: contentType,
            day_type: dayType,
            device: device,
            avg_session_minutes: avgMinutes,
            total_session_minutes: totalMinutes,
            user_count: cellRows.length,
            binge_rate: bingeCount / cellRows.length,
            completion_rate: completionCount / cellRows.length,
            recommendation_rate: recCount / cellRows.length,
            contributing_users: contributingUsers,
            // Center coordinates
            coordinates: [
              xIndex - (DAY_TYPES.length - 1) / 2,
              yIndex - (DEVICES.length - 1) / 2,
              zIndex - (CONTENT_TYPES.length - 1) / 2
            ]
          });
        }
      });
    });
  });

  return {
    data,
    axes: {
      x: DAY_TYPES,
      y: DEVICES,
      z: CONTENT_TYPES
    }
  };
};