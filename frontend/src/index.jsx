import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyle from './Utils/GlobalStyle';
import App from './App';

const root = createRoot(document.getElementById("root"))
const app = (
    <BrowserRouter>
        <GlobalStyle />
        <App />
    </BrowserRouter>
);

root.render(app);