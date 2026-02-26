/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Light mode colors
                light: {
                    primary: '#1E293B',      // Slate 800
                    secondary: '#64748B',    // Slate 500
                    background: '#FFFFFF',
                    surface: '#F8FAFC',
                    accent: '#6366F1',       // Indigo 500
                    border: '#E2E8F0',
                },
                // Dark mode colors
                dark: {
                    background: '#0F172A',   // Slate 900
                    surface: '#020617',      // Slate 950
                    primary: '#E5E7EB',
                    secondary: '#94A3B8',
                    accent: '#818CF8',       // Indigo 400
                    border: '#1E293B',
                }
            },
            fontFamily: {
                logo: ['"Space Grotesk"', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
