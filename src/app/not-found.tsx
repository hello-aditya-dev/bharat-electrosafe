import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/ui/BackToTop';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { productNavigationItems } from '@/data/products';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-be-warm-white">
      <Header />
      <main className="flex-1 flex items-center justify-center page-horizontal-padding">
        <div className="container-site text-center py-16">
          {/* Breadcrumb-like element */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center mb-8">
            <ol className="flex items-center gap-1 text-metadata">
              <li className="flex items-center gap-1">
                <Link
                  href="/"
                  className="text-be-charcoal-800 hover:text-be-yellow-text-hover transition-colors duration-200"
                >
                  Home
                </Link>
                <span className="text-be-grey-650" aria-hidden>/</span>
              </li>
              <li>
                <span className="text-be-grey-650 font-medium" aria-current="page">
                  404 Error
                </span>
              </li>
            </ol>
          </nav>

          {/* 404 label */}
          <p className="text-be-yellow-text text-metadata font-semibold uppercase tracking-wide mb-4">
            404
          </p>

          {/* Heading */}
          <h1 className="text-section-h2 text-be-charcoal-950 mb-4">
            Page not found
          </h1>

          {/* Subtext */}
          <p className="text-body-large text-be-grey-650 max-w-md mx-auto mb-8">
            The page you are looking for does not exist or has been moved.
            Try one of the links below to find what you need.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <PrimaryButton href="/">
              Return to Home
            </PrimaryButton>
            <SecondaryButton href="/contact-us">
              Contact Us
            </SecondaryButton>
          </div>

          {/* Product family links */}
          <div className="max-w-lg mx-auto">
            <h2 className="text-sm font-semibold text-be-charcoal-950 uppercase tracking-wide mb-4">
              Our Products
            </h2>
            <ul className="flex flex-col gap-2">
              {productNavigationItems.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={product.href}
                    className="text-base text-be-grey-650 hover:text-be-yellow-text-hover transition-colors underline-offset-2 hover:underline"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
