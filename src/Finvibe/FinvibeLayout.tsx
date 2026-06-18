import { Outlet } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import './type/index.css'

export default function FinvibeLayout() {
  return (  
    <div
      className="finvibe-app"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppHeader />
      <main className="pt-[72px] flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}
