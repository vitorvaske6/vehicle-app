export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t py-8 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} VehicleTrack. Todos os direitos reservados.</p>
        <div className="mt-2 space-x-4">
          <a href="/privacy" className="hover:text-primary-500">
            Política de Privacidade
          </a>
          <a href="/terms" className="hover:text-primary-500">
            Termos de Uso
          </a>
        </div>
      </div>
    </footer>
  )
}