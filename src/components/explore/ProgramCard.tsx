import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

interface ProgramCardProps {
  id?: string;
  title: string;
  university: string;
  upcomingIntake: string;
  duration: string;
  ranking: string;
  rankingYear: string;
  totalTuitionFees: string;
  applicationDeadline: string;
  onApplyClick?: () => void;
  onReadDetailsClick?: () => void;
}

interface InfoFieldProps {
  label: string;
  value: string;
  className?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  className = '',
}) => (
  <div className={className}>
    <p className="text-body-5 lg:text-body-6 mb-1 font-semibold whitespace-nowrap text-[var(--color-text-secondary)]">
      {label}
    </p>
    <p className="text-body-1 lg:text-h4 font-semibold whitespace-nowrap text-[var(--color-text-primary)]">
      {value}
    </p>
  </div>
);

const UniversityBadge: React.FC<{ university: string }> = ({ university }) => (
  <div className="text-body-6 mb-6 inline-block rounded-full bg-[var(--color-secondary)] px-4 py-1.5 font-medium text-[var(--color-text-primary)] lg:mb-4 lg:py-1.5">
    {university}
  </div>
);

const ApplicationDeadline: React.FC<{ deadline: string }> = ({ deadline }) => (
  <p className="text-body-4 mb-6 font-semibold text-[var(--color-text-secondary)] lg:mb-4">
    /* Application deadline -{' '}
    <span className="font-medium text-[var(--color-text-important)]">
      {deadline}
    </span>
  </p>
);

const ProgramCard: React.FC<ProgramCardProps> = ({
  id = '1',
  title,
  university,
  upcomingIntake,
  duration,
  ranking,
  rankingYear,
  totalTuitionFees,
  applicationDeadline,
  onApplyClick,
  onReadDetailsClick,
}) => {
  const navigate = useNavigate();
  const programInfo = [
    { label: 'Upcoming Intake', value: upcomingIntake },
    { label: 'Duration', value: duration },
    { label: `Thailand Ranking ${rankingYear}`, value: ranking },
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
              navigate(`/programs/${id}`);
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
