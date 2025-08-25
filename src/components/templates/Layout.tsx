interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header 
        className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40"
        role="banner"
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-center items-center h-14 sm:h-16">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center leading-tight">
              Programming Language Voting
            </h1>
          </div>
        </div>
      </header>

      <main 
        className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8"
        role="main"
        id="main-content"
      >
        {children}
      </main>

      <footer 
        className="bg-white border-t border-gray-200 mt-4"
        role="contentinfo"
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-center items-center h-12 sm:h-16">
            <p className="text-xs sm:text-sm text-gray-500 text-center">
              Vote for your favorite programming language
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}