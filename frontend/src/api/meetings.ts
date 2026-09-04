import client from './client';
import type { Meeting } from '@/types';

export interface CreateMeetingPayload {
  title: string;
  startTime?: string;
  password?: string;
}

export const meetingsApi = {
  create: (data: CreateMeetingPayload) =>
    client.post<Meeting>('/meetings', data),

  list: () =>
    client.get<{ meetings: Meeting[] } | Meeting[]>('/meetings'),

  get: (id: string) =>
    client.get<Meeting>(`/meetings/${id}`),

  update: (id: string, data: Partial<CreateMeetingPayload>) =>
    client.patch<Meeting>(`/meetings/${id}`, data),

  remove: (id: string) =>
    client.delete(`/meetings/${id}`),

  join: (id: string, password?: string) =>
    client.post<{ roomId: string; token: string }>(`/meetings/${id}/join`, { password }),

  leave: (id: string) =>
    client.post(`/meetings/${id}/leave`),
};
