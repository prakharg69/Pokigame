import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function GameBoard({ gameState, setGameState }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [highlightedStats, setHighlightedStats] = useState({});
  const com = useRef(0);
  const navigate= useNavigate();
  useEffect(() => {
  if (gameState.status === "finished") {
    navigate('/finished');
  }
}, [gameState.status]);

  const searchPokemon = async () => {
    if (!searchTerm.trim()) {
      setSearchError("Please enter a Pokémon name");
    }
    try {
      setIsSearching(true);
      setSearchError("");
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error("pokemon not found");
      }
      const data = await response.json();
      console.log(data);

      // Check if Pokémon already used
      if (gameState.searchedPokemon.includes(data.id)) {
        setSearchError("This Pokémon has already been used in this game");
        return;
      }

      // Find next player without a Pokémon
      const playerIndex = gameState.players.findIndex((p) => p.pokemon == null);
      if (playerIndex === -1) {
        setSearchError(
          "All players have already selected Pokémon for this round"
        );
        return;
      }
      // Process Pokémon data
      const pokemon = {
        id: data.id,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        image: data.sprites.front_default,
        stats: {
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          "special-attack": data.stats[3].base_stat,
          "special-defense": data.stats[4].base_stat,
          speed: data.stats[5].base_stat,
        },
      };
      // Update game state
      const updatedPlayers = [...gameState.players];
      updatedPlayers[playerIndex].pokemon = pokemon;
      setGameState({
        ...gameState,
        players: updatedPlayers,
        searchedPokemon: [...gameState.searchedPokemon, data.id],
      });
      setSearchTerm("");
    } catch (error) {
      setSearchError(error.message);
    } finally {
      setIsSearching(false);
    }
  };
  const compareStats = () => {

    com.current += 1;
  if (com.current > 1) {
    return;
  }

    
    const stats = [
      "hp",
      "attack",
      "defense",
      "special-attack",
      "special-defense",
      "speed",
    ];
    const highlight = {};
    const updatedPlayers = [...gameState.players];

    stats.forEach((stat) => {
      let highestValue = -1;
      let winningPlayers = [];
      updatedPlayers.forEach((player, index) => {
        const value = player.pokemon.stats[stat];

        if (value > highestValue) {
          highestValue = value;
          winningPlayers = [index];
        } else if (value === highestValue) {
          winningPlayers.push(index);
        }
      });

      const point = 1 / winningPlayers.length;
      winningPlayers.forEach((playerIndex) => {
        updatedPlayers[playerIndex].score += point;
      });
      highlight[stat] = winningPlayers;
    });

    setHighlightedStats(highlight);
    setGameState({ ...gameState, players: updatedPlayers });
  };

  const nextRound = () => {
    com.current = 0;
    const nextRoundNum = gameState.currentRound + 1;
    if (nextRoundNum > gameState.maxRounds) {
      // Game over
      setGameState({
        ...gameState,
        status: "finished",
      });
      return;
    }
    // Reset for next round
    const updatedPlayers = gameState.players.map((player) => ({
      ...player,
      pokemon: null,
    }));
    setGameState({
      ...gameState,
      players: updatedPlayers,
      currentRound: nextRoundNum,
    });
    setHighlightedStats({});
  };

  const allPlayersHavePokemon = gameState.players.every(
    (p) => p.pokemon !== null
  );
  const currentPlayerIndex = gameState.players.findIndex(
    (p) => p.pokemon === null
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden py-8 px-4">
      <div className="relative z-10 max-w-4xl mx-auto bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-center mb-10">
          Pokemon Stats Battle
        </h1>

        <div className="space-y-10 animate-fade-in">
          {/* 🧢 Round Title */}
          <div className="text-center">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              {gameState.name} - Round {gameState.currentRound} of{" "}
              {gameState.maxRounds}
            </h2>
          </div>

          {/* 🧍 Player Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameState.players.map((player, index) => (
              <PlayerCard
                key={index}
                player={player}
                isCurrent={
                  index === currentPlayerIndex && currentPlayerIndex !== -1
                }
              />
            ))}
          </div>

          {/* 🔍 Search & Select Area */}
          <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Current Round - Choose Your Pokémon
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a Pokémon..."
                disabled={currentPlayerIndex === -1}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
              />
              <button
                onClick={searchPokemon}
                disabled={isSearching || currentPlayerIndex === -1}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>

            {searchError && <p className="text-red-500 mb-4">{searchError}</p>}

            {/* 🔄 Pokémon Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {gameState.players.map((player, index) => (
                <PokemonCard
                  key={index}
                  player={player}
                  highlightedStats={highlightedStats}
                  playerIndex={index}
                />
              ))}
            </div>

            {/* 🆚 Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={compareStats}
                disabled={!allPlayersHavePokemon}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
              >
                Compare Stats
              </button>
              {Object.keys(highlightedStats).length > 0 && (
                <button
                  onClick={nextRound}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition-all duration-300"
                >
                  Next Round
                </button>
              )}
            </div>
          </div>

          {/* 🏆 Scoreboard */}
          <Scoreboard players={gameState.players} />
        </div>
      </div>
    </div>
  );
}

export function PlayerCard({ player, isCurrent }) {
  return (
    <div
      className={`p-5 rounded-2xl shadow-lg transition-all duration-300 ${
        isCurrent
          ? "border-2 border-blue-600 bg-white/80 backdrop-blur-sm"
          : "border border-transparent bg-white/70 backdrop-blur-sm"
      }`}
    >
      <h3 className="text-xl font-bold text-blue-700 mb-1">{player.name}</h3>

      <p className="text-gray-700 mb-1">
        Score:{" "}
        <span className="font-semibold text-gray-900">
          {player.score.toFixed(1)}
        </span>
      </p>

      <p className="text-sm text-gray-600 italic">
        {player.pokemon ? (
          <>
            Selected:{" "}
            <span className="font-medium text-purple-700 capitalize">
              {player.pokemon.name}
            </span>
          </>
        ) : (
          "No Pokémon selected"
        )}
      </p>
    </div>
  );
}

export function PokemonCard({ player, highlightedStats, playerIndex }) {
  const stats = [
    "hp",
    "attack",
    "defense",
    "special-attack",
    "special-defense",
    "speed",
  ];

  if (!player.pokemon) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm flex items-center space-x-4">
        <div className="text-4xl">🎮</div>
        <div>
          <h3 className="text-lg font-bold text-yellow-800">
            {player.name} hasn’t chosen their Pokémon yet!
          </h3>
          <p className="text-sm text-yellow-700">
            Encourage them to catch one now! ⚡️
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl transition-all duration-300">
      <h3 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-pink-500 to-yellow-500">
        {player.name}'s Pokemon:
        <span className="block mt-1 text-3xl">
          {player.pokemon.name.toUpperCase()}
        </span>
      </h3>

      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 p-2 rounded-full shadow-inner">
          <img
            src={player.pokemon.image}
            alt={player.pokemon.name}
            className="w-32 h-32 object-contain rounded-full bg-white p-2"
            onError={(e) => {
              e.target.src =
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-2">
                Stat
              </th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-2">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => {
              const isHighlighted =
                highlightedStats[stat]?.includes(playerIndex);
              return (
                <tr
                  key={stat}
                  className={`rounded-lg ${
                    isHighlighted ? "bg-red-100 shadow-md" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2 text-sm text-gray-700 capitalize">
                    {stat}
                  </td>
                  <td
                    className={`px-4 py-2 text-sm font-semibold ${
                      isHighlighted
                        ? "text-red-600 animate-pulse"
                        : "text-gray-900"
                    }`}
                  >
                    {player.pokemon.stats[stat]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Scoreboard({ players }) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 mb-6 text-center">
        🏆 Scoreboard
      </h3>

      <ol className="space-y-4">
        {sortedPlayers.map((player, index) => (
          <li
            key={index}
            className={`flex items-center justify-between px-4 py-3 rounded-xl ${
              index === 0
                ? "bg-yellow-100 font-semibold"
                : index === 1
                ? "bg-gray-100"
                : index === 2
                ? "bg-orange-100"
                : "bg-white/80"
            } shadow-sm`}
          >
            <span className="text-gray-800 flex items-center gap-2">
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"}
              {index > 2 && `${index + 1}.`}
              {player.name}
            </span>
            <span className="text-gray-600">{player.score.toFixed(1)} pts</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default GameBoard;
