import { ReactNode } from "react"



//componente para alinhar o conteudo da pagina com o header
export function Container( {children}: {children:ReactNode}) {
    return(
        <div className="w-full max-w-7xl mx-auto px-2">
        {children}
        </div>
    )
}