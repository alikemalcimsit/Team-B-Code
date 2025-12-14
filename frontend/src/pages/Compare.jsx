import React, { useState } from 'react'
import { FaBalanceScale, FaTrophy } from 'react-icons/fa'
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

export default function Compare() {
  const [comparison, setComparison] = useState({
    property1: {
      district: '',
      neighborhood: '',
      net_m2: '',
      rooms: '',
      asking_price: ''
    },
    property2: {
      district: '',
      neighborhood: '',
      net_m2: '',
      rooms: '',
      asking_price: ''
    }
  })
  const [results, setResults] = useState({ property1: null, property2: null })
  const [loading, setLoading] = useState(false)

  const formatNumber = (value) => value.replace(/\D/g, '')
  const formatPrice = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers ? Number(numbers).toLocaleString('tr-TR') : ''
  }
  const parsePrice = (value) => value.replace(/\./g, '')
  const parseRooms = (roomsStr) => {
    if (!roomsStr) return 0
    if (roomsStr === 'Stüdyo') return 1
    const parts = roomsStr.split('+').map(Number)
    return parts.reduce((a, b) => a + b, 0)
  }

  const handleCompare = async () => {
    setLoading(true)
    try {
      const [res1, res2] = await Promise.all([
        fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            district: comparison.property1.district,
            net_m2: Number(comparison.property1.net_m2),
            rooms: parseRooms(comparison.property1.rooms),
            asking_price: Number(parsePrice(comparison.property1.asking_price)),
            ...(comparison.property1.neighborhood && { neighborhood: comparison.property1.neighborhood })
          })
        }),
        fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            district: comparison.property2.district,
            net_m2: Number(comparison.property2.net_m2),
            rooms: parseRooms(comparison.property2.rooms),
            asking_price: Number(parsePrice(comparison.property2.asking_price)),
            ...(comparison.property2.neighborhood && { neighborhood: comparison.property2.neighborhood })
          })
        })
      ])
      const data1 = await res1.json()
      const data2 = await res2.json()
      setResults({ property1: data1, property2: data2 })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getVerdictColor = (verdict) => {
    if (verdict?.includes('IYI') || verdict?.includes('İYİ')) return 'green'
    if (verdict?.includes('KOTU') || verdict?.includes('KÖTÜ')) return 'red'
    return 'blue'
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">İlan Karşılaştırma</h1>
          <p className="text-xl text-gray-600">İki ilanı yan yana karşılaştırın ve en iyi yatırım fırsatını bulun</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Property 1 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">İlan 1</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">İlçe</label>
                <select
                  value={comparison.property1.district}
                  onChange={(e) => setComparison({
                    ...comparison,
                    property1: { ...comparison.property1, district: e.target.value }
                  })}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                >
                  <option value="">İlçe seçiniz...</option>
                  {istanbulDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mahalle</label>
                <input
                  type="text"
                  value={comparison.property1.neighborhood}
                  onChange={(e) => setComparison({
                    ...comparison,
                    property1: { ...comparison.property1, neighborhood: e.target.value }
                  })}
                  placeholder="Çengelköy Mah."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Net m²</label>
                  <input
                    type="text"
                    value={comparison.property1.net_m2}
                    onChange={(e) => setComparison({
                      ...comparison,
                      property1: { ...comparison.property1, net_m2: formatNumber(e.target.value) }
                    })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Oda</label>
                  <select
                    value={comparison.property1.rooms}
                    onChange={(e) => setComparison({
                      ...comparison,
                      property1: { ...comparison.property1, rooms: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                  >
                    <option value="">Seçiniz...</option>
                    {['Stüdyo', '1+1', '2+1', '3+1', '4+1', '5+1'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">İlan Fiyatı (₺)</label>
                <input
                  type="text"
                  value={formatPrice(comparison.property1.asking_price)}
                  onChange={(e) => setComparison({
                    ...comparison,
                    property1: { ...comparison.property1, asking_price: parsePrice(e.target.value) }
                  })}
                  placeholder="1.000.000"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Property 2 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">İlan 2</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">İlçe</label>
                <select
                  value={comparison.property2.district}
                  onChange={(e) => setComparison({
                    ...comparison,
                    property2: { ...comparison.property2, district: e.target.value }
                  })}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                >
                  <option value="">İlçe seçiniz...</option>
                  {istanbulDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mahalle</label>
                <input
                  type="text"
                  value={comparison.property2.neighborhood}
                  onChange={(e) => setComparison({
                    ...comparison,
                    property2: { ...comparison.property2, neighborhood: e.target.value }
                  })}
                  placeholder="Çengelköy Mah."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Net m²</label>
                  <input
                    type="text"
                    value={comparison.property2.net_m2}
                    onChange={(e) => setComparison({
                      ...comparison,
                      property2: { ...comparison.property2, net_m2: formatNumber(e.target.value) }
                    })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Oda</label>
                  <select
                    value={comparison.property2.rooms}
                    onChange={(e) => setComparison({
                      ...comparison,
                      property2: { ...comparison.property2, rooms: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                  >
                    <option value="">Seçiniz...</option>
                    {['Stüdyo', '1+1', '2+1', '3+1', '4+1', '5+1'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">İlan Fiyatı (₺)</label>
                <input
                  type="text"
                  value={formatPrice(comparison.property2.asking_price)}
                  onChange={(e) => setComparison({
                    ...comparison,
                    property2: { ...comparison.property2, asking_price: parsePrice(e.target.value) }
                  })}
                  placeholder="1.000.000"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCompare}
            disabled={loading || !comparison.property1.district || !comparison.property2.district}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
          >
            {loading ? 'Karşılaştırılıyor...' : (
              <span className="flex items-center gap-2">
                <FaBalanceScale /> Karşılaştır
              </span>
            )}
          </button>
        </div>

        {results.property1 && results.property2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">İlan 1 Analizi</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-blue-700 mb-1">Tahmini Değer</div>
                  <div className="text-3xl font-bold text-blue-900">
                    {results.property1.prediction?.predicted_price?.toLocaleString('tr-TR')} TL
                  </div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">İlan Fiyatı</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {results.property1.comparison?.asking_price?.toLocaleString('tr-TR')} TL
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    getVerdictColor(results.property1.comparison?.verdict) === 'green' ? 'text-green-600' :
                    getVerdictColor(results.property1.comparison?.verdict) === 'red' ? 'text-amber-600' :
                    'text-blue-600'
                  }`}>
                    {results.property1.comparison?.verdict_emoji} {results.property1.comparison?.verdict}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">İlan 2 Analizi</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-purple-700 mb-1">Tahmini Değer</div>
                  <div className="text-3xl font-bold text-purple-900">
                    {results.property2.prediction?.predicted_price?.toLocaleString('tr-TR')} TL
                  </div>
                </div>
                <div>
                  <div className="text-sm text-purple-700 mb-1">İlan Fiyatı</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {results.property2.comparison?.asking_price?.toLocaleString('tr-TR')} TL
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    getVerdictColor(results.property2.comparison?.verdict) === 'green' ? 'text-green-600' :
                    getVerdictColor(results.property2.comparison?.verdict) === 'red' ? 'text-amber-600' :
                    'text-purple-600'
                  }`}>
                    {results.property2.comparison?.verdict_emoji} {results.property2.comparison?.verdict}
                  </div>
                </div>
              </div>
            </div>

            {/* Winner */}
            <div className="lg:col-span-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-8 text-white text-center">
              <h3 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <FaTrophy className="text-4xl" />
                Kazanan İlan
              </h3>
              <div className="text-2xl">
                {(() => {
                  const diff1 = results.property1.comparison?.difference_percent || 999
                  const diff2 = results.property2.comparison?.difference_percent || 999
                  return Math.abs(diff1) < Math.abs(diff2) ? 'İlan 1' : 'İlan 2'
                })()}
              </div>
              <p className="mt-2 opacity-90">Daha iyi fiyat/değer oranına sahip</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

