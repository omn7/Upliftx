"use client"
import React from 'react'
import { Mail, SendHorizonal, Menu, X } from 'lucide-react'
import { Button } from './button'
import { AnimatedGroup } from './animated-group'
import { cn } from '../../lib/utils'
import { Link } from 'react-router-dom'
import { InfiniteSlider } from './infinite-slider'
import { ProgressiveBlur } from './progressive-blur'
import { useTheme } from '../../contexts/ThemeContext';

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    const { isDark } = useTheme();
    
    return (
        <main>
            <section className="relative min-h-[60vh] overflow-hidden">
                {/* Modern blurred gradient background */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 w-full h-full"
                >
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full h-[80vh] bg-gradient-to-tr from-emerald-400/60 via-indigo-500/40 to-purple-600/60 blur-[120px] opacity-90 rounded-b-[45%]" />
                  <div className="absolute left-1/3 top-1/2 w-2/3 h-1/2 bg-gradient-to-br from-white/20 via-emerald-400/20 to-transparent blur-3xl opacity-60 rounded-full" />
                </div>
                <div className="relative mx-auto max-w-6xl px-2 pt-10 sm:pt-16 md:pt-20 lg:pt-28 xl:pt-32 lg:pb-12">
                    <div className="relative z-10 mx-auto max-w-2xl text-center px-1 sm:px-0">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}
                        >
                            <h1
                                className={`text-balance text-2xl font-semibold sm:text-4xl md:text-5xl md:font-medium transition-colors duration-300 ${
                                    isDark ? 'text-white' : 'text-[#2D3436]'
                                }`}>
                                Uplift X Events
                            </h1>

                            <p className={`mx-auto mt-4 max-w-xl text-pretty text-base sm:text-lg transition-colors duration-300 ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            Find your purpose, build your network, and contribute to something truly special.
                            </p>

                            <form
                                action=""
                                className="mt-12 mx-auto max-w-sm">
                                <button
                                    className="group relative inline-flex items-center justify-center w-full sm:w-auto px-4 py-3 sm:px-8 sm:py-4 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-emerald-500 rounded-full shadow-md bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 text-base sm:text-lg"
                                    style={{
                                        boxShadow: '0 0 12px rgba(52, 211, 153, 0.5), 0 0 24px rgba(52, 211, 153, 0.3), 0 0 36px rgba(52, 211, 153, 0.1)'
                                    }}
                                >
                                    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                                    <span className="relative flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                        </svg>
                                        Join WhatsApp Group
                                    </span>
                                </button>
                            </form>

                            <div
                                aria-hidden
                                className="bg-radial from-primary/50 dark:from-primary/25 relative mx-auto mt-32 max-w-2xl to-transparent to-55% text-left"
                            >
                                <div className={`border-border/50 absolute inset-0 mx-auto w-80 -translate-x-3 -translate-y-12 rounded-[2rem] border p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:-translate-x-6 transition-colors duration-300 ${
                                    isDark ? 'bg-black/20 border-white/10' : 'bg-white/20 border-gray-300/20'
                                }`}>
                                    <div className={`relative h-96 overflow-hidden rounded-[1.5rem] border p-2 pb-12 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--border),var(--border)_1px,transparent_1px,transparent_6px)] before:opacity-50 transition-colors duration-300 ${
                                        isDark ? 'border-white/10' : 'border-gray-300/20'
                                    }`}></div>
                                </div>
                                <div className={`border-border/50 mx-auto w-80 translate-x-4 rounded-[2rem] border p-2 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:translate-x-8 transition-colors duration-300 ${
                                    isDark ? 'bg-black/50 border-white/10' : 'bg-white/50 border-gray-300/20'
                                }`}>
                                    <div className={`space-y-2 overflow-hidden rounded-[1.5rem] border p-2 shadow-xl backdrop-blur-3xl transition-colors duration-300 ${
                                        isDark ? 'bg-black/5 border-white/10' : 'bg-white/5 border-gray-300/20'
                                    }`}>
                                        <AppComponent />

                                        <div className={`rounded-[1rem] p-4 pb-16 transition-colors duration-300 ${
                                            isDark ? 'bg-white/5' : 'bg-gray-100/50'
                                        }`}></div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-5" />
                            </div>
                        </AnimatedGroup>
                    </div>
                </div>
            </section>
            <LogoCloud />
        </main>
    )
}

const AppComponent = () => {
    const { isDark } = useTheme();
    
    // Pie chart data (random example)
    const activeVolunteers = 60;
    const opportunities = 40;
    const total = activeVolunteers + opportunities;
    const activeAngle = (activeVolunteers / total) * 360;
    const oppAngle = (opportunities / total) * 360;
    // Pie chart arc helper
    function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
        const start = polarToCartesian(cx, cy, r, endAngle);
        const end = polarToCartesian(cx, cy, r, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        const d = [
            "M", start.x, start.y,
            "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
            "L", cx, cy, "Z"
        ].join(" ");
        return d;
    }
    function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
        const rad = (angle - 90) * Math.PI / 180.0;
        return {
            x: cx + r * Math.cos(rad),
            y: cy + r * Math.sin(rad)
        };
    }
    return (
        <div className={`relative space-y-3 rounded-[1rem] p-4 transition-all duration-300 ${
            isDark ? 'bg-white/5' : 'glass-gradient'
        }`}>
            <div className="flex items-center gap-1.5 text-orange-400">
                <svg
                    className="size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 32 32">
                    <g fill="none">
                        <path
                            fill="#ff6723"
                            d="M26 19.34c0 6.1-5.05 11.005-11.15 10.641c-6.269-.374-10.56-6.403-9.752-12.705c.489-3.833 2.286-7.12 4.242-9.67c.34-.445.689 3.136 1.038 2.742c.35-.405 3.594-6.019 4.722-7.991a.694.694 0 0 1 1.028-.213C18.394 3.854 26 10.277 26 19.34"></path>
                        <path
                            fill="#ffb02e"
                            d="M23 21.851c0 4.042-3.519 7.291-7.799 7.144c-4.62-.156-7.788-4.384-7.11-8.739C9.07 14.012 15.48 10 15.48 10S23 14.707 23 21.851"></path>
                    </g>
                </svg>
                <div className="text-sm font-medium">Volunteering Impact</div>
            </div>
            <div className={`border-b pb-3 text-sm font-medium transition-all duration-300 ${
                isDark ? 'text-white border-white/10' : 'text-[#2D3436] border-white/20'
            }`}>You made a bigger difference this year than last year!</div>
            <div className="flex flex-col items-center gap-2">
                <svg width="100" height="100" viewBox="0 0 40 40">
                    <path d={describeArc(20, 20, 16, 0, activeAngle)} fill="#34d399" />
                    <path d={describeArc(20, 20, 16, activeAngle, 360)} fill="#6366f1" />
                </svg>
                <div className="flex justify-center gap-4 mt-2 text-xs">
                    <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-emerald-400"></span> Active Volunteers ({activeVolunteers})</span>
                    <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-indigo-500"></span> Opportunities ({opportunities})</span>
                </div>
            </div>
        </div>
    )
}

const menuItems = [
    { name: 'Features', href: '#link' },
    { name: 'Solution', href: '#link' },
    { name: 'Pricing', href: '#link' },
    { name: 'About', href: '#link' },
]

const LogoCloud = () => {
    const { isDark } = useTheme();
    
    return (
        <section className={`pb-16 md:pb-32 overflow-x-hidden transition-colors duration-300 ${
            isDark ? 'bg-black' : 'bg-[#e8faea]'
        }`}>
            <div className="group relative m-auto max-w-6xl px-2 sm:px-6 overflow-x-hidden">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="inline md:max-w-44 md:border-r md:pr-6">
                        <p className={`text-end text-sm transition-colors duration-300 ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>Powering the best teams</p>
                    </div>
                    <div className="relative py-6 w-full md:w-[calc(100%-11rem)] max-w-full overflow-x-auto">
                        <InfiniteSlider
                            duration={40}
                            durationOnHover={20}
                            gap={112}
                        >
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                    alt="Nvidia Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/column.svg"
                                    alt="Column Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/github.svg"
                                    alt="GitHub Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nike.svg"
                                    alt="Nike Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                    alt="Lemon Squeezy Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/laravel.svg"
                                    alt="Laravel Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-7 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lilly.svg"
                                    alt="Lilly Logo"
                                    height="28"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-6 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/openai.svg"
                                    alt="OpenAI Logo"
                                    height="24"
                                    width="auto"
                                />
                            </div>
                        </InfiniteSlider>

                        <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                        <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                        <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full w-20"
                            direction="left"
                            blurIntensity={1}
                        />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full w-20"
                            direction="right"
                            blurIntensity={1}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

const Logo = ({ className }: { className?: string }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill="url(#logo-gradient)"
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
} 