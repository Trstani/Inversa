import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Button from '../components/Button';
import PenVintage from '../assets/PenVintage.jpg';

const HeroFst = () => {
  return (
    <section
      className="relative w-full py-16 md:py-24 bg-cover bg-center"
      style={{ backgroundImage: `url(${PenVintage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-2 items-center">
          
          {/* Left */}
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold font-logo leading-tight">
              Kolaborasi Kreatif Tanpa Batas
            </h1>
            <p className="mt-4 text-lg text-gray-200">
              INVERSA adalah platform collaborative creative writing yang memungkinkan penulis,
              editor, dan pembaca bekerja sama dalam satu ekosistem terstruktur.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<FiArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                >
                  Mulai Menulis
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline" size="lg">
                  Jelajahi Proyek
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Image */}
          <div className="flex justify-center">
            <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/10">
              <img
                src={PenVintage}
                alt="Vintage Pen Writing"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroFst;