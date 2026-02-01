ginimport * as Location from 'expo-location';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
  address: string;
  rating: number;
  image: string;
}

// Request location permission
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

// Get current location
export const getCurrentLocation = async (): Promise<LocationCoords | null> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      if (newStatus !== 'granted') {
        return null;
      }
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get nearby restaurants (mock data for now)
export const getNearbyRestaurants = async (
  userLocation: LocationCoords,
  radiusKm: number = 5
): Promise<Restaurant[]> => {
  try {
    // Mock restaurants data
    const mockRestaurants: Restaurant[] = [
      {
        id: '1',
        name: 'KFC',
        latitude: userLocation.latitude + 0.01,
        longitude: userLocation.longitude + 0.01,
        distance: 1.2,
        address: '123 Main Street',
        rating: 4.2,
        image: require('../assets/images/KFC.jpg'),
      },
      {
        id: '2',
        name: "McDonald's",
        latitude: userLocation.latitude - 0.01,
        longitude: userLocation.longitude + 0.02,
        distance: 2.1,
        address: '456 Oak Avenue',
        rating: 4.0,
        image: require('../assets/images/McDonald\'s.jpg'),
      },
      {
        id: '3',
        name: 'Nandos',
        latitude: userLocation.latitude + 0.02,
        longitude: userLocation.longitude - 0.01,
        distance: 1.8,
        address: '789 Pine Road',
        rating: 4.5,
        image: require('../assets/images/Nandos.jpg'),
      },
      {
        id: '4',
        name: 'Pedros',
        latitude: userLocation.latitude - 0.02,
        longitude: userLocation.longitude - 0.02,
        distance: 3.2,
        address: '321 Elm Street',
        rating: 4.3,
        image: require('../assets/images/Pedros.jpg'),
      },
      {
        id: '5',
        name: 'Hungry Lion',
        latitude: userLocation.latitude + 0.015,
        longitude: userLocation.longitude - 0.015,
        distance: 2.5,
        address: '654 Maple Drive',
        rating: 3.9,
        image: require('../assets/images/Hungry Lion.jpg'),
      },
      {
        id: '6',
        name: 'Vida e Caffè',
        latitude: userLocation.latitude - 0.015,
        longitude: userLocation.longitude + 0.015,
        distance: 1.5,
        address: '987 Cedar Lane',
        rating: 4.4,
        image: require('../assets/images/Vida Caffe.jpg'),
      },
    ];

    // Filter by radius and sort by distance
    return mockRestaurants
      .filter((restaurant) => restaurant.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Error getting nearby restaurants:', error);
    return [];
  }
};

// Get address from coordinates
export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (addresses.length > 0) {
      const address = addresses[0];
      return `${address.street}, ${address.city}, ${address.region}`;
    }

    return null;
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    return null;
  }
};

// Get coordinates from address
export const getCoordinatesFromAddress = async (
  address: string
): Promise<LocationCoords | null> => {
  try {
    const geocoded = await Location.geocodeAsync(address);

    if (geocoded.length > 0) {
      return {
        latitude: geocoded[0].latitude,
        longitude: geocoded[0].longitude,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting coordinates from address:', error);
    return null;
  }
};

// Watch user location
export const watchUserLocation = (
  callback: (location: LocationCoords) => void,
  errorCallback?: (error: any) => void
): (() => void) => {
  let subscription: any = null;

  const startWatching = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus !== 'granted') {
          errorCallback?.(new Error('Location permission denied'));
          return;
        }
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );
    } catch (error) {
      errorCallback?.(error);
    }
  };

  startWatching();

  return () => {
    if (subscription) {
      subscription.remove();
    }
  };
};
