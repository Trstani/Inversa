import React, { useEffect, useState, useRef } from 'react';

const EditorTutorial = ({
  step,
  onNext,
  onSkip,
  onPrevious,
  openMobileMenu,   // Fungsi async: () => Promise<void> (tunggu animasi selesai)
  closeMobileMenu,
}) => {
  const tutorials = [
    {
      targetId: 'chapter-sidebar',
      title: 'chapter sidebar',
      description: 'Chapter sidebar akan berisi List Chapter yang kamu buat',
    },
    {
      targetId: 'add-chapter',
      title: 'Add Chapter',
      description: 'Menambahkan Chapter Baru pada project Kamu',
    },
    {
      targetId: 'create-chapter',
      title: 'Create Chapters',
      description: 'Buat Chapter pertama mu',
    },
  ];

  // Bersihkan semua highlight saat komponen di-unmount (finish / skip / navigasi keluar)
  useEffect(() => {
    return () => {
      document.querySelectorAll('.tutorial-highlight').forEach((el) =>
        el.classList.remove('tutorial-highlight')
      );
    };
  }, []);

  const tooltipRef = useRef(null);
    const [tooltipStyle, setTooltipStyle] = useState({});
    const [arrowStyle, setArrowStyle] = useState({});
    const [placement, setPlacement] = useState('bottom'); // 'bottom' | 'top' | 'mobile'
    const [isMobile, setIsMobile] = useState(false);
    const [resizeKey, setResizeKey] = useState(0);
  
    // Deteksi perangkat mobile
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);
  
    // Recalculate saat resize
    useEffect(() => {
      const handleResize = () => setResizeKey((prev) => prev + 1);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    // Posisikan tooltip setiap kali step, mode mobile, atau resize berubah
    useEffect(() => {
      const tutorial = tutorials[step];
      if (!tutorial) return;
  
      // Bersihkan highlight sebelumnya
      document.querySelectorAll('.tutorial-highlight').forEach((el) => el.classList.remove('tutorial-highlight'));
  
      const positionTooltip = async () => {
        let targetElement = null;
  
        // ---------- PHASE 3: Burger menu support ----------
        if (isMobile && tutorial.requiresMenuOpen) {
          if (!openMobileMenu) {
            console.warn('openMobileMenu prop tidak tersedia. Lewati step.');
            onNext();
            return;
          }
          // Buka menu mobile dan tunggu animasi
          await openMobileMenu();
          // Beri waktu ekstra agar elemen benar-benar tampil
          await new Promise((r) => setTimeout(r, 400));
          targetElement = document.getElementById(tutorial.mobileTargetId);
        } else {
          targetElement = document.getElementById(tutorial.targetId);
        }
  
        if (!targetElement) {
          console.warn(`Target tidak ditemukan: ${tutorial.mobileTargetId || tutorial.targetId}`);
          onNext(); // auto-skip
          return;
        }
  
        // Highlight dan scroll
        targetElement.classList.add('tutorial-highlight');
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
        // ---------- PHASE 2: Mobile experience ----------
        if (isMobile) {
          setPlacement('mobile');
          setTooltipStyle({}); // gunakan CSS class fixed bottom
          setArrowStyle({ display: 'none' });
          return;
        }
  
        // ---------- PHASE 1: Smart positioning untuk desktop/tablet ----------
        const tooltipEl = tooltipRef.current;
        if (!tooltipEl) return;
  
        // Tunggu sebentar agar layout selesai (scroll, highlight)
        await new Promise((r) => setTimeout(r, 100));
  
        const targetRect = targetElement.getBoundingClientRect();
        const tooltipRect = tooltipEl.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;
  
        const vw = window.innerWidth;
        const vh = window.innerHeight;
  
        // Horizontal: pusatkan ke target, clamp ke viewport
        let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        left = Math.max(16, Math.min(left, vw - tooltipWidth - 16));
  
        // Vertikal: prefer bottom, fallback top, clamp
        const spaceBelow = vh - targetRect.bottom - 12;
        const spaceAbove = targetRect.top - 12;
        let top;
        let newPlacement;
  
        if (spaceBelow >= tooltipHeight + 12) {
          top = targetRect.bottom + 12;
          newPlacement = 'bottom';
        } else if (spaceAbove >= tooltipHeight + 12) {
          top = targetRect.top - tooltipHeight - 12;
          newPlacement = 'top';
        } else {
          // Tidak cukup ruang, tetap di bawah tapi clamp
          top = targetRect.bottom + 12;
          newPlacement = 'bottom';
        }
  
        // Clamp vertikal
        if (top < 16) top = 16;
        if (top + tooltipHeight > vh - 16) {
          top = vh - tooltipHeight - 16;
        }
  
        // Posisi panah (horizontal relatif terhadap tooltip, ikuti target)
        let arrowLeft = targetRect.left + targetRect.width / 2 - left;
        arrowLeft = Math.max(12, Math.min(arrowLeft, tooltipWidth - 12));
  
        setTooltipStyle({
          position: 'fixed',
          top: `${top}px`,
          left: `${left}px`,
        });
  
        setArrowStyle({
          left: `${arrowLeft}px`,
          // Penempatan vertikal panah sesuai arah tooltip
          ...(newPlacement === 'bottom'
            ? { top: '-8px', transform: 'translateX(-50%) rotate(45deg)' }
            : { bottom: '-8px', transform: 'translateX(-50%) rotate(225deg)' }),
        });
  
        setPlacement(newPlacement);
      };
  
      positionTooltip();
    }, [step, isMobile, resizeKey, openMobileMenu, onNext]);
  
    // Tutup menu mobile jika step berubah dan sebelumnya membutuhkan menu
    useEffect(() => {
      return () => {
        if (closeMobileMenu && isMobile) {
          closeMobileMenu();
        }
      };
    }, [step, closeMobileMenu, isMobile]);
  
    const current = tutorials[step];
    if (!current) return null;
  
    const isLastStep = step === tutorials.length - 1;
    const isFirstStep = step === 0;
  
    return (
      <>
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/50 z-[9998]" />
  
        {/* ---------- DESKTOP/TABLET TOOLTIP ---------- */}
        {!isMobile && (
          <div
            ref={tooltipRef}
            style={tooltipStyle}
            className="fixed z-[9999] w-80 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-5"
          >
            {/* Panah */}
            <div
              style={arrowStyle}
              className="absolute w-4 h-4 bg-white dark:bg-gray-900 border-l border-t border-gray-200 dark:border-gray-700"
            />
  
            {/* Konten */}
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
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {current.description}
            </p>
  
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
        )}
  
        {/* ---------- MOBILE CARD (fixed bottom) ---------- */}
        {isMobile && (
          <div className="fixed bottom-4 left-4 right-4 z-[9999] rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-5">
            {/* Progress & skip */}
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
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {current.description}
            </p>
  
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
        )}
      </>
    );
  };
  

export default EditorTutorial;