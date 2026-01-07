import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ImagePlus } from 'lucide-react';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

const AttendanceReport = ({ students, attendanceData }) => {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [waliKelas, setWaliKelas] = useState(""); // <- Tambahan untuk nama wali kelas

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    if (backgroundImage) {
      doc.addImage(backgroundImage, 'PNG', 0, 0, 210, 297);
    }

    doc.setFontSize(12);
    doc.text("Laporan Kehadiran Siswa : .........................................", 14, 47);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 53);

    const tableColumn = ["No", "Nama Siswa", "Kelas", "Hadir", "Izin", "Alfa", "Total Hari"];
    const tableRows = [];

    students.forEach((student, index) => {
      const studentAttendance = attendanceData[student.id] || {};
      let hadirCount = 0;
      let izinCount = 0;
      let alfaCount = 0;
      let totalDays = 0;

      Object.values(studentAttendance).forEach(status => {
        if (status === 'Hadir') hadirCount++;
        if (status === 'Izin') izinCount++;
        if (status === 'Alfa') alfaCount++;
        if (status) totalDays++;
      });

      const studentData = [
        index + 1,
        student.name,
        student.class,
        hadirCount,
        izinCount,
        alfaCount,
        totalDays
      ];
      tableRows.push(studentData);
    });

    doc.autoTable({
      startY: 55,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] },
      bodyStyles: { textColor: [0, 0, 0] },
      margin: { top: 35 }
    });

    const finalY = doc.lastAutoTable.finalY + 20;

    doc.setFontSize(12);
    doc.setTextColor(0);

    doc.text("Mengetahui,", 130, finalY);
    doc.text("Wali Kelas", 130, finalY + 8);
    doc.text("____________________________", 130, finalY + 30);
    doc.text(waliKelas || "Nama Wali Kelas", 130, finalY + 38); // <- Menampilkan input nama wali kelas

    doc.save(`laporan_kehadiran_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const getMonthlySummary = (studentId) => {
    const studentAttendance = attendanceData[studentId] || {};
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    let hadir = 0;
    let izin = 0;
    let alfa = 0;

    Object.keys(studentAttendance).forEach(date => {
      if (date.startsWith(currentMonth)) {
        if (studentAttendance[date] === 'Hadir') hadir++;
        if (studentAttendance[date] === 'Izin') izin++;
        if (studentAttendance[date] === 'Alfa') alfa++;
      }
    });
    return { hadir, izin, alfa };
  };

  return (
    <div className="mt-10 p-6 bg-white/10 backdrop-blur-md border-slate-700 shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">Rekap Kehadiran Bulan Ini</h2>
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageUpload}
            className="hidden"
            id="bg-upload"
          />
          <label htmlFor="bg-upload">
            <Button asChild variant="outline" className="text-white border-white hover:bg-white hover:text-black cursor-pointer">
              <span><ImagePlus size={18} className="mr-2" />Template</span>
            </Button>
          </label>
          <Button onClick={generatePDF} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            <Download size={18} className="mr-2" />
            Unduh PDF
          </Button>
        </div>
      </div>

      {/* Input Nama Wali Kelas */}
      <div className="mb-4">
        <label className="block text-sm text-white mb-1">Nama Wali Kelas:</label>
        <input
          type="text"
          value={waliKelas}
          onChange={(e) => setWaliKelas(e.target.value)}
          className="w-full p-2 rounded bg-white/20 text-white placeholder:text-white/70 border border-slate-500"
          placeholder="Masukkan nama wali kelas"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-slate-300">
          <thead className="bg-slate-700/50 text-slate-200">
            <tr>
              <th className="p-3">Nama Siswa</th>
              <th className="p-3">Kelas</th>
              <th className="p-3 text-center">Hadir</th>
              <th className="p-3 text-center">Izin</th>
              <th className="p-3 text-center">Alfa</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const summary = getMonthlySummary(student.id);
              return (
                <tr key={student.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">{student.class}</td>
                  <td className="p-3 text-center text-green-400 font-semibold">{summary.hadir}</td>
                  <td className="p-3 text-center text-yellow-400 font-semibold">{summary.izin}</td>
                  <td className="p-3 text-center text-red-400 font-semibold">{summary.alfa}</td>
                </tr>
              );
            })}
            {students.length === 0 && (
              <tr>
                <td colSpan="5" className="p-3 text-center text-slate-400">Belum ada data siswa.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReport;
