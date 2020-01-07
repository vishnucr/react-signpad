import React from 'react';
import './App.css';
// import Signature from './components/signature';
// import Signature2 from './components/signature2';
import SingPad from './components/sign-pad/signPad';

function App() {
  return (
    <div className="app">
      <SingPad width="640" height="480"></SingPad> 
    </div>
  );
}

export default App;
