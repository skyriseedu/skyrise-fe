import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  route: string;
}

const OurServices = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const services: ServiceCard[] = [
    {
      id: 1,
      title: t('home.services.consultation.badge'),
      backsideTitle: t('home.services.consultation.title'),
      subtitle: t('home.services.consultation.subtitle'),
      description: t('home.services.consultation.description'),
      icon: serviceIcon,
      iconAlt: t('home.services.consultation.iconAlt'),
      route: '/services/consultation',
    },
    {
      id: 2,
      title: t('home.services.preUniversity.badge'),
      backsideTitle: t('home.services.preUniversity.title'),
      subtitle: t('home.services.preUniversity.subtitle'),
      description: t('home.services.preUniversity.description'),
      icon: preUniversityIcon,
      iconAlt: t('home.services.preUniversity.iconAlt'),
      route: '/services/pre-university',
    },
    {
      id: 3,
      title: t('home.services.visa.badge'),
      backsideTitle: t('home.services.visa.title'),
      subtitle: t('home.services.visa.subtitle'),
      description: t('home.services.visa.description'),
      icon: visaSupportIcon,
      iconAlt: t('home.services.visa.iconAlt'),
      route: '/services/visa-assistance',
    },
    {
      id: 4,
      title: t('home.services.accommodation.badge'),
      backsideTitle: t('home.services.accommodation.title'),
      subtitle: t('home.services.accommodation.subtitle'),
      description: t('home.services.accommodation.description'),
      icon: airportPickupIcon,
      iconAlt: t('home.services.accommodation.iconAlt'),
      route: '/services/accommodation-and-airport-pick-up',
    },
    {
      id: 5,
      title: t('home.services.admissionSupport.badge'),
      backsideTitle: t('home.services.admissionSupport.title'),
      subtitle: t('home.services.admissionSupport.subtitle'),
      description: t('home.services.admissionSupport.description'),
      icon: admissionSupportIcon,
      iconAlt: t('home.services.admissionSupport.iconAlt'),
      route: '/services/admission-process-support',
    },
  ];

  const handleServiceClick = (route: string) => {
    navigate(route);
  };

  return (
    <section className="bg-white px-6 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-h1 text-text-primary lg:text-custom mb-12 text-center font-semibold">
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
              onButtonClick={() => handleServiceClick(service.route)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
