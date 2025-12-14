import React, { useState } from 'react'
import { FaUpload, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa'

export default function TrainModel() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [csvContent, setCsvContent] = useState('')
  const [trainingConfig, setTrainingConfig] = useState({
    testSize: 0.2,
    targetColumn: 'Price'
  })
  const [isTraining, setIsTraining] = useState(false)
  const [trainingResults, setTrainingResults] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Check if file is CSV
      const validExtensions = ['.csv']
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase()
      
      if (validExtensions.includes(fileExtension) || selectedFile.type === 'text/csv' || selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile)
        setFileName(selectedFile.name)
        setError(null)
        
        // CSV içeriğini oku
        try {
          const text = await selectedFile.text()
          setCsvContent(text)
        } catch (err) {
          setError('Dosya okunurken bir hata oluştu')
          console.error('File read error:', err)
        }
      } else {
        setError('Lütfen CSV formatında bir dosya seçin.')
        e.target.value = ''
        setFile(null)
        setFileName('')
      }
    }
  }

  const handleTraining = async () => {
    if (!file || !csvContent) {
      setError('Lütfen önce bir CSV dosyası yükleyin.')
      return
    }

    setIsTraining(true)
    setError(null)
    setTrainingResults(null)

    try {
      const response = await fetch('http://localhost:8000/train-with-new-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csv_data: csvContent,
          target_column: trainingConfig.targetColumn,
          test_size: trainingConfig.testSize
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `API Error: ${response.status}`)
      }

      const data = await response.json()
      setTrainingResults(data)
    } catch (err) {
      setError(err.message || 'Eğitim sırasında bir hata oluştu')
      console.error('Training error:', err)
    } finally {
      setIsTraining(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Model Eğitimi</h1>
          <p className="text-xl text-gray-600">Kendi veri setiniz ile modeli eğitin ve daha doğru tahminler için AI'ınızı geliştirin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Veri Seti Yükleme</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-gray-400 transition-colors duration-200">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex justify-center mb-4">
                    <FaUpload className="text-6xl text-gray-400" />
                  </div>
                  <div className="text-xl font-semibold text-gray-900 mb-2">
                    {fileName || 'Dosya Seçin veya Sürükleyin'}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    CSV formatında veri seti
                  </div>
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200"
                  >
                    Dosya Seç
                  </button>
                </label>
              </div>

              {fileName && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-600 text-xl" />
                      <div>
                        <div className="font-semibold text-green-900">{fileName}</div>
                        <div className="text-sm text-green-700">
                          {(file?.size / 1024 / 1024).toFixed(2)} MB
                          {csvContent && ` • ${csvContent.split('\n').length - 1} satır`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null)
                        setFileName('')
                        setCsvContent('')
                        setError(null)
                        document.getElementById('file-upload').value = ''
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <FaTimesCircle className="text-xl" />
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2 text-red-700">
                    <FaTimesCircle />
                    <span className="text-sm font-semibold">{error}</span>
                  </div>
                </div>
              )}

              {/* File Format Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="text-sm text-blue-900">
                  <strong>Beklenen CSV Formatı:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-blue-800">
                    <li>CSV dosyası noktalı virgül (;) ile ayrılmış olmalı</li>
                    <li>Gerekli kolonlar: District, Price, m² (Net), Number of rooms</li>
                    <li>Opsiyonel kolonlar: Neighborhood, Building Age</li>
                    <li>Price formatı: "924021.52 TL" veya sayısal değer</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Training Configuration */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Eğitim Ayarları</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Test Split (Test Verisi Oranı)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={trainingConfig.testSize}
                    onChange={(e) => setTrainingConfig({ ...trainingConfig, testSize: Number(e.target.value) })}
                    min="0.1"
                    max="0.5"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  />
                  <div className="text-xs text-gray-500 mt-1">Test için ayrılacak veri oranı (0.1-0.5)</div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Column (Hedef Kolon)
                  </label>
                  <input
                    type="text"
                    value={trainingConfig.targetColumn}
                    onChange={(e) => setTrainingConfig({ ...trainingConfig, targetColumn: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  />
                  <div className="text-xs text-gray-500 mt-1">Tahmin edilecek kolon adı (genellikle "Price")</div>
                </div>
              </div>
            </div>

            {/* Start Training Button */}
            <button
              onClick={handleTraining}
              disabled={!file || !csvContent || isTraining}
              className="w-full px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              {isTraining ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Model Eğitiliyor...
                </>
              ) : (
                <>
                  <FaUpload />
                  Modeli Eğit
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Training Progress */}
            {isTraining && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 text-center">
                <FaSpinner className="text-6xl text-gray-900 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Model Eğitiliyor...</h3>
                <p className="text-gray-600">Yeni verilerle model eğitimi yapılıyor. Lütfen bekleyin.</p>
              </div>
            )}

            {/* Training Results */}
            {trainingResults && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50">
                <div className="flex items-center gap-3 mb-6">
                  {trainingResults.status === 'success' ? (
                    <FaCheckCircle className="text-3xl text-green-600" />
                  ) : (
                    <FaTimesCircle className="text-3xl text-red-600" />
                  )}
                  <h3 className="text-xl font-bold text-gray-900">Eğitim Sonuçları</h3>
                </div>
                
                {trainingResults.message && (
                  <div className={`p-4 rounded-xl mb-6 ${
                    trainingResults.status === 'success' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className={`text-sm font-semibold ${
                      trainingResults.status === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {trainingResults.message}
                    </p>
                  </div>
                )}

                {trainingResults.training_results && (
                  <div className="space-y-6">
                    {/* Data Info */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4 text-lg">📊 Veri Bilgileri</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200">
                          <div>
                            <div className="text-sm text-gray-600">Orijinal Veri</div>
                            <div className="text-lg font-bold text-gray-900">{trainingResults.training_results.original_data_size?.toLocaleString('tr-TR')} satır</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200">
                          <div>
                            <div className="text-sm text-gray-600">Yeni Veri</div>
                            <div className="text-lg font-bold text-gray-900">{trainingResults.training_results.new_data_size?.toLocaleString('tr-TR')} satır</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200">
                          <div>
                            <div className="text-sm text-gray-600">Toplam Veri</div>
                            <div className="text-lg font-bold text-gray-900">{trainingResults.training_results.combined_data_size?.toLocaleString('tr-TR')} satır</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Train Metrics */}
                    {trainingResults.training_results.train_metrics && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-4 text-lg">🎯 Eğitim Metrikleri</h4>
                        <p className="text-sm text-green-700 mb-4">Modelin eğitim verisi üzerindeki performansı</p>
                        <div className="space-y-4">
                          <div className="p-4 bg-white rounded-xl border border-green-200">
                            <div className="text-sm text-green-700 mb-2">MAE (Ortalama Mutlak Hata)</div>
                            <div className="text-3xl font-bold text-green-900 mb-1">
                              {trainingResults.training_results.train_metrics.mae?.toLocaleString('tr-TR')} TL
                            </div>
                            <div className="text-xs text-green-600">Tahminlerdeki ortalama sapma miktarı</div>
                          </div>
                          <div className="p-4 bg-white rounded-xl border border-green-200">
                            <div className="text-sm text-green-700 mb-2">RMSE (Kök Ortalama Kare Hata)</div>
                            <div className="text-3xl font-bold text-green-900 mb-1">
                              {trainingResults.training_results.train_metrics.rmse?.toLocaleString('tr-TR')} TL
                            </div>
                            <div className="text-xs text-green-600">Hata büyüklüğünün karekökü</div>
                          </div>
                          <div className="p-4 bg-white rounded-xl border border-green-200">
                            <div className="text-sm text-green-700 mb-2">R² Score (Doğruluk Oranı)</div>
                            <div className="text-3xl font-bold text-green-900 mb-1">
                              {(trainingResults.training_results.train_metrics.r2 * 100)?.toFixed(1)}%
                            </div>
                            <div className="text-xs text-green-600">Modelin veri değişkenliğini açıklama oranı</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Test Metrics */}
                    {trainingResults.training_results.test_metrics && (
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-4 text-lg">✅ Test Metrikleri</h4>
                        <p className="text-sm text-blue-700 mb-4">Modelin görülmemiş veriler üzerindeki performansı</p>
                        <div className="space-y-4">
                          <div className="p-4 bg-white rounded-xl border border-blue-200">
                            <div className="text-sm text-blue-700 mb-2">MAE (Ortalama Mutlak Hata)</div>
                            <div className="text-3xl font-bold text-blue-900 mb-1">
                              {trainingResults.training_results.test_metrics.mae?.toLocaleString('tr-TR')} TL
                            </div>
                            <div className="text-xs text-blue-600">Tahminlerdeki ortalama sapma miktarı</div>
                          </div>
                          <div className="p-4 bg-white rounded-xl border border-blue-200">
                            <div className="text-sm text-blue-700 mb-2">RMSE (Kök Ortalama Kare Hata)</div>
                            <div className="text-3xl font-bold text-blue-900 mb-1">
                              {trainingResults.training_results.test_metrics.rmse?.toLocaleString('tr-TR')} TL
                            </div>
                            <div className="text-xs text-blue-600">Hata büyüklüğünün karekökü</div>
                          </div>
                          <div className="p-4 bg-white rounded-xl border border-blue-200">
                            <div className="text-sm text-blue-700 mb-2">R² Score (Doğruluk Oranı)</div>
                            <div className="text-3xl font-bold text-blue-900 mb-1">
                              {(trainingResults.training_results.test_metrics.r2 * 100)?.toFixed(1)}%
                            </div>
                            <div className="text-xs text-blue-600">Modelin veri değişkenliğini açıklama oranı</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Performance Summary */}
                    {trainingResults.training_results.test_metrics && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                        <h4 className="font-semibold text-purple-900 mb-4 text-lg">📈 Performans Özeti</h4>
                        <div className="space-y-3 text-sm text-purple-800">
                          <div className="flex justify-between items-center">
                            <span>Ortalama tahmin hatası:</span>
                            <span className="font-bold">~{Math.round(trainingResults.training_results.test_metrics.mae).toLocaleString('tr-TR')} TL</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Model doğruluğu:</span>
                            <span className="font-bold">{(trainingResults.training_results.test_metrics.r2 * 100)?.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Test verisi oranı:</span>
                            <span className="font-bold">{(trainingConfig.testSize * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Model Update Status */}
                    <div className={`p-4 rounded-xl border ${
                      trainingResults.model_updated 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-amber-50 border-amber-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        {trainingResults.model_updated ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaTimesCircle className="text-amber-600" />
                        )}
                        <span className={`text-sm font-semibold ${
                          trainingResults.model_updated ? 'text-green-800' : 'text-amber-800'
                        }`}>
                          {trainingResults.model_updated 
                            ? 'Model başarıyla güncellendi' 
                            : 'Model güncellenmedi (Production modunda)'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setTrainingResults(null)
                        setFile(null)
                        setFileName('')
                        setCsvContent('')
                        document.getElementById('file-upload').value = ''
                      }}
                      className="w-full px-4 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200"
                    >
                      Yeni Eğitim Başlat
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Info Card */}
            {!isTraining && !trainingResults && (
              <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3">💡 İpuçları</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• CSV dosyası noktalı virgül (;) ile ayrılmış olmalı</li>
                  <li>• Daha fazla veri = Daha iyi sonuçlar</li>
                  <li>• Veri kalitesi önemlidir</li>
                  <li>• Eğitim süresi veri boyutuna bağlıdır</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

