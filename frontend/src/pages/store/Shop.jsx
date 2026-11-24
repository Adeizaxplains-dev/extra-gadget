import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  PackageSearch,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';

import * as productService from '../../services/productService.js';
import * as categoryService from '../../services/categoryService.js';
import { ProductGrid } from '../../components/product/ProductGrid.jsx';
import { ProductFilters } from '../../components/product/ProductFilters.jsx';
import { Pagination } from '../../components/admin/Pagination.jsx';
import { PageSpinner } from '../../components/ui/Spinner.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const queryString = searchParams.toString();
  const filters = Object.fromEntries(searchParams.entries());

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'page' && Boolean(value)
  ).length;

  useEffect(() => {
    categoryService
      .listCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    let isActive = true;

    setResult(null);
    setError(null);

    productService
      .listProducts(filters)
      .then((data) => {
        if (isActive) setResult(data);
      })
      .catch((err) => {
        if (isActive) {
          setError(err.message || 'Unable to load products. Please try again.');
        }
      });

    return () => {
      isActive = false;
    };

    // queryString represents the current URL filters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString, reloadKey]);

  const updateFilters = (next) => {
    const params = {};

    Object.entries(next).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params[key] = value;
      }
    });

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const retryLoading = () => {
    setReloadKey((current) => current + 1);
  };

  return (
    <main className="min-h-screen bg-[#FAF8F8] pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#171114] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#171114] via-[#24151A] to-[#4A101D]" />

        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#C8102E]/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-[#C8102E]/10 blur-3xl" />

        <div className="container-page relative py-12 sm:py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80">
                <Sparkles size={15} className="text-[#FF6B7D]" />
                Explore our collection
              </div>

              <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Find your next
                <span className="block text-[#FF6B7D]">
                  favourite gadget.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
                Discover gadgets and everyday tech essentials selected to
                bring more convenience, creativity and enjoyment to your life.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#shop-products"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#A90D27]"
                >
                  Explore products
                  <ArrowRight size={17} />
                </a>

                <Link
                  to="/contact"
                  className="rounded-xl border border-white/20 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Need help choosing?
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex lg:justify-end">
              <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <div className="absolute inset-5 rounded-full border border-white/10" />
                <div className="absolute inset-10 rounded-full border border-white/10" />

                <div className="flex h-36 w-36 items-center justify-center rounded-3xl bg-gradient-to-br from-[#C8102E] to-[#7D1025] shadow-2xl shadow-black/30">
                  <PackageSearch size={68} strokeWidth={1.2} />
                </div>

                <div className="absolute -bottom-2 right-0 rounded-xl border border-white/10 bg-[#2B1B20] px-4 py-3 shadow-xl">
                  <p className="text-xs text-white/50">Your next find</p>
                  <p className="mt-1 text-sm font-semibold">Starts here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop content */}
      <section
        id="shop-products"
        className="container-page scroll-mt-8 py-10 sm:py-14"
      >
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E]">
              The collection
            </p>

            <h2 className="font-display text-3xl font-semibold tracking-tight text-[#21191C] sm:text-4xl">
              Shop all gadgets
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#756A6E] sm:text-base">
              Browse the collection and find the right tech for your everyday
              needs.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#EDE5E7] bg-white px-4 py-3 text-sm text-[#756A6E]">
            <Search size={17} className="text-[#C8102E]" />
            <span>
              {result
                ? `${result.items.length} product${result.items.length === 1 ? '' : 's'} on this page`
                : 'Discover your next gadget'}
            </span>
          </div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Filters */}
          <aside className="rounded-2xl border border-[#EDE5E7] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[#C8102E]" />
                <h3 className="font-semibold text-[#21191C]">Filters</h3>
              </div>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-[#C8102E] transition hover:text-[#920C21]"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="border-t border-[#F0E9EB] pt-5">
              <ProductFilters
                categories={categories}
                filters={filters}
                onChange={updateFilters}
              />
            </div>

            {activeFilterCount > 0 && (
              <div className="mt-5 border-t border-[#F0E9EB] pt-5">
                <p className="text-xs text-[#8A7E82]">
                  {activeFilterCount} filter{activeFilterCount === 1 ? '' : 's'}{' '}
                  applied
                </p>
              </div>
            )}
          </aside>

          {/* Products */}
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[#21191C]">
                  {activeFilterCount > 0 ? 'Matching products' : 'All products'}
                </h3>

                <p className="mt-1 text-sm text-[#8A7E82]">
                  {activeFilterCount > 0
                    ? 'Products that match your selected filters.'
                    : 'Explore everything in our current collection.'}
                </p>
              </div>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#EDE5E7] bg-white px-3 py-2 text-xs font-semibold text-[#756A6E] transition hover:border-[#C8102E]/30 hover:text-[#C8102E]"
                >
                  <X size={14} />
                  Reset filters
                </button>
              )}
            </div>

            {error && (
              <div className="rounded-2xl border border-[#F0D5DA] bg-white p-6 sm:p-8">
                <ErrorState
                  message={error}
                  onRetry={retryLoading}
                />
              </div>
            )}

            {!error && result === null && (
              <div className="rounded-2xl border border-[#EDE5E7] bg-white py-16">
                <PageSpinner />
              </div>
            )}

            {!error && result !== null && (
              <>
                {result.items.length > 0 ? (
                  <div className="rounded-2xl border border-[#EDE5E7] bg-white p-4 sm:p-6">
                    <ProductGrid
                      products={result.items}
                      emptyMessage="No products match your current filters."
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#EDE5E7] bg-white px-6 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF1F2] text-[#C8102E]">
                      <PackageSearch size={30} />
                    </div>

                    <h3 className="mt-5 text-xl font-semibold text-[#21191C]">
                      No products found
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#756A6E]">
                      We couldn’t find products matching your current
                      selection. Try changing your filters or browsing the
                      full collection.
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#A90D27]"
                    >
                      View all products
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {result.pagination.pages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      page={result.pagination.page}
                      pages={result.pagination.pages}
                      onChange={(page) =>
                        updateFilters({ ...filters, page })
                      }
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Help banner */}
      <section className="container-page">
        <div className="flex flex-col justify-between gap-5 rounded-2xl bg-[#F1E8EA] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8102E]">
              Need a little help?
            </p>

            <h2 className="mt-2 font-display text-xl font-semibold text-[#21191C] sm:text-2xl">
              Not sure which gadget is right for you?
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#756A6E]">
              Get in touch with our team for help finding a product that suits
              your needs.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#21191C] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3B2B30]"
          >
            Contact us
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}