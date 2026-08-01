import { generateBaseMetadata, siteConfig } from '@/lib/metadata'

export const metadata = generateBaseMetadata({
  title: `Contact - ${siteConfig.name}`,
  description: `Contact ${siteConfig.name} - ${siteConfig.description}`,
  openGraph: {
    title: `Contact - ${siteConfig.name}`,
    description: `Contact ${siteConfig.name} - ${siteConfig.description}`,
    url: `${siteConfig.url}/contact`,
  },
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
})

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-text-primary mb-8">Contact</h1>
      <div className="prose prose-lg max-w-none text-text-primary dark:prose-invert">
        <p className="mb-4">
          If you have any questions, suggestions, or feedback, please reach out to us.
        </p>
        <p className="mb-4">
          Email: <a href="mailto:jtly2050@gmail.com" className="text-accent hover:text-accent-hover">
            jtly2050@gmail.com
          </a>
        </p>
        <p className="mb-4 text-sm text-text-secondary">
          We typically respond within 24-48 hours.
        </p>
      </div>
    </div>
  )
}

