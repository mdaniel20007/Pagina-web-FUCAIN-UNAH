import Header from '../components/Header'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import Evento from '../components/Evento'
import Disciplinas from '../components/Disciplinas'
import Cronogramas from '../components/Cronogramas'
import Galeria from '../components/Galeria'
import Patrocinadores from '../components/Patrocinadores'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div id="top" className="min-h-screen overflow-x-clip">
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Evento />
        <Disciplinas />
        <Cronogramas />
        <Galeria />
        <Patrocinadores />
      </main>
      <Footer />
    </div>
  )
}
