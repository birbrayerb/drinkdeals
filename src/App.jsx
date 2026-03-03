import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Home from './pages/Home'
import StatePage from './pages/StatePage'
import CityPage from './pages/CityPage'
import BarPage from './pages/BarPage'
import Layout from './components/Layout'

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:stateSlug" element={<StatePage />} />
            <Route path="/:stateSlug/:citySlug" element={<CityPage />} />
            <Route path="/:stateSlug/:citySlug/:barSlug" element={<BarPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  )
}
