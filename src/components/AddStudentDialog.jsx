import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function AddStudentDialog({ onAddStudent }) {
  const [open, setOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    class: '',
    photoUrl: '',
  });

  const handleAdd = () => {
    onAddStudent(newStudent);
    setNewStudent({ name: '', class: '', photoUrl: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          + Tambah Siswa
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white text-black p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Tambah Siswa Baru</h3>
        
        <div className="space-y-4">
          <Input
            className="text-white bg-gray-800 placeholder-gray-400"
            placeholder="Nama Siswa"
            value={newStudent.name}
            onChange={(e) =>
              setNewStudent({ ...newStudent, name: e.target.value })
            }
          />
          <Input
            className="text-white bg-gray-800 placeholder-gray-400"
            placeholder="Kelas"
            value={newStudent.class}
            onChange={(e) =>
              setNewStudent({ ...newStudent, class: e.target.value })
            }
          />
          <Input
            className="text-white bg-gray-800 placeholder-gray-400"
            placeholder="URL Foto (opsional)"
            value={newStudent.photoUrl}
            onChange={(e) =>
              setNewStudent({ ...newStudent, photoUrl: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <Button variant="outline" className="text-white border-white hover:bg-gray-800" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddStudentDialog;
