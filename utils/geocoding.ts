interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    state?: string;
    postcode?: string;
  };
}

interface NominatimResponse {
  results: GeocodeResult[];
}

export async function searchLocation(query: string): Promise<GeocodeResult[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=5`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "EateryApp/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NominatimResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching location:", error);
    return [];
  }
}

export async function searchRestaurantsByLocation(
  locationQuery: string,
  radius: number = 1500,
): Promise<any[]> {
  try {
    // First, geocode the location query to get coordinates
    const geocodeResults = await searchLocation(locationQuery);

    if (geocodeResults.length === 0) {
      console.log("No location found for query:", locationQuery);
      return [];
    }

    const location = geocodeResults[0];
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);

    // Now search for restaurants near those coordinates
    const bbox = [
      lat - radius / 111000,
      lon - radius / (111000 * Math.cos((lat * Math.PI) / 180)),
      lat + radius / 111000,
      lon + radius / (111000 * Math.cos((lat * Math.PI) / 180)),
    ].join(",");

    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="restaurant"](${bbox});
        node["amenity"="fast_food"](${bbox});
        node["amenity"="cafe"](${bbox});
        node["shop"="bakery"](${bbox});
        node["shop"="supermarket"](${bbox});
      );
      out body;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "EateryApp/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Calculate distances and format results
    const restaurants = data.elements
      .filter((node: any) => node.tags.name)
      .map((node: any) => {
        const distance = calculateDistance(lat, lon, node.lat, node.lon);
        return {
          ...node,
          distance: distance,
          searchLocation: location.display_name,
        };
      })
      .sort((a: any, b: any) => a.distance - b.distance)
      .slice(0, 20);

    return restaurants;
  } catch (error) {
    console.error("Error searching restaurants by location:", error);
    return [];
  }
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
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
  return R * c;
}
