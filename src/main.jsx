import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css'; // Added this line
// import './scss/styles.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
        <App />
    </Router>
  </StrictMode>
);
