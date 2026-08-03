import PropTypes from 'prop-types';

function DashboardHeader({ onProfileClick }) {
  return (
    <header className="bg-surface-container/80 backdrop-blur-xl border-b border-outline-variant/20 fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile h-16">
      <div className="flex items-center gap-3">
        <img
          alt="Elite Way School Crest"
          className="h-10 w-10 object-contain"
          src="https://lh3.googleusercontent.com/aida/AP1WRLu74TLR7CvL-qe-DA7v2M-VuY21hvhC9lX_0bGhlwjoHWR7tI3W0HrmcMwatRR6tvQZApRdmrmTby7XM4Z1W0R6yQSSoZ2uym5DGdsRV8Fhe10SZJhqFYnRUkJgtTxiZLXNAC1IM0wClcy6TAWBaW514vXi2rKlKu0gUgIs4h9926F7YqP1P0E-ux0R3ssPeVqr0LpaRsPR3hnL4uBc9xyPA9xUnQcosqf4fTix_CVlKi0fjDwNseRdPx0"
        />
        <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
          Elite Way School
        </h1>
      </div>
      <button
        onClick={onProfileClick}
        className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
        aria-label="User profile"
      >
        <span className="material-symbols-outlined text-primary text-2xl">account_circle</span>
      </button>
    </header>
  );
}

DashboardHeader.propTypes = {
  onProfileClick: PropTypes.func,
};

export default DashboardHeader;
