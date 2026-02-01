export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    card: "#fff",
    primary: "#11181C",
    tint: "#007AFF",
    tabIconDefault: "#868686",
    tabIconSelected: "#11181C",
    border: "#e5e5e5",
    gray: "#6b7280",
    darkGray: "#374151",
    lightGray: "#f3f4f6",
  },
  dark: {
    text: "#fff",
    background: "#11181C",
    card: "#1c1c1e",
    primary: "#fff",
    tint: "#fff",
    tabIconDefault: "#868686",
    tabIconSelected: "#fff",
    border: "#2c2c2e",
    gray: "#9ca3af",
    darkGray: "#f3f4f6",
    lightGray: "#374151",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Typography = {
  title: {
    fontSize: 28,
    fontWeight: "bold" as const,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold" as const,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "normal" as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: "normal" as const,
  },
  small: {
    fontSize: 12,
    fontWeight: "normal" as const,
  },
};
