import { createContext, useContext } from 'react';

// true once the loader has finished, so the hero can play its entrance animation
export const IntroContext = createContext(false);
export const useIntroDone = () => useContext(IntroContext);
