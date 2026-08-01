import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-text-muted">404</h1>
        </div>
        <h2 className="text-4xl font-bold text-text-primary mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-text-secondary mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/all-tools"
            className="px-6 py-3 border-2 border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors"
          >
            Browse All Tools
          </Link>
        </div>
      </div>
    </div>
  )
}

