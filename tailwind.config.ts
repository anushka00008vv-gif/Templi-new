import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { cream:'#F6F1E8', ink:'#171512', accent:'#B83A32', sand:'#E8DFD1' }, fontFamily: { sans:['Arial','Helvetica','sans-serif'] } } }, plugins: [] };
export default config;
