import React from 'react';
import landingPageStudents from '@/assets/images/landing-page-students.png';
import facebookWhite from '@/assets/facebook-white.svg';
import youtubeWhite from '@/assets/youtube-white.svg';
import messengerWhite from '@/assets/messenger-white.svg';
import telegramWhite from '@/assets/telegram-white.svg';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={landingPageStudents}
          alt="Students celebrating graduation"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex h-full">
        <div className="w-full max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 lg:pt-32">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-[40px] leading-tight font-bold text-white md:text-[48px] lg:text-[56px]">
              Study Without Limits.
              <br />
              We'll Show You How.
            </h1>

            <p className="text-body-4 lg:text-h1 mb-8 text-white">
              We aim to help every student find their suitable universities with
              honesty, heart, and real support.
            </p>

            <div className="mb-8 flex gap-4">
              <a
                href="#"
                className="bg-primary text-body-4 hover:bg-primary/90 lg:text-h1 inline-block rounded-[10px] px-12 py-3 font-medium text-white transition-colors"
              >
                Get Started
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a href="#" className="hover:opacity-80">
                <img src={facebookWhite} alt="Facebook" className="h-6 w-6" />
              </a>
              <a href="#" className="hover:opacity-80">
                <img src={messengerWhite} alt="Messenger" className="h-6 w-6" />
              </a>
              <a href="#" className="hover:opacity-80">
                <img src={youtubeWhite} alt="YouTube" className="h-6 w-6" />
              </a>
              <a href="#" className="hover:opacity-80">
                <img src={telegramWhite} alt="Telegram" className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
