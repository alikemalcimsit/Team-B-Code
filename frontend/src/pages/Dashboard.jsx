import React, { useState, useEffect } from 'react'
import { FaChartLine, FaHome, FaBed, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa'
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi'
import Map from '../components/Map'

const istanbulDistricts = [
  'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler',
  'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü',
  'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt',
  'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane',
  'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer',
  'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye',
  'Üsküdar', 'Zeytinburnu'
]

export default function Dashboard() {
  const [selectedDistrict, setSelectedDistrict] = useState('Üsküdar')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDistrictStats(selectedDistrict)
  }, [selectedDistrict])

  const fetchDistrictStats = async (district) => {
    setLoading(true)
    setError(null)
    try {
      // Dashboard endpoint'ine istek atıyoruz
      const response = await fetch('http://localhost:8000/dashboard', {
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
      
      // API'den gelen stats verisini kullan
      if (data.stats) {
        setStats({
          avgPrice: data.stats.avgPrice,
          medianPrice: data.stats.medianPrice,
          priceChange: data.stats.priceChange,
          listings: data.stats.activeListings || data.stats.listings,
          predictedPrice: data.stats.predictedPrice,
          percentile: data.stats.percentile,
          minPrice: data.stats.minPrice,
          maxPrice: data.stats.maxPrice,
          avgRooms: data.stats.avgRooms,
          avgArea: data.stats.avgArea
        })
      }
    } catch (err) {
      setError(err.message)
      console.error('Dashboard API Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Piyasa Dashboard</h1>
          <p className="text-xl text-gray-600">İstanbul emlak piyasası analizleri ve trendleri</p>
        </div>

        {/* District Selector */}
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

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Veriler yükleniyor...</p>
          </div>
        )}

        {error && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
            <p className="text-orange-700">Veriler yüklenirken bir hata oluştu: {error}</p>
          </div>
        )}

        {stats && !loading && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <FaChartLine className="text-blue-600 text-xl" />
                  <div className="text-sm font-semibold text-blue-700">Ortalama Fiyat</div>
                </div>
                <div className="text-3xl font-bold text-blue-900">{stats.avgPrice.toLocaleString('tr-TR')} TL</div>
                <div className={`text-sm mt-2 flex items-center gap-1 ${parseFloat(stats.priceChange) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(stats.priceChange) > 0 ? (
                    <HiTrendingUp className="inline" />
                  ) : (
                    <HiTrendingDown className="inline" />
                  )}
                  {Math.abs(parseFloat(stats.priceChange)).toFixed(1)}%
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <FaHome className="text-purple-600 text-xl" />
                  <div className="text-sm font-semibold text-purple-700">Aktif İlan</div>
                </div>
                <div className="text-3xl font-bold text-purple-900">{stats.listings}</div>
                <div className="text-sm text-gray-600 mt-2">Benzer emlak</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <FaBed className="text-green-600 text-xl" />
                  <div className="text-sm font-semibold text-green-700">Medyan Fiyat</div>
                </div>
                <div className="text-3xl font-bold text-green-900">{stats.medianPrice.toLocaleString('tr-TR')} TL</div>
                <div className="text-sm text-gray-600 mt-2">Piyasa ortalaması</div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <FaRulerCombined className="text-orange-600 text-xl" />
                  <div className="text-sm font-semibold text-orange-700">Piyasa Yüzdesi</div>
                </div>
                <div className="text-3xl font-bold text-orange-900">{stats.percentile?.toFixed(1)}%</div>
                <div className="text-sm text-gray-600 mt-2">Percentile</div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50">
                <div className="text-sm font-semibold text-gray-700 mb-2">Fiyat Aralığı</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minimum:</span>
                    <span className="font-bold text-gray-900">{stats.minPrice.toLocaleString('tr-TR')} TL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maksimum:</span>
                    <span className="font-bold text-gray-900">{stats.maxPrice.toLocaleString('tr-TR')} TL</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Tahmini Değer:</span>
                    <span className="font-bold text-blue-600">{stats.predictedPrice.toLocaleString('tr-TR')} TL</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Map */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-gray-200/50 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaMapMarkerAlt className="text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">Lokasyon Haritası</h2>
          </div>
          <Map district={selectedDistrict} height="500px" />
        </div>
      </div>
    </div>
  )
}
