import longLogo from '../assets/long_logo.png';
import longLogoDark from '../assets/long_logo_dark_bg.png';
import ThemeToggle from './ThemeToggle';

function DashboardHeader() {
  return (
    <header className="bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile h-16">
      <div className="flex items-center gap-3">
        <img
          alt="Elite Way School Logo"
          className="h-10 w-auto block dark:hidden"
          src={longLogo}
        />
        <img
          alt="Elite Way School Logo"
          className="h-10 w-auto hidden dark:block"
          src={longLogoDark}
        />
      </div>
      <ThemeToggle />
    </header>
  );
}

export default DashboardHeader;
