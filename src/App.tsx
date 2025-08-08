import './App.css';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'my' : 'en');
  };

  return (
    <>
      <h1 className="text-primary text-h1 font-bold underline">Hello world!</h1>
      <p className="text-body-1">Loream asperam</p>

      <div className="mt-8 p-4">
        <p>{t('hello', { name: 'Kyi' })}</p>
        <p>{t('welcome')}</p>
        <button
          onClick={toggleLanguage}
          className="bg-primary mt-4 rounded px-4 py-2 text-white"
        >
          {i18n.language === 'en' ? 'Myanmar' : 'English'}
        </button>
      </div>
    </>
  );
}

export default App;
