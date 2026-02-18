import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './LegalPage.css'

export default function AccessibilityPage() {
    useEffect(() => { window.scrollTo(0, 0) }, [])

    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-page__header animate-fade-in-up">
                    <Link to="/" className="tryon__back" style={{ marginBottom: 'var(--space-md)', display: 'inline-flex' }}>
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <p className="section-label">Commitment</p>
                    <h1 className="section-title">Accessibility Statement</h1>
                    <p className="legal-page__updated">Last updated: February 18, 2026</p>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <section className="legal-page__section">
                        <h2>Our Commitment</h2>
                        <p>
                            Peer Jewelry is committed to ensuring digital accessibility for people of all abilities.
                            We strive to continually improve the user experience for everyone, and apply relevant
                            accessibility standards to make our jewelry catalog and virtual try-on platform usable
                            by the widest possible audience.
                        </p>
                    </section>

                    <section className="legal-page__section">
                        <h2>Conformance Goals</h2>
                        <p>
                            We aim to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>.
                            These guidelines explain how to make web content more accessible for people with disabilities
                            and more user-friendly for all users.
                        </p>
                    </section>

                    <section className="legal-page__section">
                        <h2>Accessibility Features</h2>

                        <h3>Navigation & Interaction</h3>
                        <ul>
                            <li>Full keyboard navigation support throughout the catalog and all pages</li>
                            <li>Clear focus indicators on all interactive elements</li>
                            <li>Logical tab order that follows the visual layout</li>
                            <li>Skip-to-content capability for screen reader users</li>
                        </ul>

                        <h3>Visual Design</h3>
                        <ul>
                            <li>Color contrast ratios meeting WCAG AA standards (minimum 4.5:1 for normal text)</li>
                            <li>Text can be resized up to 200% without loss of content or functionality</li>
                            <li>Essential information is never conveyed by color alone</li>
                            <li>Responsive design that adapts to various screen sizes and orientations</li>
                        </ul>

                        <h3>Content & Structure</h3>
                        <ul>
                            <li>Semantic HTML5 elements for proper document structure</li>
                            <li>Descriptive alt text for all product images</li>
                            <li>Proper heading hierarchy (h1 through h4) for easy navigation</li>
                            <li>ARIA labels on interactive elements where needed</li>
                            <li>Form inputs with associated labels for clear identification</li>
                        </ul>

                        <h3>Product Catalog</h3>
                        <ul>
                            <li>Product cards are keyboard-accessible with clear focus states</li>
                            <li>Price information is presented as text, readable by screen readers</li>
                            <li>Category filters are accessible via keyboard</li>
                            <li>Image carousels can be navigated with keyboard controls</li>
                        </ul>
                    </section>

                    <section className="legal-page__section">
                        <h2>AI Virtual Try-On Accessibility</h2>
                        <p>
                            Our AI-powered virtual try-on feature is designed with accessibility in mind:
                        </p>
                        <ul>
                            <li>
                                <strong>Pose guides:</strong> Visual guides include text descriptions explaining the
                                required pose for each jewelry category (rings, necklaces, earrings)
                            </li>
                            <li>
                                <strong>Upload process:</strong> The file upload interface is keyboard-accessible and
                                includes screen reader-friendly labels
                            </li>
                            <li>
                                <strong>Results:</strong> Generated try-on images include descriptive alt text
                            </li>
                            <li>
                                <strong>Status updates:</strong> Loading states and error messages are announced to
                                screen readers via ARIA live regions
                            </li>
                        </ul>
                    </section>

                    <section className="legal-page__section">
                        <h2>Request & Cart System</h2>
                        <p>Our inquiry system is designed to be fully accessible:</p>
                        <ul>
                            <li>Cart and wishlist actions provide audible feedback via toast notifications</li>
                            <li>Quantity controls are keyboard-operable</li>
                            <li>The inquiry submission form uses properly labeled inputs</li>
                            <li>Success and error states are communicated to assistive technologies</li>
                        </ul>
                    </section>

                    <section className="legal-page__section">
                        <h2>Known Limitations</h2>
                        <p>
                            While we strive for full accessibility, we are aware of some areas that need ongoing
                            improvement:
                        </p>
                        <ul>
                            <li>
                                AI-generated virtual try-on images may not be fully descriptive to screen reader
                                users due to the visual nature of the feature
                            </li>
                            <li>
                                Some third-party components (image carousels) may have limited accessibility in
                                certain browsers
                            </li>
                        </ul>
                        <p>
                            We are actively working to address these limitations and improve the overall
                            accessibility of our platform.
                        </p>
                    </section>

                    <section className="legal-page__section">
                        <h2>Assistive Technologies Supported</h2>
                        <p>Peer Jewelry is designed to be compatible with:</p>
                        <ul>
                            <li>Screen readers (NVDA, JAWS, VoiceOver, TalkBack)</li>
                            <li>Screen magnification software</li>
                            <li>Speech recognition software</li>
                            <li>Keyboard-only navigation</li>
                            <li>Browser zoom functionality (up to 200%)</li>
                        </ul>
                    </section>

                    <div className="legal-page__contact">
                        <h2>Feedback & Assistance</h2>
                        <p>
                            We welcome your feedback on the accessibility of Peer Jewelry. If you encounter any
                            accessibility barriers or have suggestions for improvement, please contact us
                            at <a href="mailto:accessibility@peerjewelry.com">accessibility@peerjewelry.com</a>.
                        </p>
                        <p>
                            We will make reasonable efforts to address your concerns and provide the information
                            or functionality you need in an accessible format.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
