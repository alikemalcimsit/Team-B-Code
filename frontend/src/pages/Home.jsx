import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaRocket, FaDollarSign, FaSearch, FaRobot, FaBalanceScale, FaChartBar, FaTachometerAlt } from 'react-icons/fa'

export default function Home() {
  const [stats, setStats] = useState({
    totalAnalyses: 10000,
    accuracy: 95,
    districts: 39,
    technology: 'AI'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchHomeStats()
  }, [])

  const fetchHomeStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/model-metrics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats({
          totalAnalyses: data.totalAnalyses || 10000,
          accuracy: data.accuracy || 95,
          districts: data.districts || 39,
          technology: 'AI'
        })
      }
    } catch (err) {
      console.error('Home stats error:', err)
      // Fallback to default values
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: 'url(/alev-takil-C_I6dPH94wI-unsplash.jpg)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 via-pink-600/20 to-orange-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.15),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-7xl w-full">
            {/* Main Title */}
            <div className="text-center mb-16 space-y-6">
              <div className="inline-block px-6 py-2 bg-white/80 backdrop-blur-xl rounded-full border border-gray-200/50 shadow-lg mb-6">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FaRocket className="text-blue-600" />
                  AI-Powered Real Estate Intelligence
                </span>
              </div>
              
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tight">
                <span className="block bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent animate-gradient">
                  Emlak AI
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
                Yapay zeka ile emlak değerlendirme, yatırım analizi ve piyasa tahminleri
              </p>
              
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                İstanbul'daki emlak piyasasını anında analiz edin. AI destekli fiyat tahminleri, yatırım önerileri ve piyasa trendleri.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  {loading ? '...' : `${(stats.totalAnalyses / 1000).toFixed(0)}K+`}
                </div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Analiz Edildi</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                  {loading ? '...' : `%${stats.accuracy.toFixed(0)}`}
                </div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Doğruluk</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600 mb-2">
                  {loading ? '...' : stats.districts}
                </div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">İlçe</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-blue-600 mb-2">
                  {stats.technology}
                </div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Teknoloji</div>
              </div>
            </div>

            {/* Main Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Fiyat Tahmini */}
              <Link
                to="/predict"
                className="group relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 hover:border-blue-300/50 transition-all duration-300 transform hover:-translate-y-3 hover:scale-[1.02] overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl -z-0"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl -z-0"></div>
                
                <div className="relative z-10">
                  <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <FaDollarSign className="text-6xl text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Fiyat Tahmini</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Emlakınızın özelliklerini girerek AI destekli anlık fiyat tahmini alın.
                  </p>
                  <div className="flex items-center text-blue-600 font-bold group-hover:text-blue-700">
                    Başla
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* İlan Kontrol */}
              <Link
                to="/check"
                className="group relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 hover:border-green-300/50 transition-all duration-300 transform hover:-translate-y-3 hover:scale-[1.02] overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full blur-3xl -z-0"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-500/20 to-green-500/20 rounded-full blur-2xl -z-0"></div>
                
                <div className="relative z-10">
                  <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <FaSearch className="text-6xl text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">İlan Kontrol</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Bulduğunuz ilanı analiz edin. Yatırım değeri ve piyasa karşılaştırması ile karar verin.
                  </p>
                  <div className="flex items-center text-green-600 font-bold group-hover:text-green-700">
                    Başla
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Model Eğitimi */}
              <Link
                to="/train"
                className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:-translate-y-3 hover:scale-[1.02] overflow-hidden md:col-span-2 lg:col-span-1"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl -z-0"></div>
                
                <div className="relative z-10">
                  <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <FaRobot className="text-6xl text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Model Eğitimi</h2>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Kendi veri setiniz ile modeli eğitin ve daha doğru tahminler için AI'ınızı geliştirin.
                  </p>
                  <div className="flex items-center text-white font-bold group-hover:text-gray-200">
                    Başla
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Link
                to="/compare"
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 cursor-pointer"
              >
                <div className="mb-4">
                  <FaBalanceScale className="text-4xl text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">İlan Karşılaştırma</h3>
                <p className="text-gray-600 text-sm">İki ilanı yan yana karşılaştırın</p>
              </Link>
              <Link
                to="/trends"
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 cursor-pointer"
              >
                <div className="mb-4">
                  <FaChartBar className="text-4xl text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Piyasa Trendleri</h3>
                <p className="text-gray-600 text-sm">Fiyat trendleri ve analizler</p>
              </Link>
              <Link
                to="/dashboard"
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 cursor-pointer"
              >
                <div className="mb-4">
                  <FaTachometerAlt className="text-4xl text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard</h3>
                <p className="text-gray-600 text-sm">Piyasa istatistikleri ve analizler</p>
              </Link>
            </div>

            {/* CTA Section */}
            <div className="text-center space-y-4">
              <div className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <Link to="/predict" className="text-white font-bold text-lg flex items-center gap-3">
                  <span>Hemen Deneyin</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
              <div>
                <Link to="/presentation" className="text-gray-600 hover:text-gray-900 text-sm font-medium underline">
                  Sunumu Görüntüle →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated gradient for title */}
      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
