
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';

const AppSettingsDialog = ({ appSettings, onUpdateAppSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(appSettings);

  useEffect(() => {
    setSettings(appSettings);
  }, [appSettings, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    onUpdateAppSettings(settings);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-white border-slate-600 hover:bg-slate-700 fixed top-4 right-4 z-50">
          <Settings size={18} className="mr-2" /> Pengaturan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Pengaturan Aplikasi</DialogTitle>
          <DialogDescription>
            Sesuaikan informasi umum aplikasi absensi di sini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="schoolName" className="text-right">
              Nama Pondok
            </Label>
            <Input
              id="schoolName"
              name="schoolName"
              value={settings.schoolName}
              onChange={handleInputChange}
              className="col-span-3 bg-slate-700 border-slate-600 text-white"
              placeholder="Nama Pondok Pesantren"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="className" className="text-right">
              Nama Kelas
            </Label>
            <Input
              id="className"
              name="className"
              value={settings.className}
              onChange={handleInputChange}
              className="col-span-3 bg-slate-700 border-slate-600 text-white"
              placeholder="Contoh: Kelas IX - SPEKAY"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="academicYear" className="text-right">
              Tahun Ajaran
            </Label>
            <Input
              id="academicYear"
              name="academicYear"
              value={settings.academicYear}
              onChange={handleInputChange}
              className="col-span-3 bg-slate-700 border-slate-600 text-white"
              placeholder="Contoh: 2024/2025"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logoUrl" className="text-right">
              Logo Pondok
            </Label>
            <Input
              id="logoUrl"
              name="logoUrl"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="col-span-3 bg-slate-700 border-slate-600 text-white file:text-white file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-slate-600 hover:file:bg-slate-500"
            />
          </div>
          {settings.logoUrl && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-start-2 col-span-3">
                <p className="text-sm text-slate-400 mb-1">Preview Logo:</p>
                <img src={settings.logoUrl} alt="Preview Logo" className="h-16 w-16 object-contain rounded bg-slate-700 p-1" />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline" className="text-white border-slate-600 hover:bg-slate-700">Batal</Button>
          <Button onClick={handleSaveChanges} className="bg-yellow-500 hover:bg-yellow-600 text-black">Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppSettingsDialog;
