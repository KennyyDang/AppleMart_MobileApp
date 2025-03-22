import React, { createContext, useState, useContext, useRef, useCallback } from 'react';

const TabBarContext = createContext({
  isTabBarVisible: true,
  setIsTabBarVisible: (_visible: boolean) => {},
  handleScroll: (_event: any) => {},
});

export const TabBarProvider = ({ children }) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollingDirectionRef = useRef<'up' | 'down' | null>(null);
  const scrollTimerRef = useRef<number | null>(null);

  const handleScroll = useCallback((event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    // Determine scroll direction with threshold to avoid flickering
    if (currentScrollY > lastScrollY.current + 5) {
      scrollingDirectionRef.current = 'down';
      setIsTabBarVisible(false);
    } else if (currentScrollY < lastScrollY.current - 5) {
      scrollingDirectionRef.current = 'up';
      setIsTabBarVisible(true);
    }
    
    // Update last scroll position
    lastScrollY.current = currentScrollY;
    
    // Clear existing timer
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    
    // If user has stopped scrolling for a while and is at top, show tab bar
    scrollTimerRef.current = setTimeout(() => {
      if (currentScrollY < 10) {
        setIsTabBarVisible(true);
      }
    }, 200) as any; // Type cast for React Native's setTimeout
  }, []);

  return (
    <TabBarContext.Provider value={{ isTabBarVisible, setIsTabBarVisible, handleScroll }}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBar = () => useContext(TabBarContext);