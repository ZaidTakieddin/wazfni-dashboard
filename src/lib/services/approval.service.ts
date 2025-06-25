import type { Company, Job, ApprovalRequest, RejectionRequest } from 'src/types/approval';

import axiosInstance, { endpoints } from '../axios';

// ----------------------------------------------------------------------

export class ApprovalService {
  // Company Approvals
  static async getPendingCompanies(): Promise<Company[]> {
    const response = await axiosInstance.get<Company[]>(endpoints.admin.approval.companies.pending);

    return response.data;
  }

  static async getAllCompanies(): Promise<Company[]> {
    const response = await axiosInstance.get<Company[]>(endpoints.admin.approval.companies.all);

    return response.data;
  }

  static async getCompanyById(companyId: string): Promise<Company> {
    const response = await axiosInstance.get<Company>(
      endpoints.admin.approval.companies.details(companyId)
    );

    return response.data;
  }

  static async approveCompany(companyId: string): Promise<void> {
    await axiosInstance.patch(endpoints.admin.approval.companies.approve(companyId));
  }

  static async rejectCompany(companyId: string, data: RejectionRequest): Promise<void> {
    await axiosInstance.patch(endpoints.admin.approval.companies.reject(companyId), data);
  }

  // Job Approvals
  static async getPendingJobs(): Promise<Job[]> {
    const response = await axiosInstance.get<Job[]>(endpoints.admin.approval.jobs.pending);
    return response.data;
  }

  static async getAllJobs(): Promise<Job[]> {
    const response = await axiosInstance.get<Job[]>(endpoints.admin.approval.jobs.all);
    return response.data;
  }

  static async getJobById(jobId: string): Promise<Job> {
    const response = await axiosInstance.get<Job>(endpoints.admin.approval.jobs.details(jobId));
    return response.data;
  }

  static async approveJob(jobId: string): Promise<void> {
    await axiosInstance.patch(endpoints.admin.approval.jobs.approve(jobId));
  }

  static async rejectJob(jobId: string, data: RejectionRequest): Promise<void> {
    await axiosInstance.patch(endpoints.admin.approval.jobs.reject(jobId), data);
  }
}
