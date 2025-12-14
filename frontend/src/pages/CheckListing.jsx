import React, { useState } from 'react'
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

export default function CheckListing() {
  const [formData, setFormData] = useState({
    district: '',
    neighborhood: '',
    net_m2: '',
    gross_m2: '',
    rooms: '',
    building_age: '',
    floor: '',
    num_floors: '',
    bathrooms: '',
    asking_price: '',
    purpose: 'yatırım'
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const formatNumber = (value) => {
    if (!value) return ''
    const numbers = value.replace(/\D/g, '')
    return numbers
  }

  const formatPrice = (value) => {
    if (!value) return ''
    const numbers = value.replace(/\D/g, '')
    if (!numbers) return ''
    return Number(numbers).toLocaleString('tr-TR')
  }

  const parsePrice = (value) => {
    return value.replace(/\./g, '')
  }

  const parseRooms = (roomsStr) => {
    if (!roomsStr) return 0
    if (roomsStr === 'Stüdyo') return 1
    const parts = roomsStr.split('+').map(Number)
    return parts.reduce((a, b) => a + b, 0)
  }

  const getVerdictColor = (verdict) => {
    if (verdict?.includes('IYI') || verdict?.includes('İYİ')) return 'green'
    if (verdict?.includes('KOTU') || verdict?.includes('KÖTÜ')) return 'red'
    return 'blue'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    // Build payload - minimum required: district, net_m2, rooms, asking_price
    const payload = {
      district: formData.district,
      net_m2: Number(formData.net_m2) || Number(formData.gross_m2),
      rooms: parseRooms(formData.rooms) || 0,
      asking_price: Number(parsePrice(formData.asking_price))
    }

    // Add optional fields only if provided
    if (formData.neighborhood) payload.neighborhood = formData.neighborhood
    if (formData.gross_m2) payload.gross_m2 = Number(formData.gross_m2)
    if (formData.building_age) payload.building_age = Number(formData.building_age)
    if (formData.floor) payload.floor = Number(formData.floor)
    if (formData.num_floors) payload.num_floors = Number(formData.num_floors)
    if (formData.bathrooms) payload.bathrooms = Number(formData.bathrooms)
    if (formData.purpose) payload.purpose = formData.purpose

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
      console.error('API Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">İlan Kontrol</h1>
          <p className="text-xl text-gray-600">Bulduğunuz ilanı analiz edin ve yatırım değerini öğrenin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* İlçe - Required */}
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                  İlçe <span className="text-orange-500">*</span>
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                >
                  <option value="">İlçe seçiniz...</option>
                  {istanbulDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Mahalle - Optional */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mahalle (Opsiyonel)</label>
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder="Örn: Çengelköy Mh."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* İlan Fiyatı - Required */}
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                  İlan Fiyatı (₺) <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={formatPrice(formData.asking_price)}
                  onChange={(e) => setFormData({ ...formData, asking_price: parsePrice(e.target.value) })}
                  placeholder="Örn: 1.000.000"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Metrekare */}
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Net m² <span className="text-orange-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={formData.net_m2}
                      onChange={(e) => setFormData({ ...formData, net_m2: formatNumber(e.target.value) })}
                      placeholder="Net m²"
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formData.gross_m2}
                      onChange={(e) => setFormData({ ...formData, gross_m2: formatNumber(e.target.value) })}
                      placeholder="Brüt m² (Opsiyonel)"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Oda Sayısı - Required */}
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Oda Sayısı <span className="text-orange-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Stüdyo', '1+1', '2+1', '3+1', '4+1', '5+1'].map(room => (
                    <button
                      key={room}
                      type="button"
                      onClick={() => setFormData({ ...formData, rooms: room })}
                      className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        formData.rooms === room
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {room}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amaç */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amaç</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, purpose: 'yatırım' })}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      formData.purpose === 'yatırım'
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    📈 Yatırım
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, purpose: 'oturma' })}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      formData.purpose === 'oturma'
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🏠 Oturma
                  </button>
                </div>
              </div>

              {/* Bina Yaşı - Optional */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bina Yaşı (Opsiyonel)</label>
                <input
                  type="text"
                  value={formData.building_age}
                  onChange={(e) => setFormData({ ...formData, building_age: formatNumber(e.target.value) })}
                  placeholder="Örn: 12"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Kat Bilgileri */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bulunduğu Kat (Opsiyonel)</label>
                  <input
                    type="text"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: formatNumber(e.target.value) })}
                    placeholder="Örn: 3"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Toplam Kat Sayısı (Opsiyonel)</label>
                  <input
                    type="text"
                    value={formData.num_floors}
                    onChange={(e) => setFormData({ ...formData, num_floors: formatNumber(e.target.value) })}
                    placeholder="Örn: 6"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Banyo Sayısı - Optional */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Banyo Sayısı (Opsiyonel)</label>
                <input
                  type="text"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: formatNumber(e.target.value) })}
                  placeholder="Örn: 2"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.district || !formData.net_m2 || !formData.rooms || !formData.asking_price}
                className="w-full px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
              >
                {loading ? 'Analiz Ediliyor...' : 'İlanı Analiz Et'}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Map */}
            <Map district={formData.district} neighborhood={formData.neighborhood} height="500px" />

            {/* Results */}
            {loading && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900">Analiz Ediliyor...</h3>
              </div>
            )}

            {error && (
              <div className="bg-orange-50 border border-orange-200 rounded-3xl p-8 shadow-xl">
                <div className="text-orange-700 font-semibold mb-2">⚠️ Bağlantı Hatası</div>
                <div className="text-gray-700 mb-4">{error}</div>
                <div className="mt-4 text-sm text-gray-600">
                  Backend servisinizin çalıştığından ve <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">http://localhost:8000</code> adresinde erişilebilir olduğundan emin olun.
                </div>
              </div>
            )}

            {result && result.comparison && (
              <div className="space-y-6">
                {/* Verdict Card - Modern Design */}
                <div className={`relative overflow-hidden rounded-3xl p-8 shadow-2xl border-2 ${
                  getVerdictColor(result.comparison.verdict) === 'green' 
                    ? 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-emerald-200' :
                  getVerdictColor(result.comparison.verdict) === 'red' 
                    ? 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-amber-200' :
                  'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200'
                }`}>
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-xl"></div>
                  
                  <div className="relative text-center">
                    <div className="text-7xl mb-6 transform hover:scale-110 transition-transform duration-300">
                      {result.comparison.verdict_emoji || '📊'}
                    </div>
                    <div className={`text-4xl font-extrabold mb-4 tracking-tight ${
                      getVerdictColor(result.comparison.verdict) === 'green' ? 'text-emerald-700' :
                      getVerdictColor(result.comparison.verdict) === 'red' ? 'text-amber-700' :
                      'text-blue-700'
                    }`}>
                      {result.comparison.verdict}
                    </div>
                    {result.comparison.verdict_description && (
                      <div className="text-base text-gray-700 leading-relaxed max-w-md mx-auto">
                        {result.comparison.verdict_description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Comparison - Enhanced */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">İlan Fiyatı</div>
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {result.comparison.asking_price?.toLocaleString('tr-TR')} TL
                    </div>
                  </div>
                  <div className="relative bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Tahmini Değer</div>
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                      {result.comparison.predicted_price?.toLocaleString('tr-TR')} TL
                    </div>
                  </div>
                </div>

                {/* Statistics - Enhanced */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 text-center shadow-md border border-blue-100 hover:shadow-lg transition-all duration-200">
                    <div className={`text-2xl font-extrabold mb-1 ${
                      result.comparison.difference_percent > 0 
                        ? 'text-amber-600' 
                        : 'text-emerald-600'
                    }`}>
                      {result.comparison.difference_percent > 0 ? '+' : ''}{result.comparison.difference_percent?.toFixed(1)}%
                    </div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Fark</div>
                  </div>
                  {result.comparison.similar_properties_count && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 text-center shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-200">
                      <div className="text-2xl font-extrabold text-indigo-700 mb-1">{result.comparison.similar_properties_count}</div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Benzer İlan</div>
                    </div>
                  )}
                  {result.comparison.percentile && (
                    <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-5 text-center shadow-md border border-teal-100 hover:shadow-lg transition-all duration-200">
                      <div className="text-2xl font-extrabold text-teal-700 mb-1">{result.comparison.percentile?.toFixed(1)}%</div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Piyasa</div>
                    </div>
                  )}
                </div>

                {/* Dataset Info - Enhanced */}
                {result.comparison.dataset_prices && (
                  <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200/50">
                    <h4 className="font-bold text-gray-900 mb-5 text-lg flex items-center gap-2">
                      <span className="text-2xl">📊</span>
                      Piyasa İstatistikleri
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Minimum</div>
                        <div className="text-lg font-bold text-gray-900">{result.comparison.dataset_price_min?.toLocaleString('tr-TR')} TL</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Medyan</div>
                        <div className="text-lg font-bold text-gray-900">{result.comparison.dataset_price_median?.toLocaleString('tr-TR')} TL</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Maksimum</div>
                        <div className="text-lg font-bold text-gray-900">{result.comparison.dataset_price_max?.toLocaleString('tr-TR')} TL</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

