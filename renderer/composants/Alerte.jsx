import React from 'react';

export const Alerte = ({ type = 'info', message, onFermer }) => {
  const styles = {
    erreur: 'bg-red-100 border-red-400 text-red-700',
    succes: 'bg-green-100 border-green-400 text-green-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    attention: 'bg-yellow-100 border-yellow-400 text-yellow-700'
  };

  return (
    <div className={`${styles[type]} px-4 py-3 rounded relative border mb-4`} role="alert">
      <span className="block sm:inline">{message}</span>
      {onFermer && (
        <span
          className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
          onClick={onFermer}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>
      )}
    </div>
  );
};
