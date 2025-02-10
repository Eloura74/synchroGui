import React from 'react';

export const TestComponent = () => {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2">Test Tailwind</h1>
      <p className="text-sm">Si vous voyez ce texte en blanc sur fond bleu, Tailwind fonctionne !</p>
      <button className="mt-4 bg-white text-blue-500 px-4 py-2 rounded hover:bg-blue-100">
        Bouton de test
      </button>
    </div>
  );
};
