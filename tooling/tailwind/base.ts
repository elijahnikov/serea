import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: ["src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				border: "hsl(var(--border))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: "hsl(var(--card))",
				input: "hsl(var(--input))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					hover: "hsl(var(--primary-hover))",
					active: "hsl(var(--primary-active))",
					ring: "hsl(var(--primary-ring))",
					border: "hsl(var(--primary-border))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					hover: "hsl(var(--secondary-hover))",
					active: "hsl(var(--secondary-active))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					hover: "hsl(var(--destructive-hover))",
					active: "hsl(var(--destructive-active))",
					ring: "hsl(var(--destructive-ring))",
					border: "hsl(var(--destructive-border))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				carbon: {
					DEFAULT: "#F0F0F0",
					100: "#F8F8F8",
					200: "#F0F0F0",
					300: "#E8E8E8",
					400: "#E0E0E0",
					500: "#D8D8D8",
					600: "#D0D0D0",
					700: "#C8C8C8",
					800: "#C0C0C0",
					900: "#B8B8B8",
				},
				"carbon-dark": {
					DEFAULT: "#1A1A1A",
					100: "#121212",
					200: "#1A1A1A",
					300: "#242424",
					400: "#2E2E2E",
					500: "#383838",
				},
			},
			borderColor: {
				DEFAULT: "hsl(var(--border))",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
