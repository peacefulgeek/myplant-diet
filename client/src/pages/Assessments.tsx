import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";

type Question = {
  q: string;
  options: { label: string; weight: number }[];
};

type Assessment = {
  slug: string;
  title: string;
  blurb: string;
  hero: string;
  category: string;
  questions: Question[];
  bands: { min: number; max: number; title: string; advice: string; reading: string }[];
};

const ASSESSMENTS: Assessment[] = [
  {
    slug: "plant-readiness",
    title: "Plant-readiness check",
    blurb: "Where you are on the curve from curious to consistent. 6 questions, ~90 seconds.",
    hero: "https://myplant-diet.b-cdn.net/library/lib-10.webp",
    category: "starter",
    questions: [
      { q: "How often do you eat a primarily plant-based dinner?", options: [
        { label: "Almost never", weight: 0 },
        { label: "1 night a week", weight: 1 },
        { label: "2-3 nights a week", weight: 2 },
        { label: "4+ nights a week", weight: 3 },
      ]},
      { q: "How comfortable are you cooking lentils, beans, or tofu?", options: [
        { label: "Not at all", weight: 0 },
        { label: "I have tried once or twice", weight: 1 },
        { label: "I have a few go-to recipes", weight: 2 },
        { label: "It is a kitchen staple", weight: 3 },
      ]},
      { q: "How does your household feel about more plants?", options: [
        { label: "Resistant", weight: 0 },
        { label: "Mixed", weight: 1 },
        { label: "Curious", weight: 2 },
        { label: "On board", weight: 3 },
      ]},
      { q: "Pantry: how many of these are stocked? (lentils, olive oil, crushed tomatoes, onions, smoked paprika)", options: [
        { label: "0-1", weight: 0 },
        { label: "2", weight: 1 },
        { label: "3-4", weight: 2 },
        { label: "All five", weight: 3 },
      ]},
      { q: "Why are you exploring this?", options: [
        { label: "Curiosity only", weight: 1 },
        { label: "How I feel after eating", weight: 2 },
        { label: "A specific health goal", weight: 3 },
        { label: "All of the above", weight: 3 },
      ]},
      { q: "When something new flops in the kitchen, you...", options: [
        { label: "Quit for the week", weight: 0 },
        { label: "Order takeout", weight: 1 },
        { label: "Tweak it next time", weight: 2 },
        { label: "Already iterating", weight: 3 },
      ]},
    ],
    bands: [
      { min: 0, max: 6, title: "Curious starter", advice: "Start with the 30-day plan. Two plant dinners a week is the goal.", reading: "/starter-kit" },
      { min: 7, max: 12, title: "Steady learner", advice: "Pick one new ingredient this week and make it twice. Repetition beats novelty.", reading: "/articles?category=guide" },
      { min: 13, max: 18, title: "Mostly there", advice: "You have the rhythm. Use the protein guide and a real grocery list to lock it in.", reading: "/articles?category=protein" },
    ],
  },
  {
    slug: "fiber-baseline",
    title: "Fiber baseline",
    blurb: "A quick check of where your fiber is now. Most adults eat about 15g; the target is closer to 30g.",
    hero: "https://myplant-diet.b-cdn.net/library/lib-09.webp",
    category: "nutrition",
    questions: [
      { q: "Whole grains in a typical day?", options: [
        { label: "None", weight: 0 },
        { label: "1 serving", weight: 1 },
        { label: "2-3 servings", weight: 2 },
        { label: "4+ servings", weight: 3 },
      ]},
      { q: "Beans, lentils, or chickpeas per week?", options: [
        { label: "0", weight: 0 },
        { label: "1-2 times", weight: 1 },
        { label: "3-4 times", weight: 2 },
        { label: "Daily", weight: 3 },
      ]},
      { q: "Vegetables per day (rough cups)?", options: [
        { label: "Less than 1", weight: 0 },
        { label: "1-2", weight: 1 },
        { label: "3-4", weight: 2 },
        { label: "5+", weight: 3 },
      ]},
      { q: "Fruit per day?", options: [
        { label: "0", weight: 0 },
        { label: "1", weight: 1 },
        { label: "2", weight: 2 },
        { label: "3+", weight: 3 },
      ]},
      { q: "Nuts and seeds per week?", options: [
        { label: "Rare", weight: 0 },
        { label: "Once or twice", weight: 1 },
        { label: "Most days", weight: 2 },
        { label: "Daily", weight: 3 },
      ]},
    ],
    bands: [
      { min: 0, max: 5, title: "Below the typical American baseline", advice: "Start with one bean meal and one fruit add per day for a week.", reading: "/articles?category=fiber" },
      { min: 6, max: 10, title: "About average, room to grow", advice: "Add overnight oats and a daily handful of seeds. Two changes, four weeks.", reading: "/articles?category=breakfast" },
      { min: 11, max: 15, title: "On target", advice: "Maintain. Track your week occasionally so you stay in this band.", reading: "/articles" },
    ],
  },
  {
    slug: "protein-confidence",
    title: "Plant protein confidence",
    blurb: "Are you actually getting enough? A short check before you go down a rabbit hole.",
    hero: "https://myplant-diet.b-cdn.net/library/lib-15.webp",
    category: "nutrition",
    questions: [
      { q: "How often do you eat a clearly protein-anchored meal?", options: [
        { label: "Rarely", weight: 0 },
        { label: "Once a day", weight: 1 },
        { label: "Twice a day", weight: 2 },
        { label: "All three meals", weight: 3 },
      ]},
      { q: "Comfort with tofu or tempeh?", options: [
        { label: "None", weight: 0 },
        { label: "Trying it out", weight: 1 },
        { label: "Solid", weight: 2 },
        { label: "Confident", weight: 3 },
      ]},
      { q: "Comfort with lentils and chickpeas?", options: [
        { label: "None", weight: 0 },
        { label: "Sometimes", weight: 1 },
        { label: "Weekly", weight: 2 },
        { label: "Several times a week", weight: 3 },
      ]},
      { q: "Do you check protein on labels?", options: [
        { label: "Never", weight: 0 },
        { label: "Sometimes", weight: 1 },
        { label: "Mostly", weight: 2 },
        { label: "Always", weight: 3 },
      ]},
    ],
    bands: [
      { min: 0, max: 3, title: "Underbuilt", advice: "Make one tofu and one lentil meal this week. Read the protein guide.", reading: "/articles?category=protein" },
      { min: 4, max: 8, title: "Steady, room for one more anchor", advice: "Add a third protein-anchored meal a day. Bowls and stir fries are easiest.", reading: "/articles?category=dinner" },
      { min: 9, max: 12, title: "Solid", advice: "You are fine. Vary sources weekly and you will not have to think about this again.", reading: "/articles" },
    ],
  },
  {
    slug: "iron-status",
    title: "Iron status quick-check",
    blurb: "Plant iron is real iron. The trick is the assistance.",
    hero: "https://myplant-diet.b-cdn.net/library/lib-03.webp",
    category: "nutrition",
    questions: [
      { q: "Iron-rich plants per day (lentils, beans, tofu, leafy greens)?", options: [
        { label: "0", weight: 0 },
        { label: "1", weight: 1 },
        { label: "2", weight: 2 },
        { label: "3+", weight: 3 },
      ]},
      { q: "Vitamin C with iron meals?", options: [
        { label: "Never", weight: 0 },
        { label: "Sometimes", weight: 1 },
        { label: "Most meals", weight: 2 },
        { label: "Always", weight: 3 },
      ]},
      { q: "Coffee or tea right after meals?", options: [
        { label: "Always", weight: 0 },
        { label: "Often", weight: 1 },
        { label: "Sometimes", weight: 2 },
        { label: "Wait an hour", weight: 3 },
      ]},
    ],
    bands: [
      { min: 0, max: 3, title: "Iron risk", advice: "Bigger lentil portions, citrus or peppers with meals, no coffee right after.", reading: "/articles?category=iron" },
      { min: 4, max: 6, title: "Probably fine", advice: "Keep going. Add one C-rich food per iron meal as a habit.", reading: "/articles?category=protein" },
      { min: 7, max: 9, title: "Strong", advice: "You have the system. Get a baseline blood test once a year and forget about it.", reading: "/articles" },
    ],
  },
  {
    slug: "gut-comfort",
    title: "Gut-comfort tracker",
    blurb: "Plants help, until they overwhelm. This tells you which side you are on.",
    hero: "https://myplant-diet.b-cdn.net/library/lib-37.webp",
    category: "wellness",
    questions: [
      { q: "How is your bathroom rhythm?", options: [
        { label: "Irregular", weight: 0 },
        { label: "Sometimes", weight: 1 },
        { label: "Most days", weight: 2 },
        { label: "Daily, predictable", weight: 3 },
      ]},
      { q: "Bloating after meals?", options: [
        { label: "Daily", weight: 0 },
        { label: "Several times a week", weight: 1 },
        { label: "Rarely", weight: 2 },
        { label: "Never", weight: 3 },
      ]},
      { q: "Water intake?", options: [
        { label: "Less than 4 cups", weight: 0 },
        { label: "4-6 cups", weight: 1 },
        { label: "6-8 cups", weight: 2 },
        { label: "8+ cups", weight: 3 },
      ]},
    ],
    bands: [
      { min: 0, max: 3, title: "Tender", advice: "Soak beans, chew slower, water up. Add fiber gradually, not in spikes.", reading: "/articles?category=gut" },
      { min: 4, max: 6, title: "Mostly easy", advice: "Track which one food triggers you. Usually it is one, not many.", reading: "/articles?category=gut" },
      { min: 7, max: 9, title: "Steady", advice: "Maintain. Variety beats volume.", reading: "/articles" },
    ],
  },
  {
    slug: "energy-and-sleep",
    title: "Energy and sleep audit",
    blurb: "What you eat shows up at 3pm and 11pm. Quick read.",
    hero: "https://myplant-diet.b-cdn.net/library/lib-04.webp",
    category: "wellness",
    questions: [
      { q: "3pm slump?", options: [
        { label: "Daily", weight: 0 },
        { label: "Most days", weight: 1 },
        { label: "Rare", weight: 2 },
        { label: "Never", weight: 3 },
      ]},
      { q: "Falling asleep within 20 minutes?", options: [
        { label: "Rare", weight: 0 },
        { label: "Sometimes", weight: 1 },
        { label: "Most nights", weight: 2 },
        { label: "Always", weight: 3 },
      ]},
      { q: "Caffeine after 2pm?", options: [
        { label: "Daily", weight: 0 },
        { label: "Often", weight: 1 },
        { label: "Sometimes", weight: 2 },
        { label: "Never", weight: 3 },
      ]},
    ],
    bands: [
      { min: 0, max: 3, title: "Drained", advice: "Move caffeine before noon. Lunch with real protein and fiber.", reading: "/articles?category=energy" },
      { min: 4, max: 6, title: "Variable", advice: "One change at a time. Sleep schedule first, then breakfast.", reading: "/articles?category=breakfast" },
      { min: 7, max: 9, title: "Charged", advice: "You are doing well. Most people would benefit from your routine.", reading: "/articles" },
    ],
  },
  {
    slug: "kitchen-skill",
    title: "Plant-based kitchen skill",
    blurb: "How fluent are you actually? No judgment, just calibration.",
    hero: "https://myplant-diet.b-cdn.net/library/lib-25.webp",
    category: "starter",
    questions: [
      { q: "Knife skills", options: [
        { label: "Slow", weight: 0 },
        { label: "Functional", weight: 1 },
        { label: "Comfortable", weight: 2 },
        { label: "Fast", weight: 3 },
      ]},
      { q: "Salting and acid", options: [
        { label: "Add at the end", weight: 0 },
        { label: "Add some during", weight: 1 },
        { label: "Layer through cooking", weight: 2 },
        { label: "Adjust by taste", weight: 3 },
      ]},
      { q: "One-pot dinners", options: [
        { label: "Never", weight: 0 },
        { label: "Once a week", weight: 1 },
        { label: "A few times a week", weight: 2 },
        { label: "Default", weight: 3 },
      ]},
    ],
    bands: [
      { min: 0, max: 3, title: "Beginner", advice: "One technique at a time. The aromatic base for soup is a great first lesson.", reading: "/articles?category=technique" },
      { min: 4, max: 6, title: "Comfortable", advice: "Add one new technique a month. Try a slow braise next.", reading: "/articles?category=technique" },
      { min: 7, max: 9, title: "Fluent", advice: "You are kitchen-fluent. Try one new global cuisine this month.", reading: "/articles" },
    ],
  },
  {
    slug: "label-literacy",
    title: "Plant-based label literacy",
    blurb: "Can you spot the actually-good products from the marketing?",
    hero: "https://myplant-diet.b-cdn.net/library/lib-30.webp",
    category: "shopping",
    questions: [
      { q: "Do you read ingredient lists?", options: [
        { label: "Never", weight: 0 },
        { label: "Sometimes", weight: 1 },
        { label: "Most products", weight: 2 },
        { label: "Always", weight: 3 },
      ]},
      { q: "Do you check fiber per serving?", options: [
        { label: "Never", weight: 0 },
        { label: "Rarely", weight: 1 },
        { label: "Sometimes", weight: 2 },
        { label: "Often", weight: 3 },
      ]},
      { q: "Do you compare brands side by side?", options: [
        { label: "Never", weight: 0 },
        { label: "Sometimes", weight: 1 },
        { label: "Often", weight: 2 },
        { label: "Always", weight: 3 },
      ]},
    ],
    bands: [
      { min: 0, max: 3, title: "Marketing trusting", advice: "Start by reading the first three ingredients. Most decisions can be made on those alone.", reading: "/articles?category=labels" },
      { min: 4, max: 6, title: "Aware", advice: "Add fiber and sodium to your scan. Two more numbers. One minute extra per shop.", reading: "/articles?category=shopping" },
      { min: 7, max: 9, title: "Sharp", advice: "You can outsmart the front of any package. Help a friend.", reading: "/articles" },
    ],
  },
  {
    slug: "habit-stickiness",
    title: "Plant-based habit stickiness",
    blurb: "Whether the change you're making will last past week three.",
    hero: "https://myplant-diet.b-cdn.net/library/lib-29.webp",
    category: "wellness",
    questions: [
      { q: "When you slip, do you...", options: [
        { label: "Quit for the week", weight: 0 },
        { label: "Quit for the day", weight: 1 },
        { label: "Pick up at the next meal", weight: 2 },
        { label: "It's already not a thought", weight: 3 },
      ]},
      { q: "Do you have a default lazy meal?", options: [
        { label: "No", weight: 0 },
        { label: "Working on it", weight: 1 },
        { label: "Yes, one", weight: 2 },
        { label: "Yes, three", weight: 3 },
      ]},
      { q: "Do you eat the same breakfast 4+ days a week?", options: [
        { label: "Never", weight: 0 },
        { label: "Sometimes", weight: 1 },
        { label: "Most weeks", weight: 2 },
        { label: "Always", weight: 3 },
      ]},
      { q: "Do you have one repeating dinner you can make on autopilot?", options: [
        { label: "No", weight: 0 },
        { label: "Working on it", weight: 1 },
        { label: "Yes", weight: 2 },
        { label: "Yes and family loves it", weight: 3 },
      ]},
    ],
    bands: [
      { min: 0, max: 4, title: "Fragile", advice: "One default breakfast, one default dinner. That is the entire plan for month one.", reading: "/articles?category=routine" },
      { min: 5, max: 8, title: "Steady", advice: "Add a default lunch. Three repeating meals is the engine that lasts.", reading: "/articles?category=meal-prep" },
      { min: 9, max: 12, title: "Sticky", advice: "You have built it in. Check on it once a season.", reading: "/articles" },
    ],
  },
];

export default function Assessments() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const active = useMemo(
    () => ASSESSMENTS.find((a) => a.slug === activeSlug) || null,
    [activeSlug],
  );

  return (
    <div className="container py-12">
      <header className="max-w-3xl">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/65">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Self-checks
        </span>
        <h1 className="font-serif text-4xl mt-2">Plant-based assessments</h1>
        <p className="mt-3 text-lg text-foreground/75 leading-relaxed">
          Nine short, lovely self-checks. Each takes about 90 seconds. They are
          calibration, not diagnosis. Pick one, take it, and you'll be pointed
          to the next thing actually worth reading.
        </p>
      </header>

      {!active && (
        <section className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ASSESSMENTS.map((a) => (
            <article
              key={a.slug}
              className="rounded-2xl border border-border bg-card overflow-hidden pc-shadow group cursor-pointer"
              onClick={() => setActiveSlug(a.slug)}
            >
              <div className="aspect-[5/3] overflow-hidden">
                <img
                  src={a.hero}
                  alt={a.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-secondary-foreground/80">
                  {a.category}
                </p>
                <h2 className="font-serif text-xl mt-1">{a.title}</h2>
                <p className="text-sm text-foreground/75 mt-2">{a.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-primary text-sm font-medium">
                  Take the check <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </article>
          ))}
        </section>
      )}

      {active && (
        <ActiveAssessment
          assessment={active}
          onExit={() => setActiveSlug(null)}
        />
      )}
    </div>
  );
}

function ActiveAssessment({
  assessment,
  onExit,
}: {
  assessment: Assessment;
  onExit: () => void;
}) {
  const [answers, setAnswers] = useState<number[]>([]);
  const score = answers.reduce((acc, n) => acc + n, 0);
  const finished = answers.length === assessment.questions.length;
  const band = finished
    ? assessment.bands.find((b) => score >= b.min && score <= b.max) ||
      assessment.bands[0]
    : null;

  function answer(weight: number) {
    setAnswers([...answers, weight]);
  }

  function reset() {
    setAnswers([]);
  }

  const currentQ = answers.length < assessment.questions.length
    ? assessment.questions[answers.length]
    : null;

  return (
    <section className="mt-10 max-w-3xl">
      <button
        onClick={onExit}
        className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary"
      >
        ← All assessments
      </button>

      <div className="mt-3 rounded-2xl border border-border bg-card overflow-hidden pc-shadow">
        <div className="aspect-[16/6] overflow-hidden">
          <img src={assessment.hero} alt={assessment.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-serif text-3xl">{assessment.title}</h2>
          <p className="text-foreground/70 mt-2">{assessment.blurb}</p>
        </div>
      </div>

      {currentQ && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8 pc-shadow">
          <p className="text-xs uppercase tracking-wide text-secondary-foreground/80">
            Question {answers.length + 1} of {assessment.questions.length}
          </p>
          <h3 className="font-serif text-2xl mt-1">{currentQ.q}</h3>
          <ul className="mt-4 space-y-2">
            {currentQ.options.map((opt) => (
              <li key={opt.label}>
                <button
                  onClick={() => answer(opt.weight)}
                  className="w-full text-left rounded-xl border border-border bg-background hover:bg-primary/5 hover:border-primary/40 px-4 py-3 transition-colors"
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {finished && band && (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8 pc-shadow">
          <p className="text-xs uppercase tracking-wide text-primary">Your result</p>
          <h3 className="font-serif text-3xl mt-1">{band.title}</h3>
          <p className="mt-3 text-foreground/80 text-lg leading-relaxed">{band.advice}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={band.reading}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 font-medium pc-shadow"
            >
              Read what's next <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 font-medium"
            >
              <RotateCcw className="h-4 w-4" /> Take it again
            </button>
          </div>
          <p className="mt-4 text-xs text-foreground/55">
            Self-checks for personal calibration. Not a substitute for medical
            advice. Talk to your clinician for diagnosis.
          </p>
        </div>
      )}
    </section>
  );
}
