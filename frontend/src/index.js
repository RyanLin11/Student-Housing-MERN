import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './base/App';
import Home from './components/Home';
import Listings from './components/Listings';
import ListingForm from './forms/ListingForm';
import ListingPage from './components/ListingPage';
import Register from './auth/Register';
import Login from './auth/Login';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element= {<App />}>
          <Route index element={<Home />} />
          <Route path='listings/' element={<Listings />}>
            <Route index element={<ListingPage />} />
            <Route path='add' element={<ListingForm />} />
            <Route path='*' element={<h1>Page Not Found</h1>} />
          </Route>
          
          <Route path='register' element={<Register />} />
          <Route path='login' element={<Login />} />
          <Route path='*' element={<h1>Page not found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
