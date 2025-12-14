import React, { useState, useEffect } from 'react'
import { FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi'

const istanbulDistricts = [
  'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler',
  'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü',
  'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt',
  'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane',
  'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer',
  'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye',
  'Üsküdar', 'Zeytinburnu'
]

export default function Trends() {
  const [selectedDistrict, setSelectedDistrict] = useState('Üsküdar')
  const [trendData, setTrendData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTrendData(selectedDistrict)
  }, [selectedDistrict])

  const fetchTrendData = async (district) => {
    setLoading(true)
    setError(null)
    try {
      // Trends endpoint'ine istek atıyoruz
      const response = await fetch('http://localhost:8000/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          district: district
        })
      })

      if (!response.ok) {
        throw new Error('API hatası')
      }

      const data = await response.json()
      
      // API'den gelen trend verisini kullan
      if (data.trendInfo && data.trendInfo.priceHistory) {
        const trendPercent = data.trendInfo.trend || 0
        
        // Date formatından ay adı çıkar (2019-12 -> Aralık 2019)
        const formatMonth = (dateStr) => {
          const [year, month] = dateStr.split('-')
          const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                          'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
          const monthName = months[parseInt(month) - 1]
          return `${monthName} ${year}`
        }
        
        // Price history'yi formatla
        const formattedPriceHistory = data.trendInfo.priceHistory.map(item => ({
          month: formatMonth(item.date),
          date: item.date,
          price: item.price
        }))
        
        // Volatilite hesapla (fiyat aralığından)
        const prices = formattedPriceHistory.map(p => p.price)
        const priceRange = data.trendInfo.currentStats.maxPrice - data.trendInfo.currentStats.minPrice
        const avgPrice = data.trendInfo.currentStats.avgPrice
        const volatility = (priceRange / avgPrice) * 100
        
        // Talep seviyesi hesapla (trend'e göre)
        const demand = trendPercent > 5 ? 'Çok Yüksek' :
                      trendPercent > 2 ? 'Yüksek' :
                      trendPercent > -2 ? 'Orta' : 'Düşük'
        
        setTrendData({
          priceHistory: formattedPriceHistory,
          trend: trendPercent > 0 ? `+${trendPercent.toFixed(2)}%` : `${trendPercent.toFixed(2)}%`,
          trendValue: trendPercent,
          demand: demand,
          avgPrice: data.trendInfo.currentStats.avgPrice,
          median: data.trendInfo.currentStats.medianPrice,
          volatility: volatility.toFixed(1),
          listings: data.trendInfo.currentStats.listings,
          minPrice: data.trendInfo.currentStats.minPrice,
          maxPrice: data.trendInfo.currentStats.maxPrice
        })
      }
    } catch (err) {
      setError(err.message)
      console.error('Trends API Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Trend verileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || !trendData) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
            <p className="text-orange-700">Veriler yüklenirken bir hata oluştu: {error || 'Veri bulunamadı'}</p>
          </div>
        </div>
      </div>
    )
  }

  const maxPrice = Math.max(...trendData.priceHistory.map(p => p.price))
  const minPrice = Math.min(...trendData.priceHistory.map(p => p.price))

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Piyasa Trendleri</h1>
          <p className="text-xl text-gray-600">İstanbul emlak piyasası fiyat trendleri ve analizleri</p>
        </div>

        <div className="mb-8">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-6 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-lg font-semibold"
          >
            {istanbulDistricts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <FaChartLine className="text-blue-600" />
              <div className="text-sm font-semibold text-blue-700">6 Aylık Trend</div>
            </div>
            <div className="flex items-center gap-2">
              {trendData.trendValue > 0 ? (
                <HiTrendingUp className="text-3xl text-green-600" />
              ) : (
                <HiTrendingDown className="text-3xl text-red-600" />
              )}
              <div className="text-3xl font-bold text-blue-900">{trendData.trend}</div>
            </div>
            <div className="text-xs text-gray-600 mt-2">Son 6 ayda</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <div className="text-sm font-semibold text-green-700 mb-2">Talep Seviyesi</div>
            <div className="text-3xl font-bold text-green-900">{trendData.demand}</div>
            <div className="text-xs text-gray-600 mt-2">Piyasa durumu</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <div className="text-sm font-semibold text-purple-700 mb-2">Fiyat Aralığı</div>
            <div className="text-sm font-bold text-purple-900">
              {trendData.minPrice?.toLocaleString('tr-TR')} - {trendData.maxPrice?.toLocaleString('tr-TR')} TL
            </div>
            <div className="text-xs text-gray-600 mt-2">Min - Max</div>
          </div>
        </div>

        {/* Price Chart */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaChartLine className="text-gray-600" />
            Fiyat Trendi
          </h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {trendData.priceHistory.map((point, index) => {
              const height = ((point.price - minPrice) / (maxPrice - minPrice)) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 cursor-pointer relative group"
                    style={{ height: `${height}%`, minHeight: '20px' }}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {point.price.toLocaleString('tr-TR')} TL
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 font-medium">{point.month}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaChartLine className="text-indigo-600" />
            Trend Analizi
          </h3>
          <div className="space-y-2 text-gray-700">
            <p>• {selectedDistrict} bölgesinde son 6 ayda <strong>{trendData.trend}</strong> fiyat trendi görülmektedir</p>
            <p>• Talep seviyesi <strong>{trendData.demand}</strong> olarak değerlendirilmektedir</p>
            <p>• Fiyat aralığı {trendData.minPrice?.toLocaleString('tr-TR')} TL - {trendData.maxPrice?.toLocaleString('tr-TR')} TL</p>
            <p>• Volatilite %{trendData.volatility} seviyesindedir</p>
            <p>• Piyasada <strong>{trendData.listings}</strong> benzer emlak bulunmaktadır</p>
            <p>• Ortalama fiyat: <strong>{trendData.avgPrice?.toLocaleString('tr-TR')} TL</strong>, Medyan: <strong>{trendData.median?.toLocaleString('tr-TR')} TL</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}
