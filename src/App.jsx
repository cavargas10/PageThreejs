import React from 'react';
import Header from './Header';
import ParticleModel from './ParticleModel';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <ParticleModel />
      <main className="content">
        <h1>BOOST<br/>YOUR<br/>BRAND</h1>
        <p>We create <strong>digital experience</strong> at the intersection between <strong>design</strong> and <strong>technology</strong>, helping our clients to <strong>imagine the future</strong>, today.</p>
      </main>
    </div>
  );
}

export default App;
