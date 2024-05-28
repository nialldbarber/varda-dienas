/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all of your component files.
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				latvianRed: "#A4343A",
				latvianRedFaded: "#A4343A80",
			},
			fontFamily: {
				"cosmica-bold": ["Cosmica-Bold"],
				"cosmica-extrabold": ["Cosmica-Extrabold"],
				"cosmica-heavy": ["Cosmica-Heavy"],
				"cosmica-light": ["Cosmica-Light"],
				"cosmica-medium": ["Cosmica-Medium"],
				"cosmica-regular": ["Cosmica-Regular"],
				"cosmica-semibold": ["Cosmica-Semibold"],
			},
		},
	},
	plugins: [],
};
