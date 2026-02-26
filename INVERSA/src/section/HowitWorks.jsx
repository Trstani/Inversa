import React from 'react';

const steps = [
  'Create Project',
  'Write Draft Chapter',
  'Collaborator Edit',
  'Save Draft',
  'Publish Final',
  'Readers Enjoy'
];

const HowItWorks = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center font-logo">Bagaimana Cara Kerjanya?</h2>
        <p className="mt-3 text-center text-light-secondary dark:text-dark-secondary max-w-2xl mx-auto">
          Alur sederhana yang membuat kolaborasi tetap rapi dan terarah.
        </p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-4 p-4 bg-light-surface dark:bg-dark-surface rounded-lg border border-light-border dark:border-dark-border"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-light-accent dark:bg-dark-accent text-white rounded-full flex items-center justify-center font-bold text-lg">
                {idx + 1}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{step}</h3>
                {idx === 0 && (
                  <p className="text-sm text-light-secondary dark:text-dark-secondary">
                    Buat proyek baru, tentukan genre dan deskripsi.
                  </p>
                )}
                {idx === 1 && (
                  <p className="text-sm text-light-secondary dark:text-dark-secondary">
                    Tulis draf bab dengan rich text editor.
                  </p>
                )}
                {idx === 2 && (
                  <p className="text-sm text-light-secondary dark:text-dark-secondary">
                    Collaborator dapat mengedit dan memberi saran.
                  </p>
                )}
                {idx === 3 && (
                  <p className="text-sm text-light-secondary dark:text-dark-secondary">
                    Simpan perubahan tanpa mengganggu versi final.
                  </p>
                )}
                {idx === 4 && (
                  <p className="text-sm text-light-secondary dark:text-dark-secondary">
                    Publikasikan bab yang sudah final.
                  </p>
                )}
                {idx === 5 && (
                  <p className="text-sm text-light-secondary dark:text-dark-secondary">
                    Pembaca dapat menikmati hasil karya.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;