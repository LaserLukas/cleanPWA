import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import "./App.scss";

function App() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="App-container">
      <Button
        variant="outline-primary"
        active={isClicked}
        onClick={(e) => setIsClicked(!isClicked)}
      >
        Primary
      </Button>
    </div>
  );
}

export default App;
