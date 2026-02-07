export default function KontakPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Kontak</h1>
      <p className="mt-3 text-sm text-gray-700">
        Untuk pertanyaan, kerja sama, atau pesanan dalam jumlah besar, hubungi kami:
      </p>

      <div className="mt-4 rounded-xl border bg-white p-4 text-sm">
        <div><b>WhatsApp:</b> <a className="text-green-700 underline" href="https://wa.me/6289532642246">0895-3264-22463</a></div>
        <div className="mt-1"><b>Jam operasional:</b> 08.00–20.00</div>
      </div>
    </div>
  );
}