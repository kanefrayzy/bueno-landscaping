import { About } from '@/components/sections/about/About';
import { BlogPosts } from '@/components/sections/blog/BlogPosts';
import { Areas } from '@/components/sections/areas/Areas';
import { ContactBar } from '@/components/sections/contact-bar/ContactBar';
import { Faq } from '@/components/sections/faq/Faq';
import { Hero } from '@/components/sections/hero/Hero';
import { QuoteSection } from '@/components/sections/quote/QuoteSection';
import { Reviews } from '@/components/sections/reviews/Reviews';
import { Services } from '@/components/sections/services/Services';
import { Work } from '@/components/sections/work/Work';
import { JsonLd } from '@/components/ui/JsonLd';
import { homeFaq } from '@/config/home';
import { getAllPosts } from '@/lib/blog';
import { pageMetadata } from '@/lib/seo';
import { localBusinessSchema } from '@/lib/schema';

export const metadata = pageMetadata({
  title: 'Landscaping & Hardscape in Patchogue, NY | Bueno Landscaping',
  description:
    'Lawn care, patios, masonry, sprinklers, drainage and sheds in Patchogue and nearby Long Island towns. Call or text (631) 394-1668 for a free estimate.',
  path: '/',
  absoluteTitle: true,
});

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <Hero />
      <ContactBar />
      <Services />
      <Work />
      <About />
      <Reviews />
      <Areas />
      <BlogPosts posts={posts.slice(0, 3)} />
      <Faq items={homeFaq} />
      <QuoteSection />
    </>
  );
}
