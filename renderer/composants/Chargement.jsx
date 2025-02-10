import React from 'react';

export const Chargement = ({ taille = 'normal', className = '' }) => {
  const tailleClasses = {
    petit: 'w-4 h-4',
    normal: 'w-8 h-8',
    grand: 'w-12 h-12'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="relative">
        <div className={`${tailleClasses[taille]} animate-spin`}>
          <div className="absolute w-full h-full rounded-full border-4 border-solid border-blue-400 border-t-transparent"></div>
          <div className="absolute w-full h-full rounded-full border-4 border-solid border-blue-400 opacity-20"></div>
        </div>
      </div>
    </div>
  );
};
