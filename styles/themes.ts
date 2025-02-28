import { ConfigThemes } from "@heroui/theme"

const themes: ConfigThemes = {
  "purple-dark": {
    extend: "dark", // <- inherit default values from dark theme
    colors: {
      background: "#0D001A",
      foreground: "#ffffff",
      primary: {
        50: "#3B096C",
        100: "#520F83",
        200: "#7318A2",
        300: "#9823C2",
        400: "#c031e2",
        500: "#DD62ED",
        600: "#F182F6",
        700: "#FCADF9",
        800: "#FDD5F9",
        900: "#FEECFE",
        DEFAULT: "#DD62ED",
        foreground: "#ffffff",
      },
      focus: "#F182F6",
    },
    layout: {
      disabledOpacity: "0.3",
      radius: {
        small: "4px",
        medium: "6px",
        large: "8px",
      },
      borderWidth: {
        small: "1px",
        medium: "2px",
        large: "3px",
      },
    },
  },
  // dark: {
  //   extend: "dark",
  //   colors: {
  //     primary: '#0b11b8',
  //     background: '#1a1a2e',
  //     secondary: '#4a4eb8',
  //   }
  // },
  // light: {
  //   extend: "light",
  //   colors: {
  //     primary: '#0b11b8',
  //     background: '#f0f0ff',
  //     secondary: '#4a4eb8',
  //   }
  // }
}

export default themes