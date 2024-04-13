/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				background: "hsl(0 0% 100%)",
				foreground: "hsl(222.2 84% 4.9%)",
				primary: "hsl(222.2 47.4% 11.2%)",
				primaryForeground: "hsl(210 40% 98%)",
				secondary: "hsl(210 40% 96.1%)",
				secondaryForeground: "hsl(222.2 47.4% 11.2%)",
				muted: "hsl(210 40% 96.1%)",
				mutedForeground: "hsl(215.4 16.3% 46.9%)",
				destructive: "hsl(0 84.2% 60.2%)",
				destructiveForeground: "hsl(210 40% 98%)",
				accent: "hsl(210 40% 96.1%)",
				accentForeground: "hsl(222.2 47.4% 11.2%)",
				ring: "hsl(215 20.2% 65.1%)",
				success: "hsl(120, 100%, 50%)",
				successForground: "#009A00",
				facebook: "#4167B2",
				instagram: "#D52D85",
				twitter: "#1DA1F1",
				linkedin: "#0077B5",
				blue: "hsl(202 96.7% 47.1%)",
			},
			boxShadow: {
				inputHover: "rgb(232, 237, 235) 0px 0px 0px 3px",
				inputFocus: "rgb(4, 152, 236) 0px 0px 0px 3px",
			},
		},
		fontFamily: {
			sans: ['"Inter var", sans-serif'],
		},
	},
	plugins: [],
};
