import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: ["src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
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
