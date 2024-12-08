import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface Location2 {
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
  locations: Location2[];
}

// Auth APIs
export const login = (data: { username: string; password: string }) =>
  api.post('/auth/login', data);

// Tender APIs
export const searchTenders = (params: any) => api.get('/tenders/search', { params });
export const getTenderById = (id: string) => api.get(`/tenders/${id}`);
export const getDistricts = () => api.get('/tenders/districts');
export const getBlocks = () => api.get('/tenders/blocks');

// Consignee APIs
export const getConsignees = (districts?: string[]) => {
  const params = districts?.length ? { districts: districts.join(',') } : {};
  return api.get('/consignees', { params });
};

export const updateConsigneeStatus = (id: string, data: any) =>
  api.patch(`/consignees/${id}`, data);

// Upload APIs with role-based endpoints
export const uploadLogistics = (data: FormData) =>
  api.post('/upload/logistics', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const uploadChallan = (data: FormData) =>
  api.post('/upload/challan', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const uploadInstallation = (data: FormData) =>
  api.post('/upload/installation', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const uploadInvoice = (data: FormData) =>
  api.post('/upload/invoice', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });


export const createInstallationRequest = (data: InstallationRequest) =>
  api.post('/equipment-installation', data);

export const uploadConsigneeCSV = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/equipment-installation/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getInstallationRequests = () =>
  api.get('/equipment-installation');

export const downloadTemplate = () =>
  api.get('/equipment-installation/template', {
    responseType: 'blob'
  });

export const getAllUsers = () => api.get('/admin/users');

export const updateUserRoles = (userId: string, roles: string[]) =>
  api.put('/admin/users/role', { userId, roles });
