"use client";
import React from 'react'
import Report from '../ui/Report';
import { getMyReports } from '@/services/blog';
import { ReportProps } from '@/types/blog';
import { useQuery } from '@tanstack/react-query';

const Reports = () => {
  const { data: reports } = useQuery<ReportProps[]>({
    queryKey: ["reports"],
    queryFn: getMyReports,
  });
  return (
    <Report reports={reports} />
  )
}

export default Reports