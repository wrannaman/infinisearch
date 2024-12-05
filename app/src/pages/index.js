import { useState, useEffect } from 'react';
import Head from 'next/head';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { BoltIcon, EnvelopeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { RadioGroup } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/router';
import { NewspaperIcon, ArrowTrendingUpIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { SparklesIcon, RssIcon, DocumentDuplicateIcon, VideoCameraIcon, FireIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon, DocumentTextIcon, SpeakerWaveIcon, PhotoIcon } from '@heroicons/react/24/outline'

const navigation = [
  // Updated navigation if needed
]

const useCases = [
  {
    name: 'The 24/7 Content Machine',
    description:
      'Connect your news sources and watch as AI transforms them into a daily blog post, TikTok, YouTube video, podcast episode (in your voice!), and LinkedIn article—all automatically published across your platforms.',
    href: '#',
    Icon: FireIcon,
  },
  {
    name: 'Your Personal Media Studio',
    description:
      'Stop manually creating content. Secret Agent monitors your selected sources 24/7, synthesizes the key insights, and publishes professionally crafted content across all platforms—maintaining your unique voice and perspective.',
    href: '#',
    Icon: SparklesIcon,
  },
  {
    name: 'Superhuman Content Creation',
    description:
      'Set it once, benefit forever. Your AI agent curates trending topics from your sources, creates comprehensive content, and maintains a consistent publishing schedule across all platforms. No daily input required.',
    href: '#',
    Icon: BoltIcon,
  },
  {
    name: 'The Ultimate Time Multiplier',
    description:
      'While others spend hours researching and creating content, your AI agent automatically transforms industry news into engaging content across all platforms. Stay ahead of trends without the burnout.',
    href: '#',
    Icon: ArrowTrendingUpIcon,
  },
]

const steps = [
  {
    name: 'Design Your AI Avatar',
    description: 'Tell us about the publication you\'d like to create. Tech expert? Industry analyst? Startup thought leader? Your AI will maintain this persona across all content.',
    icon: SparklesIcon,
  },
  {
    name: 'Choose Your Sources',
    description: 'Connect any news sites, RSS feeds, or industry sources. Your AI filters through the noise to find what matters to your audience.',
    icon: RssIcon,
  },
  {
    name: 'Auto-Generate Content',
    description: 'Your AI synthesizes your sources into a daily blog post, Twitter thread, and LinkedIn article—each perfectly formatted for the platform. Set your schedule and let it run!',
    icon: DocumentDuplicateIcon,
  },
  {
    name: 'Instant Video Creation',
    description: 'Your curated content automatically becomes a YouTube video with AI voiceover and visuals. From news to video in minutes.',
    icon: VideoCameraIcon,
  },
  {
    name: 'TikTok Ready',
    description: 'Coming Soon: Auto-convert your curated insights into TikTok format. Same expertise, new medium.',
    icon: FireIcon,
  },
];

const contentFlow = [
  {
    title: 'Smart Curation',
    description: 'Your AI agent monitors your selected sources 24/7, identifying trending topics and key insights.',
    icon: RssIcon,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Multi-Format Creation',
    description: 'Transforms curated content into your unique voice, optimized for every platform.',
    icon: DocumentTextIcon,
    color: 'from-purple-500 to-indigo-500'
  },
  {
    title: 'Audio & Visual Magic',
    description: 'Generates podcast episodes in your voice, creates custom thumbnails, and produces engaging videos.',
    icon: SpeakerWaveIcon,
    color: 'from-orange-500 to-amber-500'
  },
  {
    title: 'Cross-Platform Publishing',
    description: 'Automatically posts to your blog, YouTube, TikTok, Twitter, LinkedIn, and podcast platforms.',
    icon: ArrowPathIcon,
    color: 'from-green-500 to-emerald-500'
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000); // Change step every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Secret Agent | Your AI-Powered Media Empire</title>
        <meta name="description" content="Transform one piece of content into a complete media presence across blogs, podcasts, YouTube, TikTok, and LinkedIn—automatically." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Secret Agent</span>
              <img
                alt=""
                src="/icon.png"
                className="h-8 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-white hover:text-gray-300">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="https://calendly.com/andrew-xo/30" className="text-sm/6 font-semibold text-white hover:text-gray-300">
              Book A Call <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Secret Agent</span>
                <img
                  alt=""
                  src="/icon.png"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-white"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-gray-800"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="https://calendly.com/andrew-xo/30"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-gray-800"
                  >
                    Book A Call
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
      <main>
        {/* Hero section with integrated Try it out */}
        <div className="relative isolate overflow-hidden bg-black">
          <div className="mx-auto max-w-7xl">
            <div className="py-24 sm:py-32">
              {/* <div className="flex items-center justify-center gap-2 mb-6">
                <span className="px-3 py-1 text-xs font-semibold bg-rose-600/10 text-rose-600 rounded-full">
                  As Featured In ProductHunt
                </span>
              </div> */}
              <h1 className="mt-10 text-4xl font-bold tracking-tight sm:text-7xl text-center text-white">
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Turn Industry News
                </span>
                <br />
                <span className="text-white">Into Your Media Empire</span>
              </h1>
              <div className="mt-6 text-xl leading-8 text-center max-w-3xl mx-auto text-gray-300">
                <span className="font-semibold">
                  Your AI agent monitors your sources and creates
                  <span className="text-rose-500"> daily content</span> across
                  <span className="text-rose-500"> all major platforms</span>
                  — 100% automatically.
                </span>
                <div className="mt-10 flex items-center justify-center gap-6">
                  <a
                    href="https://calendly.com/andrew-xo/30"
                    className="rounded-lg bg-rose-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-rose-500 transition-all hover:scale-105 animate-pulse"
                  >
                    Get Early Access (25 Spots Left) →
                  </a>
                </div>
                <div className="mt-6 flex items-center justify-center gap-8">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <img
                        key={i}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                        src={`https://randomuser.me/api/portraits/men/${i}.jpg`}
                        alt=""
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">
                    <span className="text-rose-500 font-semibold">17 creators</span> joined this week
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-rose-950/50 to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.rose.400/15),theme(colors.black))]" />
          </div>
        </div>
        <section className="bg-black text-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src="https://thecompiler.io/content/images/2024/11/icon-1.png"
                    alt="TheCompiler.io Logo"
                    className="w-16 h-16 rounded-lg"
                  />
                  <h2 className="text-2xl font-bold">TheCompiler.io</h2>
                </div>
                <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  See Secret Agent in Action
                </h3>
                <p className="text-xl mb-6 text-gray-300">
                  Our inaugural AI-powered channel delivering daily tech news across all platforms:
                </p>
                <ul className="space-y-4 text-gray-300 mb-8">
                  <li className="flex items-center gap-2">
                    <DocumentTextIcon className="h-5 w-5 text-rose-600" />
                    Daily curated tech news articles
                  </li>
                  <li className="flex items-center gap-2">
                    <SpeakerWaveIcon className="h-5 w-5 text-rose-600" />
                    AI-voiced podcast episodes on Apple & Spotify
                  </li>
                  <li className="flex items-center gap-2">
                    <VideoCameraIcon className="h-5 w-5 text-rose-600" />
                    Automated YouTube content
                  </li>
                  <li className="flex items-center gap-2">
                    <RssIcon className="h-5 w-5 text-rose-600" />
                    Multi-platform distribution
                  </li>
                </ul>
                <div className="flex gap-4">
                  <a
                    href="https://thecompiler.io"
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-rose-600 hover:bg-rose-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit TheCompiler.io
                  </a>
                  <a
                    href="https://calendly.com/andrew-xo/30"
                    className="inline-flex items-center px-6 py-3 rounded-lg border border-rose-600 hover:bg-rose-600/10 transition-colors"
                  >
                    Build Your Channel →
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-6">
                  <h4 className="font-semibold mb-2">Latest Updates</h4>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-400">
                      Daily tech news covering:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Breaking tech developments</li>
                        <li>Developer tools and updates</li>
                        <li>AI and machine learning news</li>
                        <li>Open source projects</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <a href="https://podcasts.apple.com/us/podcast/the-compiler/id1780120699" className="flex-1">
                    <div className="bg-gray-900 rounded-lg p-4 text-center hover:bg-gray-800 transition-colors">
                      <SparklesIcon className="h-6 w-6 mx-auto mb-2 text-rose-600" />
                      Apple Podcast
                    </div>
                  </a>
                  <a href="https://youtube.com/@thecompilerdaily" className="flex-1">
                    <div className="bg-gray-900 rounded-lg p-4 text-center hover:bg-gray-800 transition-colors">
                      <VideoCameraIcon className="h-6 w-6 mx-auto mb-2 text-rose-600" />
                      YouTube
                    </div>
                  </a>
                  <a href="https://open.spotify.com/show/3L5qJS2F2zHJ2Wck4xWB5S" className="flex-1">
                    <div className="bg-gray-900 rounded-lg p-4 text-center hover:bg-gray-800 transition-colors">
                      <SpeakerWaveIcon className="h-6 w-6 mx-auto mb-2 text-rose-600" />
                      Spotify
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="bg-black border-t border-gray-800">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
            <div className="grid grid-cols-1 gap-y-16 gap-x-8 lg:grid-cols-3">
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-white">
                  Real Results from
                  <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"> Early Users</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2">
                <figure className="rounded-lg bg-gray-900 p-8 border border-gray-800">
                  <blockquote className="text-gray-300">
                    "Secret Agent created a month's worth of content in just one day. My YouTube subscribers doubled in 2 weeks."
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <div>
                      <div className="font-semibold text-white">Sarah Chen</div>
                      <div className="text-gray-500">Tech Influencer</div>
                    </div>
                  </figcaption>
                </figure>
                <figure className="rounded-lg bg-gray-900 p-8 border border-gray-800">
                  <blockquote className="text-gray-300">
                    "I went from 0 to 10k LinkedIn followers in 30 days. The AI-generated content is incredibly engaging."
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <div>
                      <div className="font-semibold text-white">Mark Thompson</div>
                      <div className="text-gray-500">Startup Founder</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-rose-600">How It Works</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Your 24/7 Content Empire
              </p>
              <p className="mt-6 text-lg/8 text-base-content/80">
                While others struggle with content creation, your AI assistant builds your media presence across all platforms.
              </p>
            </div>

            <nav aria-label="Progress" className="mx-auto max-w-2xl">
              <ol role="list" className="overflow-hidden">
                {steps.map((step, stepIdx) => (
                  <li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? 'pb-10' : '', 'relative')}>
                    <div
                      className={classNames(
                        'group relative flex items-start',
                        stepIdx <= currentStep ? 'opacity-100' : 'opacity-50'
                      )}
                    >
                      <span className="flex h-9 items-center">
                        <span
                          className={classNames(
                            'relative z-10 flex size-8 items-center justify-center rounded-full',
                            stepIdx <= currentStep ? 'bg-rose-600' : 'bg-gray-200',
                            'transition-all duration-500'
                          )}
                        >
                          <step.icon className="size-5 text-white" />
                        </span>
                      </span>
                      <span className="ml-4 flex min-w-0 flex-col">
                        <span className={classNames(
                          'text-sm font-medium',
                          stepIdx <= currentStep ? 'text-rose-600' : 'text-gray-500'
                        )}>{step.name}</span>
                        <span className="text-sm text-gray-500">{step.description}</span>
                      </span>
                    </div>
                    {stepIdx !== steps.length - 1 && (
                      <div
                        className={classNames(
                          'absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5',
                          stepIdx < currentStep ? 'bg-rose-600' : 'bg-gray-200'
                        )}
                      />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>

        <div className="bg-black py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-rose-600">Use Cases</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl text-white">
                Create Content That
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"> Dominates</span>
              </p>
              <p className="mt-6 text-lg/8 text-gray-400">
                Transform your content strategy with AI-powered creation tools that adapt to any format or platform.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                {useCases.map((useCase) => (
                  <div key={useCase.name} className="flex flex-col bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-rose-600 transition-all hover:scale-105">
                    <dt className="flex items-center gap-x-3 text-xl font-semibold text-white">
                      <useCase.Icon aria-hidden="true" className="h-7 w-7 flex-none text-rose-600" />
                      {useCase.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base/7">
                      <p className="flex-auto text-gray-400">{useCase.description}</p>
                      <p className="mt-6">
                        <a href={useCase.href} className="text-sm font-semibold text-rose-600 hover:text-rose-500">
                          Learn more <span aria-hidden="true">→</span>
                        </a>
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-rose-600">Daily Automation</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                Your 24/7 Content
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"> Factory</span>
              </p>
              <p className="mt-6 text-lg/8 text-base-content/80">
                While you sleep, Secret Agent creates and publishes an entire media ecosystem. Every. Single. Day.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {contentFlow.map((item, index) => (
                  <div key={item.title} className="relative pl-16 group">
                    <div className={`absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${item.color} group-hover:scale-110 transition-all`}>
                      <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="relative">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-base text-gray-600">
                        {item.description}
                      </p>
                      {index < contentFlow.length - 1 && (
                        <div className="absolute -right-4 top-4 hidden lg:block">
                          <ChevronRightIcon className="h-6 w-6 text-rose-600" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 flex justify-center">
                <div className="rounded-md bg-gray-50 p-8 text-center border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900">Daily Output</h4>
                  <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {['Blog Post', 'Podcast Episode', 'YouTube Video', 'Social Posts'].map((output) => (
                      <div key={output} className="rounded-lg bg-white p-4 shadow-sm border border-gray-200 hover:border-rose-600 transition-all">
                        <p className="text-sm text-gray-600">{output}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main >
      {/* Footer */}
      <footer className="text-center py-10 mt-32">
        <div>
          <p className="text-gray-500">© 2024 XO Capital. All rights reserved.</p>
        </div>
      </footer>
      <div className="fixed bottom-0 inset-x-0 bg-black/90 backdrop-blur-lg border-t border-gray-800 p-4 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6">
          <div className="text-white">
            <p className="font-semibold">Ready to Automate Your Content Empire?</p>
            <p className="text-sm text-gray-400">Set up once, publish forever</p>
          </div>
          <a
            href="https://calendly.com/andrew-xo/30"
            className="rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-rose-500 transition-all hover:scale-105"
          >
            Book Your Demo →
          </a>
        </div>
      </div>
    </div >
  );
}