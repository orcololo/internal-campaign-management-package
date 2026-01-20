// apps/web/lib/geo-utils.ts
/**
 * Check if a point is inside a polygon using ray-casting algorithm
 */
export function isPointInPolygon(
  point: [number, number],
  polygon: number[][][]
): boolean {
  const [x, y] = point;
  const ring = polygon[0]; // Use outer ring
  
  if (!ring) return false;

  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Check if a point is inside a circle
 */
export function isPointInCircle(
  point: [number, number],
  center: [number, number],
  radiusKm: number
): boolean {
  const [lng, lat] = point;
  const [centerLng, centerLat] = center;
  
  // Haversine formula for distance
  const R = 6371; // Earth radius in km
  const dLat = (lat - centerLat) * Math.PI / 180;
  const dLng = (lng - centerLng) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(centerLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance <= radiusKm;
}
