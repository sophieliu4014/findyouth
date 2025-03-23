
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'work-sans': ['Work Sans', 'sans-serif'],
				'comfortaa': ['Comfortaa', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				youth: {
					blue: '#1EAEDB',
					purple: '#9b87f5',
					lightpurple: '#D6BCFA',
					softgreen: '#F2FCE2',
					softgray: '#F1F0FB',
					charcoal: '#403E43',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1.5rem',
				'3xl': '2rem'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				slideDown: {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				dash: {
					'0%': { 'stroke-dashoffset': '300' },
					'100%': { 'stroke-dashoffset': '0' }
				},
				wavyAnimation: {
					'0%': { d: 'M0,10 Q30,5 60,10 T120,10 T180,10 T240,10 T300,10' },
					'50%': { d: 'M0,10 Q30,15 60,10 T120,10 T180,10 T240,10 T300,10' },
					'100%': { d: 'M0,10 Q30,5 60,10 T120,10 T180,10 T240,10 T300,10' }
				},
				shimmer: {
					'0%': { backgroundPosition: '-1000px 0' },
					'100%': { backgroundPosition: '1000px 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.5s ease-out',
				'slide-up': 'slideUp 0.5s ease-out',
				'slide-down': 'slideDown 0.5s ease-out',
				'pulse-slow': 'pulse 3s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'dash': 'dash 2s linear forwards',
				'wavy': 'wavyAnimation 5s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite'
			},
			boxShadow: {
				'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
				'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
				'button': '0 4px 14px 0 rgba(0, 0, 0, 0.08)',
				'card': '0 5px 25px rgba(0, 0, 0, 0.03)',
				'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
				'hover': '0 10px 40px -10px rgba(0, 0, 0, 0.2)'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-blue': 'linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)',
				'gradient-purple': 'linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)',
				'gradient-youth': 'linear-gradient(135deg, #9b87f5 0%, #1EAEDB 100%)',
				'shimmer': 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)'
			},
			backdropFilter: {
				'glass': 'blur(4px)',
				'glass-strong': 'blur(10px)'
			},
			strokeDasharray: {
				'300': '300',
			},
			strokeDashoffset: {
				'300': '300',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
