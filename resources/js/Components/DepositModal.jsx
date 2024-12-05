import axios from "axios"
import {X} from "lucide-react";
import { useRef, useState } from "react";
import { router } from "@inertiajs/react";

export default function DepositModal({user, setDepositModal}){

    var link = "/depositosuitpay"
    var nameRef = useRef()
    var lastNameRef = useRef()
    var cpfRef = useRef()
    var amountRef = useRef()
    const [qrCode, setQrCode] = useState("") 
    const [concluido, setConcluido] = useState(false)
    const [valor, setValor] = useState(0)
    const [paymentCode, setPaymentCode] = useState("")
    const [loading, setLoading] = useState(false)
    const depositar = () => {
        setValor(parseInt(amountRef.current.value))
        setLoading(true)
        axios.post(link, {
            user,
            name: nameRef.current.value,
            lastName: lastNameRef.current.value,
            amount: amountRef.current.value,
            cpf: cpfRef.current.value,
        }).then((response) => {
            console.log(response.data)
            if(response.data.idTransaction){
                setQrCode(response.data.paymentCodeBase64)
                setPaymentCode(response.data.paymentCode)

                var interval = setInterval(() => {
                    axios.post("/checkPayment", {
                        idTransaction: response.data.idTransaction
                    }).then((response) => {
                        if(response.data.status === "PAID_OUT"){
                            clearInterval(interval)
                            setQrCode(false)
                            setConcluido(true)
                            router.visit("", {
                                only: ["auth"],
                                preserveState: true,
                                preserveScroll: true
                            })
                        }
                    })
                }, 10000)
            }
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoading(false)
        })
    }

    const copiarCodigo = () => {
        navigator.clipboard.writeText(paymentCode)
    }

    return(
       <div className="fixed inset-0 bg-white/20 z-[100] flex items-center justify-center">
        {!concluido ? (
             <div className="w-[720px] h-[386px] flex">
             <img src="cadastro.png" alt="" />
             <div className="radial w-full flex flex-col"> 
                 <div className="flex justify-between w-full p-2 border-b-[0.01px] border-muted/[0.04]">
                     <h1 className="text-white text-sm">Depósito</h1>
                     <X onClick={() => setDepositModal(false)} strokeWidth={0.5} className="text-muted cursor-pointer hover:text-red-600"/>
                 </div>
                 {!qrCode ? (
                     <>
                 <div>
                      <h1 className="text-center text-lg font-kanit text-textcard pt-3">Insira as informações do pix</h1>
                 </div>

                 <div className="w-full p-2 flex flex-col gap-3">
                     <input ref={cpfRef} placeholder="Digite seu CPF" className="h-10 text-xs focus:border-border focus:ring-border placeholder:text-textcard placeholder:text-xs w-full rounded-md bg-background1 outline-none border-none text-textcard" type="text" />
                     <div className="w-full flex gap-2">
                         <input ref={nameRef} placeholder="Nome" className="h-10 text-xs focus:border-border focus:ring-border placeholder:text-textcard placeholder:text-xs w-full rounded-md bg-background1 outline-none border-none text-textcard" type="text" />
                         <input ref={lastNameRef} placeholder="Sobrenome" className="h-10 text-xs focus:border-border focus:ring-border placeholder:text-textcard placeholder:text-xs w-full rounded-md bg-background1 outline-none border-none text-textcard" type="text" />
                     </div>

                     <p className="font-kanit text-textcard text-xs">Selecione a quantia</p>
                     <div className="w-full justify-between flex gap-4">
                         <button onClick={() => amountRef.current.value = 40} className="p-2 flex-1 bg-white/[0.04] rounded-md text-textcard font-bold border border-transparent hover:border-border focus:border-border">40 BRL</button>
                         <button onClick={() => amountRef.current.value = 120} className="p-2 flex-1 bg-white/[0.04] rounded-md text-textcard font-bold border border-transparent hover:border-border focus:border-border">120 BRL</button>
                         <button onClick={() => amountRef.current.value = 240} className="p-2 flex-1 bg-white/[0.04] rounded-md text-textcard font-bold border border-transparent hover:border-border focus:border-border">240 BRL</button>
                     </div>

                     <input ref={amountRef} placeholder="Digite a quantia (BRL)" className="h-10 text-xs focus:border-border focus:ring-border placeholder:text-textcard placeholder:text-xs w-full rounded-md bg-background1 outline-none border-none text-textcard" type="text" />

                     <div className="flex w-full font-kanit text-textcard gap-4">
                         <button onClick={() => setDepositModal(false)} className="p-2 flex-1 bg-white/[.04] rounded-md border border-white hover:border-border">Voltar</button>
                         <button onClick={depositar} className="flex-1 bg-backbutton border-b-2 border-borderbutton rounded-md" >{loading ? "Aguarde..." : "Depositar"}</button>
                     </div>
                 </div>
                 </>
                 ): (
                     <div className="flex flex-col w-full text-center items-center justify-center pt-4 font-kanit text-textcard">
                         <h1>R${valor.toFixed(2)}</h1>
                         <img src={`data:image/png;base64, ${qrCode}`} alt="" className="size-40 mt-2 filter invert contrast-200 mix-blend-screen"/>
                         <div className="flex flex-col gap-3 mt-2">
                             <p className="text-muted text-xs">1. Leia o QRCode com o aplicativo Pix.</p>
                             <p className="text-muted text-xs">2. Conclua o depósito com o seu banco.</p>
                             <p className="text-muted text-xs">3. Aguarde nesta página até o valor ser creditado.</p>
                             <p onClick={copiarCodigo} className="text-muted text-xs hover:text-border cursor-pointer">4. Se preferir, clique aqui para copiar o código.</p>
                         </div>
                     </div>
                 )}
             </div>
         </div>
        ) : 
        (
            <div className="w-[480px] h-[386px] flex flex-col items-center text-center font-kanit text-textcard radial">
                   <div className="flex justify-between w-full p-2 border-b-[0.01px] border-muted/[0.04]">
                     <h1 className="text-white text-sm font-kanit">Sucesso</h1>
                     <X onClick={() => setDepositModal(false)} strokeWidth={0.5} className="text-muted cursor-pointer hover:text-red-600"/>
                 </div>

                 <div className="size-52 rounded-full bg-backgroundnav mt-4">

                 </div>

                 <div className="mt-2">
                    <h1>Depósito concluido com sucesso!</h1>
                    <p className="font-inter text-muted text-xs"> Parabéns, em instantes o valor estará disponível em seu saldo.</p>
                 </div>

                 <button onClick={() => setDepositModal(false)} className="h-12 mt-3 w-32 bg-backbutton border-b-2 border-borderbutton rounded-md" >Finalizar</button>
            </div> 
        )}
           
             
       </div>
    )
}