import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Emlak AI",
      subtitle: "Yapay Zeka Destekli Emlak Değerlendirme Platformu",
      content: "İstanbul emlak piyasasını AI teknolojisi ile analiz edin"
    },
    {
      title: "Özellikler",
      subtitle: "Güçlü AI Teknolojisi",
      features: [
        "⚡ Anında fiyat tahmini",
        "🔍 İlan analiz ve değerlendirme",
        "📊 Piyasa trend analizi",
        "⚖️ İlan karşılaştırma",
        "🤖 Özelleştirilebilir model eğitimi"
      ]
    },
    {
      title: "İstatistikler",
      subtitle: "Platform Performansı",
      stats: [
        { label: "Analiz Edilen İlan", value: "10,000+" },
        { label: "Doğruluk Oranı", value: "%95" },
        { label: "Kapsanan İlçe", value: "39" },
        { label: "AI Modeli", value: "Gelişmiş ML" }
      ]
    },
    {
      title: "Teknoloji",
      subtitle: "Modern Stack",
      tech: [
        "React + Vite",
        "Tailwind CSS",
        "Leaflet Maps",
        "Python FastAPI",
        "Machine Learning",
        "Real-time Analysis"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Slide Content */}
        <div className="flex-1 flex items-center justify-center px-8 py-20">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-7xl md:text-8xl font-black text-white mb-6 animate-fade-in">
              {slides[currentSlide].title}
            </h1>
            <p className="text-3xl md:text-4xl text-blue-200 mb-12">
              {slides[currentSlide].subtitle}
            </p>

            {slides[currentSlide].content && (
              <p className="text-xl text-gray-300">{slides[currentSlide].content}</p>
            )}

            {slides[currentSlide].features && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                {slides[currentSlide].features.map((feature, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="text-2xl text-white">{feature}</div>
                  </div>
                ))}
              </div>
            )}

            {slides[currentSlide].stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                {slides[currentSlide].stats.map((stat, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {slides[currentSlide].tech && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
                {slides[currentSlide].tech.map((tech, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                    <div className="text-lg text-white">{tech}</div>
                  </div>
                ))}
              </div>
            )}

            {currentSlide === slides.length - 1 && (
              <div className="mt-12">
                <Link
                  to="/"
                  className="inline-block px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Platformu Keşfet →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="pb-8 flex items-center justify-center gap-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === idx ? 'bg-white w-8' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 right-8 flex gap-4">
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-xl text-white disabled:opacity-50"
          >
            ← Önceki
          </button>
          <button
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-xl text-white disabled:opacity-50"
          >
            Sonraki →
          </button>
        </div>
      </div>
    </div>
  )
}

