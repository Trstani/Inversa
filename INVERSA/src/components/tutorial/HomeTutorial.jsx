import React, { useEffect, useState, useRef } from 'react';

const HomeTutorial = ({ step, onNext, onSkip, onPrevious }) => {
  const tutorials = [
    { targetId: 'tutorial-home', title: 'Home', description: 'Halaman utama INVERSA. Menampilkan berbagai karya dan rekomendasi untukmu.' },
    { targetId: 'tutorial-explore', title: 'Explore', description: 'Cari karya berdasarkan judul atau genre. Temukan cerita-cerita menarik.' },
    { targetId: 'tutorial-dashboard', title: 'Dashboard', description: 'Kelola project solo maupun tim. Lihat statistik dan aktivitas menulismu.' },
    { targetId: 'tutorial-bento-dashboard', title: 'Your Dashboard', description: 'Ringkasan aktivitas akun milikmu. Total proyek, anggota tim, dan notifikasi.' },
    { targetId: 'tutorial-followed-projects', title: 'Followed Projects', description: 'Proyek yang kamu ikuti akan muncul di sini untuk akses cepat.' },
    { targetId: 'tutorial-reading-history', title: 'Reading History', description: 'Lanjutkan membaca chapter terakhir yang pernah kamu buka.' },
    { targetId: 'tutorial-profile', title: 'Profile', description: 'Kelola akun dan informasi profil. Ubah foto, bio, dan preferensi.' }
  ];

  const [position, setPosition] = useState({ top: 100, left: 100 });
  const timeoutRef = useRef(null);

  useEffect(() => {
    const current = tutorials[step];
    if (!current) return;

    // Bersihkan highlight sebelumnya
    const prevTarget = document.querySelector('.tutorial-highlight');
    if (prevTarget) prevTarget.classList.remove('tutorial-highlight');

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const target = document.getElementById(current.targetId);
      if (!target) {
        console.warn(`Target element not found: ${current.targetId}`);
        onNext(); // auto-skip
        return;
      }

      target.classList.add('tutorial-highlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const rect = target.getBoundingClientRect();
      const tooltipWidth = 320;
      const tooltipHeight = 240; // perkiraan tinggi tooltip

      // Posisi horizontal: center di atas target, dengan clamp pinggir layar
      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));

      // Posisi vertikal: di bawah target + 12px
      let top = rect.bottom + 12;

      // Jika tooltip melebihi batas bawah layar, tampilkan di atas target
      if (top + tooltipHeight > window.innerHeight) {
        top = rect.top - tooltipHeight - 12;
      }

      setPosition({ top, left });
    }, 200);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const currentTarget = document.getElementById(current.targetId);
      if (currentTarget) currentTarget.classList.remove('tutorial-highlight');
    };
  }, [step, onNext]);

  const current = tutorials[step];
  if (!current) return null;

  const isLastStep = step === tutorials.length - 1;
  const isFirstStep = step === 0;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" />

      {/* Tooltip */}
      <div
        style={{ top: position.top, left: position.left }}
        className="fixed z-[9999] w-80 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-5"
      >
        {/* Arrow (selalu di tengah tooltip) */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white dark:bg-gray-900 border-l border-t border-gray-200 dark:border-gray-700" />

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Step {step + 1} of {tutorials.length}</span>
            <button onClick={onSkip} className="hover:text-gray-700 dark:hover:text-gray-300 transition">
              Skip tutorial
            </button>
          </div>
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((step + 1) / tutorials.length) * 100}%` }}
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{current.title}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{current.description}</p>

        <div className="mt-5 flex justify-between items-center">
          <div className="flex gap-2">
            {!isFirstStep && onPrevious && (
              <button
                onClick={onPrevious}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Previous
              </button>
            )}
          </div>
          <button
            onClick={onNext}
            className="px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-all active:scale-95"
          >
            {isLastStep ? 'Finish' : 'Next →'}
          </button>
        </div>
      </div>
    </>
  );
};

export default HomeTutorial;