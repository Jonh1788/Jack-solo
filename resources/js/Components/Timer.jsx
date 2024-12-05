import { useState } from "react";

export default function Timer(){
    const [timer, setTimer] = useState(0);
    return (
        <div className='absolute top-6 rounded-lg text-[#FEDA35] right-6 h-12 w-28 bg-[#FEDA3514] border border-[#FEDA35] flex items-center justify-center gap-2 px-3 py-2'>
        <div className='size-6'>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9.00375" stroke="#FEDA35" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.4554 13.1515L12 12V5.9975" stroke="#FEDA35" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        </div>
        <p className='font-kanit font-medium text-3xl'>{`${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2,"0")}`}</p>
    </div> 
    );
}