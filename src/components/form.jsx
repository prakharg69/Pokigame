import React, { useState } from 'react';

function App() {
  const [gameState, setGameState] = useState({
    status: 'setup', // 'setup', 'playing', 'finished'
    name: '',
    players: [],
    currentRound: 1,
    maxRounds: 5,
    searchedPokemon: []
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-red-500 text-center mb-8">Pokémon Stats Battle</h1>
        
        {gameState.status === 'setup' && (
          <GameSetup gameState={gameState} setGameState={setGameState} />
        )}
        
        {gameState.status === 'playing' && (
          <GameBoard gameState={gameState} setGameState={setGameState} />
        )}
        
        {gameState.status === 'finished' && (
          <GameFinished gameState={gameState} />
        )}
      </div>
    </div>
  );
}

function GameSetup({ gameState, setGameState }) {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState(Array(2).fill(''));
  const [gameName, setGameName] = useState('');
  const [error, setError] = useState('');

  const handlePlayerCountChange = (e) => {
    const count = parseInt(e.target.value);
    setPlayerCount(count);
    setPlayerNames(Array(count).fill(''));
  };

  const handlePlayerNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const startGame = () => {
    // Validate inputs
    if (!gameName.trim()) {
      setError('Please enter a game name');
      return;
    }
    
    for (let i = 0; i < playerNames.length; i++) {
      if (!playerNames[i].trim()) {
        setError(`Please enter name for Player ${i + 1}`);
        return;
      }
    }
    
    // Initialize players
    const players = playerNames.map(name => ({
      name: name.trim(),
      score: 0,
      pokemon: null
    }));
    
    // Update game state
    setGameState({
      ...gameState,
      status: 'playing',
      name: gameName.trim(),
      players,
      currentRound: 1,
      searchedPokemon: []
    });
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Game Setup</h2>
      
      <div className="mb-4">
        <label htmlFor="gameName" className="block font-medium text-gray-700 mb-1">Game Name:</label>
        <input 
          type="text" 
          id="gameName" 
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="Enter game name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="playerCount" className="block font-medium text-gray-700 mb-1">Number of Players:</label>
        <input 
          type="number" 
          id="playerCount" 
          min="2" 
          max="6" 
          value={playerCount}
          onChange={handlePlayerCountChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      
      <div className="space-y-3 mb-6">
        {playerNames.map((name, index) => (
          <div key={index}>
            <label htmlFor={`player${index}`} className="block font-medium text-gray-700 mb-1">Player {index + 1} Name:</label>
            <input
              type="text"
              id={`player${index}`}
              value={name}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              placeholder="Enter player name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        ))}
      </div>
      
      <button 
        onClick={startGame}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Start Game
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}

function GameBoard({ gameState, setGameState }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [highlightedStats, setHighlightedStats] = useState({});

  const searchPokemon = async () => {
    if (!searchTerm.trim()) {
      setSearchError('Please enter a Pokémon name');
      return;
    }
    
    try {
      setIsSearching(true);
      setSearchError('');
      
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error('Pokémon not found');
      }
      
      const data = await response.json();
      
      // Check if Pokémon already used
      if (gameState.searchedPokemon.includes(data.id)) {
        setSearchError('This Pokémon has already been used in this game');
        return;
      }
      
      // Find next player without a Pokémon
      const playerIndex = gameState.players.findIndex(p => p.pokemon === null);
      
      if (playerIndex === -1) {
        setSearchError('All players have already selected Pokémon for this round');
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
          'special-attack': data.stats[3].base_stat,
          'special-defense': data.stats[4].base_stat,
          speed: data.stats[5].base_stat
        }
      };
      
      // Update game state
      const updatedPlayers = [...gameState.players];
      updatedPlayers[playerIndex].pokemon = pokemon;
      
      setGameState({
        ...gameState,
        players: updatedPlayers,
        searchedPokemon: [...gameState.searchedPokemon, data.id]
      });
      
      // Clear search
      setSearchTerm('');
    } catch (error) {
      setSearchError(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const compareStats = () => {
    const stats = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
    const highlight = {};
    const updatedPlayers = [...gameState.players];
    
    stats.forEach(stat => {
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
      
      // Award points
      const points = 1 / winningPlayers.length;
      winningPlayers.forEach(playerIndex => {
        updatedPlayers[playerIndex].score += points;
      });
      
      // Track winners for highlighting
      highlight[stat] = winningPlayers;
    });
    
    setHighlightedStats(highlight);
    setGameState({
      ...gameState,
      players: updatedPlayers
    });
  };

  const nextRound = () => {
    const nextRoundNum = gameState.currentRound + 1;
    
    if (nextRoundNum > gameState.maxRounds) {
      // Game over
      setGameState({
        ...gameState,
        status: 'finished'
      });
      return;
    }
    
    // Reset for next round
    const updatedPlayers = gameState.players.map(player => ({
      ...player,
      pokemon: null
    }));
    
    setGameState({
      ...gameState,
      players: updatedPlayers,
      currentRound: nextRoundNum
    });
    
    // Reset UI state
    setHighlightedStats({});
  };

  const allPlayersHavePokemon = gameState.players.every(p => p.pokemon !== null);
  const currentPlayerIndex = gameState.players.findIndex(p => p.pokemon === null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        {gameState.name} - Round {gameState.currentRound} of {gameState.maxRounds}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {gameState.players.map((player, index) => (
          <PlayerCard 
            key={index}
            player={player}
            isCurrent={index === currentPlayerIndex && currentPlayerIndex !== -1}
          />
        ))}
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Current Round</h3>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a Pokémon..."
            disabled={currentPlayerIndex === -1}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
          />
          <button 
            onClick={searchPokemon}
            disabled={isSearching || currentPlayerIndex === -1}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {searchError && <p className="text-red-500 mb-4">{searchError}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {gameState.players.map((player, index) => (
            player.pokemon && (
              <PokemonCard 
                key={index}
                player={player}
                highlightedStats={highlightedStats}
                playerIndex={index}
              />
            )
          ))}
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={compareStats}
            disabled={!allPlayersHavePokemon}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Compare Stats
          </button>
          
          {Object.keys(highlightedStats).length > 0 && (
            <button 
              onClick={nextRound}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next Round
            </button>
          )}
        </div>
      </div>
      
      <Scoreboard players={gameState.players} />
    </div>
  );
}

function PlayerCard({ player, isCurrent }) {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border-2 ${isCurrent ? 'border-blue-600' : 'border-transparent'}`}>
      <h3 className="text-lg font-semibold text-blue-800">{player.name}</h3>
      <p className="text-gray-700">Score: <span className="font-medium">{player.score.toFixed(1)}</span></p>
      <p className="text-gray-600">
        {player.pokemon 
          ? `Selected: ${player.pokemon.name}`
          : 'No Pokémon selected'}
      </p>
    </div>
  );
}

function PokemonCard({ player, highlightedStats, playerIndex }) {
  const stats = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {player.name}'s Pokémon: <span className="text-red-600">{player.pokemon.name}</span>
      </h3>
      
      <div className="flex flex-col items-center mb-4">
        <img 
          src={player.pokemon.image} 
          alt={player.pokemon.name}
          className="w-32 h-32 object-contain bg-gray-100 rounded-full p-2"
          onError={(e) => {
            e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
          }}
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stat</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stats.map(stat => (
              <tr key={stat}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 capitalize">{stat}</td>
                <td className={`px-4 py-2 whitespace-nowrap text-sm font-medium ${
                  highlightedStats[stat] && highlightedStats[stat].includes(playerIndex)
                    ? 'text-red-600 font-bold'
                    : 'text-gray-900'
                }`}>
                  {player.pokemon.stats[stat]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Scoreboard({ players }) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Scoreboard</h3>
      <ol className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <li key={index} className="text-gray-700">
            <span className="font-medium">{player.name}:</span> {player.score.toFixed(1)} points
          </li>
        ))}
      </ol>
    </div>
  );
}

function GameFinished({ gameState }) {
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{gameState.name} - Game Over!</h2>
        <div className="bg-yellow-100 inline-block px-6 py-3 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-800">
            Winner: <span className="text-red-600">{winner.name}</span> with {winner.score.toFixed(1)} points!
          </h3>
        </div>
      </div>
      
      <Scoreboard players={gameState.players} />
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Final Pokémon Selections:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gameState.players.map((player, index) => (
            player.pokemon && (
              <PokemonCard 
                key={index}
                player={player}
                highlightedStats={{}}
                playerIndex={index}
              />
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;