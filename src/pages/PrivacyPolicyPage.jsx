import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './LegalPage.css'

export default function PrivacyPolicyPage() {
    useEffect(() => { window.scrollTo(0, 0) }, [])

    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-page__header animate-fade-in-up">
                    <Link to="/" className="tryon__back" style={{ marginBottom: 'var(--space-md)', display: 'inline-flex' }}>
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <p className="section-label">Legal</p>
                    <h1 className="section-title">Privacy Policy</h1>
                    <p className="legal-page__updated">Last updated: February 18, 2026</p>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <section className="legal-page__section">
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to Peer Jewelry ("we," "our," or "us"). We are committed to protecting your
                            privacy and being transparent about how we handle your information. This Privacy Policy
                            explains what data we collect, how we use it, and your rights regarding your personal
                            information when you use our jewelry catalog and virtual try-on platform.
                        </p>
                        <div className="legal-page__highlight">
                            <p>
                                <strong>Important:</strong> Peer Jewelry is a catalog and inquiry platform — we do not
                                process any online payments or transactions. All purchases are handled directly between
                                you and our team after you submit a product inquiry.
                            </p>
                        </div>
                    </section>

                    <section className="legal-page__section">
                        <h2>2. Information We Collect</h2>

                        <h3>2.1 Information You Provide</h3>
                        <p>When you submit a product inquiry through our request system, we collect:</p>
                        <ul>
                            <li>Your name</li>
                            <li>Email address</li>
                            <li>Phone number (optional)</li>
                            <li>The jewelry items you've selected (product names, quantities)</li>
                        </ul>

                        <h3>2.2 Wishlist & Cart Data</h3>
                        <p>
                            Your wishlist selections and cart items are stored locally on your device using your
                            browser's localStorage. This data never leaves your device unless you explicitly submit
                            a product inquiry. We do not track or monitor your browsing behavior, wishlist choices,
                            or cart contents on our servers.
                        </p>

                        <h3>2.3 AI Virtual Try-On Images</h3>
                        <p>
                            When you use our AI Virtual Try-On feature, you may upload photos of yourself. These
                            images are:
                        </p>
                        <ul>
                            <li>Processed entirely on the client side (your browser) and via the Google Gemini API</li>
                            <li>Sent directly from your browser to Google's Gemini API servers for AI processing</li>
                            <li>Never stored, saved, or transmitted to Peer Jewelry's own servers</li>
                            <li>Not used for any purpose other than generating the try-on preview</li>
                        </ul>
                    </section>

                    <section className="legal-page__section">
                        <h2>3. AI Technology — Google Gemini API</h2>
                        <p>
                            Our virtual try-on feature is powered by Google's Gemini API (gemini-2.0-flash-exp model).
                            Here's how it works:
                        </p>
                        <ul>
                            <li>
                                <strong>What it does:</strong> The AI takes your uploaded photo and the jewelry product
                                image to generate a realistic preview of how the jewelry would look on you.
                            </li>
                            <li>
                                <strong>Data flow:</strong> Your photo is sent directly from your browser to Google's
                                servers via their API. We act as an intermediary only in providing the API integration —
                                your images do not pass through our servers.
                            </li>
                            <li>
                                <strong>API Key:</strong> The Gemini API key is stored only in your browser's
                                localStorage and is never transmitted to our servers.
                            </li>
                            <li>
                                <strong>Google's Privacy:</strong> Images processed via the Gemini API are subject to
                                Google's own privacy policies. We encourage you to review Google's AI data practices
                                at <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.
                            </li>
                        </ul>
                    </section>

                    <section className="legal-page__section">
                        <h2>4. How We Use Your Information</h2>
                        <p>The information you provide through product inquiries is used exclusively to:</p>
                        <ul>
                            <li>Process your jewelry inquiry and understand your product interests</li>
                            <li>Have our team contact you directly to discuss pricing, availability, and purchase details</li>
                            <li>Improve our product catalog and customer experience</li>
                        </ul>
                        <p>We do <strong>not</strong>:</p>
                        <ul>
                            <li>Sell your personal information to third parties</li>
                            <li>Use your data for advertising or marketing without your consent</li>
                            <li>Process any payment or financial information through our platform</li>
                            <li>Store or retain the photos you upload for virtual try-on</li>
                        </ul>
                    </section>

                    <section className="legal-page__section">
                        <h2>5. Data Storage & Security</h2>
                        <h3>5.1 Local Storage</h3>
                        <p>
                            We use your browser's localStorage to store your preferences, cart items, and wishlist.
                            This data remains on your device and can be cleared at any time by clearing your browser data.
                        </p>
                        <h3>5.2 Inquiry Data</h3>
                        <p>
                            Product inquiries are stored locally in your browser for the admin dashboard functionality.
                            In a production environment, this data would be securely stored on encrypted servers with
                            appropriate access controls.
                        </p>
                    </section>

                    <section className="legal-page__section">
                        <h2>6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access the personal information we hold about you</li>
                            <li>Request correction of any inaccurate information</li>
                            <li>Request deletion of your data</li>
                            <li>Clear all locally stored data by clearing your browser's storage</li>
                            <li>Opt out of providing photos for the virtual try-on feature at any time</li>
                        </ul>
                    </section>

                    <section className="legal-page__section">
                        <h2>7. Cookies & Tracking</h2>
                        <p>
                            Peer Jewelry does not use cookies, tracking pixels, or any third-party analytics services.
                            All data storage is done through the browser's localStorage API, which is entirely under
                            your control.
                        </p>
                    </section>

                    <section className="legal-page__section">
                        <h2>8. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. Any changes will be reflected on this page
                            with an updated "Last updated" date. We encourage you to review this policy periodically.
                        </p>
                    </section>

                    <div className="legal-page__contact">
                        <h2>Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy or our data practices,
                            please contact us at <a href="mailto:privacy@peerjewelry.com">privacy@peerjewelry.com</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
