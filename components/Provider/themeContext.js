import React, { useContext } from 'react';

export const ThemeContext = React.createContext({
  theme: 'auto',
});

export const useThemeContext = () => {
  return useContext(ThemeContext);
};