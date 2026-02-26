import React from 'react';
import Hero from '../section/HeroFst';
import Features from '../section/Features';
import HowItWorks from '../section/HowitWorks';
import FAQ from '../section/FAQ';

const HomePage = () => {
  return (
    <main className="bg-light-background dark:bg-dark-background text-light-primary dark:text-dark-primary">
      <Hero />
      <Features />
      <HowItWorks />
      <FAQ />
    </main>
  );
};

export default HomePage;