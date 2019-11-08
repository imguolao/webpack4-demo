import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import './App.css'

const App = () => {
  const [count, setCount] = useState(0);
  
  return (
    <>
      <p className="container">{count}</p>
      <Button 
        type="primary"
        onClick={() => setCount((c) => c + 1)}
      >
        click + 1
      </Button>
    </>
  );
}

export default App;