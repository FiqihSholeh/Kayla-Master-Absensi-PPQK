import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AboutModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white text-slate-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Tentang Aplikasi</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p><strong>Nama Aplikasi:</strong> Absensi Online Siswa</p>
          <p><strong>Dibuat oleh:</strong> Amin Martin</p>
          <p><strong>Email:</strong> fiqih.sholeh.7@gmail.com</p>
          <p><strong>WhatsApp:</strong> 0818-0412-2425</p>
          <p><strong>Support Developer (Rp. -Bebas Mau Berapa Aja):</strong><br />BRI - 1318 0100 7111 537 (a.n. Amin Martin Suharyanto)</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutModal;
