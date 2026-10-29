import { RiskTier } from '../types';

export const getRiskBadgeColor = (tier: RiskTier | string) => {
  switch (tier) {
    case 'HIGH':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'MEDIUM':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'LOW':
    default:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
};

export const getRiskProgressColor = (tier: RiskTier | string) => {
  switch (tier) {
    case 'HIGH':
      return 'bg-red-500';
    case 'MEDIUM':
      return 'bg-amber-500';
    case 'LOW':
    default:
      return 'bg-emerald-500';
  }
};

export const getRiskHexColor = (tier: RiskTier | string) => {
  switch (tier) {
    case 'HIGH':
      return '#EF4444';
    case 'MEDIUM':
      return '#F59E0B';
    case 'LOW':
    default:
      return '#10B981';
  }
};
