import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

function StudentCard({ student, onUpdateStudent, onMarkAttendance, onDeleteStudent }) {
  const handleStatus = (status) => {
    const today = new Date();
    const date = today.toISOString().split('T')[0]; // Mendapatkan format YYYY-MM-DD

    onMarkAttendance(student.id, status, date); // Memasukkan status kehadiran dengan tanggal
  };

  const handleDelete = () => {
    if (window.confirm(`Yakin ingin menghapus data ${student.name}?`)) {
      onDeleteStudent(student.id);
    }
  };

  return (
    <Card className="bg-cover bg-center text-black p-4" style={{ backgroundImage: 'url("/images/sekolah.jpg")' }}>
      <CardContent className="flex flex-col items-center space-y-4">
        {student.photoUrl ? (
          <img
            src={student.photoUrl}
            alt={student.name}
            className="w-32 h-32 rounded-full object-cover border-2 border-slate-300"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
            Tidak ada foto
          </div>
        )}
        <div className="text-center">
          <h3 className="text-xl font-bold">{student.name}</h3>
          <p className="text-sm text-slate-600">{student.class}</p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => handleStatus("Hadir")} className="bg-green-600 hover:bg-green-700 text-white">
            Hadir
          </Button>
          <Button onClick={() => handleStatus("Izin")} className="bg-yellow-500 hover:bg-yellow-600 text-white">
            Izin
          </Button>
          <Button onClick={() => handleStatus("Alfa")} className="bg-red-600 hover:bg-red-700 text-white">
            Alfa
          </Button>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateStudent(student)}
            className="text-sm text-white border-white"
          >
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-sm text-white border-white hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default StudentCard;
