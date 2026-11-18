import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { PinLayer } from './components/Pin'
import { CheckoutSheet } from './components/commerce'
import { SvgDefs } from './components/SvgDefs'
import Home from './pages/Home'

const FromVideo = lazy(() => import('./pages/FromVideo'))
const Campaigns = lazy(() => import('./pages/Campaigns'))
const CampaignPage = lazy(() => import('./pages/CampaignPage'))
const Quests = lazy(() => import('./pages/Quests'))
const QuestPage = lazy(() => import('./pages/QuestPage'))
const Packs = lazy(() => import('./pages/Packs'))
const PackPage = lazy(() => import('./pages/PackPage'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Learn = lazy(() => import('./pages/Learn'))
const Realm = lazy(() => import('./pages/Realm'))
const Leave = lazy(() => import('./pages/Leave'))
const Concept = lazy(() => import('./pages/Concept'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageFallback() {
  return (
    <div className="wrap py-16" aria-busy="true">
      <div className="h-8 w-48 animate-pulse rounded bg-raised" />
      <div className="mt-4 h-4 w-72 max-w-full animate-pulse rounded bg-raised" />
    </div>
  )
}

export function App() {
  return (
    <>
      <SvgDefs />
      <Layout>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/from/:slug" element={<FromVideo />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:slug" element={<CampaignPage />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/quests/:slug" element={<QuestPage />} />
            <Route path="/packs" element={<Packs />} />
            <Route path="/packs/:slug" element={<PackPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/learn/:quest/:lesson" element={<Learn />} />
            <Route path="/realm" element={<Realm />} />
            <Route path="/realm/leave" element={<Leave />} />
            <Route path="/concept" element={<Concept />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
      <PinLayer />
      <CheckoutSheet />
    </>
  )
}
