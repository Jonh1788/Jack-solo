import{j as e,r as c,W as j,Y as w,a as b}from"./app-6WYRBuS4.js";import{T as n,I as l}from"./TextInput-BCXWfl2N.js";import{P as v}from"./PrimaryButton-D6FsULqo.js";import{M as N,P as d,E as u}from"./EyeIcon-CY7iFXY_.js";function k({className:r=""}){return e.jsxs("svg",{className:"text-[#848783] "+r,xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round",children:[e.jsx("path",{d:"M18 20a6 6 0 0 0-12 0"}),e.jsx("circle",{cx:"12",cy:"10",r:"4"}),e.jsx("circle",{cx:"12",cy:"12",r:"10"})]})}function D(){const r=c.useRef(null),i=c.useRef(null),{data:a,setData:t,post:m,processing:x,errors:o,reset:p}=j({name:"",email:"",password:"",password_confirmation:""});c.useEffect(()=>()=>{p("password","password_confirmation")},[]);const f=s=>{s.preventDefault(),m(route("register"))},g=()=>{r.current.type=r.current.type==="password"?"text":"password"},h=()=>{i.current.type=i.current.type==="password"?"text":"password"};return e.jsxs("main",{className:"flex min-h-screen relative z-10",children:[e.jsx("div",{className:" absolute inset-0 w-full h-full -z-10 bg-[#1B1D24]",children:e.jsx("img",{src:"/banner.jpeg",alt:"",className:"size-full object-fill mix-blend-luminosity"})}),e.jsx(w,{title:"Register"}),e.jsxs("div",{className:"w-full bg-backgroundnav flex flex-col",children:[e.jsx("div",{children:e.jsx("img",{src:"logo-jack2.png",alt:"",className:"w-32 ml-4 mt-4"})}),e.jsxs("div",{className:"flex-col flex w-full h-full px-28 mt-12 gap-8",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-kanit text-textcard font-bold",children:"Obrigado pelo interesse de efetuar seu cadastro."}),e.jsx("p",{className:"text-muted text-xs",children:"Preencha os dados corretamente e comece a ganhar dinheiro"})]}),e.jsxs("form",{onSubmit:f,className:"flex flex-col gap-2",children:[e.jsxs("div",{className:"flex items-center has-[input:focus]:[&_svg]:text-indigo-500 bg-background1 rounded-md px-2 has-[input:focus]:ring has-[input:focus]:border-border has-[input:focus]:ring-border",children:[e.jsx(k,{className:"peer-focus:text-red-800"}),e.jsx(n,{id:"name",name:"name",value:a.name,className:"block w-full peer",autoComplete:"name",isFocused:!0,onChange:s=>t("name",s.target.value),required:!0,placeholder:"Digite um nome de usuario..."}),e.jsx(l,{message:o.name,className:"mt-2"})]}),e.jsxs("div",{className:"flex items-center  bg-background1 rounded-md px-2 has-[input:focus]:ring has-[input:focus]:border-border has-[input:focus]:ring-border",children:[e.jsx(N,{}),e.jsx(n,{id:"email",type:"email",name:"email",value:a.email,className:" block w-full",autoComplete:"username",onChange:s=>t("email",s.target.value),required:!0,placeholder:"Digite um email..."}),e.jsx(l,{message:o.email,className:"mt-2"})]}),e.jsxs("div",{className:"flex items-center bg-background1 rounded-md px-2 has-[input:focus]:ring has-[input:focus]:border-border has-[input:focus]:ring-border",children:[e.jsx(d,{}),e.jsx(n,{id:"password",type:"password",name:"password",value:a.password,className:"block w-full",autoComplete:"new-password",onChange:s=>t("password",s.target.value),required:!0,placeholder:"Digite uma senha...",ref:r}),e.jsx(u,{onClick:g}),e.jsx(l,{message:o.password,className:"mt-2"})]}),e.jsxs("div",{className:"flex items-center bg-background1 rounded-md px-2 has-[input:focus]:ring has-[input:focus]:border-border has-[input:focus]:ring-border",children:[e.jsx(d,{}),e.jsx(n,{id:"password_confirmation",type:"password",name:"password_confirmation",value:a.password_confirmation,className:" block w-full",autoComplete:"new-password",onChange:s=>t("password_confirmation",s.target.value),required:!0,placeholder:"Confirme a senha...",ref:i}),e.jsx(u,{onClick:h}),e.jsx(l,{message:o.password_confirmation,className:"mt-2"})]}),e.jsx("div",{className:"flex items-center w-full justify-end mt-4",children:e.jsx(v,{className:"w-full h-12 flex items-center justify-center font-extrabold bg-bluecard drop-shadow-card border-b-4 border-borderbutton",disabled:x,children:"Cadastrar"})}),e.jsxs("div",{className:"flex text-xs text-center text-textcard w-full items-center justify-center gap-2",children:[e.jsx("p",{children:"Já possui cadastro?"}),e.jsx(b,{href:route("login"),className:"text-bluecard underline",children:"Fazer login"})]})]})]})]}),e.jsx("div",{className:"w-full bg-black/55 flex items-center justify-center",children:e.jsx("img",{src:"cadastro.png",alt:"",className:"h-screen"})})]})}export{D as default};