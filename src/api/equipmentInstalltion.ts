import api from './index';

interface Location {
  districtName: string;
  blockName: string;
  facilityName: string;
}

interface InstallationRequest {
  tenderNumber: string;
  authorityType: string;
  poDate: Date | null;
  equipment: string;
  leadTimeToDeliver: string;
  leadTimeToInstall: string;
  remarks?: string;
  hasAccessories: boolean;
  accessories: string[];
  locations: Location[];
}

export const createInstallationRequest = (data: InstallationRequest) =>
  api.post('/api/equipment-installation', data);

export const uploadConsigneeCSV = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/equipment-installation/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getInstallationRequests = () =>
  api.get('/api/equipment-installation');

export const downloadTemplate = () =>
  api.get('/api/equipment-installation/template', {
    responseType: 'blob'
  });
