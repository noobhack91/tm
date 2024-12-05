import { z } from 'zod';

const locationSchema = z.object({
  districtName: z.string().min(1),
  blockName: z.string().min(1),
  facilityName: z.string().min(1)
});

const installationSchema = z.object({
  tender_number: z.string().min(1).max(100),
  authority_type: z.enum(['UPSMC', 'UKSMC', 'SGPGIMS']),
  po_contract_date: z.string().datetime(),
  equipment: z.string().min(1),
  lead_time_to_deliver: z.number().positive(),
  lead_time_to_install: z.number().positive(),
  remarks: z.string().optional(),
  has_accessories: z.boolean(),
  selected_accessories: z.array(z.string()).default([]),
  locations: z.array(locationSchema)
});

export function validateInstallationRequest(data) {
  return installationSchema.parse(data);
}