import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import skyriseVideo from '@/assets/videos/skyrise.mov';
import facebookWhite from '@/assets/facebook-white.svg';
import youtubeWhite from '@/assets/youtube-white.svg';
import messengerWhite from '@/assets/messenger-white.svg';
import telegramWhite from '@/assets/telegram-white.svg';
import Button from '@/components/common/Button';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        >
          <source src={skyriseVideo} type="video/mp4" />
          <source src={skyriseVideo} type="video/quicktime" />
          {t('home.hero.videoFallback')}
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex h-full">
        <div className="w-full max-w-7xl px-6 pt-14 sm:px-6 lg:px-10 lg:pt-20">
          <div>
            <h1 className="mb-6 text-[32px] leading-tight font-semibold text-white md:text-[48px] lg:text-[76px]">
              {t('home.hero.title')
                .split('\n')
                .map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < t('home.hero.title').split('\n').length - 1 && (
                      <br />
                    )}
                  </React.Fragment>
                ))}
            </h1>

            <p className="text-body-4 lg:text-body-2 mb-6 text-white">
              {t('home.hero.subtitle')}
            </p>

            <div className="flex items-center gap-4">
              <a href="#" className="hover:opacity-80">
                <img
                  src={facebookWhite}
                  alt={t('common.social.facebook')}
                  className="h-8 w-8"
                />
              </a>
              <a href="#" className="hover:opacity-80">
                <img
                  src={messengerWhite}
                  alt={t('common.social.messenger')}
                  className="h-8 w-8"
                />
              </a>
              <a href="#" className="hover:opacity-80">
                <img
                  src={youtubeWhite}
                  alt={t('common.social.youtube')}
                  className="h-8 w-8"
                />
              </a>
              <a href="#" className="hover:opacity-80">
                <img
                  src={telegramWhite}
                  alt={t('common.social.telegram')}
                  className="h-8 w-8"
                />
              </a>
            </div>

            <div className="mt-6 mb-4 flex justify-center lg:justify-start">
              <Button
                size="lg"
                className="text-body-5 lg:text-body-3 w-86 rounded-[10px] font-semibold"
                onClick={() => navigate('/explore')}
              >
                {t('common.buttons.getStarted')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
