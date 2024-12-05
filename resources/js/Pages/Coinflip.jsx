import ApostaCard from '@/Components/ApostaCard';
import Chat from '@/Components/Chat';
import CoinflipModal from '@/Components/CoinflipModal';
import DepositModal from '@/Components/DepositModal';
import ImageUpload from '@/Components/ImageUpload';
import RoletaNova from '@/Components/RoletaNova';
import SortudoCard from '@/Components/SortudoCard';
import UltimosJogos from '@/Components/UltimosJogos';
import VencedorCard from '@/Components/VencedorCard';
import { Link, Head, router } from '@inertiajs/react';
import axios from 'axios';
import { X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';



const data = [
    { number: '1', color: '#123040', userId: 1, image: null },
];

export default function Coinflip({ auth, coinflips, totalInvested, totalGames, userInvestment, userWins, userLosses, totalProfit }) {

    const [availableCoinflips, setAvailableCoinflips] = useState(coinflips);
    const [amount, setAmount] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [resolvedCoinflip, setResolvedCoinflip] = useState(null);
    const [entrando, setEntrando] = useState(false);

useEffect(() => {

    window.Echo.channel('coinflip-channel').listen('CoinflipCreated', (e) => {
        setAvailableCoinflips((prev) => [...(prev || []), e.coinflip]);
      });

  // Listen for CoinflipResolved event
  window.Echo.channel('coinflip-resolved').listen('CoinflipResolved', (e) => {
    // Update the coinflips list
    setAvailableCoinflips((prev) =>
      prev ? prev.filter((cf) => cf.id !== e.coinflip.id) : []
    );



    // If the user is involved, display the result
    if (
      e.coinflip.creator_id === auth.user.id ||
      e.coinflip.joiner_id === auth.user.id
    ) {
      setResolvedCoinflip(e.coinflip);
    }
  });
}, []);

    
      const handleCreateCoinflip = () => {
        axios
          .post('/coinflips', { amount })
          .then((response) => {
            setShowCreateModal(false);
            setAmount('');
          })
          .catch((error) => {
            console.error(error);
          });
      };
    
      const handleJoinCoinflip = (id) => {
        setEntrando(true);
        axios
          .post(`/coinflips/${id}/join`)
          .then((response) => {
            // Optionally, navigate to the coinflip result page
            // Or display the modal with the coin flip animation
          })
          .catch((error) => {
            console.error(error);
          }).finally(() => {
            setEntrando(false);
          });
      };

    return (
        <>
        {resolvedCoinflip && (
      <CoinflipModal
        coinflip={resolvedCoinflip}
        onClose={() => setResolvedCoinflip(null)}
      />
    )}
            <Head title="Coinflip" />
            <div className="bg-backgroundgeneral h-max w-screen flex flex-col font-inter m-0 relative">
                <header className="w-full h-[72px]">
                    <nav className="w-full h-full bg-backgroundnav flex justify-between items-center px-8 py-5">

                        <img src="/logo-jack2.png" alt="" className='h-[24px] w-[108px]' />

                        <div className="text-muted text-xs leading-4 flex gap-4 items-center">
                            <Link
                                href={route('welcome')}
                                
                            >
                                Jackpot Diário
                            </Link>
                            <Link href={route('welcome')} className="">
                                Jackpot Semanal
                            </Link>
                            <Link className="text-selected bg-nav p-3 rounded-l-lg rounded-tr-lg border border-border">Coinflip</Link>
                            <Link className="">Como funciona?</Link>
                        </div>
                        {auth.user ? (
                            <div className="flex items-center text-selected gap-3">
                                <div onClick={() => setDepositModal(true)} className="rounded-full cursor-pointer border border-background1 p-2 hover:border-border transition-all">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9991 7H6.00114C5.25714 7 4.77314 7.785 5.10814 8.45L5.61114 9.45C5.78114 9.787 6.12714 10 6.50514 10H17.4961C17.8741 10 18.2191 9.787 18.3891 9.45L18.8921 8.45C19.2271 7.785 18.7431 7 17.9991 7V7Z" stroke="#43E56A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M14.9571 5.88916C14.0941 6.78716 12.7371 7.00016 12.0801 7.00016" stroke="#43E56A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12.0803 7.00009C12.0803 7.00009 11.6853 4.50809 12.6573 3.49609" stroke="#43E56A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M14.9572 5.88877C15.5922 5.22777 15.5922 4.15577 14.9572 3.49477C14.3222 2.83377 13.2922 2.83377 12.6572 3.49477" stroke="#43E56A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M9.04297 5.88916C9.90597 6.78716 11.263 7.00016 11.92 7.00016" stroke="#43E56A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M11.9197 7.00009C11.9197 7.00009 12.3147 4.50809 11.3427 3.49609" stroke="#43E56A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M9.04266 5.88877C8.40766 5.22777 8.40766 4.15577 9.04266 3.49477C9.67766 2.83377 10.7077 2.83377 11.3427 3.49477" stroke="#43E56A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M6.08 9.896C5.541 10.789 4.282 12.875 3.552 14.086C3.19 14.685 3 15.37 3 16.071V16.071C3 16.993 3.331 17.884 3.933 18.583L4.866 19.665C5.597 20.513 6.661 21 7.78 21H16.22C17.339 21 18.403 20.513 19.134 19.665L20.067 18.583C20.669 17.884 21 16.993 21 16.071V16.071C21 15.37 20.809 14.683 20.447 14.083L17.92 9.896" stroke="#43E56A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>

                                <div>
                                    <p className="font-kanit text-sm font-medium">
                                        R$ {auth.user.balance ? auth.user.balance.toFixed(2) : 0}
                                    </p>
                                    <p className="text-muted text-xs">Saldo em conta</p>
                                </div>

                                <div className="border-l border-background1 h-12 w-px" />

                                <div className="size-10">
                                    <img src="image.png" alt="" />
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-muted flex gap-3">
                                <Link
                                    className="border border-background1 p-2 rounded-md bg-bluecard text-textcard font-kanit drop-shadow-card hover:bg-bluecard/50"
                                    href={route('login')}
                                >
                                    Login
                                </Link>
                                <Link
                                    className="border font-kanit border-background1 p-2 rounded-md hover:bg-white/10"
                                    href={route('register')}
                                >
                                    Registrar
                                </Link>
                            </div>
                        )}
                    </nav>
                </header>

                <main className="flex flex-col p-8 w-full gap-6">
                    {/* Banner */}
                    <div className="w-full h-60">
                        <img src={`/BannerJ.jpeg`} alt="" />
                    </div>

                    {/* Jackpot */}
                    <div className="w-full flex gap-6 ">
                        {/* Apostas e roleta */}
                        <div className={`h-[692px] min-w-[800px] flex flex-1 relative rounded-md bg-blend-color-burn bg-black/[0.1]`}>
                            <div className='flex flex-col size-full'>
                                <div className='flex flex-col w-full h-32'>
                                    <div className='flex justify-between mb-2'>
                                        <h1 className='text-white'>Coinflip</h1>
                                        <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-bluecard text-textcard rounded-lg font-extrabold py-2 px-4 drop-shadow-card border-b-4 border-[#43E56A]"
                  >
                    Criar coinflip
                  </button>
                                    </div>

                                    <div className="flex size-full text-white gap-4">
                                        <div className='flex bg-[#1e2326] items-center justify-center px-2 rounded-md  w-[40%]'>
                                            <div className='flex flex-col'>
                                                <p className='text-[#888ea8] text-sm'>Valores investidos</p>
                                                <h1 className='text-lg font-inter font-semibold'>R${totalInvested.toFixed(2)}</h1>
                                            </div>
                                            <div className='h-[80%] w-px bg-[#363845] mx-4'/>
                                            <div className='flex flex-col'>
                                                <p className='text-[#888ea8] text-sm'>Quantidade de jogos</p>
                                                <h1 className='text-lg font-inter font-semibold'>{totalGames}</h1>
                                            </div>
                                        </div>

                                        <div className='w-full flex bg-[#1e2326] items-center justify-around px-2 rounded-md'>
                                        <div className='flex flex-col'>
                                                <p className='text-[#888ea8] text-sm'>Meu investimento</p>
                                                <h1 className='text-lg font-inter font-semibold'>R${userInvestment.toFixed(2)}</h1>
                                            </div>
                                            <div className='h-[80%] w-px bg-[#363845] mx-4'/>
                                            <div className='flex flex-col'>
                                                <p className='text-[#888ea8] text-sm'>Ganhos</p>
                                                <h1 className='text-lg font-inter font-semibold'>R${userWins.toFixed(2)}</h1>
                                            </div>
                                            <div className='h-[80%] w-px bg-[#363845] mx-4'/>
                                            <div className='flex flex-col'>
                                                <p className='text-[#888ea8] text-sm'>Percas</p>
                                                <h1 className='text-lg font-inter font-semibold'>R${userLosses.toFixed(2)}</h1>
                                            </div>
                                            <div className='h-[80%] w-px bg-[#363845] mx-4'/>
                                            <div className='flex flex-col'>
                                                <p className='text-[#888ea8] text-sm'>Total ganho</p>
                                                <h1 className='text-lg font-inter font-semibold'>R${totalProfit.toFixed(2)}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='bg-[#1e2326] size-full mt-2 p-2 rounded-md overflow-y-auto'>
                                {availableCoinflips && availableCoinflips.map((cf) => (
                  <div
                    key={cf.id}
                    className="flex p-2 bg-[#16171c] justify-between mb-2"
                  >
                    {/* Images */}
                    <div className="flex items-center justify-center">
                      <img
                        className="rounded-full"
                        src={cf?.creator?.profile_image || '/image.png'}
                        alt=""
                      />
                      <p className="text-white font-kanit font-bold mx-2">VS</p>
                      <img
                        className="rounded-full"
                        src="/placeholder.png" // Placeholder for joiner
                        alt=""
                      />
                    </div>

                    {/* Values */}
                    <div className="flex flex-col">
                      <p className="text-[#42e56b] font-kanit">
                        R${cf.amount}
                      </p>
                      <p className="text-[#b2b6c6] font-inter text-sm">
                        {new Date(cf.created_at).toLocaleString()}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleJoinCoinflip(cf.id)}
                        className="bg-bluecard/10 text-textcard rounded-lg font-extrabold py-2 px-4  border-b-4 border-[#07180b] hover:bg-bluecard"
                      >
                        {entrando ? 'Entrando...' : 'Entrar'}
                      </button>
                      {/* Optionally, add a view button */}
                    </div>
                  </div>
                ))}
                                </div>

                            </div>
                        </div>
                        {/* Chat */}
                        <Chat disable={!auth.user} auth={auth} />
                    </div>

                </main>
                  {/* Create Coinflip Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl mb-4">Criar Coinflip</h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              placeholder="Valor da aposta"
            />
            <button
              onClick={handleCreateCoinflip}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Criar
            </button>
            <button
              onClick={() => setShowCreateModal(false)}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
            </div>
        </>
    );
}