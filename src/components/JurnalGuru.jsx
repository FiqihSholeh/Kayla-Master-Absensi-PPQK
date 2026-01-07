import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const JurnalGuru = () => {
  const [form, setForm] = useState({
    tanggal: "",
    namaGuru: "",
    mapel: "",
    kelas: "",
    materi: "",
    kegiatan: "",
  });

  const [jurnalList, setJurnalList] = useState(() => {
    const saved = localStorage.getItem("jurnalGuru");
    return saved ? JSON.parse(saved) : [];
  });

  // State untuk gambar background
  const [templateImage, setTemplateImage] = useState(null);

  useEffect(() => {
    localStorage.setItem("jurnalGuru", JSON.stringify(jurnalList));
  }, [jurnalList]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTambah = () => {
    if (
      form.tanggal &&
      form.namaGuru &&
      form.mapel &&
      form.kelas &&
      form.materi &&
      form.kegiatan
    ) {
      setJurnalList([...jurnalList, { ...form }]);
      setForm({
        tanggal: "",
        namaGuru: "",
        mapel: "",
        kelas: "",
        materi: "",
        kegiatan: "",
      });
    } else {
      alert("Semua kolom harus diisi!");
    }
  };

  const handleReset = () => {
    if (window.confirm("Yakin ingin menghapus semua entri?")) {
      setJurnalList([]);
      localStorage.removeItem("jurnalGuru");
    }
  };

  const handleImportTemplate = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          if (window.confirm("Template akan menggantikan data jurnal yang ada. Lanjutkan?")) {
            setJurnalList(importedData);
          }
        } else {
          alert("Format file tidak sesuai.");
        }
      } catch (err) {
        alert("Gagal membaca file. Pastikan file JSON valid.");
      }
    };
    reader.readAsText(file);
  };

  const handleExportTemplate = () => {
    const blob = new Blob([JSON.stringify(jurnalList, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template_jurnal.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Fungsi baru untuk upload gambar background
  const handleUploadBackground = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi format file
    if (!file.type.startsWith("image/png") && !file.type.startsWith("image/jpeg")) {
      alert("Format file harus PNG atau JPG/JPEG");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setTemplateImage(event.target.result); // simpan base64
    };
    reader.readAsDataURL(file);
  };

  const handleCetakPDF = () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "mm",
    });
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Jika ada gambar background, tambahkan dulu
    if (templateImage) {
      const imgFormat = templateImage.startsWith("data:image/png") ? "PNG" : "JPEG";
      doc.addImage(templateImage, imgFormat, 0, 0, 210, 297); // ukuran A4 full
    }

    doc.text("Jurnal Harian Guru : ......................................................", 14, 47);

    autoTable(doc, {
      startY: 50,
      columns: [
        { header: "No", dataKey: "no" },
        { header: "Tanggal", dataKey: "tanggal" },
        { header: "Nama Guru", dataKey: "namaGuru" },
        { header: "Mata Pelajaran", dataKey: "mapel" },
        { header: "Kelas", dataKey: "kelas" },
        { header: "Materi", dataKey: "materi" },
        { header: "Kegiatan", dataKey: "kegiatan" },
      ],
      body: jurnalList.map((item, index) => ({
        no: index + 1,
        tanggal: new Date(item.tanggal).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        namaGuru: item.namaGuru,
        mapel: item.mapel,
        kelas: item.kelas,
        materi: item.materi,
        kegiatan: item.kegiatan,
      })),
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        halign: "center",
        fontSize: 12,
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
      },
      bodyStyles: {
        halign: "left",
        textColor: [0, 0, 0],
        fontSize: 12,
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
      },
      styles: {
        fontSize: 12,
      },
    });

    let finalY = doc.lastAutoTable.finalY + 20;
    if (finalY < 230) finalY = 230;

    const today = new Date();
    const formattedDate = today.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    doc.text(`................, ${formattedDate}`, 130, finalY);
    doc.text("Mengetahui,", 14, finalY);
    doc.text("Waka Kurikulum", 14, finalY + 8);
    doc.text("____________________________", 14, finalY + 30);

    doc.text("Guru Mapel", 130, finalY + 8);
    doc.text("____________________________", 130, finalY + 30);

    doc.save("jurnal_guru.pdf");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white text-black rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Jurnal Guru</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input name="tanggal" type="date" value={form.tanggal} onChange={handleChange} className="border p-2 rounded" />
        <input name="namaGuru" type="text" placeholder="Nama Guru" value={form.namaGuru} onChange={handleChange} className="border p-2 rounded" />
        <input name="mapel" type="text" placeholder="Mata Pelajaran" value={form.mapel} onChange={handleChange} className="border p-2 rounded" />
        <input name="kelas" type="text" placeholder="Kelas" value={form.kelas} onChange={handleChange} className="border p-2 rounded" />
        <input name="materi" type="text" placeholder="Materi" value={form.materi} onChange={handleChange} className="border p-2 rounded" />
        <input name="kegiatan" type="text" placeholder="Kegiatan Pembelajaran" value={form.kegiatan} onChange={handleChange} className="border p-2 rounded" />
      </div>

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <button onClick={handleTambah} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tambah Entri</button>
        <button onClick={handleCetakPDF} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Cetak PDF</button>
        <button onClick={handleReset} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Reset Data</button>
        <button onClick={handleExportTemplate} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Export Template</button>

        {/* Input upload file JSON untuk import template */}
        <input type="file" accept=".json" onChange={handleImportTemplate} className="border border-gray-300 px-2 py-1 rounded" />

        {/* Input upload gambar background (PNG/JPG) */}
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleUploadBackground}
          className="border border-gray-300 px-2 py-1 rounded"
          title="Upload gambar background PNG atau JPG"
        />
      </div>

      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-200 text-center">
          <tr>
            <th className="border px-2 py-1">Tanggal</th>
            <th className="border px-2 py-1">Nama Guru</th>
            <th className="border px-2 py-1">Mapel</th>
            <th className="border px-2 py-1">Kelas</th>
            <th className="border px-2 py-1">Materi</th>
            <th className="border px-2 py-1">Kegiatan</th>
          </tr>
        </thead>
        <tbody>
          {jurnalList.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">Belum ada entri.</td>
            </tr>
          ) : (
            jurnalList.map((item, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{item.tanggal}</td>
                <td className="border px-2 py-1">{item.namaGuru}</td>
                <td className="border px-2 py-1">{item.mapel}</td>
                <td className="border px-2 py-1">{item.kelas}</td>
                <td className="border px-2 py-1">{item.materi}</td>
                <td className="border px-2 py-1">{item.kegiatan}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JurnalGuru;
