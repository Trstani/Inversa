import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const faqs = [
  {
    question: 'Apakah kolaborasi dilakukan secara realtime?',
    answer: 'Tidak. INVERSA menggunakan sistem asynchronous collaboration untuk menjaga struktur dan kontrol draft.'
  },
  {
    question: 'Siapa yang bisa mengedit chapter?',
    answer: 'Hanya initiator dan collaborator yang telah disetujui, dan hanya saat status draft.'
  },
  {
    question: 'Apakah chapter bisa diubah setelah dipublish?',
    answer: 'Tidak. Setelah publish, chapter terkunci dan tidak dapat diubah.'
  },
  {
    question: 'Bagaimana cara bergabung menjadi collaborator?',
    answer: 'Ajukan permintaan kolaborasi pada proyek yang diinginkan, lalu tunggu approval dari initiator.'
  }
];

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="bg-light-surface dark:bg-dark-surface py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center font-logo">Pertanyaan yang Sering Diajukan</h2>
        <p className="mt-3 text-center text-light-secondary dark:text-dark-secondary">
          Temukan jawaban atas pertanyaan seputar penggunaan INVERSA.
        </p>
        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-light-border dark:border-dark-border rounded-lg bg-light-background dark:bg-dark-background overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
              >
                <span className="font-medium text-lg">{faq.question}</span>
                {openFaq === idx ? (
                  <FiChevronUp className="w-5 h-5 text-light-secondary dark:text-dark-secondary" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-light-secondary dark:text-dark-secondary" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-light-secondary dark:text-dark-secondary border-t border-light-border dark:border-dark-border pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;