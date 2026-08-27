"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSofiaPanel } from "../context/SofiaPanelContext";

// SofiaPanelHost se monta en TODAS las rutas (vive en el layout raíz), pero
// el panel empieza cerrado. Cargamos SofiaAssistant en un chunk aparte para
// no sumar su peso al JS inicial de cada página — solo se descarga cuando
// el usuario realmente abre el panel por primera vez.
const SofiaAssistant = dynamic(() => import("./SofiaAssistant"), { ssr: false });

export default function SofiaPanelHost() {
  const { isOpen, close } = useSofiaPanel();
  // Una vez abierto, lo mantenemos montado (aunque se cierre) para no
  // perder la conversación ni volver a mostrar el estado de carga.
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  return (
    <>
      {/* Backdrop — cierra el panel al hacer click fuera (solo en pantallas angostas) */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-[70] bg-slate-950/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel flotante */}
      <div
        className={`fixed right-4 top-4 bottom-4 z-[80] w-[calc(100%-2rem)] max-w-sm transition-all duration-300 ease-out ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-6 opacity-0"
        }`}
      >
        {hasOpened && <SofiaAssistant onClose={close} />}
      </div>
    </>
  );
}
