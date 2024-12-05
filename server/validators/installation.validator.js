import { z } from 'zod';

const installationSchema = z.object({
  tender_number: z.string().min(1).max(100),
  authority_type: z.enum(['UPSMC', 'UKSMC', 'SGPGIMS']),
  po_contract_date: z.string().datetime(),
  equipment: z.string().min(1),
  lead_time_to_deliver: z.number().positive(),
  lead_time_to_install: z.number().positive(),
  remarks: z.string().optional(),
  has_accessories: z.boolean(),
  selected_accessories: z.array(z.string()).optional()
});

const locationSchema = z.object({
  sr_no: z.number().positive(),
  district_name: z.string().min(1),
  block_name: z.string().min(1),
  facility_name: z.string().min(1)
});

export function validateInstallationRequest(formData, locations) {
  const validatedForm = installationSchema.parse(formData);
  const validatedLocations = z.array(locationSchema).parse(locations);
  
  return {
    ...validatedForm,
    locations: validatedLocations
  };
}