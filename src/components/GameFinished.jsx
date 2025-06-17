import React from "react";
import { PokemonCard, Scoreboard } from "./GameBoard";


function GameFinished({ gameState }) {
  const sortedPlayers = [...gameState.players].sort(
    (a, b) => b.score - a.score
  ); // dese order
  const winner = sortedPlayers[0];
  return (


    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden py-8 px-4">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl z-0"></div>
        <div className="absolute bottom-32 right-10 w-40 h-40 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-xl z-0"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-lg z-0"></div>

        <div className="relative z-10 max-w-4xl mx-auto bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-center mb-10">
            Pokemon Stats Battle
          </h1>

         

  <div className="space-y-10 px-4 py-6">
      {/* Game Over Title */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-pink-600 mb-4 drop-shadow-md">
          {gameState.name} - Game Over!
        </h2>
        <div className="inline-block bg-gradient-to-r from-yellow-100 to-red-50 px-6 py-3 rounded-xl shadow-md backdrop-blur">
          <h3 className="text-xl font-semibold text-yellow-800">
            🏆 Winner: <span className="text-red-600">{winner.name}</span> with{" "}
            {winner.score.toFixed(1)} points!
          </h3>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
          🏅 Final Scoreboard
        </h3>
        <Scoreboard players={gameState.players} />
      </div>

      {/* Final Pokémon Cards */}
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          🎮 Final Pokémon Selections
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameState.players.map((player, index) =>
            player.pokemon ? (
              <PokemonCard
                key={index}
                player={player}
                highlightedStats={{}}
                playerIndex={index}
              />
            ) : null
          )}
        </div>
      </div>
    </div>


        </div>
      </div>




      
  );
}

export default GameFinished;
