export default function Footer(): React.JSX.Element {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-300">
            © 2024 Cricket Scoring App. Built with Next.js and NestJS.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Real-time cricket scoring and commentary platform
          </p>
        </div>
      </div>
    </footer>
  );
}
