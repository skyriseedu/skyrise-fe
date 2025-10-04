import { TextEditor } from '@/components/common/TextEditor/TextEditor';
import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-700">
      <div className="max-w-4xl">
        <TextEditor />
      </div>
    </div>
  );
};

export default AdminDashboard;
