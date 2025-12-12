import React, { useEffect, useState } from "react";
import { loadBlockchain, getName, setName } from "./contract";

function App() {
  const [name, setNameState] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  // Initialisation du contrat
  useEffect(() => {
    const init = async () => {
      try {
        await loadBlockchain(); // <- doit finir avant tout
        const currentName = await getName();
        setNameState(currentName);
      } catch (err) {
        console.error("Error initializing blockchain:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleClick = async () => {
    if (!input) return;
    setLoading(true);
    try {
      await setName(input); // Ici, contract doit déjà être défini
      const updated = await getName();
      setNameState(updated);
      setInput("");
    } catch (err) {
      console.error("Error setting name:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading blockchain...</div>;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Hello {name}</h1>
      <input
        type="text"
        placeholder="Enter a new name..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: "10px", width: "250px" }}
      />
      <br /><br />
      <button onClick={handleClick} style={{ padding: "10px 20px", fontSize: "18px" }}>
        Set Name
      </button>
    </div>
  );
}

export default App;
