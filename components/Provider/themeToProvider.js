import React, { useState , useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { ThemeContext } from '@/components/Provider/themeContext';
import Cookies from 'js-cookie';

const useTheme = () => {  
  const [theme, setTheme] = useState('auto');  

  useEffect(() => {  
      const storeTheme = Cookies.get('theme');  
      if (storeTheme) setTheme(storeTheme);  
  }, []);  

  const toggleTheme = () => {  
    setTheme((prevTheme) => {  
      let theTheme,
      cookieTheme;

      if (prevTheme === 'auto') {
        theTheme = 'light';
        cookieTheme = 'light';
      } else if (theme === 'light') {
        theTheme = 'dark';
        cookieTheme = 'dark';
  
      } else {
        cookieTheme = 'auto';
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          // 当前处于暗黑模式
          theTheme = 'dark';
        } else {
          theTheme = 'light';
        }
      }

      Cookies.set('theme', cookieTheme);
      document.documentElement.setAttribute('theme', theTheme);

      return cookieTheme;  
    });  
  };  

  return [theme, toggleTheme];  
};

export function ThemeProvider(props) {
  const [value, toggleTheme] = useTheme();
  return (
    <ThemeContext.Provider value={{ theme: value, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm:
            value === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
        }}
      >
        {props.children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}