import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { SEOProvider } from './contexts/SEOContext';

const rootElement = document.getElementById('root')!;

// If the root element has children other than our placeholder comment, we should hydrate
const hasPrerenderedHTML = rootElement.innerHTML !== '<!--app-html-->' && rootElement.hasChildNodes();

if (hasPrerenderedHTML) {
  hydrateRoot(
    rootElement,
    <StrictMode>
      <BrowserRouter>
        <SEOProvider>
          <App />
        </SEOProvider>
      </BrowserRouter>
    </StrictMode>
  );
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <SEOProvider>
          <App />
        </SEOProvider>
      </BrowserRouter>
    </StrictMode>
  );
}
