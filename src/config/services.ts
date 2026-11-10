import type { IconName } from '@/components/ui/Icon';
import { getWork, getWorks, type WorkImage } from './work';

export type FaqItem = {
  question: string;
  answer: string;
};

export type Service = {
  slug: string;
  title: string;
  heading: string;
  icon: IconName;
  shortDescription: string;
  intro: string;
  bullets: string[];
  image: WorkImage;
  gallery: WorkImage[];
  seo: { title: string; description: string };
  faq: FaqItem[];
  // An extra section on the service page for one job people search for by name.
  feature?: { eyebrow: string; title: string; paragraphs: string[]; bullets: string[] };
};

// TODO: confirm with client: the scope listed in each service's bullets.
// TODO: confirm with client: "Fences & Outdoor Improvements" was on the old mockup. Add it back if they still offer it.
// Photos come from src/config/work-images.ts (frames from the client's TikTok videos).
export const services: Service[] = [
  {
    slug: 'lawn-care',
    title: 'Lawn Care',
    heading: 'Lawn Care Services',
    icon: 'grass',
    shortDescription: 'Mowing, edging and trimming to keep your lawn neat and healthy.',
    intro:
      'We take care of the routine lawn work so you don’t have to. Mowing, edging along walks and beds, trimming the spots a mower can’t reach, and cleaning up before we leave.',
    bullets: [
      'Mowing',
      'Edging along walkways, driveways and beds',
      'String trimming around fences, trees and borders',
      'Blowing clippings off walks and driveways',
      'Regular visits through the season',
    ],
    image: getWork('sod-lawn-arborvitae'),
    gallery: getWorks(['sod-lawn-fence-line', 'lawn-curved-bed-edge', 'sod-yard-after', 'arborvitae-side-yard']),
    seo: {
      title: 'Lawn Care & Mowing in Patchogue, NY',
      description:
        'Lawn mowing, edging and trimming in Patchogue and nearby Long Island towns. Call or text Bueno Landscaping at (631) 394-1668 for a free estimate.',
    },
    faq: [
      {
        question: 'How often should my lawn be mowed?',
        answer:
          'During the growing season most lawns need mowing about once a week. In slower or dry stretches it can be less often. We’ll work out a schedule that fits your yard.',
      },
      {
        question: 'What’s included in a lawn care visit?',
        answer:
          'Mowing, edging along walks, driveways and beds, trimming around fences and trees, and blowing clippings off hard surfaces.',
      },
      {
        question: 'Do I need to be home when you come?',
        answer:
          'No, as long as we can get into the yard. Let us know about gates, pets or anything in the yard we should watch out for.',
      },
      {
        question: 'Can I add cleanups or planting to my lawn care?',
        answer:
          'Yes. Many customers add a spring or fall cleanup, fresh mulch or hedge trimming. Tell us what you need and we’ll include it in the estimate.',
      },
    ],
  },
  {
    slug: 'planting-and-mulch',
    title: 'Planting & Mulch',
    heading: 'Planting & Mulch Services',
    icon: 'plant',
    shortDescription: 'Seasonal plantings, new beds and fresh mulch.',
    intro:
      'Fresh mulch and the right plants make a big difference in how a yard looks. We plant flowers, shrubs and new beds, and mulch them so they hold moisture and stay neat.',
    bullets: [
      'Planting flowers, shrubs and small trees',
      'New garden beds and bed edging',
      'Fresh mulch for existing beds',
      'Weeding and bed cleanup before mulching',
      'Seasonal color for spring and summer',
    ],
    image: getWork('hydrangea-bed-walkway'),
    gallery: getWorks(['hydrangea-bed-curved', 'weeping-tree-bed', 'boulder-planting-bed', 'ornamental-grass-bed']),
    seo: {
      title: 'Planting & Mulching in Patchogue, NY',
      description:
        'Flower and shrub planting, new garden beds and fresh mulch in Patchogue and nearby Long Island towns. Call or text (631) 394-1668 for a free estimate.',
    },
    faq: [
      {
        question: 'When is the best time to mulch?',
        answer:
          'Spring is the most common time, after the cleanup and before summer heat. A layer in fall can also help protect roots over the winter.',
      },
      {
        question: 'How thick should mulch be?',
        answer:
          'About 2 to 3 inches is enough for most beds. Too much can smother roots, and mulch should not be piled up against tree trunks.',
      },
      {
        question: 'Can you help me pick plants?',
        answer:
          'Yes. Tell us what you like and how much sun the area gets, and we’ll suggest plants that suit the spot.',
      },
      {
        question: 'Do you remove old plants before planting?',
        answer: 'We can clear out old or dead plants and clean up the bed before putting in new ones.',
      },
    ],
  },
  {
    slug: 'hedge-and-shrub-trimming',
    title: 'Hedge & Shrub Trimming',
    heading: 'Hedge & Shrub Trimming',
    icon: 'tree',
    shortDescription: 'Neat, well-shaped hedges and shrubs.',
    intro:
      'Overgrown hedges and shrubs make a yard look messy and can block walkways and windows. We trim and shape them and clean up the clippings.',
    bullets: [
      'Hedge trimming and shaping',
      'Shrub pruning',
      'Cutting back growth from walkways, windows and siding',
      'Cleanup of clippings',
    ],
    image: getWork('boxwood-boulder-bed'),
    gallery: getWorks(['shrubs-along-fence', 'boulder-border-bed']),
    seo: {
      title: 'Hedge & Shrub Trimming in Patchogue, NY',
      description:
        'Hedge trimming, shrub pruning and cleanup in Patchogue and nearby Long Island towns. Call or text Bueno Landscaping at (631) 394-1668 for a free estimate.',
    },
    faq: [
      {
        question: 'When should hedges be trimmed?',
        answer:
          'Most hedges do well with a trim in late spring or early summer, after the new growth comes in. Fast growers may need a second trim later in summer. Flowering shrubs are best trimmed right after they bloom.',
      },
      {
        question: 'How often do shrubs need trimming?',
        answer: 'Usually once or twice a season, depending on the plant and how neat you want it to look.',
      },
      {
        question: 'Can you cut back a badly overgrown hedge?',
        answer:
          'Often, yes. Some shrubs handle a hard cut back well and some don’t. We’ll look at it and tell you what makes sense.',
      },
      {
        question: 'Do you clean up after trimming?',
        answer: 'Yes. Cleanup of the clippings is part of the job.',
      },
    ],
  },
  {
    slug: 'spring-and-fall-cleanup',
    title: 'Spring & Fall Cleanup',
    heading: 'Spring & Fall Cleanup and Leaf Removal',
    icon: 'leaf',
    shortDescription: 'Leaf removal, debris and old growth cleared out each season.',
    intro:
      'A spring or fall cleanup gets your yard ready for the season ahead. We do leaf removal from the lawn and beds, clear debris, cut back old growth and tidy up the beds.',
    bullets: [
      'Leaf removal from the lawn and beds',
      'Clearing sticks, branches and storm debris',
      'Cutting back perennials and old growth',
      'Bed cleanup and edging',
      'Hauling away yard waste',
    ],
    image: getWork('japanese-maple-planting'),
    gallery: getWorks(['maple-planting-fall']),
    seo: {
      title: 'Cleanup & Leaf Removal in Patchogue, NY',
      description:
        'Spring and fall cleanups and leaf removal in Patchogue and nearby Long Island towns: leaves, debris, beds and yard waste. Call or text (631) 394-1668.',
    },
    faq: [
      {
        question: 'Do you do leaf removal in the fall?',
        answer:
          'Yes. We clear leaves from the lawn, beds and along fences and walkways, and take them away. Leaves left on the lawn over winter can smother the grass.',
      },
      {
        question: 'When should I book a spring cleanup?',
        answer:
          'Early spring, once the ground has dried out a bit. Spring is a busy time, so it helps to call early.',
      },
      {
        question: 'When is the best time for a fall cleanup?',
        answer:
          'After most of the leaves have dropped, usually late in the fall. Yards with a lot of trees sometimes need more than one visit.',
      },
      {
        question: 'Can I get a one-time cleanup?',
        answer: 'Yes. A cleanup can be a one-time job. You don’t need to sign up for regular service.',
      },
      {
        question: 'Do you take the leaves and debris away?',
        answer: 'Yes. Hauling away the leaves and yard waste is part of the cleanup.',
      },
    ],
  },
  {
    slug: 'irrigation',
    title: 'Irrigation',
    heading: 'Irrigation Services',
    icon: 'water',
    shortDescription: 'Sprinkler installation, repair, spring start-up and fall winterization.',
    intro:
      'A working sprinkler system keeps your lawn and beds watered without dragging a hose around. We install new systems, fix ones that aren’t working right, turn them on in spring and winterize them in fall.',
    bullets: [
      'New sprinkler system installation',
      'Repair of broken heads, leaking lines and zones that aren’t working',
      'Spring start-up and system check',
      'Fall winterization (blowing out the lines)',
      'Adjusting heads and coverage',
    ],
    image: getWork('sprinkler-valve-box'),
    gallery: getWorks(['irrigation-valve-stone-wall']),
    feature: {
      eyebrow: 'Fall service',
      title: 'Sprinkler winterization and blowout',
      paragraphs: [
        'Water left in sprinkler lines over a Long Island winter can freeze, expand and crack pipes, fittings, heads and the backflow device. A fall blowout clears the water out before the first hard freeze.',
        'We shut off the water to the system, then blow out each zone with compressed air until the heads run dry. In spring we turn the system back on and check every zone.',
      ],
      bullets: [
        'Water supply to the system shut off',
        'Each zone blown out with compressed air',
        'Controller set for the off season',
        'Spring start-up and zone check when you’re ready',
      ],
    },
    seo: {
      title: 'Sprinkler & Irrigation in Patchogue, NY',
      description:
        'Sprinkler installation, repair, spring start-up and winterization in Patchogue and nearby Long Island towns. Call or text (631) 394-1668 for a free estimate.',
    },
    faq: [
      {
        question: 'When should I turn on my sprinkler system in spring?',
        answer:
          'Once the risk of a hard freeze has passed. Turning it on too early can damage pipes and parts if the temperature drops again. A spring start-up is also a good time to check every zone for leaks and broken heads.',
      },
      {
        question: 'When should I winterize my system?',
        answer:
          'Before the first hard freeze in the fall. Water left in the lines can freeze, expand and crack pipes, fittings and heads.',
      },
      {
        question: 'What is a sprinkler blowout?',
        answer:
          'It is how a sprinkler system is winterized. The water to the system is shut off and each zone is blown out with compressed air until no water comes out of the heads, so nothing is left inside to freeze over the winter.',
      },
      {
        question: 'Can I just drain the system instead of blowing it out?',
        answer:
          'Draining leaves water sitting in low spots of the lines and in the heads. Blowing out each zone with air clears the water that draining misses.',
      },
      {
        question: 'Some heads aren’t popping up or a zone isn’t working. Can you fix it?',
        answer:
          'Usually, yes. Common causes are broken or clogged heads, a leak in the line or a valve problem. We’ll find the cause and tell you what it takes to fix it.',
      },
      {
        question: 'Can you install a sprinkler system in an existing lawn?',
        answer:
          'Yes. We lay out zones for the lawn and beds, run the lines and set the heads. We go over the layout with you before the work starts.',
      },
    ],
  },
  {
    slug: 'drainage',
    title: 'Drainage',
    heading: 'Drainage Services',
    icon: 'drain',
    shortDescription: 'French drains, dry wells, downspout drainage and regrading for standing water.',
    intro:
      'Standing water, a soggy lawn or water running toward the house usually means it has nowhere to go. We find where the water comes from and where it should go, then fix it with a French drain, a dry well, downspout drainage or regrading.',
    bullets: [
      'French drains',
      'Dry wells',
      'Downspout drainage, piped away from the house',
      'Fixing standing water and soggy lawns',
      'Regrading so water runs away from the house',
    ],
    image: getWork('dry-well-excavation'),
    gallery: getWorks(['drainage-excavation']),
    seo: {
      title: 'Drainage & French Drains in Patchogue, NY',
      description:
        'French drains, dry wells, downspout drainage and regrading for standing water and soggy lawns in Patchogue and nearby Long Island towns. Call (631) 394-1668.',
    },
    faq: [
      {
        question: 'Why does water keep pooling in my yard?',
        answer:
          'Usually the ground is too flat or slopes the wrong way, the soil is heavy and drains slowly, or downspouts dump roof water right next to the house. Often it is more than one of these. We look at where the water comes from before suggesting a fix.',
      },
      {
        question: 'What is the difference between a French drain and a dry well?',
        answer:
          'A French drain is a gravel trench with a perforated pipe that collects water and carries it somewhere else. A dry well is an underground chamber that holds water and lets it soak into the ground. They are often used together: the drain carries water to the dry well.',
      },
      {
        question: 'Can you connect my downspouts underground?',
        answer:
          'Yes. Downspouts can be piped underground away from the foundation, often to a dry well, so roof water stops pooling next to the house.',
      },
      {
        question: 'Will regrading fix a soggy lawn?',
        answer:
          'If the problem is the slope, yes. Regrading reshapes the ground so water runs away from the house and low spots stop collecting it. If the soil itself drains slowly, a drain or dry well may be needed as well.',
      },
      {
        question: 'Do I need a permit for a dry well?',
        answer:
          'It depends on the town and the job. Some Long Island towns have rules about dry wells and where water can be sent. Check with your town building department before the work starts.',
      },
    ],
  },
  {
    slug: 'hardscape',
    title: 'Hardscape',
    heading: 'Hardscape Services',
    icon: 'pavers',
    shortDescription: 'Patios, walkways, retaining walls and pavers.',
    intro:
      'Hardscape is the stone and paver side of your yard: the patio you sit on, the walkway to the door and the walls that hold back a slope. We plan it with you, prepare the base and build it.',
    bullets: [
      'Paver patios',
      'Walkways and front entrances',
      'Retaining walls',
      'Paver installation and borders',
      'Excavation, base preparation and grading',
    ],
    image: getWork('patio-curved-seating-wall'),
    gallery: getWorks(['checkerboard-paver-patio', 'pool-patio-gravel-beds', 'curved-paver-walkway', 'block-retaining-wall-lighting', 'pool-deck-stepping-pavers', 'paver-landing-front-door']),
    seo: {
      title: 'Patios & Hardscape in Patchogue, NY',
      description:
        'Paver patios, walkways and retaining walls in Patchogue and nearby Long Island towns. Call or text Bueno Landscaping at (631) 394-1668 for a free estimate.',
    },
    faq: [
      {
        question: 'What’s the difference between hardscape and masonry?',
        answer:
          'Hardscape covers the built parts of a yard, like patios, walkways and retaining walls, often made with pavers or block. Masonry is stone and brick work, like steps and walls, usually set with mortar. Many projects use both.',
      },
      {
        question: 'How long does a patio take to build?',
        answer:
          'It depends on the size, the site and the material. We’ll give you an idea of the timeline when we go over the estimate.',
      },
      {
        question: 'Why do some patios sink or shift?',
        answer:
          'Usually because the base wasn’t prepared right. A paver patio needs proper excavation, a compacted gravel base and edge restraints to hold its shape.',
      },
      {
        question: 'Do I need a retaining wall?',
        answer:
          'If you have a slope that washes out, a part of the yard you want to level off, or soil pushing against a walkway or patio, a retaining wall can help. We’ll look at the area and tell you what we think.',
      },
      {
        question: 'Can I choose the pavers and colors?',
        answer: 'Yes. We go over material and color options with you during the estimate.',
      },
    ],
  },
  {
    slug: 'masonry',
    title: 'Masonry',
    heading: 'Masonry Services',
    icon: 'bricks',
    shortDescription: 'Stone and brick work, steps, walls and paver installation.',
    intro:
      'We do stone and brick work around the house and yard: front steps, garden and seating walls, stone borders and paver installation.',
    bullets: [
      'Stone and brick walls',
      'Front and back steps',
      'Stone edging and borders',
      'Paver installation',
    ],
    image: getWork('flagstone-path-granite-edge'),
    gallery: getWorks(['flagstone-walkway-planting-beds', 'natural-stone-steps', 'granite-block-edging', 'flagstone-path-side-yard', 'curved-seating-wall', 'granite-cobblestone-apron']),
    seo: {
      title: 'Masonry & Stone Work in Patchogue, NY',
      description:
        'Stone and brick walls, steps, borders and paver installation in Patchogue and nearby Long Island towns. Call or text (631) 394-1668 for a free estimate.',
    },
    faq: [
      {
        question: 'What kind of masonry work do you do?',
        answer:
          'Stone and brick work for homes, including steps, walls, borders and paver installation. If you’re not sure your job fits, call or text and ask.',
      },
      {
        question: 'Can you build new front steps?',
        answer: 'Yes, steps are part of our masonry work. We’ll look at the entrance and talk through options with you.',
      },
      {
        question: 'Brick or natural stone, which is better?',
        answer:
          'Both last when they’re installed right. Brick has a classic, even look. Natural stone varies in color and shape and fits well in garden settings. It often comes down to the look of the house and your budget.',
      },
      {
        question: 'Do I need a permit for steps or walls?',
        answer:
          'It depends on the town and the size of the project. Taller walls and work at the main entrance are more likely to need approval. Check with your town building department before the work starts.',
      },
    ],
  },
  {
    slug: 'sheds',
    title: 'Sheds',
    heading: 'Shed Installation',
    icon: 'shed',
    shortDescription: 'Shed installation and site prep.',
    intro:
      'A shed needs a level, solid spot to sit on. Otherwise it settles, the doors stop closing right and the bottom stays wet. We prepare the site and install the shed.',
    bullets: [
      'Site prep and leveling',
      'Gravel or paver base for the shed',
      'Shed installation',
      'Cleanup after the job',
    ],
    image: getWork('backyard-shed-plantings'),
    gallery: getWorks([]),
    seo: {
      title: 'Shed Installation in Patchogue, NY',
      description:
        'Shed installation and site prep, including leveling and gravel or paver bases, in Patchogue and nearby Long Island towns. Call or text (631) 394-1668.',
    },
    // TODO: confirm with client: do they supply sheds, install sheds the customer bought, or both? Add an FAQ once known.
    faq: [
      {
        question: 'Why does a shed need site prep?',
        answer:
          'A shed on uneven or soft ground can settle, lean and rot at the bottom. A level, well drained base keeps it square and off the wet soil.',
      },
      {
        question: 'What kind of base is best for a shed?',
        answer:
          'A compacted gravel pad works well for most sheds because it drains. Some people prefer a paver pad. We’ll suggest a base based on the shed size and your yard.',
      },
      {
        question: 'Do I need a permit for a shed?',
        answer:
          'Many towns have rules about shed size and how close it can sit to the property line. Rules differ by town, so check with your town building department before you buy.',
      },
      {
        question: 'Where should the shed go?',
        answer:
          'Pick a spot that’s easy to get to, drains well and meets your town’s setback rules. We can walk the yard with you and point out good spots.',
      },
    ],
  },
];

export const serviceOptions = [...services.map((service) => service.title), 'Other / Not sure yet'];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
