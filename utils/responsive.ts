import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Breakpoints for different screen sizes
export const BREAKPOINTS = {
  xs: 320, // Small phones
  sm: 375, // Regular phones
  md: 768, // Tablets
  lg: 1024, // Large tablets
  xl: 1280, // Desktops
  xxl: 1536, // Large desktops
};

// Get current screen size category
export const getScreenSize = () => {
  if (width >= BREAKPOINTS.xxl) return "xxl";
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return "xs";
};

// Check if screen is mobile
export const isMobile = () => width < BREAKPOINTS.md;
export const isTablet = () => width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
export const isDesktop = () => width >= BREAKPOINTS.lg;

// Responsive values
export const responsive = {
  // Font sizes
  fontSize: {
    xs: { title: 20, section: 16, card: 14, text: 12 },
    sm: { title: 22, section: 17, card: 15, text: 13 },
    md: { title: 24, section: 18, card: 16, text: 14 },
    lg: { title: 26, section: 20, card: 17, text: 15 },
    xl: { title: 28, section: 22, card: 18, text: 16 },
    xxl: { title: 30, section: 24, card: 19, text: 17 },
  },

  // Spacing
  spacing: {
    xs: { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 28 },
    sm: { xs: 12, sm: 16, md: 20, lg: 24, xl: 28, xxl: 32 },
    md: { xs: 16, sm: 20, md: 24, lg: 28, xl: 32, xxl: 36 },
    lg: { xs: 20, sm: 24, md: 28, lg: 32, xl: 36, xxl: 40 },
    xl: { xs: 24, sm: 28, md: 32, lg: 36, xl: 40, xxl: 44 },
  },

  // Card dimensions
  card: {
    xs: { width: 140, height: 180 },
    sm: { width: 160, height: 200 },
    md: { width: 180, height: 220 },
    lg: { width: 200, height: 240 },
    xl: { width: 220, height: 260 },
    xxl: { width: 240, height: 280 },
  },

  // Grid columns
  gridColumns: {
    xs: 2,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
    xxl: 6,
  },

  // Container max width
  containerMaxWidth: {
    xs: width,
    sm: width,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },
};

// Get responsive value based on current screen size
export const getResponsiveValue = <T>(
  values: Partial<Record<keyof typeof BREAKPOINTS, T>>,
  fallback: T,
): T => {
  const screenSize = getScreenSize();
  return values[screenSize] || fallback;
};

// Responsive styles helper
export const createResponsiveStyles = (
  screenSize: keyof typeof BREAKPOINTS,
) => {
  const sizes = responsive.fontSize[screenSize];
  const spacing = responsive.spacing.md[screenSize];
  const card = responsive.card[screenSize];
  const columns = responsive.gridColumns[screenSize];
  const maxWidth = responsive.containerMaxWidth[screenSize];

  return {
    // Typography
    titleFontSize: sizes.title,
    sectionFontSize: sizes.section,
    cardFontSize: sizes.card,
    textFontSize: sizes.text,

    // Spacing
    padding: spacing,
    margin: spacing,
    cardMargin: spacing / 2,

    // Cards
    cardWidth: card.width,
    cardHeight: card.height,

    // Grid
    gridColumns: columns,
    categoryCardWidth: `${100 / columns - 2}%`,

    // Container
    containerMaxWidth: maxWidth,

    // Special handling for different screen sizes
    isMobile: screenSize === "xs" || screenSize === "sm",
    isTablet: screenSize === "md",
    isDesktop:
      screenSize === "lg" || screenSize === "xl" || screenSize === "xxl",
  };
};

// Hook to get responsive styles
export const useResponsiveStyles = () => {
  const screenSize = getScreenSize();
  return createResponsiveStyles(screenSize);
};

// Export current dimensions
export { height, width };

// Listen for dimension changes
export const addDimensionListener = (callback: () => void) => {
  const subscription = Dimensions.addEventListener("change", callback);
  return subscription;
};
