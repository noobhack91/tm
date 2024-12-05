import { Download, Plus, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
// import { createEquipmentInstallation } from '../api';

interface ConsigneeRow {
  sr: string;
  districtName: string;
  blockName: string;
  facilityName: string;
}

const authorityOptions = [
  { value: 'UPSMC', label: 'UPSMC' },
  { value: 'UKSMC', label: 'UKSMC' },
  { value: 'SGPGIMS', label: 'SGPGIMS' }
];

export const EquipmentInstallationUpload: React.FC = () => {
  const [formData, setFormData] = useState({
    tenderNumber: '',
    authorityType: null,
    poDate: '',
    equipment: '',
    leadTimeDeliver: '',
    leadTimeInstall: '',
    remarks: '',
    addAccessories: false,
    selectedAccessories: []
  });

  const [consignees, setConsignees] = useState<ConsigneeRow[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv') {
        toast.error('Please upload a CSV file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').slice(1); // Skip header row
        const parsedConsignees = rows.map((row, index) => {
          const [districtName, blockName, facilityName] = row.split(',');
          return {
            sr: (index + 1).toString(),
            districtName: districtName?.trim() || '',
            blockName: blockName?.trim() || '',
            facilityName: facilityName?.trim() || ''
          };
        });
        
        // Check for similar district names
        const similarDistricts = findSimilarDistricts(parsedConsignees);
        if (similarDistricts.length > 0) {
          toast.warning('Similar district names found: ' + similarDistricts.join(', '));
        }
        
        setConsignees(parsedConsignees);
      };
      reader.readAsText(file);
      setFile(file);
    }
  };

  const findSimilarDistricts = (consignees: ConsigneeRow[]): string[] => {
    const districts = consignees.map(c => c.districtName);
    const similarDistricts: string[] = [];
    
    districts.forEach((district, i) => {
      districts.slice(i + 1).forEach(otherDistrict => {
        if (calculateSimilarity(district, otherDistrict) > 0.9) {
          similarDistricts.push(`${district} ≈ ${otherDistrict}`);
        }
      });
    });
    
    return similarDistricts;
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    return (longer.length - editDistance(longer, shorter)) / longer.length;
  };

  const editDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str1.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str2.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        if (str1[i-1] === str2[j-1]) {
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i-1][j-1] + 1,
            matrix[i][j-1] + 1,
            matrix[i-1][j] + 1
          );
        }
      }
    }
    
    return matrix[str1.length][str2.length];
  };

  const handleAddLocation = () => {
    setConsignees([
      ...consignees,
      {
        sr: (consignees.length + 1).toString(),
        districtName: '',
        blockName: '',
        facilityName: ''
      }
    ]);
  };

  const handleRemoveLocation = (index: number) => {
    setConsignees(consignees.filter((_, i) => i !== index));
  };

  const handleDownloadTemplate = () => {
    const template = 'District Name,Block Name,Facility Name\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'consignee_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      if (consignees.length === 0) {
        toast.error('Please add at least one location');
        return;
      }
    
      try {
        const payload = {
          tenderNumber: formData.tenderNumber,
          authorityType: formData.authorityType?.value,
          poDate: formData.poDate,
          equipment: formData.equipment,
          leadTimeToDeliver: parseInt(formData.leadTimeDeliver),
          leadTimeToInstall: parseInt(formData.leadTimeInstall),
          remarks: formData.remarks,
          hasAccessories: formData.addAccessories,
          accessories: formData.selectedAccessories.map(acc => acc.value),
          locations: consignees.map(c => ({
            districtName: c.districtName,
            blockName: c.blockName,
            facilityName: c.facilityName
          }))
        };
        console.log(payload)
    //     const response = await createEquipmentInstallation(payload);
        toast.success('Equipment installation request created successfully');
    
        // Reset form
        setFormData({
          tenderNumber: '',
          authorityType: null,
          poDate: '',
          equipment: '',
          leadTimeDeliver: '',
          leadTimeInstall: '',
          remarks: '',
          addAccessories: false,
          selectedAccessories: []
        });
        setConsignees([]);
        setFile(null);
    
      } catch (error) {
        console.error('Error creating installation request:', error);
        toast.error('Failed to create installation request');
      }
    };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create Equipment Installation Request
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tender Number</label>
                <input
                  type="text"
                  value={formData.tenderNumber}
                  onChange={(e) => setFormData({ ...formData, tenderNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Authority Type</label>
                <Select
                  value={formData.authorityType}
                  onChange={(option) => setFormData({ ...formData, authorityType: option })}
                  options={authorityOptions}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date of PO/Contract</label>
                <input
                  type="date"
                  value={formData.poDate}
                  onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Equipment</label>
                <input
                  type="text"
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Lead Time to Deliver (Days)</label>
                <input
                  type="number"
                  value={formData.leadTimeDeliver}
                  onChange={(e) => setFormData({ ...formData, leadTimeDeliver: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Lead Time to Install (Days)</label>
                <input
                  type="number"
                  value={formData.leadTimeInstall}
                  onChange={(e) => setFormData({ ...formData, leadTimeInstall: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="mt-6 flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.addAccessories}
                  onChange={(e) => setFormData({ ...formData, addAccessories: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Add Accessories</label>
              </div>

              {formData.addAccessories && (
                <Select
                  isMulti
                  value={formData.selectedAccessories}
                  onChange={(options) => setFormData({ ...formData, selectedAccessories: options })}
                  options={[
                    { value: 'monitor', label: 'Monitor' },
                    { value: 'cables', label: 'Cables' },
                    { value: 'stand', label: 'Stand' }
                  ]}
                  className="flex-1"
                  placeholder="Select accessories..."
                />
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Consignee Details</h2>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </button>
                
                <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".csv"
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facility Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consignees.map((consignee, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consignee.sr}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={consignee.districtName}
                          onChange={(e) => {
                            const newConsignees = [...consignees];
                            newConsignees[index].districtName = e.target.value;
                            setConsignees(newConsignees);
                          }}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={consignee.blockName}
                          onChange={(e) => {
                            const newConsignees = [...consignees];
                            newConsignees[index].blockName = e.target.value;
                            setConsignees(newConsignees);
                          }}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={consignee.facilityName}
                          onChange={(e) => {
                            const newConsignees = [...consignees];
                            newConsignees[index].facilityName = e.target.value;
                            setConsignees(newConsignees);
                          }}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleRemoveLocation(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={handleAddLocation}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </button>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  tenderNumber: '',
                  authorityType: null,
                  poDate: '',
                  equipment: '',
                  leadTimeDeliver: '',
                  leadTimeInstall: '',
                  remarks: '',
                  addAccessories: false,
                  selectedAccessories: []
                });
                setConsignees([]);
                setFile(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};