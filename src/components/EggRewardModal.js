import React from 'react';
import { catImages } from '../assets/cats';

const rarityColor = {
  Mythic: 'text-orange-400',
  Legendary: 'text-yellow-300',
  Epic: 'text-pink-400',
  Rare: 'text-blue-300',
  Common: 'text-purple-100',
};

const EggRewardModal = ({ open, onClose, egg }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#2D2052] rounded-2xl shadow-xl p-3 w-[250px] max-w-full relative">
        <button
          className="absolute top-4 right-4 text-purple-200 hover:text-purple-400 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="text-lg font-bold text-purple-300 mb-4 text-center">{egg.name} Rewards</div>
        <div className="grid grid-cols-3 gap-1">
          {egg.cats.map((cat, idx) => (
            <div key={cat.name} className="bg-[#1C1533] rounded-xl p-1 flex flex-col items-center border-2 border-transparent hover:border-yellow-400 transition relative text-xs">
              <div className="h-5 w-5 mb-0.5 flex items-center justify-center">
                <img src={catImages[cat.name]} alt={cat.name} className="h-5 w-5 object-contain mb-0.5" />
              </div>
              <div className="font-bold text-white text-xs text-center mb-0.5">{cat.name}</div>
              <div className={`text-[10px] font-semibold mb-0.5 ${rarityColor[cat.rarity]}`}>{cat.rarity}</div>
              <div className="bg-black bg-opacity-40 rounded-md px-1 py-0.5 text-[10px] text-blue-200 mb-0.5">{cat.earn} / day</div>
              <div className="bg-yellow-400 text-black text-[10px] font-bold rounded px-1 py-0.5 mt-0.5">Rate {cat.rate}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EggRewardModal;
