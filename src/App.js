import React from 'react';
import './App.css';
// import Signature from './components/signature';
// import Signature2 from './components/signature2';
import SingPad from './components/sign-pad/signPad';

function App() {
  return (
    <div className="app">
      <SingPad width="600" height="350"></SingPad> 
    </div>
  );
}

export default App;
