import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSaveNotes] = useState([]);

  const handleListen = useCallback(() => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("Continue...");
        mic.start();
      };
      mic.onstart = () => {
        console.log("Mics On");
      };
      mic.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        console.log(transcript);
        setNote(transcript);
      };
      mic.onerror = (event) => {
        console.error(event.error);
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stopped Mic on Click");
      };
    }
  }, [isListening]);

  useEffect(() => {
    handleListen();
  }, [handleListen, isListening]);

  const handleSaveNotes = () => {
    setSaveNotes([...savedNotes, note]);
    setNote("");
  };

  return (
    <>
      <h1 className="main">Voice Notes</h1>
      <div className="container">
        <div className="box">
          <h2 className="inside">Current Note</h2>
          <div className="x1">
            {isListening ? (
              <span className="span">🎤</span>
            ) : (
              <span className="span">🔴</span>
            )}
            <div className="buttons">
              <button onClick={() => setIsListening((prevState) => !prevState)}>
                Start/Stop
              </button>
              <button onClick={handleSaveNotes} disabled={!note}>
                Save Notes
              </button>
            </div>
          </div>
          <p className="para">{note}</p>
        </div>
        <div className="box">
          <h2 className="inside">Notes</h2>
          {savedNotes.map((n) => (
            <p className="para" key={n}>
              {n}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
