import React, { useEffect, useState, useRef } from 'react';

const DashboardTutorialTeam = ({
  step,
  onNext,
  onSkip,
  onPrevious,
}) => {
  const tutorials = [
    {
      targetId: 'tutorial-tab-Team',
      title: 'Teams',
      description: 'Area kolaborasi tim. Di sini kamu bisa bekerja sama dengan penulis lain.',
    },
    {
      targetId: 'tutorial-create-team', // perbaiki ID: lowercase 'team'
      title: 'Create Team',
      description: 'Buat tim baru untuk berkolaborasi. Kamu bisa mengundang anggota dan mengelola proyek bersama.',
    },
    {
      targetId: 'tutorial-my-Teams',
      title: 'My Teams',
      description: 'Daftar seluruh tim yang kamu miliki atau menjadi anggotanya. Klik tim untuk melihat proyek bersama.',
    },
    {
      targetId: 'tutorial-available-Teams',
      title: 'Available Teams',
      description: 'Daftar tim yang bisa kamu ajukan untuk bergabung. Temukan tim dengan minat yang sama.',
    },
    {
      targetId: 'tutorial-requests-Teams',
      title: 'Join Requests',
      description: 'Daftar permintaan bergabung dari pengguna yang ingin masuk ke tim kamu. Kamu bisa approve atau reject.',
    },
  ];

  const [position, setPosition] = useState({ top: 100, left: 100 });
  const [arrowLeft, setArrowLeft] = useState(50);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const updatePosition = () => {
    const current = tutorials[step];
    if (!current) return;

    const target = document.getElementById(current.targetId);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 260;

    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));

    const targetCenterX = rect.left + rect.width / 2;
    let arrowOffset = targetCenterX - left;
    arrowOffset = Math.max(20, Math.min(arrowOffset, tooltipWidth - 20));
    setArrowLeft(arrowOffset);

    let top = rect.bottom + 16;
    if (top + tooltipHeight > window.innerHeight) {
      top = rect.top - tooltipHeight - 16;
    }

    setPosition({ top, left });
  };

  useEffect(() => {
    const current = tutorials[step];
    if (!current) return;

    const prevTarget = document.querySelector('.tutorial-highlight');
    if (prevTarget) {
      prevTarget.classList.remove('tutorial-highlight');
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const target = document.getElementById(current.targetId);
      
      if (!target) {
        console.warn(`Target element not found: ${current.targetId}`);
        onNext();
        return;
      }

      target.classList.add('tutorial-highlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      updatePosition();
    }, 200);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const currentTarget = document.getElementById(current.targetId);
      if (currentTarget) {
        currentTarget.classList.remove('tutorial-highlight');
      }
    };
  }, [step]);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [step]);

  const current = tutorials[step];
  if (!current) return null;

  const isLastStep = step === tutorials.length - 1;
  const isFirstStep = step === 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[9998]" />
      
      <div
        ref={tooltipRef}
        style={{ top: position.top, left: position.left }}
        className="fixed z-[9999] w-80 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-5"
      >
        <div
          style={{ left: arrowLeft }}
          className="absolute -top-2 w-4 h-4 rotate-45 bg-white dark:bg-gray-900 border-l border-t border-gray-200 dark:border-gray-700"
        />

        <div className="mb-4">
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Step {step + 1} of {tutorials.length}</span>
            <button onClick={onSkip} className="hover:text-gray-700 dark:hover:text-gray-300 transition">
              Skip tutorial
            </button>
          </div>
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${((step + 1) / tutorials.length) * 100}%` }} />
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

export default DashboardTutorialTeam;