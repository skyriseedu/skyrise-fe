import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import type { ProgramListItem } from '@/types/users/program';

interface ProgramCardProps {
  program: ProgramListItem;
  onApplyClick?: () => void;
  onReadDetailsClick?: () => void;
}

interface InfoFieldProps {
  label: string;
  value?: string | null;
  className?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  className = '',
}) => {
  return (
    <div className={className}>
      <p className="text-body-5 lg:text-body-6 mb-1 font-semibold whitespace-nowrap text-[var(--color-text-secondary)]">
        {label || '-'}
      </p>
      <p className="text-body-1 lg:text-h4 font-semibold whitespace-nowrap text-[var(--color-text-primary)]">
        {value || '-'}
      </p>
    </div>
  );
};

const UniversityBadge: React.FC<{ university?: string }> = ({ university }) => {
  return (
    <div className="text-body-6 mb-6 inline-block rounded-full bg-[var(--color-secondary)] px-4 py-1.5 font-semibold text-[var(--color-text-primary)] lg:mb-4 lg:py-1.5">
      {university || '-'}
    </div>
  );
};

const formatApplicationDeadline = (deadline?: string | null) => {
  if (!deadline) return undefined;

  const trimmed = deadline.trim();
  if (!trimmed) return undefined;

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(parsed);
};

const ApplicationDeadline: React.FC<{ deadline?: string | null }> = ({
  deadline,
}) => {
  return (
    <p className="text-body-4 mb-6 font-semibold text-[var(--color-text-secondary)] lg:mb-4">
      Application deadline -{' '}
      <span className="font-semibold text-[var(--color-text-important)]">
        {deadline ?? '-'}
      </span>
    </p>
  );
};

const formatRanking = (
  ranking: ProgramListItem['universityRanking']
): string | undefined => {
  if (!ranking) return undefined;
  if (typeof ranking === 'string') return ranking;
  const parts: string[] = [];
  if (typeof ranking.number === 'number') parts.push(`#${ranking.number}`);
  if (ranking.type) parts.push(ranking.type);
  const formatted = parts.join(' ').trim();
  return formatted.length ? formatted : undefined;
};

const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onApplyClick,
  onReadDetailsClick,
}) => {
  const navigate = useNavigate();
  const title = program.programName;
  const university = program.universityName;
  const upcomingIntake = program.keyInformation?.upcomingIntake?.[0];
  const duration = program.keyInformation?.duration;
  const ranking = program.universityRanking;
  const totalTuitionFees = program.keyInformation?.totalTuitionFees;
  const applicationDeadline = formatApplicationDeadline(
    program.applicationDeadline
  );
  const slug = program.slug;
  const rankingLabel = 'Thailand Ranking';
  const programInfo = [
    { label: 'Upcoming Intake', value: upcomingIntake },
    { label: 'Duration', value: duration },
    { label: rankingLabel, value: formatRanking(ranking) },
    { label: 'Total Tuition Fees', value: totalTuitionFees },
  ];

  return (
    <div className="rounded-[var(--border-radius-md)] border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-h3 mb-4 font-semibold text-[var(--color-text-primary)] lg:mb-3">
        {title}
      </h3>

      <UniversityBadge university={university} />

      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-6 lg:mb-4 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-4">
        {programInfo?.map((info, index) => (
          <InfoField key={index} label={info.label} value={info.value} />
        ))}
      </div>

      <ApplicationDeadline deadline={applicationDeadline} />

      <div className="flex items-center justify-between gap-3">
        <Button
          outline
          onClick={onApplyClick}
          className="flex-1 !border-0 !bg-[var(--color-secondary)] whitespace-nowrap !text-[var(--color-text-primary)] hover:!bg-[var(--color-secondary)]/80 lg:flex-none lg:!px-8"
        >
          Apply with SkyRise
        </Button>

        <Button
          primary
          onClick={() => {
            if (onReadDetailsClick) {
              onReadDetailsClick();
            } else {
              if (slug) {
                const path = `/programs/${slug}`;
                navigate(path);
              }
            }
          }}
          className="flex-1 !bg-[var(--color-primary)] whitespace-nowrap hover:!bg-[var(--color-primary)]/90 lg:flex-none lg:!px-8"
        >
          Read Details
        </Button>
      </div>
    </div>
  );
};

export default ProgramCard;
