import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Coin } from './Coin';
import { OrbitControls } from '@react-three/drei';
import { X } from 'lucide-react';

export default function CoinflipModal({ coinflip, onClose }) {
  const {
    creator,
    joiner,
    winner_side,
    amount,
    winner,
    creator_side,
    joiner_side,
  } = coinflip;

  const [showWinner, setShowWinner] = useState(false);

  const handleAnimationEnd = () => {
    setShowWinner(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#1e2326] rounded-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white"
        >
          <X />
        </button>
        <div className="flex items-center justify-between mb-4">
          {/* Criador */}
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">
              {creator_side === 'heads' ? 'Cara' : 'Coroa'}
            </p>
            <img
              src={creator.profile_image || '/image.png'}
              alt=""
              className="rounded-full w-24 h-24 mb-2"
            />
            <p className="text-white">{creator.name}</p>
          </div>
          {/* Animação da moeda */}
          <div className="flex flex-col items-center">
            <p className="text-[#42e56b] font-kanit">R${amount}</p>
            <Canvas style={{ width: 200, height: 200 }}>
              <ambientLight />
              <Coin
                winnerSide={winner_side}
                onAnimationEnd={handleAnimationEnd}
              />
              <OrbitControls enableZoom={false} />
            </Canvas>
          </div>
          {/* Participante */}
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">
              {joiner_side === 'heads' ? 'Cara' : 'Coroa'}
            </p>
            <img
              src={joiner.profile_image || '/image.png'}
              alt=""
              className="rounded-full w-24 h-24 mb-2"
            />
            <p className="text-white">{joiner.name}</p>
          </div>
        </div>
        {showWinner && (
          <p className="text-center text-white mt-4">
            Vencedor: {winner.name}
          </p>
        )}
      </div>
    </div>
  );
}