import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Company, Job, RejectionRequest } from 'src/types/approval';

import { ApprovalService } from '../services/approval.service';

// ----------------------------------------------------------------------

// Query Keys
export const approvalKeys = {
  all: ['approvals'] as const,
  companies: {
    all: ['approvals', 'companies'] as const,
    pending: ['approvals', 'companies', 'pending'] as const,
    details: (id: string) => ['approvals', 'companies', 'details', id] as const,
  },
  jobs: {
    all: ['approvals', 'jobs'] as const,
    pending: ['approvals', 'jobs', 'pending'] as const,
    details: (id: string) => ['approvals', 'jobs', 'details', id] as const,
  },
} as const;

// ----------------------------------------------------------------------

// Company Hooks
export function usePendingCompanies() {
  return useQuery({
    queryKey: approvalKeys.companies.pending,
    queryFn: ApprovalService.getPendingCompanies,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAllCompanies() {
  return useQuery({
    queryKey: approvalKeys.companies.all,
    queryFn: ApprovalService.getAllCompanies,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCompanyDetails(companyId: string) {
  return useQuery({
    queryKey: approvalKeys.companies.details(companyId),
    queryFn: () => ApprovalService.getCompanyById(companyId),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useApproveCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) => ApprovalService.approveCompany(companyId),
    onSuccess: () => {
      // Invalidate and refetch approval queries
      queryClient.invalidateQueries({ queryKey: approvalKeys.companies.all });
      queryClient.invalidateQueries({ queryKey: approvalKeys.companies.pending });
    },
    onError: (error) => {
      console.error('Failed to approve company:', error);
    },
  });
}

export function useRejectCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, data }: { companyId: string; data: RejectionRequest }) =>
      ApprovalService.rejectCompany(companyId, data),
    onSuccess: () => {
      // Invalidate and refetch approval queries
      queryClient.invalidateQueries({ queryKey: approvalKeys.companies.all });
      queryClient.invalidateQueries({ queryKey: approvalKeys.companies.pending });
    },
    onError: (error) => {
      console.error('Failed to reject company:', error);
    },
  });
}

// Job Hooks
export function usePendingJobs() {
  return useQuery({
    queryKey: approvalKeys.jobs.pending,
    queryFn: ApprovalService.getPendingJobs,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAllJobs() {
  return useQuery({
    queryKey: approvalKeys.jobs.all,
    queryFn: ApprovalService.getAllJobs,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useJobDetails(jobId: string) {
  return useQuery({
    queryKey: approvalKeys.jobs.details(jobId),
    queryFn: () => ApprovalService.getJobById(jobId),
    enabled: !!jobId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useApproveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => ApprovalService.approveJob(jobId),
    onSuccess: () => {
      // Invalidate and refetch approval queries
      queryClient.invalidateQueries({ queryKey: approvalKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: approvalKeys.jobs.pending });
    },
    onError: (error) => {
      console.error('Failed to approve job:', error);
    },
  });
}

export function useRejectJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: RejectionRequest }) =>
      ApprovalService.rejectJob(jobId, data),
    onSuccess: () => {
      // Invalidate and refetch approval queries
      queryClient.invalidateQueries({ queryKey: approvalKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: approvalKeys.jobs.pending });
    },
    onError: (error) => {
      console.error('Failed to reject job:', error);
    },
  });
}
