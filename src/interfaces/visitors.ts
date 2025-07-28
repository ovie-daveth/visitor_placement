export interface Visit {
  id: string; // Guid
  visitorId: string;
  visitor?: Visitor;
  staffEmail?: string;
  staffName?: string;
  purpose?: string;
  status: string; // default = "Pending"
  belongings?: string;
  comments?: string;
  faceImageUrl?: string;
  barcodeUrl?: string;
  tagNumber?: string;
  checkInTime?: string; // DateTime serialized as ISO string
  checkOutTime?: string;
  createdAt?: string;
  formattedVisitId?: string;
}

export interface VisitorDataInterface {
  id: string;
  visitorName: string;
  staffName: string;
  staffEmail: string;
  status: string;
  faceImageUrl: string;
  purpose: string;
  barcodeUrl: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  tagNumber: string | null;
  comments: string | null;
  formattedVisitId: string;
}

export interface Visitor {
  id: string; // Guid
  fullName: string;
  address?: string;
  email?: string;
  phone: string;
  photoUrl?: string;
  visits: Visit[];
}

export interface PaginatedVisits<T> {
  data: T;
  total: number;
  totalPages: number;
  page: number;  
  pageSize: number;
}