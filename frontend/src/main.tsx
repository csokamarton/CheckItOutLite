import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { ChakraProvider, createSystem, defineConfig } from '@chakra-ui/react';
import './index.css';
import App from './App';
import Header from './components/Header';
import { useEffect, useState } from 'react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {},
    },
  },
});

const system = createSystem(config);

const AppWrapper = () => {
  const navigate = useNavigate();
  const [appInstance, setAppInstance] = useState<App | null>(null);

  useEffect(() => {
    setAppInstance(new App(navigate)); 
  }, [navigate]);

  return (
    <>
      {appInstance && appInstance.View()}
    </>
  );
};

createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider value={system}>
    <Router>
      <AppWrapper />
    </Router>
  </ChakraProvider>
);