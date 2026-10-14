import { Route, Routes } from 'react-router'
import { MotionConfig } from 'framer-motion'
import Home from './pages/Home'
import GaleriaPage from './pages/GaleriaPage'
import ScrollManager from './components/ScrollManager'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/galeria" element={<GaleriaPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </MotionConfig>
  )
}
