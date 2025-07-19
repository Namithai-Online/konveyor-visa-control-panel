export interface Country {
  id: string;
  name: string;
  iso_code: string;
  emoji_flag: string;
}

export interface VisaType {
  id: string;
  country_id: string;
  name: string;
}

export interface VisaRequirement {
  id: string;
  name: string;
  required: boolean;
}

export interface VisaRequirements {
  visa_type_id: string;
  requirements: VisaRequirement[];
}

export interface Applicant {
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  passport_number: string;
  nationality: string;
}

export interface CreateOrderRequest {
  applicant: Applicant;
  visa_type_id: string;
  travel_date: string;
}

export interface Order {
  order_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  created_at: string;
  applicant?: Applicant;
  visa_type_id?: string;
  travel_date?: string;
}

export interface OrderStep {
  step: string;
  completed: boolean;
  timestamp: string;
}

export interface ApplicationOverview {
  order_id: string;
  status: string;
  steps: OrderStep[];
}

export interface Document {
  document_id: string;
  name: string;
  status: 'uploaded' | 'pending' | 'approved' | 'rejected';
  doc_type?: string;
}

export interface DocumentsOverview {
  order_id: string;
  documents: Document[];
}

export interface DocumentUpload {
  doc_type: string;
  file_name: string;
  file_content_base64: string;
}

export interface BulkUploadRequest {
  order_id: string;
  documents: DocumentUpload[];
}

export interface BulkUploadResponse {
  order_id: string;
  uploaded_count: number;
  failed: string[];
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
}