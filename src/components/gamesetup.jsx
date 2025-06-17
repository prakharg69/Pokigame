import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Gamesetup = ({ gameState, setGameState }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState(Array(2).fill(""));
  const [gameName, setGameName] = useState("");
  const [error, setError] = useState("");
   const navigate = useNavigate(); // ✅ Initialize navigate

  const handlePlayerCountChange = (e) => {
    const count = parseInt(e.target.value);
    setPlayerCount(count);
    setPlayerNames(Array(count).fill(""));
  };

  const handlePlayerNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const startGame = () => {
    // validate INputs
    if (!gameName.trim()) {
      setError("Please enter a game name");
      return;
    }
    for (let i = 0; i < playerNames.length; i++) {
      if (!playerNames[i].trim()) {
        setError(`Please enter name for Player ${i + 1}`);
        return;
      }
    }

    //INtilize Players
    const players = playerNames.map((name) => ({
      name: name.trim(),
      score: 0,
      pokemon: null,
    }));

    // Update game state
    setGameState({
      ...gameState,
      status: "playing",
      name: gameName,
      players: players,
      currentRound: 1,
      searchedPokemon: [],
    });

     navigate("/gameboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden py-8 px-4">
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl z-0"></div>
      <div className="absolute bottom-32 right-10 w-40 h-40 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-xl z-0"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-lg z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-center mb-10">
          Pokemon Stats Battle
        </h1>

        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl animate-fade-in">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 text-center">
            Game Setup
          </h2>

          {/* Game Name */}
          <div className="mb-6">
            <label
              htmlFor="gameName"
              className="block text-md font-medium text-gray-700 mb-2"
            >
              Game Name:
            </label>
            <input
              type="text"
              id="gameName"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter game name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Number of Players */}
          <div className="mb-6">
            <label
              htmlFor="playerCount"
              className="block text-md font-medium text-gray-700 mb-2"
            >
              Number of Players:
            </label>
            <input
              type="number"
              id="playerCount"
              value={playerCount}
              min="2"
              max="6"
              onChange={handlePlayerCountChange}
              placeholder="Enter number of players"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>

          {/* Player Names */}
          <div className="space-y-5 mb-8">
            {playerNames.map((name, index) => (
              <div key={index}>
                <label
                  htmlFor={`player${index}`}
                  className="block text-md font-medium text-gray-700 mb-2"
                >
                  Player {index + 1} Name:
                </label>
                <input
                  type="text"
                  id={`player${index}`}
                  value={name}
                  onChange={(e) =>
                    handlePlayerNameChange(index, e.target.value)
                  }
                  placeholder={`Player ${index + 1} name`}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm"
                />
              </div>
            ))}
          </div>

          {/* Start Game Button */}
         <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300"
          >
            Start Game
          </button>

          {/* Error Message */}
          {error && (
            <p className="mt-4 text-red-500 text-center font-medium">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gamesetup;
