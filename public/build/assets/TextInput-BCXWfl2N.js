import{j as u,r as n}from"./app-6WYRBuS4.js";function f({message:t,className:r="",...e}){return t?u.jsx("p",{...e,className:"text-sm text-red-600 "+r,children:t}):null}const p=n.forwardRef(function({type:r="text",className:e="",isFocused:a=!1,...x},s){const o=s||n.useRef();return n.useEffect(()=>{a&&o.current.focus()},[]),u.jsx("input",{...x,type:r,className:"border-none focus:ring-transparent text-textcard bg-background1 text-sm h-12 w-[480px]  rounded-md shadow-sm "+e,ref:o})});export{f as I,p as T};
