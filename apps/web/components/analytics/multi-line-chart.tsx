'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DataSeries {
  data: Array<{ date: string; count: number }>;
  name: string;
  color: string;
  dataKey: string;
}

interface MultiLineChartProps {
  series: DataSeries[];
  title: string;
  description?: string;
}

/**
 * Multi-Line Chart Component
 * Displays multiple time-series datasets on one chart
 */
export function MultiLineChart({ series, title, description }: MultiLineChartProps) {
  // Merge all data series by date
  const mergedData = mergeSeries(series);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {mergedData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mergedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                style={{ fontSize: '12px' }}
              />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))'
                }}
              />
              <Legend />
              {series.map((s) => (
                <Line
                  key={s.dataKey}
                  type="monotone"
                  dataKey={s.dataKey}
                  stroke={s.color}
                  strokeWidth={2}
                  name={s.name}
                  dot={{ fill: s.color }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Sem dados disponíveis
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Merge multiple data series into a single dataset
 */
function mergeSeries(series: DataSeries[]) {
  const dateMap = new Map<string, any>();

  // Collect all dates
  series.forEach((s) => {
    s.data.forEach((item) => {
      const formattedDate = new Date(item.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      });
      
      if (!dateMap.has(item.date)) {
        dateMap.set(item.date, { date: formattedDate, rawDate: item.date });
      }
      
      const entry = dateMap.get(item.date);
      entry[s.dataKey] = item.count;
    });
  });

  // Convert to array and sort by date
  return Array.from(dateMap.values()).sort((a, b) => 
    new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
  );
}
