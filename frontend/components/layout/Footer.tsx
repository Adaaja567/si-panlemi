import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-8 bg-white border-t">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-600">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-gray-800">
              Ngendok_Farm – SI PANLEMI
            </p>
            <p>Perumahan X, Blok Y, Kota Z</p>
            <p>Jam operasional: 06.00 – 20.00</p>
          </div>
          <div>
            <p>WhatsApp: 08xx-xxxx-xxxx</p>
            <p>Instagram / TikTok: @ngendok_farm (jika ada)</p>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Ngendok_Farm – SI PANLEMI
        </p>
      </div>
    </footer>
  );
};

export default Footer;