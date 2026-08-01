import { generateBaseMetadata, siteConfig } from '@/lib/metadata'

export const metadata = generateBaseMetadata({
  title: `About - ${siteConfig.name}`,
  description: `About ${siteConfig.name} - ${siteConfig.description}`,
  openGraph: {
    title: `About - ${siteConfig.name}`,
    description: `About ${siteConfig.name} - ${siteConfig.description}`,
    url: `${siteConfig.url}/about`,
  },
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
})

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-text-primary mb-8">About</h1>
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p className="text-text-secondary mb-4">
          MaxTool is a collection of free, simple, and fast online tools 
          for everyday tasks. Our mission is to provide useful tools that anyone can 
          use without registration or payment.
        </p>
        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">Features</h2>
        <ul className="list-disc list-inside text-text-secondary space-y-2">
          <li>20+ free tools for various tasks</li>
          <li>No registration required</li>
          <li>Fast and simple interface</li>
          <li>Privacy-first approach</li>
          <li>Mobile-friendly design</li>
        </ul>
        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">Contact</h2>
        <p className="text-text-secondary">
          If you have any questions or suggestions, please{' '}
          <a href="/contact" className="text-accent hover:text-accent-hover">
            contact us
          </a>.
        </p>
      </div>
    </div>
  )
}

