import type { FaqItem } from './services';
import { getWork, type WorkImage } from './work';

// Each post's text is in src/content/blog/<slug>.mdx. Newest first.
export type BlogPost = {
  slug: string;
  /** H1 and card title. */
  title: string;
  /** <title>; the layout adds " | Bueno Landscaping". */
  seoTitle: string;
  /** Meta description and card text. */
  description: string;
  /** Lead paragraph under the H1. */
  intro: string;
  /** YYYY-MM-DD */
  published: string;
  updated?: string;
  minutes: number;
  /** Slug of the service page the post supports. */
  service: string;
  image: WorkImage;
  faq?: FaqItem[];
};

export const posts: BlogPost[] = [
  {
    slug: 'when-to-turn-sprinklers-on-and-off-long-island',
    title: 'When to Turn Sprinklers On and Off on Long Island',
    seoTitle: 'When to Turn Sprinklers On and Off on Long Island',
    description:
      'Spring start-up and fall winterization dates for Long Island sprinkler systems, based on NOAA freeze data, plus what to do if you missed the blowout.',
    intro:
      'On Long Island the sprinkler season runs roughly from late April to early November. Here’s when to turn your system on and off, what each step involves, and what to do if the fall shut-down slipped by.',
    published: '2026-11-09',
    minutes: 5,
    service: 'irrigation',
    image: getWork('sprinkler-valve-box'),
    faq: [
      {
        question: 'When should I blow out my sprinklers on Long Island?',
        answer:
          'Late October to mid-November, before the first hard freeze. NOAA climate normals for Islip put the median first hard freeze (28°F) around November 14.',
      },
      {
        question: 'When can I turn my sprinklers back on?',
        answer:
          'Late April into May, once hard freezes are unlikely. The median last freeze at Islip is around April 10, but a freeze after April 25 still happens about one year in ten.',
      },
      {
        question: 'What happens if I don’t winterize my sprinkler system?',
        answer:
          'Water left inside can freeze and crack pipe, fittings, valves and the backflow preventer. The damage usually shows up at spring start-up as leaks, wet spots or zones that won’t work.',
      },
      {
        question: 'Can I blow out my sprinkler system myself?',
        answer:
          'Only with a compressor that moves enough air, and with pressure kept within safe limits for your pipe. Never push compressed air through the backflow preventer. A small home compressor usually can’t clear a full zone.',
      },
    ],
  },
  {
    slug: 'dry-well-vs-french-drain-long-island',
    title: 'Dry Well vs French Drain: Fixing a Wet Yard on Long Island',
    seoTitle: 'Dry Well vs French Drain on Long Island',
    description:
      'How dry wells and French drains work, which one fits your yard, when you need both, and what Long Island’s sandy soil means for drainage.',
    intro:
      'Standing water after rain, a soggy lawn or a wet corner by the foundation all come down to the same thing: water with nowhere to go. A dry well and a French drain both fix that, but they fix different parts of it.',
    published: '2026-11-09',
    minutes: 5,
    service: 'drainage',
    image: getWork('dry-well-excavation'),
    faq: [
      {
        question: 'Do dry wells work on Long Island?',
        answer:
          'In most yards, yes. Much of the soil around Patchogue is sandy and drains well. They work poorly where the groundwater is close to the surface, such as some low areas near the bay.',
      },
      {
        question: 'Can a French drain empty into a dry well?',
        answer:
          'Yes, and it’s a common setup. The French drain collects water from the wet area and its pipe carries the water to a dry well, where it soaks into the ground.',
      },
      {
        question: 'Why does my yard flood if the soil is sandy?',
        answer:
          'Usually because of what’s on top: compacted soil or fill near the surface, downspouts dumping in one spot, or grading that sends water toward the house. The sand below doesn’t help if the water can’t get down to it.',
      },
      {
        question: 'How do I know if a dry well is clogged?',
        answer:
          'Water backs up in the downspouts or overflows at the grate during rain, or the well stays full for days. Silt and leaves are the usual cause. Cleaning it out and keeping debris out of the inlet helps.',
      },
    ],
  },
  {
    slug: 'paver-vs-concrete-vs-stone-patio',
    title: 'Pavers, Concrete or Natural Stone: Choosing a Patio on Long Island',
    seoTitle: 'Paver vs Concrete vs Stone Patio on Long Island',
    description:
      'How paver, poured concrete and natural stone patios hold up to Long Island winters, how they compare on repairs and upkeep, and what makes a patio last.',
    intro:
      'Pavers, poured concrete and natural stone all make good patios. Here’s how they handle Long Island winters, what it takes to fix them, and what really decides how long a patio lasts.',
    published: '2026-11-09',
    minutes: 6,
    service: 'hardscape',
    image: getWork('paver-patio-capped-wall'),
    faq: [
      {
        question: 'Are pavers better than concrete for a patio?',
        answer:
          'For most Long Island yards, yes, as long as the base is built right. Pavers move with freeze and thaw without cracking, and a section that settles can be lifted and reset. Concrete usually costs less upfront, but cracks are hard to repair so they don’t show.',
      },
      {
        question: 'How long does a paver patio last?',
        answer:
          'With a well-built base and joint sand topped up now and then, a paver patio can last for decades. The pavers themselves rarely wear out. Problems almost always come from the base underneath.',
      },
      {
        question: 'Can pavers go over an existing concrete patio?',
        answer:
          'Sometimes. If the slab is solid, not heaving, and the extra height won’t block a door or a step, pavers can be laid over it. A cracked or sinking slab should come out first.',
      },
      {
        question: 'Why is my paver patio sinking?',
        answer:
          'Usually the base: not enough gravel, gravel that wasn’t compacted, or water washing out from under it, often from a downspout. The fix is to lift the low area, rebuild the base and relay the pavers.',
      },
    ],
  },
  {
    slug: 'brookhaven-shed-rules-and-shed-base',
    title: 'Shed Rules in Brookhaven and How to Build a Shed Base That Lasts',
    seoTitle: 'Brookhaven Shed Permit Rules and Shed Base Guide',
    description:
      'When a shed needs a permit in the Town of Brookhaven, size and setback limits, village rules, and how to prepare a level base that keeps a shed dry.',
    intro:
      'Before a shed arrives you need two answers: can it go where you want it, and what will it sit on. Here’s what the Town of Brookhaven says, and how to prepare the ground so the doors still close years from now.',
    published: '2026-11-09',
    minutes: 4,
    service: 'sheds',
    image: getWork('backyard-shed-plantings'),
    faq: [
      {
        question: 'What size shed can I put up without a permit in Brookhaven?',
        answer:
          'According to the Town of Brookhaven shed brochure, a shed of 144 square feet or less in the rear yard, at least 3 feet from the property lines. Larger sheds, or sheds outside the rear yard, need a permit. Incorporated villages such as Patchogue have their own rules.',
      },
      {
        question: 'How far from the property line does a shed have to be in Brookhaven?',
        answer:
          'A permit-exempt shed has to be at least 3 feet from the rear and side lines. A shed in a side yard has to meet the zoning setbacks for the lot, so check with the Town’s Building Division.',
      },
      {
        question: 'Is gravel or concrete better for a shed base?',
        answer:
          'For most backyard sheds, a compacted gravel pad: it drains well and is quicker to build. A concrete slab makes sense for large sheds, workshops or heavy equipment.',
      },
      {
        question: 'Can a shed sit directly on the ground?',
        answer:
          'Not for long. Soil holds moisture and settles unevenly, so the floor rots and the frame racks until the doors stick. A level gravel pad keeps the shed dry and square.',
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function postsForService(serviceSlug: string) {
  return posts.filter((post) => post.service === serviceSlug);
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date));
}
