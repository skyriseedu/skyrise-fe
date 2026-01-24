import ServicesShowcase from '@/components/services/consultation/ServicesShowcase';
import support from '@/assets/images/Services Graphics - Accomodation and Airport.png';
import StickyHeader from '@/components/common/StickyHeader';
import AccommodationCard from '@/components/services/accommodation-and-airport-pickup/AccommodationCard';
import BunditApartment from '@/assets/images/bundit-apartment-rangsit.jpeg';
import KaveCondo from '@/assets/images/kave-condo-bangkok-uni.jpeg';
import ElsaBlissCondo from '@/assets/images/elsa-biss-condo-stamford.jpeg';
import BCondo from '@/assets/images/b-condo-raffle.jpeg';
import PlumCondo from '@/assets/images/plum-condo.jpeg';

const accommodationChoices = [
  {
    imageUrl: BunditApartment,
    name: 'Bundit Apartment',
    location: 'Near Rangsit University, Thailand',
  },
  {
    imageUrl: KaveCondo,
    name: 'Kave Condo',
    location: 'Near Bangkok University, Thailand',
  },
  {
    imageUrl: ElsaBlissCondo,
    name: 'Elsa Bliss Condo',
    location: 'Near Stamford University, Thailand',
  },
  {
    imageUrl: BCondo,
    name: 'B Condo',
    location: 'Near Raffle University, Bangkok',
  },

  {
    imageUrl: PlumCondo,
    name: 'Plum Condo',
    location: 'Near Rangsit University, Thailand',
  },
];

const AdmissionProcessPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <StickyHeader
        title="Accommodation & Airport Pick-up"
        subtitle=""
        mobilePadding="px-8"
        desktopPadding="lg:px-15"
        showBackButton={false}
        useContainer={false}
      />
      <div className="relative w-full">
        <img
          src={support}
          alt="About us cover 1"
          className="sm-[70px] h-55 w-full object-cover lg:h-[450px]"
        />
        <div
          className="absolute inset-x-0 bottom-4 py-2 md:py-2 lg:bottom-8 lg:py-2"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="container mx-auto px-6 text-left lg:px-8">
            <h1 className="text-h3 md:text-h2 lg:text-h2 font-semibold text-white">
              “Feel at home and welcomed by the new heart-warming community!”
            </h1>
          </div>
        </div>
      </div>
      <section className="w-full px-4 py-8 lg:px-15">
        <p className="text-text-primary text-body-2 lg:text-body-3 mb-10">
          Moving to a new country should feel exciting, not stressful. We help
          you settle in from day one.
        </p>

        <div className="mb-8">
          <h2 className="text-h4 lg:text-h2 text-text-primary mb-6 font-semibold">
            Service Include:
          </h2>

          <ul className="mb-8">
            <li className="mb-3 flex items-start">
              <span className="text-text-primary mr-2">•</span>
              <span className="text-text-primary text-h4 lg:text-body-3">
                Assistance in booking student accommodation or hostels{' '}
                <span className="font-bold">
                  ( Those who do not apply admission with SKYRISE team can also
                  take it with CHARGES)
                </span>
              </span>
            </li>
            <li className="mb-3 flex items-start">
              <span className="text-text-primary mr-2">•</span>
              <span className="text-text-primary text-h4 lg:text-body-3">
                Match and find roommate{' '}
                <span className="font-bold">( if needed )</span>
              </span>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-h4 lg:text-h2 text-text-primary mb-6 font-semibold">
            Accommodation Choices:
          </h2>

          {/* Mobile: Horizontal scroll */}
          <div className="lg:hidden">
            <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
              {accommodationChoices.map((choice) => (
                <div key={choice.name} className="w-72 flex-shrink-0">
                  <AccommodationCard
                    imageUrl={choice.imageUrl}
                    name={choice.name}
                    location={choice.location}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden gap-6 lg:grid lg:grid-cols-5">
            {accommodationChoices.map((choice) => (
              <AccommodationCard
                key={choice.name}
                imageUrl={choice.imageUrl}
                name={choice.name}
                location={choice.location}
              />
            ))}
          </div>

          <div className="mt-8">
            <ul>
              <li className="mb-3 flex items-start">
                <span className="text-text-primary mr-2">•</span>
                <span className="text-text-primary text-h4 lg:text-body-3">
                  Pickup Service from the airport to your place{' '}
                  <span className="font-bold">
                    (EXCLUSIVE for those who apply with SKYRISE EDU team )
                  </span>
                </span>
              </li>
            </ul>

            <p className="text-text-primary text-h4 lg:text-body-3 mt-4">
              (<span className="font-bold text-red-600">REMARK :</span> This
              service is already included in our admission service!{' '}
              <span className="font-bold">
                EXCLUSIVE for those who apply with SKYRISE EDU team
              </span>{' '}
              )
            </p>
          </div>
        </div>
      </section>
      <ServicesShowcase />
    </div>
  );
};

export default AdmissionProcessPage;
