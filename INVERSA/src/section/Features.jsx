import React from 'react';
import { FiEdit3, FiUsers, FiShield, FiType, FiFolder } from 'react-icons/fi';

const features = [
  {
    icon: <FiEdit3 className="w-8 h-8 text-light-accent dark:text-dark-accent" />,
    title: 'Structured Draft System',
    description: 'Edit hanya saat draft, simpan perubahan, dan publish final. Tidak bisa diubah setelah publish.'
  },
  {
    icon: <FiUsers className="w-8 h-8 text-light-accent dark:text-dark-accent" />,
    title: 'Asynchronous Collaboration',
    description: 'Tidak perlu realtime. Gantian edit dengan flow yang jelas dan terstruktur.'
  },
  {
    icon: <FiShield className="w-8 h-8 text-light-accent dark:text-dark-accent" />,
    title: 'Role-Based Access',
    description: 'Initiator, Collaborator, dan Reader — setiap peran memiliki hak akses yang sesuai.'
  },
  {
    icon: <FiType className="w-8 h-8 text-light-accent dark:text-dark-accent" />,
    title: 'Rich Text Editor (Tiptap)',
    description: 'Heading, image, format teks, dan lainnya untuk menulis dengan leluasa.'
  },
  {
    icon: <FiFolder className="w-8 h-8 text-light-accent dark:text-dark-accent" />,
    title: 'Project Management',
    description: 'Atur genre, kategori, abstrak, dan cover image untuk setiap proyek.'
  }
];

const Features = () => {
  return (
    <section className="bg-light-surface dark:bg-dark-surface py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center font-logo">Fitur Unggulan INVERSA</h2>
        <p className="mt-3 text-center text-light-secondary dark:text-dark-secondary max-w-2xl mx-auto">
          Dirancang untuk memudahkan kolaborasi penulisan yang terstruktur dan profesional.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-light-background dark:bg-dark-background p-6 rounded-xl border border-light-border dark:border-dark-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-light-accent/10 dark:bg-dark-accent/10 rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-light-secondary dark:text-dark-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;