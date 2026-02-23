import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['"IBM Plex Serif"', 'serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                bgPrimary: '#0E1117',
                bgSecondary: '#141923',
                bgElevated: '#1A2030',
                textPrimary: '#E6EAF2',
                textSecondary: '#9AA4BF',
                textMuted: '#6B7280',
                accentPrimary: '#7C8CFF',
                accentSuccess: '#34D399',
                accentWarning: '#FBBF24',
                accentDanger: '#F87171',
                borderSoft: 'rgba(255,255,255,0.06)'
            }
        },
    },
    plugins: [],
};
export default config;
