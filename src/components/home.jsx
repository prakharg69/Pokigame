import { Play, User, Users, Search, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const Index = ({ gameState, setGameState }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 right-10 w-40 h-40 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-lg"></div>

      {/* Modern Navbar */}
      <nav className="pt-8 pb-4">
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-md rounded-full px-8 py-3 shadow-lg border border-white/30">
            <div className="flex items-center space-x-8">
              <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PokeCard Battle
              </div>
              <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
                <div className=" cursor-pointer hover:text-blue-600 transition-colors">
                  Home
                </div>
                <div className=" cursor-pointer hover:text-blue-600 transition-colors">
                  Play
                </div>
                <div className=" cursor-pointer hover:text-blue-600 transition-colors">
                  Leaderboard
                </div>
                <div className=" cursor-pointer hover:text-blue-600 transition-colors">
                  Profile
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                Pokemon
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Card Battle
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-medium mb-4 animate-fade-in">
              Compare Pokemon cards and battle with friends!
            </p>
            <p className="text-lg text-gray-500 mb-12 animate-fade-in">
              Add players, search Pokemon cards, compare stats, and compete for
              the highest score
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in">
            <Link to="/gamesetup">
              <button className="cursor-pointer flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px]">
                <Play className="h-5 w-5 mr-2" />
                <div>Start Battle</div>
              </button>
            </Link>

            <button className=" flex items-center justify-center  border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-full text-lg font-semibold bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px]">
              <User className="mr-2 h-5 w-5" />
              About Me
            </button>
          </div>

          {/* Game Flow Steps */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl mb-3">
                <Users className="mx-auto text-blue-600" size={40} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Add Players</h3>
              <p className="text-gray-600 text-sm">
                Enter player names to join the battle arena
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl mb-3">
                <Search className="mx-auto text-green-600" size={40} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Search Pokemon</h3>
              <p className="text-gray-600 text-sm">
                Find and select your favorite Pokemon cards
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-gray-800 mb-2">Compare Stats</h3>
              <p className="text-gray-600 text-sm">
                Battle with HP, Attack, Defense and more
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl mb-3">
                <Trophy className="mx-auto text-yellow-600" size={40} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Win & Score</h3>
              <p className="text-gray-600 text-sm">
                Earn points and climb the leaderboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
