import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Button from '../components/Button';
import GridMotion from './design/GridMotion';

import img1 from '../assets/imggrid/img1.jpg';
import img2 from '../assets/imggrid/img2.jpg';
import img3 from '../assets/imggrid/img3.jpg';
import img4 from '../assets/imggrid/img4.jpg';
import img5 from '../assets/imggrid/img5.jpg';
import img6 from '../assets/imggrid/img6.jpg';
import img7 from '../assets/imggrid/img7.jpg';

const items = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7
];

const HeroFst = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <GridMotion items={items} gradientColor="black" />
      </div>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/70 z-10"></div>

      {/* HERO CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl text-white">

          <h1 className="text-4xl md:text-6xl font-bold font-logo leading-tight">
            Kolaborasi Kreatif
            <span className="block text-zinc-500">
              Tanpa Batas
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-200">
            INVERSA adalah platform collaborative creative writing
            yang memungkinkan penulis, editor, dan pembaca bekerja
            sama dalam satu ekosistem kreatif.
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
      </div>

    </section>
  );
};

export default HeroFst;