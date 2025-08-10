import FlipCard from './FlipCard';
import preUniversityIcon from '@/assets/pre-university-home.svg';
import airportPickupIcon from '@/assets/airport-pickup-home.svg';
import visaSupportIcon from '@/assets/visa-support-home.svg';
import admissionSupportIcon from '@/assets/admission-support-home.svg';
import serviceIcon from '@/assets/service-home.svg';

interface ServiceCard {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

const OurServices = () => {
  const services: ServiceCard[] = [
    {
      id: 1,
      title: 'CONSULTATION',
      subtitle: 'Admission Consultation',
      description: 'Talk with current senior students & Get Advice!',
      icon: serviceIcon,
    },
    {
      id: 2,
      title: 'PRE-UNIVERSITY',
      subtitle: 'Pre-University Programs',
      description:
        'Explore (ED Visa supported) GED, IGCSE, OSSD, and Language courses!',
      icon: preUniversityIcon,
    },
    {
      id: 3,
      title: 'VISA',
      subtitle: 'Visa Services',
      description:
        'Skip the stress, we get your Ed Visa with ease (Ygn / Laos)',
      icon: visaSupportIcon,
    },
    {
      id: 4,
      title: 'ACCOMMODATION & AIRPORT PICK-UP',
      subtitle: 'Accommodation & Airport Pick-up',
      description: 'Settle with our +100 accommodation options upon arrival!',
      icon: airportPickupIcon,
    },
    {
      id: 5,
      title: 'ADMISSION PROCESS SUPPORT',
      subtitle: 'University Application Support',
      description: 'Apply with clarity and confidence—you are the future!',
      icon: admissionSupportIcon,
    },
  ];

  const handleServiceClick = (serviceTitle: string) => {
    console.log(`Service clicked: ${serviceTitle}`);
  };

  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-[32px] text-text-primary mb-12 text-center font-semibold">
          Our Services
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {services?.map((service) => (
            <FlipCard
              key={service.id}
              title={service.title}
              subtitle={service.subtitle}
              description={service.description}
              icon={service.icon}
              onButtonClick={() => handleServiceClick(service.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
