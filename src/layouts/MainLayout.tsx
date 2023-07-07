import Header from '../components/Header'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto text-white">
      <Header />
      {children}
    </div>
  )
}

export default MainLayout
