import React, { useState } from 'react';
import { BaseModal } from './BaseModal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface LogisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  consigneeId: string;
}

export const LogisticsModal: React.FC<LogisticsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  consigneeId
}) => {
  const [date, setDate] = useState<Date | null>(null);
  const [courierName, setCourierName] = useState('');
  const [docketNumber, setDocketNumber] = useState('');
  const [documents, setDocuments] = useState<FileList | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('consigneeId', consigneeId);
    formData.append('date', date?.toISOString() || '');
    formData.append('courierName', courierName);
    formData.append('docketNumber', docketNumber);
    if (documents) {
      Array.from(documents).forEach(file => {
        formData.append('documents', file);
      });
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Update Logistics Details">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <DatePicker
            selected={date}
            onChange={(date: Date) => setDate(date)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Courier Name</label>
          <input
            type="text"
            value={courierName}
            onChange={(e) => setCourierName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Docket Number</label>
          <input
            type="text"
            value={docketNumber}
            onChange={(e) => setDocketNumber(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Documents</label>
          <input
            type="file"
            multiple
            onChange={(e) => setDocuments(e.target.files)}
            className="mt-1 block w-full"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </BaseModal>
  );
}