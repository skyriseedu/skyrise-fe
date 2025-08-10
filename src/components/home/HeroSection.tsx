import React from 'react';
import skyriseVideo from '@/assets/videos/skyrise.mov';
import facebookWhite from '@/assets/facebook-white.svg';
import youtubeWhite from '@/assets/youtube-white.svg';
import messengerWhite from '@/assets/messenger-white.svg';
import telegramWhite from '@/assets/telegram-white.svg';
import Button from '@/components/common/Button';

const HeroSection: React.FC = () => {
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
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex h-full">
        <div className="w-full max-w-7xl px-6 pt-14 sm:px-6 lg:px-10 lg:pt-20">
          <div>
            <h1 className="mb-6 font-semibold leading-tight text-white text-[32px] md:text-[48px] lg:text-[76px]">
              Study Without Limits.
              <br />
              We'll Show You How.
            </h1>

            <p className="text-body-4 lg:text-body-2 mb-6 text-white">
              We aim to help every student find their suitable universities with
              honesty, heart, and real support.
            </p>

            <div className="flex items-center gap-4">
              <a href="#" className="hover:opacity-80">
                <img src={facebookWhite} alt="Facebook" className="h-8 w-8" />
              </a>
              <a href="#" className="hover:opacity-80">
                <img src={messengerWhite} alt="Messenger" className="h-8 w-8" />
              </a>
              <a href="#" className="hover:opacity-80">
                <img src={youtubeWhite} alt="YouTube" className="h-8 w-8" />
              </a>
              <a href="#" className="hover:opacity-80">
                <img src={telegramWhite} alt="Telegram" className="h-8 w-8" />
              </a>
            </div>

            <div className="mt-6 mb-4 flex justify-center lg:justify-start">
              <Button
                size="lg"
                className="w-86 text-body-5 lg:text-body-3 font-semibold rounded-[10px]"
                onClick={() => console.log('Get Started clicked')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
