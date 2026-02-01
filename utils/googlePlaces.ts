interface GooglePlace {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  types: string[];
}

interface PlacesResponse {
  results: GooglePlace[];
  status: string;
}

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "";
const BASE_URL = "https://maps.googleapis.com/maps/api/place";

export async function fetchNearbyRestaurants(
  latitude: number,
  longitude: number,
  radius: number = 1500, // 1.5km in meters
): Promise<GooglePlace[]> {
  if (!API_KEY) {
    console.warn("Google Places API key not found. Using mock data.");
    return getMockRestaurants();
  }

  try {
    const location = `${latitude},${longitude}`;
    const radiusInMeters = radius;
    const type = "restaurant";
    const keyword = "food restaurant";

    const url = `${BASE_URL}/nearbysearch/json?location=${location}&radius=${radiusInMeters}&type=${type}&keyword=${keyword}&key=${API_KEY}`;

    const response = await fetch(url);
    const data: PlacesResponse = await response.json();

    if (data.status !== "OK") {
      console.error("Google Places API error:", data.status);
      return getMockRestaurants();
    }

    return data.results.slice(0, 10); // Limit to 10 restaurants
  } catch (error) {
    console.error("Error fetching nearby restaurants:", error);
    return getMockRestaurants();
  }
}

export function getRestaurantPhotoUrl(
  photoReference: string,
  maxWidth: number = 400,
): string {
  if (!API_KEY) return "";
  return `${BASE_URL}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${API_KEY}`;
}

function getMockRestaurants(): GooglePlace[] {
  return [
    {
      place_id: "1",
      name: "McDonald's",
      vicinity: "123 Main St",
      geometry: {
        location: { lat: 40.7128, lng: -74.006 },
      },
      rating: 4.2,
      user_ratings_total: 1250,
      price_level: 2,
      opening_hours: { open_now: true },
      types: ["restaurant", "fast_food"],
    },
    {
      place_id: "2",
      name: "KFC",
      vicinity: "456 Broad St",
      geometry: {
        location: { lat: 40.7128, lng: -74.006 },
      },
      rating: 4.1,
      user_ratings_total: 890,
      price_level: 2,
      opening_hours: { open_now: true },
      types: ["restaurant", "fast_food"],
    },
    {
      place_id: "3",
      name: "Burger King",
      vicinity: "789 Oak Ave",
      geometry: {
        location: { lat: 40.7128, lng: -74.006 },
      },
      rating: 4.0,
      user_ratings_total: 650,
      price_level: 2,
      opening_hours: { open_now: true },
      types: ["restaurant", "fast_food"],
    },
    {
      place_id: "4",
      name: "Starbucks",
      vicinity: "321 Pine St",
      geometry: {
        location: { lat: 40.7128, lng: -74.006 },
      },
      rating: 4.3,
      user_ratings_total: 2100,
      price_level: 2,
      opening_hours: { open_now: true },
      types: ["restaurant", "cafe"],
    },
    {
      place_id: "5",
      name: "Subway",
      vicinity: "654 Elm St",
      geometry: {
        location: { lat: 40.7128, lng: -74.006 },
      },
      rating: 3.8,
      user_ratings_total: 420,
      price_level: 2,
      opening_hours: { open_now: true },
      types: ["restaurant", "sandwich"],
    },
  ];
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): string {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
}
