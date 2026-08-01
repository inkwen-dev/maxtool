import { generateBaseMetadata, siteConfig } from '@/lib/metadata'

export const metadata = generateBaseMetadata({
  title: `Privacy Policy - ${siteConfig.name}`,
  description: `Privacy Policy for ${siteConfig.name} - ${siteConfig.description}`,
  openGraph: {
    title: `Privacy Policy - ${siteConfig.name}`,
    description: `Privacy Policy for ${siteConfig.name}`,
    url: `${siteConfig.url}/privacy`,
  },
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
})

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-text-primary mb-8">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none text-text-primary dark:prose-invert">
        <p className="mb-4">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">1. Introduction</h2>
        <p className="mb-4">
          MaxTool ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our website.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">2. Data Collection</h2>
        <p className="mb-4">
          We collect minimal anonymous usage statistics to improve our services. Specifically, we collect:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Tool usage statistics (which tools are used, when they are used)</li>
          <li>This data is completely anonymous and cannot be used to identify individual users</li>
          <li>We do not collect any personal information such as names, email addresses, or IP addresses</li>
          <li>We do not track individual users across sessions</li>
        </ul>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">3. Purpose of Data Collection</h2>
        <p className="mb-4">
          We collect usage statistics solely for the following purposes:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>To understand which tools are most popular and useful</li>
          <li>To improve our services and user experience</li>
          <li>To identify and fix technical issues</li>
        </ul>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">4. Data Storage</h2>
        <p className="mb-4">
          Your data is stored securely using the following services:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Supabase</strong>: Database hosting (PostgreSQL). Server location depends on your Supabase project region selection.</li>
          <li><strong>Vercel</strong>: Website hosting and analytics. Data is processed globally through Vercel's CDN network.</li>
        </ul>
        <p className="mb-4">
          We do not share your data with any third parties except as necessary to provide our services (hosting and analytics).
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">5. Data Retention</h2>
        <p className="mb-4">
          We retain anonymous usage statistics indefinitely to track long-term trends. Since this data is anonymous and cannot identify individuals, it poses no privacy risk.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">6. Your Rights</h2>
        <p className="mb-4">
          Under GDPR and other privacy laws, you have the following rights:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Right to Access</strong>: You can request information about what data we have collected (though we only collect anonymous statistics).</li>
          <li><strong>Right to Deletion</strong>: Since we don't collect personal information, there is no personal data to delete. However, if you have concerns, please contact us.</li>
          <li><strong>Right to Object</strong>: You can object to our data processing. However, since we only collect anonymous statistics, this may not be applicable.</li>
        </ul>
        <p className="mb-4">
          To exercise these rights, please contact us at <a href="mailto:jtly2050@gmail.com" className="text-accent hover:text-accent-hover hover:underline">jtly2050@gmail.com</a>.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">7. Cookies and Local Storage</h2>
        <p className="mb-4">
          We use local storage (not cookies) to save your preferences, such as:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Theme preference (light/dark mode)</li>
          <li>Tool-specific settings (saved locally in your browser)</li>
        </ul>
        <p className="mb-4">
          We do not use cookies for tracking. We use Vercel Analytics, which is privacy-friendly and does not require cookies.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">8. Third-Party Services</h2>
        <p className="mb-4">
          We use the following third-party services:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Vercel</strong>: Website hosting, CDN, and analytics. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover hover:underline">Privacy Policy</a></li>
          <li><strong>Supabase</strong>: Database hosting. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover hover:underline">Privacy Policy</a></li>
        </ul>
        <p className="mb-4">
          These services are necessary to provide our website functionality. They process data according to their own privacy policies.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">9. Children's Privacy</h2>
        <p className="mb-4">
          Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">10. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">11. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="mb-4">
          Email: <a href="mailto:jtly2050@gmail.com" className="text-accent hover:text-accent-hover hover:underline">jtly2050@gmail.com</a>
        </p>
      </div>
    </div>
  )
}

