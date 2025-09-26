import React from 'react';

export const TypographyDemo: React.FC = () => {
  return (
    <div className="p-8 bg-white">
      <h1>Titre 1 - H1</h1>
      <h2>Titre 2 - H2</h2>
      <h3>Titre 3 - H3</h3>
      <h4>Titre 4 - H4</h4>
      <p>Texte normal - P</p>
      <p><strong>Texte bold - B / Strong</strong></p>
      
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="mb-4">Classes utilitaires disponibles :</h3>
        <div className="space-y-2">
          <div className="text-h1">Classe .text-h1</div>
          <div className="text-h2">Classe .text-h2</div>
          <div className="text-h3">Classe .text-h3</div>
          <div className="text-h4">Classe .text-h4</div>
          <div className="text-body">Classe .text-body</div>
          <div className="text-body-bold">Classe .text-body-bold</div>
        </div>
      </div>
    </div>
  );
};