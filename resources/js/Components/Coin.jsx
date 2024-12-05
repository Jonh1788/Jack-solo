import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export function Coin({ winnerSide, onAnimationEnd }) {
  const coinRef = useRef();
  const [animationFinished, setAnimationFinished] = useState(false);
  const startTime = useRef(null);
  const duration = 3000; // Duração da animação em milissegundos

  // Carregar texturas para caras e coroas
  const headsTexture = useLoader(TextureLoader, '/jackpot-1.png');
  const tailsTexture = useLoader(TextureLoader, '/jackpot-2.png');

  useEffect(() => {
    startTime.current = Date.now();
    setAnimationFinished(false);
  }, [winnerSide]);

  useFrame(() => {
    const elapsed = Date.now() - startTime.current;

    if (elapsed <= duration) {
      // A animação está em execução
      const progress = elapsed / duration;

      // Movimentar a moeda para cima e para baixo
      const y = 3 * Math.sin(Math.PI * progress); // Ajuste a altura conforme necessário
      coinRef.current.position.y = y;

      // Escalar a moeda para simular aproximação
      const scale = 1 + 0.5 * Math.sin(Math.PI * progress);
      coinRef.current.scale.set(scale, scale, scale);

      // Rotacionar a moeda em torno do eixo 'y'
      coinRef.current.rotation.y += 0.2;

      coinRef.current.rotation.x += 0.1;
    } else {
      // A animação terminou
      if (!animationFinished) {
        // Definir a moeda para mostrar a face vencedora
        coinRef.current.rotation.z = winnerSide === 'heads' ? 0 : Math.PI;
        coinRef.current.position.y = 0;
        coinRef.current.scale.set(1, 1, 1);
        setAnimationFinished(true);

        // Notificar o pai que a animação terminou
        onAnimationEnd();
      }
    }
  });

  // Aplicar uma rotação inicial na moeda para que a face fique voltada para o usuário
  useEffect(() => {
    coinRef.current.rotation.x = Math.PI / 2;
  }, []);

  return (
    <mesh ref={coinRef}>
      <cylinderGeometry args={[1, 1, 0.1, 32]} />
      <meshStandardMaterial attachArray="material" map={headsTexture} />    {/* Face frontal */}
      <meshStandardMaterial attachArray="material" map={tailsTexture} />    {/* Face traseira */}
      <meshStandardMaterial attachArray="material" color="gold" />          {/* Lateral */}
    </mesh>
  );
}