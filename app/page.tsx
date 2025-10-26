// app/page.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CodeInput from "./components/CodeInput";
import ResultCard from "./components/ResultCard";
import Loader from "./components/Loader";

export default function Home() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Fungsi ini dikirim ke CodeInput
  const handleAnalyze = async (inputCode: string) => {
    setLoading(true);
    setResult(""); // Kosongkan hasil sebelumnya

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inputCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Menampilkan pesan error dari backend jika ada
        throw new Error(data.error || "Gagal mengambil data");
      }

      setResult(data.result || "Tidak ada hasil analisis ditemukan.");
    } catch (error: any) {
      console.error(error);
      setResult(`❌ Terjadi kesalahan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen p-6 pt-24 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white selection:bg-blue-900/50">
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🧠 GraniteFixer AI
      </motion.h1>

      <motion.p 
        className="text-lg text-gray-400 mb-8 max-w-xl text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Didukung oleh IBM Granite. Masukkan kode Anda untuk mendapatkan analisis mendalam.
      </motion.p>

      {/* Bagian yang dilengkapi */}
      <CodeInput
        code={code}
        setCode={setCode}
        onSubmit={handleAnalyze}
        loading={loading}
      />

      {/* Tampilkan Loader saat loading */}
      {loading && <Loader />}

      {/* Tampilkan ResultCard jika ada hasil dan tidak sedang loading */}
      {!loading && result && <ResultCard result={result} />}
      {/* Bagian yang dilengkapi selesai */}

    </main>
  );
}
