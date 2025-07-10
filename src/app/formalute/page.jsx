// /formalute page
"use client";

import { FormaluteBuilder } from "formalute";

const App = () => {
  const handleSave = (jsonConfig) => {
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "FORMALUTE_FORM_CONFIG",
          payload: jsonConfig,
        },
        "*" 
      );
      window.close(); 
    }
  };

  return (
    <div>
      <FormaluteBuilder onSave={handleSave} />
    </div>
  );
};

export default App;
