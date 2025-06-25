// ----------------------------------------------------------------------

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type Company = {
  id: string;
  name: string;
  workField: string;
  description?: string;
  location: string;
  size: string;
  website?: string;
  city: string;
  commercial_register: string;
  tax_number: string;
  logo?: string;
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
};

export type Job = {
  id: string;
  jobTitle: string;
  description: string;
  requirements?: string;
  workType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  contractType: 'REMOTE' | 'HYBRID' | 'ON_SITE';
  experienceLevel: 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'MANAGER' | 'EXPERT';
  experienceYears?: number;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  salaryType?: 'RANGE' | 'FIXED' | 'NEGOTIABLE';
  jobFeatures?: string[];
  questions?: string[];
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  company?: Company;
  subCategories?: Array<{
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  }>;
};

export type ApprovalRequest = {
  // For future use if needed
};

export type RejectionRequest = {
  rejectionReason: string;
};
