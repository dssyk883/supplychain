import React, {Component, useEffect, useState} from 'react'
import Web3 from 'web3'
import {ethers} from 'ethers';
import SupplyChainAbi from './contractsData/SupplyChain.json'
import SupplyChainAddress from './contractsData/SupplyChain-address.json' // TODO change this

import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Pharmacy from './components/Pharmacy';
import Manufacture from './components/Manufacture';
import Wholesale from './components/Wholesale';
import Insurance from './components/Insurance';
import NotFound from './components/NotFound';
import Home from './components/Home';
import config from './config/config.json'

// Define navigation links
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/pharmacy', label: 'Pharmacy' },
  { to: '/manufacture', label: 'Manufacture' },
  { to: '/wholesale', label: 'Wholesale' },
  { to: '/insurance', label: 'Insurance' }
];

// Higher-order component to guard routes based on entity type
const EntityGuard = ({ entityType, children }) => {
  // Check if entityType matches the config entity type
  const isAllowed = entityType === config.entity_type;

  if (isAllowed) {
    return children;
  } else {
    // Redirect to not found page if entity type is not allowed
    return <Navigate to="/not-found" />;
  }
};

const App = () => {
  // Filter navigation links based on allowed entity type
  const filteredNavLinks = navLinks.filter(navLink =>
    navLink.label.toLowerCase() === config.entity_type
  );
  
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            {filteredNavLinks.map((navLink, index) => (
              <li key={index}>
                <Link to={navLink.to}>{navLink.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/pharmacy"
            element={
              <EntityGuard entityType="pharmacy">
                <Pharmacy />
              </EntityGuard>
            }
          />
          <Route
            path="/manufacture"
            element={
              <EntityGuard entityType="manufacture">
                <Manufacture />
              </EntityGuard>
            }
          />
          <Route
            path="/wholesale"
            element={
              <EntityGuard entityType="wholesale">
                <Wholesale />
              </EntityGuard>
            }
          />
          <Route
            path="/insurance"
            element={
              <EntityGuard entityType="insurance">
                <Insurance />
              </EntityGuard>
            }
          />
          <Route path="/not-found" element={<NotFound />} />
          {/* Redirect any unmatched routes to the not found page */}
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
