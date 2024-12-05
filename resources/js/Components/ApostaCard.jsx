import { useState } from "react";
export default function ApostaCard ({name, total, percentual, rgba, image}){
    console.log(total)
    function rgbToHex(rgb) {
        // Extrai os valores de R, G e B da string
        const [r, g, b] = rgb.match(/\d+/g).map(Number);
    
        // Converte os valores de R, G e B para hexadecimal
        const red = r.toString(16).padStart(2, '0');
        const green = g.toString(16).padStart(2, '0');
        const blue = b.toString(16).padStart(2, '0');
    
        // Combina os valores em uma string no formato #RRGGBB
        return `#${red}${green}${blue}`;
    }
    const [color, setColor] = useState(rgbToHex(rgba))
    
    return(
        <div className="w-full h-28 bg-backgroundnav flex flex-col p-3 gap-3 rounded-md z-10">
                <div className="flex gap-2 items-center">
                    <img src={image || "/image.png"} alt=""  className="size-8 rounded-full"/>
                    <p className={`font-kanitfont-[500] text-sm`} style={{color: color}}>{name}</p>
                </div>
                <div className={`bg-[${rgbToHex(rgba)}] size-12`}/>
                <div className="border-b border-background1 w-full"/>

                <div className="flex justify-between items-center text-left text-textcard font-kanit text-xs">
                    <div>
                        <p className="text-[14px]">R${total},00</p>
                        <p className="font-inter text-muted">({total} itens)</p>
                    </div>

                    <div>
                        <p className="text-[16px] text-bluecard font-kanit font-medium">{percentual.toFixed(2)}%</p>
                    </div>
                </div>
        </div>
    )
}