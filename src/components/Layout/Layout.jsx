import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.scss';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content-wrapper">
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
