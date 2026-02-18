import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './LegalPage.css'

export default function TermsPage() {
    useEffect(() => { window.scrollTo(0, 0) }, [])

    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-page__header animate-fade-in-up">
                    <Link to="/" className="tryon__back" style={{ marginBottom: 'var(--space-md)', display: 'inline-flex' }}>
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <p className="section-label">Legal</p>
                    <h1 className="section-title">Terms & Conditions</h1>
                    <p className="legal-page__updated">Last updated: February 18, 2026</p>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <section className="legal-page__section">
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using the Peer Jewelry platform ("Service"), you agree to be bound
                            by these Terms and Conditions. If you do not agree with any part of these terms, please
                            do not use our Service.
                        </p>
                    </section>

                    <section className="legal-page__section">
                        <h2>2. Nature of Service — Inquiry Platform</h2>
                        <div className="legal-page__highlight">
                            <p>
                                <strong>Important:</strong> Peer Jewelry is a product catalog and inquiry platform.
                                We do <strong>not</strong> facilitate online purchases, process payments, or conduct
                                e-commerce transactions through this website.
                            </p>
                        </div>
                        <p>Our platform allows you to:</p>
                        <ul>
                            <li>Browse our curated jewelry collections and view product details</li>
                            <li>See indicative pricing for each piece</li>
                            <li>Add items to a wishlist for later reference</li>
                            <li>Add items to a request cart and submit an inquiry</li>
                            <li>Use AI-powered virtual try-on to preview jewelry on yourself</li>
                        </ul>
                        <p>
                            When you submit a request, our team will review your selections and contact you directly
                            to discuss availability, final pricing, customization options, and arrange the purchase
                            through our secure, personal sales process.
                        </p>
                    </section>

                    <section className="legal-page__section">
                        <h2>3. Pricing & Availability</h2>
                        <ul>
                            <li>
                                All prices displayed on the platform are <strong>indicative</strong> and subject to
                                change based on current market conditions, material costs, and customization options.
                            </li>
                            <li>
                                Final pricing will be confirmed by our sales team when they contact you regarding
                                your inquiry.
                            </li>
                            <li>
                                Product availability is not guaranteed until confirmed by our team during the
                                personal consultation.
                            </li>
                            <li>
                                Discounts shown are based on original listed prices and may not reflect final
                                negotiated pricing.
                            </li>
                        </ul>
                    </section>

                    <section className="legal-page__section">
                        <h2>4. Product Inquiries & Requests</h2>
                        <p>
                            By submitting a product inquiry, you are expressing interest in one or more jewelry pieces.
                            A request does <strong>not</strong> constitute a purchase order, binding contract, or
                            commitment to buy. You may cancel or modify your inquiry at any time before our team
                            contacts you.
                        </p>
                        <p>
                            When you submit a request, you agree to provide accurate contact information (name and
                            email) so that our team can reach you to discuss your selections.
                        </p>
                    </section>

                    <section className="legal-page__section">
                        <h2>5. AI Virtual Try-On Feature</h2>
                        <h3>5.1 Technology</h3>
                        <p>
                            Our virtual try-on feature uses Google's Gemini API, an artificial intelligence model,
                            to generate previews of how jewelry may look on you. By using this feature, you acknowledge:
                        </p>
                        <ul>
                            <li>
                                The generated images are <strong>approximations</strong> and may not perfectly represent
                                how the actual jewelry will look when worn.
                            </li>
                            <li>
                                Results depend on image quality, lighting conditions, and the AI model's capabilities.
                            </li>
                            <li>
                                Virtual try-on previews should not be the sole basis for purchasing decisions.
                            </li>
                        </ul>

                        <h3>5.2 Your Photos</h3>
                        <p>
                            Photos uploaded for virtual try-on are processed directly through Google's Gemini API.
                            We do not store, save, or retain any photos you upload. You are responsible for ensuring
                            that any photos you upload are of yourself or that you have the right to use them.
                        </p>

                        <h3>5.3 AI Limitations</h3>
                        <p>
                            AI-generated imagery may contain inaccuracies or artifacts. We do not guarantee the
                            accuracy, quality, or fitness for any particular purpose of the AI-generated try-on images.
                        </p>
                    </section>

                    <section className="legal-page__section">
                        <h2>6. Intellectual Property</h2>
                        <p>
                            All content on the Peer Jewelry platform — including product images, designs, text,
                            logos, and the "Peer Jewelry" brand — is our intellectual property or used with permission.
                            You may not:
                        </p>
                        <ul>
                            <li>Reproduce, distribute, or commercially use any content from this platform</li>
                            <li>Use our product images for purposes other than personal reference</li>
                            <li>Modify, reverse-engineer, or create derivative works from our platform</li>
                        </ul>
                    </section>

                    <section className="legal-page__section">
                        <h2>7. User Responsibilities</h2>
                        <p>You agree to:</p>
                        <ul>
                            <li>Provide accurate and truthful information when submitting inquiries</li>
                            <li>Use the platform for lawful purposes only</li>
                            <li>Not attempt to interfere with the platform's operation or security</li>
                            <li>Not misuse the AI virtual try-on feature for inappropriate or harmful purposes</li>
                        </ul>
                    </section>

                    <section className="legal-page__section">
                        <h2>8. Limitation of Liability</h2>
                        <p>
                            Peer Jewelry provides this platform "as is" without warranties of any kind, either
                            expressed or implied. We shall not be liable for:
                        </p>
                        <ul>
                            <li>Any inaccuracies in product descriptions, pricing, or AI-generated images</li>
                            <li>Loss of locally stored data (wishlist, cart items, preferences)</li>
                            <li>Issues arising from third-party services (Google Gemini API)</li>
                            <li>Any damages resulting from the use or inability to use the platform</li>
                        </ul>
                    </section>

                    <section className="legal-page__section">
                        <h2>9. Modifications to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms and Conditions at any time. Changes will be
                            posted on this page with an updated date. Continued use of the platform after changes
                            constitutes acceptance of the revised terms.
                        </p>
                    </section>

                    <section className="legal-page__section">
                        <h2>10. Governing Law</h2>
                        <p>
                            These Terms and Conditions shall be governed by and construed in accordance with applicable
                            local laws. Any disputes arising from the use of this platform shall be resolved through
                            appropriate legal channels.
                        </p>
                    </section>

                    <div className="legal-page__contact">
                        <h2>Questions?</h2>
                        <p>
                            If you have any questions about these Terms and Conditions, please reach out to us
                            at <a href="mailto:legal@peerjewelry.com">legal@peerjewelry.com</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
