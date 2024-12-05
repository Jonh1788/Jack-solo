export default function UltimosJogos({rodada, vencedor, chance, premio, hash, image}){

    return(
        <div className="w-full bg-backgroundnav h-16 flex gap-3 items-center px-3 py-4">
            <div>
                <img src={image || "/image.png"} alt="" className="size-12"/>
            </div>

            <div>
                <h1 className="text-textcard font-karin text-sm"> <span className="text-bluecard">{vencedor}</span> ganhou a rodada <span className="text-bluecard">{rodada}</span> com <span className="text-bluecard">{chance.toFixed(2)}%</span> de chance e o prêmio de R${premio.toFixed(2)}</h1>
                <p className="text-muted text-sm">Hash: {hash}</p>
            </div>
        </div>
    )
}
