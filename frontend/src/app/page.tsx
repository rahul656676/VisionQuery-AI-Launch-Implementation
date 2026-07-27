import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl mb-6">
          <span className="block text-blue-600">VisionQuery AI</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl mb-10">
          The ultimate SaaS platform for automated image and video analysis. Upload your media and query the insights instantly.
        </p>
        <div className="flex space-x-4">
          <Link
            href="/upload"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
          >
            View Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
