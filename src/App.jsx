// App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Gamesetup from "./components/gamesetup";
import GameBoard from "./components/GameBoard";
import GameFinished from "./components/GameFinished";
import Index from "./components/home";

function App() {
  const [gameState, setGameState] = useState({
    status: "setup", // default should be setup
    name: "",
    players: [],
    currentRound: 1,
    maxRounds: 2,
    searchedPokemon: [],
  });

  useEffect(() => {
    console.log(gameState);
  }, [gameState]);

  return (
    <>
     
         <Routes>
            <Route
              path="/gamesetup"
              element={
                <Gamesetup gameState={gameState} setGameState={setGameState} />
              }
            />
            <Route
              path="/gameboard"
              element={
                <GameBoard gameState={gameState} setGameState={setGameState} />
              }
            />
            <Route
              path="/finished"
              element={<GameFinished gameState={gameState} />}
            />
             <Route
              path="/"
              element={ <Index gameState={gameState} setGameState={setGameState} />}
            />
          </Routes>
     
    </>
  );
}

export default App;
