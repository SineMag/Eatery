import { useWindowDimensions } from 'react-native';
import { BREAKPOINTS } from '@/src/constants/breakpoints';

export function useResponsive() {
  const { width } = useWindowDimensions();
  const isTablet = width >= BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.desktop;

  return {
    width,
    isMobile: !isTablet,
    isTablet,
    isDesktop,
  };
}

