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
      subtitle: 'Foundation Programs',
      description:
        'Prepare for your university journey with our comprehensive foundation courses',
      icon: preUniversityIcon,
    },
    {
      id: 3,
      title: 'VISA SUPPORT',
      subtitle: 'Visa Application Assistance',
      description: 'Get expert help with your student visa application process',
      icon: visaSupportIcon,
    },
    {
      id: 4,
      title: 'ACCOMMODATION & AIRPORT PICK-UP',
      subtitle: 'Safe Airport Transfer',
      description:
        'Reliable airport pickup service to ensure your safe arrival',
      icon: airportPickupIcon,
    },
    {
      id: 5,
      title: 'ADMISSION PROCESS SUPPORT',
      subtitle: 'University Application',
      description: 'Complete support for your university admission process',
      icon: admissionSupportIcon,
    },
  ];

  const handleServiceClick = (serviceTitle: string) => {
    console.log(`Service clicked: ${serviceTitle}`);
  };

  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-h1 font-bold text-text-primary">
          Our Services
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {services.map((service) => (
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
