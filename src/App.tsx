import React, { useMemo, useState, useEffect } from 'react';
import { format, eachDayOfInterval, startOfYear, endOfYear, isBefore, startOfTomorrow, isToday, differenceInDays } from 'date-fns';

const QUOTES = [
  "Every day is a new beginning.",
  "Make each day count.",
  "Life is made of small moments.",
  "Time is precious, spend it wisely.",
  "Today is a gift.",
  "Embrace the journey.",
  "Live in the present.",
  "Create your own sunshine.",
  "One day at a time.",
  "Make today amazing.",
  "Life is now in session.",
  "Choose to shine.",
  "Write your story daily.",
];

function AnimatedNumber({ value, decimals = 0, isLoaded = true }: { value: number, decimals?: number, isLoaded?: boolean }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad && isLoaded) {
      // Initial scramble effect
      let scrambleCount = 0;
      const maxScrambles = 25; // More iterations
      const scrambleInterval = setInterval(() => {
        if (scrambleCount < maxScrambles) {
          setDisplayValue(
            decimals === 0 
              ? Math.random() * value * 2
              : Math.random() * 100
          );
          scrambleCount++;
        } else {
          clearInterval(scrambleInterval);
          setDisplayValue(value);
          setIsInitialLoad(false);
        }
      }, 80); // Slower interval

      return () => clearInterval(scrambleInterval);
    } else if (!isInitialLoad) {
      // Normal animation after initial load
      const duration = 300;
      const steps = 30;
      const stepDuration = duration / steps;
      const increment = (value - displayValue) / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        if (currentStep < steps) {
          setDisplayValue(prev => prev + increment);
          currentStep++;
        } else {
          setDisplayValue(value);
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [value, isInitialLoad, isLoaded]);

  return decimals === 0 ? 
    Math.round(displayValue).toLocaleString() : 
    displayValue.toFixed(decimals);
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const days = useMemo(() => {
    const start = startOfYear(new Date(2025, 0, 1));
    const end = endOfYear(new Date(2025, 0, 1));
    return eachDayOfInterval({ start, end });
  }, []);

  const tomorrow = startOfTomorrow();
  
  const completedDays = days.filter(day => isBefore(day, tomorrow)).length;
  const remainingDays = days.length - completedDays;

  const getCompletedDays = (date: Date | null) => {
    if (!date) return completedDays;
    return days.filter(day => isBefore(day, date) || day.getTime() === date.getTime()).length;
  };

  const getDaysUntil = (date: Date | null) => {
    if (!date || isBefore(date, tomorrow)) return remainingDays;
    return differenceInDays(date, new Date()) + 1;
  };

  const getProgressPercentage = (date: Date | null) => {
    const completed = getCompletedDays(date);
    const percentage = (completed / days.length) * 100;
    return completed === days.length ? "100.0" : percentage.toFixed(1);
  };

  const getDotColor = (day: Date) => {
    if (isToday(day)) return 'bg-cyan-400 shadow-lg shadow-cyan-500/60';
    if (isBefore(day, tomorrow)) return 'bg-blue-900/50';
    return 'bg-white/[0.08] hover:bg-white/20';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 md:p-10 lg:p-14">
      <div className={`w-full max-w-[1000px] opacity-0 transition-all duration-1000 ${isLoaded ? 'opacity-100' : ''}`}>
        <div className={`text-center mb-16 transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <p className="font-instrument italic text-cyan-400/60 text-base md:text-lg tracking-wide">{quote}</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-16 space-y-6 md:space-y-0">
          <div className="space-y-3">
            <h1 className={`font-instrument text-cyan-300 text-5xl md:text-6xl font-normal tracking-wide transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              2025
            </h1>
            <div className={`font-instrument italic text-cyan-200/90 text-lg md:text-xl tracking-wide mb-4 transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              Today is {format(new Date(), 'EEEE, MMMM do')}
            </div>
            <div className={`flex items-center gap-5 text-lg md:text-xl text-cyan-400/80 tracking-wide transform transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <span className="font-instrument italic transition-all duration-300 ease-in-out">
                <AnimatedNumber value={getCompletedDays(hoveredDate)} /> days completed
                {hoveredDate && !isBefore(hoveredDate, tomorrow) && (
                  <span className="text-cyan-400/50 ml-2 transition-all duration-300 ease-in-out">by {format(hoveredDate, 'MMM d')}</span>
                )}
              </span>
              <span className="font-instrument">•</span>
              <span className="font-instrument italic transition-all duration-300 ease-in-out">
                <AnimatedNumber value={getDaysUntil(hoveredDate)} /> days remaining
                {hoveredDate && !isBefore(hoveredDate, tomorrow) && (
                  <span className="text-cyan-400/50 ml-2 transition-all duration-300 ease-in-out">until {format(hoveredDate, 'MMM d')}</span>
                )}
              </span>
            </div>
          </div>
          <div className={`text-cyan-300 transform transition-all duration-1000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <span className="font-instrument text-4xl md:text-5xl transition-all duration-300 ease-in-out transform">
              <AnimatedNumber 
                value={parseFloat(getProgressPercentage(hoveredDate))} 
                decimals={1}
                isLoaded={isLoaded}
              />%
            </span>
            <span className="font-instrument italic text-lg md:text-xl ml-3 opacity-80 transition-all duration-300 ease-in-out">
              complete
              {hoveredDate && !isBefore(hoveredDate, tomorrow) && (
                <span className="text-cyan-400/50 ml-2 transition-all duration-300 ease-in-out">by {format(hoveredDate, 'MMM d')}</span>
              )}
            </span>
          </div>
        </div>
        
        <div className={`grid grid-cols-[repeat(auto-fill,minmax(12px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(16px,1fr))] gap-1 sm:gap-1.5 md:gap-2 transform transition-all duration-1000 delay-[1100ms] ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`}>
          {days.map((day, index) => {
            const isCompleted = isBefore(day, tomorrow);
            
            return (
              <div
                key={day.toISOString()}
                className={`group relative aspect-square flex items-center justify-center transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                style={{ transitionDelay: `${1200 + index * 2}ms` }}
                onMouseEnter={() => setHoveredDate(day)}
                onMouseLeave={() => setHoveredDate(null)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  setHoveredDate(day);
                }}
                onTouchEnd={() => setHoveredDate(null)}
                onTouchCancel={() => setHoveredDate(null)}
              >
                <div
                  className={`
                    w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px] transition-all duration-300 cursor-pointer
                    transform hover:scale-150
                    rounded-[2px]
                    ${getDotColor(day)}
                  `}
                  aria-label={format(day, 'MMMM d, yyyy')}
                />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 sm:px-4 sm:py-2
                              bg-black/50 backdrop-blur-sm border border-cyan-700/40
                              text-cyan-300 text-sm sm:text-base md:text-lg rounded-sm 
                              opacity-0 group-hover:opacity-100 
                              scale-95 group-hover:scale-100
                              -translate-y-2 group-hover:translate-y-0
                              transition-all duration-200 ease-out
                              pointer-events-none whitespace-nowrap z-10 font-instrument italic
                              shadow-lg shadow-cyan-500/30">
                  {format(day, 'MMMM d')}
                  {isCompleted && ' ●'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 sm:gap-8 mt-8 sm:mt-16 text-cyan-400/80 text-base sm:text-lg md:text-xl font-instrument italic tracking-wide flex-wrap justify-center">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/[0.08] rounded-[2px]"></div>
            <span>Future</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-900/50 rounded-[2px]"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-cyan-400 shadow-lg shadow-cyan-500/60 rounded-[2px]"></div>
            <span>Today</span>
          </div>
        </div>
      </div>
      <footer className={`fixed bottom-0 left-0 right-0 pb-4 pt-2 text-center text-cyan-400/80 font-instrument italic text-sm sm:text-base md:text-lg bg-black/80 backdrop-blur-sm transform transition-all duration-1000 delay-[2000ms] ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <span className="text-cyan-300 text-base sm:text-lg md:text-xl font-medium tracking-wide">Made by AK</span>
          <div className="flex items-center gap-4 sm:gap-5">
            <a 
              href="https://github.com/iamakchavan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors duration-200"
              aria-label="GitHub"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 md:w-6 md:h-6 fill-current"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="https://instagram.com/iamakchavan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors duration-200"
              aria-label="Instagram"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 md:w-6 md:h-6 fill-current"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="https://x.com/iamakchavan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors duration-200"
              aria-label="X (Twitter)"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 md:w-6 md:h-6 fill-current"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;