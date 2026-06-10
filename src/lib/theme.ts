// Shared chart palette — luxury charcoal + gold with restrained accents.
export const palette = {
  gold: "#C8A862",
  goldDeep: "#B08D3E",
  goldLight: "#EAD49A",
  charcoal: "#1B1B1F",
  charcoal600: "#34343A",
  charcoal400: "#6F6F77",
  grid: "#E7E7E9",
  emerald: "#1F9D6B",
  rose: "#D2484A",
  amber: "#D9920B",
  sky: "#2E7CB8",
  ink: "#121215",
};

// Ordered series colors for multi-segment charts (service mix, channels).
export const series = [
  "#C8A862",
  "#1B1B1F",
  "#B08D3E",
  "#6F6F77",
  "#DFBE6C",
  "#A3A3A9",
  "#8C6E2F",
  "#C9C9CD",
];

export const tooltipStyle = {
  borderRadius: 14,
  border: "1px solid #E7E7E9",
  boxShadow: "0 18px 40px -16px rgba(18,18,21,0.22)",
  fontSize: 12,
  padding: "10px 12px",
  background: "#FFFFFF",
} as const;
