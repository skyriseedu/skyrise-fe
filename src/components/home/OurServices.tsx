import { useTranslation } from 'react-i18next';
import FlipCard from './FlipCard';
import preUniversityIcon from '@/assets/pre-university-home.svg';
import airportPickupIcon from '@/assets/airport-pickup-home.svg';
import visaSupportIcon from '@/assets/visa-support-home.svg';
import admissionSupportIcon from '@/assets/admission-support-home.svg';
import serviceIcon from '@/assets/service-home.svg';

interface ServiceCard {
  id: number;
  title: string;
  backsideTitle: string;
  subtitle: string;
  description: string;
  icon: string;
  iconAlt: string;
}

const OurServices = () => {
  const { t } = useTranslation();

  const services: ServiceCard[] = [
    {
      id: 1,
      title: t('home.services.consultation.badge'),
      backsideTitle: t('home.services.consultation.title'),
      subtitle: t('home.services.consultation.subtitle'),
      description: t('home.services.consultation.description'),
      icon: serviceIcon,
      iconAlt: t('home.services.consultation.iconAlt'),
    },
    {
      id: 2,
      title: t('home.services.preUniversity.badge'),
      backsideTitle: t('home.services.preUniversity.title'),
      subtitle: t('home.services.preUniversity.subtitle'),
      description: t('home.services.preUniversity.description'),
      icon: preUniversityIcon,
      iconAlt: t('home.services.preUniversity.iconAlt'),
    },
    {
      id: 3,
      title: t('home.services.visa.badge'),
      backsideTitle: t('home.services.visa.title'),
      subtitle: t('home.services.visa.subtitle'),
      description: t('home.services.visa.description'),
      icon: visaSupportIcon,
      iconAlt: t('home.services.visa.iconAlt'),
    },
    {
      id: 4,
      title: t('home.services.accommodation.badge'),
      backsideTitle: t('home.services.accommodation.title'),
      subtitle: t('home.services.accommodation.subtitle'),
      description: t('home.services.accommodation.description'),
      icon: airportPickupIcon,
      iconAlt: t('home.services.accommodation.iconAlt'),
    },
    {
      id: 5,
      title: t('home.services.admissionSupport.badge'),
      backsideTitle: t('home.services.admissionSupport.title'),
      subtitle: t('home.services.admissionSupport.subtitle'),
      description: t('home.services.admissionSupport.description'),
      icon: admissionSupportIcon,
      iconAlt: t('home.services.admissionSupport.iconAlt'),
    },
  ];

  const handleServiceClick = (serviceTitle: string) => {
    console.log(`Service clicked: ${serviceTitle}`);
  };

  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-h1 text-text-primary lg:text-h1 mb-12 text-center font-semibold">
          {t('home.services.title')}
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {services?.map((service) => (
            <FlipCard
              key={service.id}
              title={service.title}
              backsideTitle={service.backsideTitle}
              subtitle={service.subtitle}
              description={service.description}
              icon={service.icon}
              iconAlt={service.iconAlt}
              onButtonClick={() => handleServiceClick(service.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
