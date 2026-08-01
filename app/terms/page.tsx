import { generateBaseMetadata, siteConfig } from '@/lib/metadata'

export const metadata = generateBaseMetadata({
  title: `Terms of Service - ${siteConfig.name}`,
  description: `Terms of Service for ${siteConfig.name} - ${siteConfig.description}`,
  openGraph: {
    title: `Terms of Service - ${siteConfig.name}`,
    description: `Terms of Service for ${siteConfig.name}`,
    url: `${siteConfig.url}/terms`,
  },
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
})

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-text-primary mb-8">Terms of Service</h1>
      <div className="prose prose-lg max-w-none text-text-primary dark:prose-invert">
        <p className="mb-4">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using MaxTool ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">2. Use of Service</h2>
        <p className="mb-4">
          MaxTool provides free online tools for various tasks. You may use our Service for personal or commercial purposes, subject to the following conditions:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>You must be at least 13 years old to use our Service</li>
          <li>You agree not to use the Service for any illegal or unauthorized purpose</li>
          <li>You agree not to attempt to gain unauthorized access to any part of the Service</li>
          <li>You agree not to interfere with or disrupt the Service or servers connected to the Service</li>
        </ul>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">3. Disclaimer of Warranties</h2>
        <p className="mb-4">
          <strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</strong> We disclaim all warranties, including but not limited to:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Warranties of merchantability</li>
          <li>Warranties of fitness for a particular purpose</li>
          <li>Warranties of non-infringement</li>
          <li>Warranties that the Service will be uninterrupted, secure, or error-free</li>
        </ul>
        <p className="mb-4">
          We do not guarantee the accuracy, reliability, or completeness of any tool results. You use the Service at your own risk.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">4. Limitation of Liability</h2>
        <p className="mb-4">
          <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:</strong>
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Your use or inability to use the Service</li>
          <li>Any errors or omissions in the Service</li>
          <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
          <li>Any interruption or cessation of transmission to or from the Service</li>
          <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the Service</li>
        </ul>
        <p className="mb-4">
          Our total liability for any claims arising from or related to the Service shall not exceed the amount you paid us (if any) in the 12 months preceding the claim, or $0 if you used the Service for free.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">5. Accuracy of Results</h2>
        <p className="mb-4">
          We do not guarantee the accuracy, reliability, or completeness of any tool results. The tools are provided for informational and convenience purposes only. You should verify important information independently and not rely solely on our tools for critical decisions.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">6. Intellectual Property</h2>
        <p className="mb-4">
          The Service, including its original content, features, and functionality, is owned by MaxTool and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </p>
        <p className="mb-4">
          You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise exploit any part of the Service without our prior written permission.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">7. User Content</h2>
        <p className="mb-4">
          Some tools may allow you to input or upload content. You retain ownership of any content you provide. By using the Service, you grant us a non-exclusive, worldwide, royalty-free license to use, store, and process your content solely for the purpose of providing the Service.
        </p>
        <p className="mb-4">
          You are solely responsible for your content and warrant that you have all necessary rights to provide such content.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">8. Prohibited Uses</h2>
        <p className="mb-4">
          You agree not to use the Service:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
          <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
          <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
          <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
          <li>To submit false or misleading information</li>
          <li>To upload or transmit viruses or any other type of malicious code</li>
          <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
        </ul>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">9. Service Availability</h2>
        <p className="mb-4">
          We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">10. Termination</h2>
        <p className="mb-4">
          We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms of Service.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">11. Governing Law</h2>
        <p className="mb-4">
          These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">12. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify or replace these Terms of Service at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">13. Contact Information</h2>
        <p className="mb-4">
          If you have any questions about these Terms of Service, please contact us at:
        </p>
        <p className="mb-4">
          Email: <a href="mailto:jtly2050@gmail.com" className="text-accent hover:text-accent-hover hover:underline">jtly2050@gmail.com</a>
        </p>
      </div>
    </div>
  )
}

