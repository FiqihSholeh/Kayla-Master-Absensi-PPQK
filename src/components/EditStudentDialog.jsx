import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

function EditStudentDialog({ student, onSave, onClose }) {
  const [name, setName] = useState(student.name);
  const [className, setClassName] = useState(student.class);
  const [photoUrl, setPhotoUrl] = useState(student.photoUrl);

  useEffect(() => {
    setName(student.name);
    setClassName(student.class);
    setPhotoUrl(student.photoUrl);
  }, [student]);

  const handleSave = () => {
    const updatedStudent = {
      ...student,
      name,
      class: className,
      photoUrl,
    };
    onSave(updatedStudent);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ubah Data Siswa</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Siswa</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama siswa"
            />
          </div>

          <div>
            <Label htmlFor="className">Kelas</Label>
            <Input
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Masukkan kelas siswa"
            />
          </div>

          <div>
            <Label htmlFor="photoUrl">Link URL Foto</Label>
            <Input
              id="photoUrl"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
            />
            {photoUrl && (
              <img
                src={photoUrl}
                alt="Preview"
                className="mt-4 w-32 h-32 object-cover rounded"
              />
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditStudentDialog;
