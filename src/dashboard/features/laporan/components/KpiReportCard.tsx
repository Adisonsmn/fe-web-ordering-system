import type { MetrikDelta } from '@shared/types';
import type { FC, ReactNode } from 'react';
import { KpiCard } from '../../overview/components/KpiCard';

interface KpiReportCardProps {
  label: string;
  delta?: MetrikDelta;
  formatter?: (val: number) => string | number;
  decorIcon?: ReactNode;
}

export const KpiReportCard: FC<KpiReportCardProps> = ({
  label,
  delta,
  formatter = (val) => val,
  decorIcon,
}) => {
  if (!delta) {
    return <KpiCard label={label} value="-" subValue="Memuat data..." decorIcon={decorIcon} />;
  }

  const value = delta.nilaiHariIni !== null ? formatter(delta.nilaiHariIni) : '-';

  let subValue = 'Sama dengan kemarin';
  let subValueColor: 'positive' | 'negative' | 'orange' | undefined;

  if (delta.deltaPersen !== null && delta.deltaPersen !== 0) {
    const direction = delta.deltaArah === 'naik' ? '+' : '-';
    subValue = `${direction}${Math.abs(delta.deltaPersen).toFixed(1)}% dibanding kemarin`;
    subValueColor = delta.deltaArah === 'naik' ? 'positive' : 'negative';
  }

  return (
    <KpiCard
      label={label}
      value={value}
      subValue={subValue}
      subValueColor={subValueColor}
      decorIcon={decorIcon}
    />
  );
};
