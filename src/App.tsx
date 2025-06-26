import React, { useState, useEffect } from 'react';
import { Coffee, Wallet, DollarSign, Heart, Zap, Star, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { connectWallet, getBalance, fundCoffee, getAddressToAmountFunded, type WalletState } from './web3';

function App() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: '',
    balance: '0.000'
  });
  const [ethAmount, setEthAmount] = useState<string>('0.01');
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const [totalFunded, setTotalFunded] = useState<string>('0');
  const [error, setError] = useState<string>('');

  const suggestedAmounts = [
    { label: 'Small Coffee', amount: '0.005', icon: Coffee, color: 'from-purple-500 to-pink-500' },
    { label: 'Large Coffee', amount: '0.01', icon: Coffee, color: 'from-blue-500 to-purple-500' },
    { label: 'Coffee + Tip', amount: '0.025', icon: Heart, color: 'from-pink-500 to-red-500' },
    { label: 'Premium Support', amount: '0.05', icon: Star, color: 'from-yellow-500 to-orange-500' }
  ];

  const handleConnect = async () => {
    setLoading(true);
    setError('');
    try {
      const walletState = await connectWallet();
      setWallet(walletState);
      
      // Get total funded amount for this address
      const funded = await getAddressToAmountFunded(walletState.address);
      setTotalFunded(funded);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleGetBalance = async () => {
    if (!wallet.connected) return;
    setLoading(true);
    setError('');
    try {
      const balance = await getBalance(wallet.address);
      setWallet(prev => ({ ...prev, balance }));
    } catch (err: any) {
      setError(err.message || 'Failed to get balance');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCoffee = async () => {
    if (!wallet.connected || !ethAmount) return;
    setPurchasing(true);
    setError('');
    setTxHash('');
    
    try {
      const hash = await fundCoffee(ethAmount, wallet.address);
      setTxHash(hash);
      
      // Refresh balance and total funded after successful transaction
      const newBalance = await getBalance(wallet.address);
      const newTotalFunded = await getAddressToAmountFunded(wallet.address);
      
      setWallet(prev => ({ ...prev, balance: newBalance }));
      setTotalFunded(newTotalFunded);
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setPurchasing(false);
    }
  };

  const isValidAmount = parseFloat(ethAmount) > 0 && parseFloat(ethAmount) <= parseFloat(wallet.balance);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-3xl mb-6 shadow-2xl backdrop-blur-sm border border-white/20">
            <Coffee size={40} className="text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-4">
            Buy Me a Coffee 🍵
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
            Support my work with a coffee! Every contribution helps me create better content and build amazing projects.
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-lg mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Wallet Status */}
            <div className="bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-cyan-600/80 backdrop-blur-sm p-6 text-white border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${wallet.connected ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'} animate-pulse`} />
                  <span className="font-semibold text-lg">
                    {wallet.connected ? 'Wallet Connected' : 'Wallet Disconnected'}
                  </span>
                </div>
                <Wallet size={24} className="text-white/80" />
              </div>
              
              {wallet.connected && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80">Address:</span>
                    <span className="font-mono text-sm bg-white/20 px-3 py-1 rounded-full">
                      {formatAddress(wallet.address)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80">Balance:</span>
                    <span className="font-bold text-xl">{parseFloat(wallet.balance).toFixed(4)} ETH</span>
                  </div>
                  {parseFloat(totalFunded) > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/80">Total Funded:</span>
                      <span className="font-bold text-lg text-green-300">{parseFloat(totalFunded).toFixed(4)} ETH</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-8 space-y-6">
              {/* Error Display */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 flex items-center space-x-3">
                  <AlertCircle size={20} className="text-red-400" />
                  <span className="text-red-200 text-sm">{error}</span>
                </div>
              )}

              {/* Success Display */}
              {txHash && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle size={20} className="text-green-400" />
                    <span className="text-green-200 font-semibold">Transaction Successful!</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-300 text-sm font-mono bg-green-500/20 px-2 py-1 rounded">
                      {formatAddress(txHash)}
                    </span>
                    <ExternalLink size={16} className="text-green-400" />
                  </div>
                </div>
              )}

              {/* Connect/Balance Buttons */}
              <div className="space-y-3">
                {!wallet.connected ? (
                  <button
                    onClick={handleConnect}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Wallet size={20} />
                        <span>Connect Wallet</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleGetBalance}
                    disabled={loading}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center justify-center space-x-2 hover:scale-105"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <DollarSign size={18} />
                        <span>Refresh Balance</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {wallet.connected && (
                <>
                  {/* Suggested Amounts */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-4">
                      Quick Select
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {suggestedAmounts.map((suggestion) => {
                        const Icon = suggestion.icon;
                        return (
                          <button
                            key={suggestion.amount}
                            onClick={() => setEthAmount(suggestion.amount)}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
                              ethAmount === suggestion.amount
                                ? 'border-purple-400 bg-purple-500/30 text-white shadow-lg shadow-purple-500/25'
                                : 'border-white/20 bg-white/10 text-white/80 hover:border-purple-400/50 hover:bg-white/20'
                            } transform hover:scale-105`}
                          >
                            <Icon size={18} className="mx-auto mb-2" />
                            <div className="text-xs font-medium mb-1">{suggestion.label}</div>
                            <div className="text-sm font-bold">{suggestion.amount} ETH</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Amount Input */}
                  <div>
                    <label htmlFor="ethAmount" className="block text-sm font-semibold text-white mb-3">
                      Custom Amount (ETH)
                    </label>
                    <div className="relative">
                      <input
                        id="ethAmount"
                        type="number"
                        step="0.001"
                        min="0"
                        value={ethAmount}
                        onChange={(e) => setEthAmount(e.target.value)}
                        placeholder="0.01"
                        className={`w-full px-4 py-4 bg-white/10 backdrop-blur-sm border-2 rounded-2xl focus:outline-none focus:bg-white/20 transition-all duration-300 text-lg font-medium text-white placeholder-white/50 ${
                          isValidAmount
                            ? 'border-white/30 focus:border-purple-400'
                            : 'border-red-400/50 focus:border-red-400'
                        }`}
                      />
                      {!isValidAmount && ethAmount && (
                        <p className="text-red-300 text-sm mt-2">
                          {parseFloat(ethAmount) > parseFloat(wallet.balance)
                            ? 'Insufficient balance'
                            : 'Please enter a valid amount'
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Buy Coffee Button */}
                  <button
                    onClick={handleBuyCoffee}
                    disabled={!isValidAmount || purchasing}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg transform hover:scale-105 disabled:transform-none"
                  >
                    {purchasing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Coffee size={24} />
                        <span>Buy Coffee</span>
                        <span>☕</span>
                        <Zap size={20} />
                      </>
                    )}
                  </button>

                  {ethAmount && isValidAmount && (
                    <div className="text-center p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
                      <p className="text-sm text-white/90">
                        You're about to send <span className="font-bold text-purple-200">{ethAmount} ETH</span>
                      </p>
                      <p className="text-xs text-white/70 mt-1">
                        Thank you for your support! ❤️
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-purple-200">
            <p className="text-sm">
              Made with ❤️ and lots of ☕ by Koushik
            </p>
            <p className="text-xs mt-2 text-purple-300">
              Powered by Ethereum blockchain
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default App;