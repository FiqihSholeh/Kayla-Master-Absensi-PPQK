import React from 'react';
import { Button } from '@/components/ui/button';

const ExportDataButton = ({ students }) => {
  const handleExport = () => {
    const dataStr = JSON.stringify(students, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'data-siswa.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold">
      Ekspor Data Siswa
    </Button>
  );
};

export default ExportDataButton;
