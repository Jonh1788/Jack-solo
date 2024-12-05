import React, { useRef, useEffect, useState } from 'react';

const RoletaNova = ({ dadosExternos, onTerminarGiro, numeroParaGirar }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const anguloAtualRef = useRef(0);
  const [girando, setGirando] = useState(false);
  const [imagensCarregadas, setImagensCarregadas] = useState([]);
  const [numeroSelecionado, setNumeroSelecionado] = useState('');

  useEffect(() => {
    if (numeroParaGirar !== null && numeroParaGirar !== undefined) {
      girarRoleta(numeroParaGirar);
    }
  }, [numeroParaGirar]);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    // Carrega as imagens
    function carregarImagens() {
      let carregadas = 0;
      const imagens = [];
      const dadosComImagem = dadosExternos.filter((d) => d.image);

      if (dadosComImagem.length === 0) {
        setImagensCarregadas(imagens);
        return;
      }

      dadosExternos.forEach((dado, index) => {
        if (dado.image) {
            console.log(dado)
          const img = new Image();
          img.src = dado.image;
          img.onload = function () {
            imagens[index] = img;
            carregadas++;
            if (carregadas === dadosComImagem.length) {
              setImagensCarregadas(imagens);
            }
          };
        }
      });
    }

    carregarImagens();
  }, [dadosExternos]);

  useEffect(() => {
    if (ctxRef.current) {
      desenharRoleta(anguloAtualRef.current);
    }
  }, [dadosExternos, imagensCarregadas]);

  function handleNumeroChange(e) {
    setNumeroSelecionado(e.target.value);
  }

  function handleGirarClick() {
    if (!girando) {
      const numero = parseInt(numeroSelecionado);
      if (!isNaN(numero)) {
        girarRoleta(numero);
      } else {
        alert('Por favor, insira um número válido.');
      }
    }
  }

  function agruparDados(dados) {
    const agrupados = [];
    let ultimoUserId = null;
    let grupoAtual = null;

    dados.forEach((dado) => {
      if (dado.userId === ultimoUserId) {
        grupoAtual.quantidade++;
        grupoAtual.segmentos.push(dado);
      } else {
        grupoAtual = {
          userId: dado.userId,
          quantidade: 1,
          segmentos: [dado],
        };
        agrupados.push(grupoAtual);
      }
      ultimoUserId = dado.userId;
    });

    return agrupados;
  }

  function desenharRoleta(anguloRotacao = 0) {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const tamanho = Math.min(canvas.width, canvas.height);
    const raio = tamanho / 2;
    const centroX = canvas.width / 2;
    const centroY = canvas.height / 2;

    const dadosAgrupados = agruparDados(dadosExternos);
    const totalSegmentos = dadosAgrupados.reduce((acc, grupo) => acc + grupo.quantidade, 0);
    const anguloPorSegmento = (2 * Math.PI) / totalSegmentos;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let anguloAcumulado = anguloRotacao;

    dadosAgrupados.forEach((grupo) => {
      const anguloSegmento = anguloPorSegmento * grupo.quantidade;

      // Desenhar o segmento agrupado
      ctx.save();
      ctx.translate(centroX, centroY);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, raio, anguloAcumulado, anguloAcumulado + anguloSegmento);
      ctx.closePath();
      ctx.fillStyle = grupo.segmentos[0].color;
      ctx.fill();
      ctx.restore();

      // Desenhar número ou imagem no centro do segmento
      ctx.save();
      ctx.translate(centroX, centroY);
      ctx.rotate(anguloAcumulado + anguloSegmento / 2);

      const dado = grupo.segmentos[0];

      if (dado.image && imagensCarregadas[dadosExternos.indexOf(dado)]) {
        const img = imagensCarregadas[dadosExternos.indexOf(dado)];

        const imgWidth = 40;
        const imgHeight = 40;
        const dx = raio * 0.75 - imgWidth / 2;
        const dy = -imgHeight / 2;

        const borderRadius = 25; // Defina o raio desejado

        // Salvar o estado atual do contexto
        ctx.save();

        // Criar um caminho com cantos arredondados
        ctx.beginPath();
        ctx.moveTo(dx + borderRadius, dy);
        ctx.lineTo(dx + imgWidth - borderRadius, dy);
        ctx.quadraticCurveTo(dx + imgWidth, dy, dx + imgWidth, dy + borderRadius);
        ctx.lineTo(dx + imgWidth, dy + imgHeight - borderRadius);
        ctx.quadraticCurveTo(dx + imgWidth, dy + imgHeight, dx + imgWidth - borderRadius, dy + imgHeight);
        ctx.lineTo(dx + borderRadius, dy + imgHeight);
        ctx.quadraticCurveTo(dx, dy + imgHeight, dx, dy + imgHeight - borderRadius);
        ctx.lineTo(dx, dy + borderRadius);
        ctx.quadraticCurveTo(dx, dy, dx + borderRadius, dy);
        ctx.closePath();

        // Recortar para que apenas a área do caminho seja desenhada
        ctx.clip();

        // Desenhar a imagem
        ctx.drawImage(img, dx, dy, imgWidth, imgHeight);

        // Restaurar o estado original do contexto
        ctx.restore();
      } else {
        // ctx.fillStyle = '#FFFFFF';
        // ctx.font = 'bold 20px Arial';
        // ctx.textAlign = 'center';
        // ctx.textBaseline = 'middle';
        // ctx.fillText(dado.number, raio * 0.75, 0);
      }

      ctx.restore();

      // Atualiza o ângulo acumulado para o próximo segmento
      anguloAcumulado += anguloSegmento;
    });

    desenharSombraInternaComBorda(ctx, centroX, centroY, raio);

    // Desenhar centro vazio
    ctx.beginPath();
    ctx.arc(centroX, centroY, raio * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = '#1E2129';
    ctx.fill();

    //desenharFlecha(ctx, centroX, centroY, raio);
  }

  function desenharSombraInternaComBorda(ctx, centroX, centroY, raio) {
    ctx.save();
    ctx.translate(centroX, centroY);

    const gradient = ctx.createRadialGradient(0, 0, raio * 0.94, 0, 0, raio);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.1, 'rgba(0, 0, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');

    ctx.beginPath();
    ctx.arc(0, 0, raio, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
  }

  function desenharFlecha(ctx, centroX, centroY, raio) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.beginPath();
    ctx.moveTo(centroX, centroY - raio + 10);
    ctx.lineTo(centroX - 15, centroY - raio + 40);
    ctx.lineTo(centroX + 15, centroY - raio + 40);
    ctx.closePath();
    ctx.fillStyle = '#000000';
    ctx.fill();

    ctx.restore();
  }

function girarRoleta(numeroSelecionado) {
  if (girando) return;
  setGirando(true);

  anguloAtualRef.current = 0;
  const canvas = canvasRef.current;
  const ctx = ctxRef.current;
  const tamanho = Math.min(canvas.width, canvas.height);
  const raio = tamanho / 2;

  const dadosAgrupados = agruparDados(dadosExternos);
  const totalSegmentos = dadosAgrupados.reduce((acc, grupo) => acc + grupo.quantidade, 0);
  const anguloPorSegmento = (2 * Math.PI) / totalSegmentos;

  // Encontrar o índice do segmento correspondente ao número selecionado
  let indexSelecionado = null;
  let contadorSegmentos = 0;
  for (let i = 0; i < dadosAgrupados.length; i++) {
    const grupo = dadosAgrupados[i];
    for (let j = 0; j < grupo.segmentos.length; j++) {
      const segmento = grupo.segmentos[j];
      if (segmento.number == numeroSelecionado) {
        indexSelecionado = contadorSegmentos;
        break;
      }
      contadorSegmentos++;
    }
    if (indexSelecionado !== null) {
      break;
    }
  }

  if (indexSelecionado === null) {
    alert('Número selecionado não encontrado!');
    setGirando(false);
    return;
  }

  const startAngleSegmento = indexSelecionado * anguloPorSegmento;
  const variacaoAleatoria = (0.2 + Math.random() * 0.6) * anguloPorSegmento;
  const anguloNoSegmento = startAngleSegmento + variacaoAleatoria;
  const totalRotacoes = 40; // Número de rotações completas
  const anguloDestino =
    totalRotacoes * 2 * Math.PI +
    (Math.PI * 3) / 2 -
    anguloNoSegmento -
    (anguloAtualRef.current % (2 * Math.PI));

  const duracao = 20000; // Duração total da animação em milissegundos (10 segundos)
  const inicio = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animar(tempoAtual) {
    const progresso = tempoAtual - inicio;
    const t = Math.min(progresso / duracao, 1);

    // Aplicar a função de easing para acelerar e desacelerar
    const facilidade = easeInOutCubic(t);

    const novoAngulo =
      anguloAtualRef.current +
      facilidade * (anguloDestino - anguloAtualRef.current);
    desenharRoleta(novoAngulo);

    if (t < 1) {
      requestAnimationFrame(animar);
    } else {
      anguloAtualRef.current = novoAngulo % (2 * Math.PI);
      setGirando(false);
      // Executa a função ao terminar de girar
      if (onTerminarGiro) {
        onTerminarGiro(numeroSelecionado);
      }
    }
  }

  requestAnimationFrame(animar);
}

  return (
    <div>
      <canvas
        ref={canvasRef}
        width="400"
        height="400"
        style={{
          border: '24px solid rgba(0,0,0,0.4)',
          display: 'block',
          margin: '0 auto',
          borderRadius: '50%',
        }}
      ></canvas>
      {/* <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >
        <input
          type="number"
          value={numeroSelecionado}
          onChange={handleNumeroChange}
          placeholder="Digite o número selecionado"
          style={{
            padding: '10px',
            fontSize: '16px',
          }}
        />
        <button
          onClick={handleGirarClick}
          style={{
            marginLeft: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Girar
        </button>
      </div> */}
    </div>
  );
};

export default RoletaNova;