/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				'secondary': '#f0f0f0',
				'text-color': '#313131',
				'red': '#730000',
				'blue': '#730000',
				'auxiliary-orange': '#CD801F',
				'auxiliary-gray': '#3A3A3A',
			}
		},
	},
	plugins: [
		// ...
		require('tailwind-scrollbar'),
	],
}

