import NavInicio from '../components/inicio/NavInicio'
import HeroInicio from '../components/inicio/HeroInicio'
import FooterInicio from '../components/inicio/FooterInicio'
import { Contadores, GaleriaSlider, Inscripcion, LogoVitrina, Participantes, Programacion, Universidades } from '../components/inicio/Secciones'
import { Wave } from '../components/inicio/fx'
import { usePageTheme } from '../components/inicio/usePageTheme'
import { inicio } from '../data/inicio'

export default function Home() {
  usePageTheme('#FFFFFF', 'FUCAIN 2026 · UNAH')
  return (
    <div className="fc-page min-h-screen overflow-x-clip">
      <NavInicio />
      <main>
        <HeroInicio />
        <Programacion />
        <Wave fill="#FFFFFF" d="M0,40 C200,4 380,70 620,52 C860,34 1000,2 1200,24 C1320,38 1390,56 1440,50 L1440,90 L0,90 Z" />
        <Contadores />
        <Wave fill="#FFFFFF" d="M0,50 C220,14 420,80 680,56 C900,36 1080,8 1260,30 C1350,42 1400,58 1440,52 L1440,90 L0,90 Z" />
        <GaleriaSlider />
        <LogoVitrina />
        <Participantes />
        <Wave fill="#85328A" d="M0,46 C240,8 460,76 720,54 C980,32 1160,4 1440,38 L1440,90 L0,90 Z" />
        <Inscripcion fechaLimite={inicio.fechaLimite} />
        <Wave bg="#85328A" fill="#FFFFFF" d="M0,30 C200,70 420,10 680,38 C900,62 1120,80 1300,48 C1380,34 1420,32 1440,36 L1440,90 L0,90 Z" />
        <Universidades />
      </main>
      <FooterInicio />
    </div>
  )
}
