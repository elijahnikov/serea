import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import base from "./base";

export default {
	content: base.content,
	presets: [base],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				serea: ["var(--font-serea)"],
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"caret-blink": {
					"0%,70%,100%": { opacity: "1" },
					"20%,50%": { opacity: "0" },
				},
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				marquee: {
					from: { transform: "translateX(0)" },
					to: { transform: "translateX(calc(-100% - var(--gap)))" },
				},
				"marquee-vertical": {
					from: { transform: "translateY(0)" },
					to: { transform: "translateY(calc(-100% - var(--gap)))" },
				},
			},
			boxShadow: {
				xs: "0 1px 2px 0 rgba(18, 18, 23, 0.05)",
				"xs-dark": "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
				sm: "0 1px 3px 0 rgba(18, 18, 23, 0.1), 0 1px 2px 0 rgba(18, 18, 23, 0.06)",
				"sm-dark":
					"0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)",
				md: "0px 2px 4px -1px rgba(18, 18, 23, 0.06), 0px 4px 6px -1px rgba(18, 18, 23, 0.08)",
				"md-dark":
					"0px 2px 4px -1px rgba(0, 0, 0, 0.3), 0px 4px 6px -1px rgba(0, 0, 0, 0.2)",
				lg: "0px 4px 6px -2px rgba(18, 18, 23, 0.05), 0px 10px 15px -3px rgba(18, 18, 23, 0.08)",
				"lg-dark":
					"0px 4px 6px -2px rgba(0, 0, 0, 0.2), 0px 10px 15px -3px rgba(0, 0, 0, 0.3)",
				xl: "0px 10px 10px -5px rgba(18, 18, 23, 0.04), 0px 20px 25px -5px rgba(18, 18, 23, 0.10)",
				"xl-dark":
					"0px 10px 10px -5px rgba(0, 0, 0, 0.2), 0px 20px 25px -5px rgba(0, 0, 0, 0.3)",
				"2xl": "0px 25px 50px -12px rgba(18, 18, 23, 0.25)",
				"2xl-dark": "0px 25px 50px -12px rgba(0, 0, 0, 0.4)",
				overlay:
					"0px 1px 2px 0px rgba(18, 18, 23, 0.04), 0px 2px 4px 0px rgba(18, 18, 23, 0.04), 0px 5px 10px 0px rgba(18, 18, 23, 0.03), 0px 12px 24px 0px rgba(18, 18, 23, 0.03), 0px 0px 0px 1px rgba(18, 18, 23, 0.10)",
				"overlay-dark":
					"0px 1px 2px 0px rgba(0, 0, 0, 0.2), 0px 2px 4px 0px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.2), 0px 8px 16px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 1px rgba(0, 0, 0, 0.3)",
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				marquee: "marquee var(--duration) linear infinite",
				"marquee-vertical": "marquee-vertical var(--duration) linear infinite",
				"caret-blink": "caret-blink 1.25s ease-out infinite",
			},
		},
	},
	plugins: [animate],
} satisfies Config;
