const ContactSection: React.FC = () => {
  return (
    <section id="kontak" className="bg-white py-10">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Kontak Ngendok_Farm
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Hubungi kami untuk pemesanan dan informasi lebih lanjut.
        </p>
        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <p>WhatsApp: 08xx-xxxx-xxxx</p>
          <p>Alamat: Perumahan X, Blok Y, Kota Z</p>
          <p>Jam operasional: 06.00 – 20.00</p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;