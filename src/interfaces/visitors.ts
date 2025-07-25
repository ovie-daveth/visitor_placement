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

export interface Visitor {
  id: string; // Guid
  fullName: string;
  address?: string;
  email?: string;
  phone: string;
  photoUrl?: string;
  visits: Visit[];
}