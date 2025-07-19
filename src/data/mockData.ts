import { Country, VisaType, Order, Document, SystemHealth, ApplicationOverview, DocumentsOverview } from '@/types/api';

export const mockCountries: Country[] = [
  { id: "RO", name: "Romania", iso_code: "RO", emoji_flag: "🇷🇴" },
  { id: "US", name: "United States", iso_code: "US", emoji_flag: "🇺🇸" },
  { id: "FR", name: "France", iso_code: "FR", emoji_flag: "🇫🇷" },
  { id: "DE", name: "Germany", iso_code: "DE", emoji_flag: "🇩🇪" },
  { id: "IT", name: "Italy", iso_code: "IT", emoji_flag: "🇮🇹" },
  { id: "ES", name: "Spain", iso_code: "ES", emoji_flag: "🇪🇸" },
];

export const mockVisaTypes: VisaType[] = [
  { id: "T1", country_id: "RO", name: "Tourist Visa" },
  { id: "B1", country_id: "RO", name: "Business Visa" },
  { id: "S1", country_id: "RO", name: "Student Visa" },
  { id: "T2", country_id: "US", name: "Tourist Visa" },
  { id: "B2", country_id: "US", name: "Business Visa" },
  { id: "T3", country_id: "FR", name: "Schengen Tourist Visa" },
];

export const mockOrders: Order[] = [
  {
    order_id: "O123",
    status: "pending",
    created_at: "2025-07-19T10:00:00Z",
    applicant: {
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      dob: "1990-01-01",
      passport_number: "X123456",
      nationality: "RO"
    },
    visa_type_id: "T1",
    travel_date: "2025-12-01"
  },
  {
    order_id: "O124",
    status: "in_progress",
    created_at: "2025-07-18T15:30:00Z",
    applicant: {
      first_name: "Jane",
      last_name: "Smith",
      email: "jane@example.com",
      dob: "1985-05-15",
      passport_number: "Y789012",
      nationality: "US"
    },
    visa_type_id: "T2",
    travel_date: "2025-11-15"
  },
  {
    order_id: "O125",
    status: "completed",
    created_at: "2025-07-17T09:15:00Z",
    applicant: {
      first_name: "Alice",
      last_name: "Johnson",
      email: "alice@example.com",
      dob: "1992-08-22",
      passport_number: "Z345678",
      nationality: "FR"
    },
    visa_type_id: "T3",
    travel_date: "2025-10-30"
  },
  {
    order_id: "O126",
    status: "rejected",
    created_at: "2025-07-16T14:20:00Z",
    applicant: {
      first_name: "Bob",
      last_name: "Wilson",
      email: "bob@example.com",
      dob: "1988-03-10",
      passport_number: "A901234",
      nationality: "DE"
    },
    visa_type_id: "B1",
    travel_date: "2025-09-20"
  }
];

export const mockDocuments: Document[] = [
  { document_id: "D1", name: "Passport Copy", status: "uploaded", doc_type: "passport" },
  { document_id: "D2", name: "Photo", status: "approved", doc_type: "photo" },
  { document_id: "D3", name: "Bank Statement", status: "pending", doc_type: "financial" },
  { document_id: "D4", name: "Travel Insurance", status: "rejected", doc_type: "insurance" },
];

export const mockSystemHealth: SystemHealth = {
  status: "healthy",
  timestamp: new Date().toISOString()
};

export const mockApplicationOverview: ApplicationOverview = {
  order_id: "O123",
  status: "pending",
  steps: [
    { step: "submitted", completed: true, timestamp: "2025-07-19T10:10:00Z" },
    { step: "documents_uploaded", completed: true, timestamp: "2025-07-19T10:15:00Z" },
    { step: "under_review", completed: false, timestamp: "" },
    { step: "approved", completed: false, timestamp: "" }
  ]
};

export const mockDocumentsOverview: DocumentsOverview = {
  order_id: "O123",
  documents: mockDocuments
};