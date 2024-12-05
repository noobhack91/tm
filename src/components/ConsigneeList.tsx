import { ClipboardCheck, FileSpreadsheet, FileText, Truck } from 'lucide-react';
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ConsigneeDetails } from '../types';

interface ConsigneeListProps {
  consignees: ConsigneeDetails[];
  onUpdateLogistics: (id: string) => void;
  onUpdateChallan: (id: string) => void;
  onUpdateInstallation: (id: string) => void;
  onUpdateInvoice: (id: string) => void;
  onUpdateSerialNumber: (id: string, serialNumber: string) => void;
}

export const ConsigneeList: React.FC<ConsigneeListProps> = ({
  consignees,
  onUpdateLogistics,
  onUpdateChallan,
  onUpdateInstallation,
  onUpdateInvoice,
  onUpdateSerialNumber,
}) => {
  const { user } = useAuth();

  const canPerformAction = (actionType: string): boolean => {
    if (user?.role === 'admin') return true;
    
    switch (actionType) {
      case 'logistics':
        return user?.role === 'logistics';
      case 'challan':
        return user?.role === 'challan';
      case 'installation':
        return user?.role === 'installation';
      case 'invoice':
        return user?.role === 'invoice';
      default:
        return false;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District/Consignee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facility Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accessories</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {consignees.map((consignee) => (
            <tr key={consignee.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consignee.srNo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{consignee.districtName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consignee.blockName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consignee.facilityName}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${getStatusColor(consignee.consignmentStatus)}`}>
                  {consignee.consignmentStatus}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {consignee.accessoriesPending.status ? (
                  <span className="text-red-600 cursor-pointer" title={consignee.accessoriesPending.items?.join(', ')}>
                    Yes ({consignee.accessoriesPending.count})
                  </span>
                ) : (
                  <span className="text-green-600">No</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {/* {(canPerformAction('logistics') || user?.role === 'admin') && ( */}
                  <input
                    type="text"
                    value={consignee.serialNumber || ''}
                    onChange={(e) => onUpdateSerialNumber(consignee.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="Enter S/N"
                  />
                {/* )} */}
                {!canPerformAction('logistics') && !user?.role === 'admin' && (
                  <span className="text-sm text-gray-500">{consignee.serialNumber || '-'}</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                {canPerformAction('logistics') && (
                  <button
                    onClick={() => onUpdateLogistics(consignee.id)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Update Logistics"
                  >
                    <Truck className="w-5 h-5" />
                  </button>
                )}
                {canPerformAction('challan') && (
                  <button
                    onClick={() => onUpdateChallan(consignee.id)}
                    className="text-green-600 hover:text-green-900"
                    title="Update Challan"
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                )}
                {canPerformAction('installation') && (
                  <button
                    onClick={() => onUpdateInstallation(consignee.id)}
                    className="text-purple-600 hover:text-purple-900"
                    title="Update Installation"
                  >
                    <ClipboardCheck className="w-5 h-5" />
                  </button>
                )}
                {canPerformAction('invoice') && (
                  <button
                    onClick={() => onUpdateInvoice(consignee.id)}
                    className="text-orange-600 hover:text-orange-900"
                    title="Update Invoice"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const getStatusColor = (status: string): string => {
  const colors = {
    'Processing': 'bg-gray-100 text-gray-800',
    'Dispatched': 'bg-blue-100 text-blue-800',
    'Installation Pending': 'bg-yellow-100 text-yellow-800',
    'Installation Done': 'bg-green-100 text-green-800',
    'Invoice Done': 'bg-purple-100 text-purple-800',
    'Bill Submitted': 'bg-indigo-100 text-indigo-800',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};