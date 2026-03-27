import * as Location from 'expo-location';

import { FavoritePlace } from '@/src/types';

export async function requestPermissions(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentLocation(): Promise<Location.LocationObject> {
  return Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
}

export function buildFavoritePlace(
  userId: string,
  name: string,
  location: Location.LocationObject
): Omit<FavoritePlace, 'id'> {
  return {
    userId,
    name,
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    createdAt: new Date(),
  };
}
