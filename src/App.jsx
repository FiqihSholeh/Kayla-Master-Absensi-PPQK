import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import StudentCard from '@/components/StudentCard';
import AttendanceReport from '@/components/AttendanceReport';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AddStudentDialog from '@/components/AddStudentDialog';
import AppSettingsDialog from '@/components/AppSettingsDialog';
import useLocalStorage from '@/hooks/useLocalStorage';
import ExportDataButton from '@/components/ExportDataButton';
import EditStudentDialog from '@/components/EditStudentDialog';
import AboutModal from './components/AboutModal';
import JurnalGuru from './components/JurnalGuru';

const initialStudentsData = [
  { id: 1, name: 'Shofwah Qanitah Zulfa', class: 'Kelas IX Akhwat', photoUrl: '' },
  { id: 2, name: 'Ahmad Budi Santoso', class: 'Kelas IX Ikhwan', photoUrl: '' },
  { id: 3, name: 'Citra Ayu Lestari', class: 'Kelas IX Akhwat', photoUrl: '' },
];

const initialAppSettingsData = {
  schoolName: 'PONPES QURAN KAYUWALANG',
  className: 'Kelas IX - SPEKAY',
  academicYear: '2024/2025',
  logoUrl: 'https://images.unsplash.com/photo-1604245155712-52ae0ae6fe2e',
};

function App() {
  const [showJurnal, setShowJurnal] = useState(false);
  const { toast } = useToast();

  const [students, setStudents] = useLocalStorage('students', null);
  const [attendanceData, setAttendanceData] = useLocalStorage('attendanceData', {});
  const [appSettings, setAppSettings] = useLocalStorage('appSettings', null);

  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [editingStudent, setEditingStudent] = useState(null);

  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  useEffect(() => {
    if (!students) setStudents(initialStudentsData);
    if (!appSettings) setAppSettings(initialAppSettingsData);
  }, []);

  useEffect(() => {
    if (students && currentStudentIndex >= students.length && students.length > 0) {
      setCurrentStudentIndex(students.length - 1);
    } else if (students && students.length === 0) {
      setCurrentStudentIndex(0);
    }
  }, [students, currentStudentIndex]);

  const handleUpdateStudent = (updatedStudent) => {
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
    toast({
      title: "Data Siswa Diperbarui",
      description: `${updatedStudent.name} berhasil diperbarui.`,
      variant: "default",
      duration: 3000,
    });
  };

  const handleDeleteStudent = (studentId) => {
  const student = students.find(s => s.id === studentId);
  const updatedStudents = students.filter(s => s.id !== studentId);
  setStudents(updatedStudents);
  setAttendanceData(prev => {
    const updated = { ...prev };
    delete updated[studentId];
    return updated;
  });

  setCurrentStudentIndex(prevIndex => {
    if (prevIndex >= updatedStudents.length) {
      return Math.max(updatedStudents.length - 1, 0);
    }
    return prevIndex;
  });

  toast({
    title: "Siswa Dihapus",
    description: `${student.name} berhasil dihapus.`,
    variant: "destructive",
    duration: 3000,
  });
};

  const handleMarkAttendance = (studentId, status) => {
    const today = new Date().toISOString().slice(0, 10);
    setAttendanceData(prevData => {
      const studentData = prevData[studentId] || {};
      const updatedStudentData = {
        ...studentData,
        [today]: studentData[today] === status ? studentData[today] : status,
      };
      return { ...prevData, [studentId]: updatedStudentData };
    });
    const student = students.find(s => s.id === studentId);
    toast({
      title: "Presensi Dicatat",
      description: `${student.name} ditandai ${status} untuk hari ini.`,
      variant: status === "Hadir" || status === "Izin" ? "default" : "destructive",
      duration: 3000,
    });
  };

  const handleResetAttendance = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    setAttendanceData(prevData => {
      const resetData = {};
      Object.keys(prevData).forEach(studentId => {
        const studentData = prevData[studentId];
        const newStudentData = {};
        Object.keys(studentData).forEach(date => {
          const studentDate = new Date(date);
          if (studentDate.getMonth() !== currentMonth) {
            newStudentData[date] = studentData[date];
          }
        });
        resetData[studentId] = newStudentData;
      });
      toast({
        title: "Kehadiran Reset",
        description: "Data kehadiran bulan ini telah direset.",
        variant: "default",
        duration: 3000,
      });
      return resetData;
    });
  };

  const handleAddStudent = (newStudent) => {
    if (!newStudent.name || !newStudent.class) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Nama dan Kelas siswa tidak boleh kosong.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    setStudents([...students, { ...newStudent, id: newId }]);
    toast({
      title: "Siswa Ditambahkan",
      description: `${newStudent.name} berhasil ditambahkan.`,
      duration: 3000,
    });
  };

  const handleUpdateAppSettings = (updatedSettings) => {
    setAppSettings(updatedSettings);
    toast({
      title: "Pengaturan Aplikasi Diperbarui",
      description: "Informasi aplikasi berhasil disimpan.",
      duration: 3000,
    });
  };

  const handleStartEditStudent = (student) => {
    setEditingStudent(student);
  };

  const nextStudent = () => {
    setCurrentStudentIndex((prev) => (prev + 1) % students.length);
  };

  const prevStudent = () => {
    setCurrentStudentIndex((prev) => (prev - 1 + students.length) % students.length);
  };

  const cardVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (dir) => ({ zIndex: 0, x: dir < 0 ? 300 : -300, opacity: 0 }),
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    newDirection > 0 ? nextStudent() : prevStudent();
  };

  if (!students || !appSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Memuat data...
      </div>
    );
  }

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white p-4 sm:p-8 flex flex-col">
    <AppSettingsDialog appSettings={appSettings} onUpdateAppSettings={handleUpdateAppSettings} />
    
    <header className="text-center py-8">
      <div className="flex justify-center items-center mb-4">
        {appSettings.logoUrl && <img alt="Logo Pondok" className="h-16 w-16 mr-4 object-contain" src={appSettings.logoUrl} />}
        <div>
          <h2 className="text-sm font-semibold text-yellow-400">{appSettings.schoolName}</h2>
        </div>
      </div>
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl md:text-5xl font-bold text-white mb-2">
        ABSENSI DIGITAL
      </motion.h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="inline-block bg-yellow-500 text-slate-900 px-6 py-2 rounded-full text-xl font-semibold shadow-md mb-2">
        {appSettings.className}
      </motion.div>
      <p className="text-slate-400 text-xl">Tahun Pelajaran {appSettings.academicYear}</p>
    </header>

    {/* Tombol Jurnal Guru */}
    <div className="p-4">
      <button
        onClick={() => setShowJurnal(!showJurnal)}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mb-4"
      >
        {showJurnal ? "Sembunyikan Jurnal Guru" : "Tampilkan Jurnal Guru"}
      </button>

      <div className="mt-2">
  <a
    href="https://docs.google.com/spreadsheets/d/1VEhhzMP6rVo4z29EoibOx6UymkYRAamChgDsCGvyyn4/export?format=xlsx"
    target="_blank"
    rel="noopener noreferrer"
  >
    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
      Download Template Leger Nilai
    </button>
  </a>
</div>

      {/* Tampilkan komponen JurnalGuru jika showJurnal true */}
      {showJurnal && <JurnalGuru />}
    </div>

    <div className="flex justify-end mb-6 px-4">
      <AddStudentDialog onAddStudent={handleAddStudent} />
    </div>

    <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden px-4">
      {students.length > 0 ? (
        <>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div key={currentStudentIndex} custom={direction} variants={cardVariants} initial="enter" animate="center" exit="exit" transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }} className="w-full max-w-sm">
              <StudentCard student={students[currentStudentIndex]} onUpdateStudent={handleStartEditStudent} onMarkAttendance={handleMarkAttendance} onDeleteStudent={handleDeleteStudent} />
            </motion.div>
          </AnimatePresence>

          {students.length > 1 && (
            <div className="flex justify-between w-full max-w-sm mt-6">
              <Button onClick={() => paginate(-1)} className="bg-slate-700 hover:bg-slate-600 text-white">
                <ArrowLeft size={18} className="mr-2" /> Sebelumnya
              </Button>
              <Button onClick={() => paginate(1)} className="bg-slate-700 hover:bg-slate-600 text-white">
                Berikutnya <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          )}
          <p className="text-slate-400 mt-4 text-sm">Menampilkan {currentStudentIndex + 1} dari {students.length} siswa</p>
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-slate-400 text-lg">Belum ada data siswa. Silakan tambahkan siswa terlebih dahulu.</p>
        </div>
      )}
    </main>

    {students.length > 0 && (
      <div className="px-4 mt-8">
        <AttendanceReport students={students} attendanceData={attendanceData} />
      </div>
    )}

    <div className="flex justify-center gap-4 px-4 mt-6">
      <ExportDataButton students={students} attendanceData={attendanceData} />
      <Button onClick={() => setIsAboutModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white">
        Tentang Aplikasi
      </Button>
    </div>

    <div className="px-4 mt-6 flex justify-center">
      <Button onClick={handleResetAttendance} className="bg-red-600 hover:bg-red-500 text-white">
        Reset Kehadiran Bulan Ini
      </Button>
    </div>

    <Toaster />
    <footer className="text-center py-8 mt-auto text-slate-500 text-sm">
      Absensi Digital &copy; {new Date().getFullYear()} {appSettings.schoolName}.
      <p>Dibuat dengan <span role="img" aria-label="love">❤️</span> oleh Tim IT Sekolah.</p>
    </footer>

    {editingStudent && (
      <EditStudentDialog student={editingStudent} onSave={(updatedStudent) => {
        handleUpdateStudent(updatedStudent);
        setEditingStudent(null);
      }} onClose={() => setEditingStudent(null)} />
    )}

    <AboutModal open={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
  </div>
);
}

export default App;
