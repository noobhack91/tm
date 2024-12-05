import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { Upload, Download } from 'lucide-react';

interface EquipmentFormProps {
  onSubmit: (data: any) => void;
  onFileUpload: (file: File) => void;
  onDownloadTemplate: () => void;
}

const authorityOptions = [
  { value: 'UPSMC', label: 'UPSMC' },
  { value: 'UKSMC', label: 'UKSMC' },
  { value: 'SGPGIMS', label: 'SGPGIMS' }
];

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  onSubmit,
  onFileUpload,
  onDownloadTemplate
}) => {
  const [formData, setFormData] = useState({
    tenderNumber: '',
    authorityType: '',
    poDate: null as Date | null,
    equipment: '',
    leadTimeToDeliver: '',
    leadTimeToInstall: '',
    remarks: '',
    hasAccessories: false,
    accessories: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAccessoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const accessory = e.target.value;
    if (accessory) {
      setFormData(prev => ({
        ...prev,
        accessories: [...prev.accessories, accessory]
      }));
      e.target.value = '';
    }
  };

  const removeAccessory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      accessories: prev.accessories.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tender Number</label>
          <input
            type="text"
            required
            value={formData.tenderNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, tenderNumber: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Authority Type</label>
          <Select
            options={authorityOptions}
            onChange={(option) => setFormData(prev => ({ ...prev, authorityType: option?.value || '' }))}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">PO Date</label>
          <DatePicker
            selected={formData.poDate}
            onChange={(date) => setFormData(prev => ({ ...prev, poDate: date }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Equipment Name</label>
          <input
            type="text"
            required
            value={formData.equipment}
            onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lead Time to Deliver (days)</label>
          <input
            type="number"
            required
            min="1"
            value={formData.leadTimeToDeliver}
            onChange={(e) => setFormData(prev => ({ ...prev, leadTimeToDeliver: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lead Time to Install (days)</label>
          <input
            type="number"
            required
            min="1"
            value={formData.leadTimeToInstall}
            onChange={(e) => setFormData(prev => ({ ...prev, leadTimeToInstall: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Remarks</label>
        <textarea
          value={formData.remarks}
          onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasAccessories"
            checked={formData.hasAccessories}
            onChange={(e) => setFormData(prev => ({ ...prev, hasAccessories: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="hasAccessories" className="ml-2 text-sm text-gray-700">
            Has Accessories
          </label>
        </div>

        {formData.hasAccessories && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Add Accessories</label>
            <div className="mt-1 flex space-x-2">
              <input
                type="text"
                placeholder="Enter accessory name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAccessoryChange(e as any);
                  }
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {formData.accessories.length > 0 && (
              <div className="mt-2 space-y-2">
                {formData.accessories.map((accessory, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>{accessory}</span>
                    <button
                      type="button"
                      onClick={() => removeAccessory(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <label className="relative cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload CSV
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileUpload(file);
              }}
              accept=".csv"
              className="hidden"
            />
          </label>
          <button
            type="button"
            onClick={onDownloadTemplate}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Download className="h-5 w-5 mr-1" />
            Download Template
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
