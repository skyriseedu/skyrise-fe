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

const InfoField: React.FC<InfoFieldProps> = ({ label, value, className = '' }) => (
  <div className={className}>
    <p className="text-body-5 lg:text-body-6 text-[var(--color-text-secondary)] mb-1 font-semibold whitespace-nowrap">{label}</p>
    <p className="text-body-1 lg:text-h4 font-semibold text-[var(--color-text-primary)] whitespace-nowrap">{value}</p>
  </div>
);

const UniversityBadge: React.FC<{ university: string }> = ({ university }) => (
  <div className="bg-[var(--color-secondary)] text-body-6 font-medium text-[var(--color-text-primary)] px-4 py-1.5 lg:py-1.5 rounded-full inline-block mb-6 lg:mb-4">
    {university}
  </div>
);

const ApplicationDeadline: React.FC<{ deadline: string }> = ({ deadline }) => (
  <p className="text-body-4 text-[var(--color-text-secondary)] mb-6 lg:mb-4 font-semibold">
    /* Application deadline - <span className="text-[var(--color-text-important)] font-medium">{deadline}</span>
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
    <div className="bg-white rounded-[var(--border-radius-md)] p-6 shadow-sm border border-gray-200">
      <h3 className="text-h3 font-semibold text-[var(--color-text-primary)] mb-4 lg:mb-3">{title}</h3>
      
      <UniversityBadge university={university} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-6 lg:gap-y-4 mb-6 lg:mb-4">
        {programInfo?.map((info, index) => (
          <InfoField key={index} label={info.label} value={info.value} />
        ))}
      </div>

      <ApplicationDeadline deadline={applicationDeadline} />
      
      <div className="flex justify-between items-center gap-3">
        <Button
          outline
          onClick={onApplyClick}
          className="!bg-[var(--color-secondary)] !text-[var(--color-text-primary)] !border-0 hover:!bg-[var(--color-secondary)]/80 flex-1 lg:flex-none lg:!px-8 whitespace-nowrap"
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
          className="!bg-[var(--color-primary)] hover:!bg-[var(--color-primary)]/90 flex-1 lg:flex-none lg:!px-8 whitespace-nowrap"
        >
          Read Details
        </Button>
      </div>
    </div>
  );
};

export default ProgramCard;