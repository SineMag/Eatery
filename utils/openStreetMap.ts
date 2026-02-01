interface OSMNode {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    cuisine?: string;
    amenity?: string;
    shop?: string;
    opening_hours?: string;
    phone?: string;
    website?: string;
    addr_street?: string;
    addr_housenumber?: string;
    addr_city?: string;
  };
}

interface OverpassResponse {
  elements: OSMNode[];
}

export async function fetchNearbyRestaurants(
  latitude: number,
  longitude: number,
  radius: number = 1500, // 1.5km in meters
): Promise<OSMNode[]> {
  try {
    // Build Overpass query for nearby restaurants
    const bbox = [
      latitude - radius / 111000, // Convert radius to degrees (approximate)
      longitude - radius / (111000 * Math.cos((latitude * Math.PI) / 180)),
      latitude + radius / 111000,
      longitude + radius / (111000 * Math.cos((latitude * Math.PI) / 180)),
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

    const data: OverpassResponse = await response.json();

    // Filter out nodes without names and sort by distance
    const restaurants = data.elements
      .filter((node) => node.tags.name)
      .map((node) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          node.lat,
          node.lon,
        );
        return {
          ...node,
          distance: distance,
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20); // Limit to 20 restaurants

    return restaurants;
  } catch (error) {
    console.error("Error fetching OpenStreetMap data:", error);
    return getMockRestaurants();
  }
}

export function calculateDistance(
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

export function formatDistance(distance: number | undefined): string {
  if (distance === undefined || distance === null || isNaN(distance)) {
    return "Unknown distance";
  }

  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
}

export function getCuisineType(tags: any): string {
  if (tags.cuisine) {
    const cuisineMap: { [key: string]: string } = {
      burger: "Burgers",
      pizza: "Pizza",
      mexican: "Mexican",
      chinese: "Chinese",
      japanese: "Japanese",
      indian: "Indian",
      italian: "Italian",
      thai: "Thai",
      vietnamese: "Vietnamese",
      american: "American",
      french: "French",
      greek: "Greek",
      mediterranean: "Mediterranean",
      kebab: "Kebab",
      sandwich: "Sandwiches",
      seafood: "Seafood",
      sushi: "Sushi",
      ramen: "Ramen",
      barbecue: "BBQ",
      vegetarian: "Vegetarian",
      vegan: "Vegan",
    };

    const cuisines = tags.cuisine
      .toLowerCase()
      .split(";")
      .map((c: string) => c.trim());
    for (const cuisine of cuisines) {
      if (cuisineMap[cuisine]) {
        return cuisineMap[cuisine];
      }
    }
  }

  if (tags.amenity === "fast_food") return "Fast Food";
  if (tags.amenity === "cafe") return "Cafe";
  if (tags.shop === "bakery") return "Bakery";
  if (tags.shop === "supermarket") return "Grocery";

  return "Restaurant";
}

export function getRestaurantAddress(tags: any): string {
  const parts = [];
  if (tags.addr_housenumber) parts.push(tags.addr_housenumber);
  if (tags.addr_street) parts.push(tags.addr_street);
  if (tags.addr_city) parts.push(tags.addr_city);

  return parts.join(" ") || "Address not available";
}

function getMockRestaurants(): OSMNode[] {
  return [
    {
      id: 1,
      lat: 40.7128,
      lon: -74.006,
      tags: {
        name: "McDonald's",
        cuisine: "burger",
        amenity: "fast_food",
        addr_street: "123 Main St",
        addr_city: "New York",
      },
    },
    {
      id: 2,
      lat: 40.7129,
      lon: -74.0061,
      tags: {
        name: "KFC",
        cuisine: "chicken",
        amenity: "fast_food",
        addr_street: "456 Broad St",
        addr_city: "New York",
      },
    },
    {
      id: 3,
      lat: 40.713,
      lon: -74.0062,
      tags: {
        name: "Burger King",
        cuisine: "burger",
        amenity: "fast_food",
        addr_street: "789 Oak Ave",
        addr_city: "New York",
      },
    },
    {
      id: 4,
      lat: 40.7131,
      lon: -74.0063,
      tags: {
        name: "Starbucks",
        amenity: "cafe",
        addr_street: "321 Pine St",
        addr_city: "New York",
      },
    },
    {
      id: 5,
      lat: 40.7132,
      lon: -74.0064,
      tags: {
        name: "Subway",
        cuisine: "sandwich",
        amenity: "fast_food",
        addr_street: "654 Elm St",
        addr_city: "New York",
      },
    },
  ];
}
