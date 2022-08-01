import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import App from './App';
import theme from './theme'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <React.StrictMode>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </React.StrictMode>
  </ChakraProvider>
  
);

