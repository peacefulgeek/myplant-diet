import { useState, useMemo } from "react";
import { Sparkles, Search } from "lucide-react";

type Pick = {
  asin: string;
  name: string;
  category: "supplement" | "herb" | "tcm";
  helps: string[];
  why: string;
  caution?: string;
};

const PICKS: Pick[] = [
  // ── core supplements (vegan-relevant) ──
  { asin: "B07DCPX9GR", name: "Doctor's Best Vitamin B12 (methylcobalamin) 1500mcg", category: "supplement", helps: ["energy", "nerve health", "vegan baseline"], why: "Methyl form, lozenge, the standard recommendation if you eat fully plant-based." },
  { asin: "B0019LWUPY", name: "Garden of Life Vitamin Code Raw B-Complex", category: "supplement", helps: ["energy", "stress", "metabolism"], why: "Whole-food B-complex with B12, B6, folate, and B5 from a real food matrix." },
  { asin: "B074H5YKHX", name: "Nordic Naturals Algae Omega (EPA + DHA)", category: "supplement", helps: ["heart", "brain", "skin"], why: "Algae-source EPA and DHA, no fish oil, third-party tested." },
  { asin: "B07PHV3J16", name: "Sports Research Vegan D3 (5000 IU, lichen)", category: "supplement", helps: ["bone", "mood", "immunity"], why: "Lichen-sourced D3, the form many vegans miss in winter." },
  { asin: "B0011865IQ", name: "NOW Foods Magnesium Citrate 200mg", category: "supplement", helps: ["sleep", "muscle", "regularity"], why: "Citrate form is gentle; most people are short on magnesium even with a clean diet." },
  { asin: "B00280M138", name: "Pure Encapsulations Magnesium Glycinate 120mg", category: "supplement", helps: ["sleep", "anxiety", "muscle"], why: "Glycinate form, calmer on the gut, the bedtime version." },
  { asin: "B005P0XQIS", name: "Garden of Life mykind Organics Plant Iron + Herbs", category: "supplement", helps: ["iron", "energy"], why: "Curry-leaf-derived iron with vitamin C built in for absorption." },
  { asin: "B074H5VK5S", name: "Garden of Life Vitamin Code Zinc 30mg", category: "supplement", helps: ["immunity", "skin"], why: "Whole-food zinc, well tolerated, stand-by during cold season." },
  { asin: "B0747JSQ32", name: "MaryRuth's Liquid Iodine Drops", category: "supplement", helps: ["thyroid", "energy"], why: "Easy way to top up iodine if you skip iodized salt and sea vegetables." },
  { asin: "B00FT0LLLE", name: "NOW Foods Sunflower Lecithin 1200mg", category: "supplement", helps: ["choline", "brain", "fat metabolism"], why: "A vegan choline source if eggs are off the menu." },
  { asin: "B07YK4D6XG", name: "Now Foods True Calm GABA Blend", category: "supplement", helps: ["sleep", "stress"], why: "GABA + theanine for evening wind-down without sedation." },
  { asin: "B07DG4KH7S", name: "Pure Encapsulations Probiotic 50B", category: "supplement", helps: ["gut", "immunity", "digestion"], why: "Multi-strain, dairy-free, refrigeration optional, well documented." },
  { asin: "B07PNDV8YL", name: "Renew Life Ultimate Flora Probiotic 50B", category: "supplement", helps: ["gut", "regularity"], why: "Daily probiotic with bifidobacterium-heavy blend for fiber-rich eaters." },
  { asin: "B0033GUNUK", name: "Bob's Red Mill Psyllium Husk Powder", category: "supplement", helps: ["fiber", "regularity", "cholesterol"], why: "Cheap, soluble fiber, the easiest 5g add-in to oatmeal or smoothies." },
  { asin: "B003NFB46Q", name: "NOW Foods CoQ10 100mg", category: "supplement", helps: ["heart", "energy"], why: "Heart and mitochondrial support, especially after 40 or with statin use." },
  { asin: "B07JFD9C3V", name: "Doctor's Best Astaxanthin 6mg", category: "supplement", helps: ["skin", "eyes", "antioxidant"], why: "Carotenoid antioxidant, the one most plant-eaters miss." },
  { asin: "B005Z6ZL5O", name: "Garden of Life Sport Vegan Protein", category: "supplement", helps: ["protein", "recovery"], why: "Pea + sprouted protein blend, post-workout staple if meals run light." },
  { asin: "B07TY9Q4WK", name: "MaryRuth's Vegan Multivitamin Liquid", category: "supplement", helps: ["daily baseline"], why: "A liquid daily multivitamin for people who hate horse pills." },
  { asin: "B00R47RJK0", name: "Carlson Nutra-Support Joint", category: "supplement", helps: ["joints", "mobility"], why: "Glucosamine-free joint blend for plant-based eaters with creaky knees." },
  { asin: "B07GR5MSKD", name: "Vitafusion Power Zinc Gummies", category: "supplement", helps: ["immunity"], why: "Travel-friendly zinc gummies for people who keep forgetting capsules." },

  // ── western herbs ──
  { asin: "B074PTQ4K8", name: "Gaia Herbs Ashwagandha Root Capsules", category: "herb", helps: ["stress", "sleep", "adrenals"], why: "Standardized root extract; the most studied adaptogen for stress." },
  { asin: "B003B3OOKA", name: "Gaia Herbs Turmeric Supreme", category: "herb", helps: ["inflammation", "joints"], why: "Curcuminoid extract with black pepper for absorption." },
  { asin: "B0002Y25LC", name: "Nature's Way Milk Thistle 175mg", category: "herb", helps: ["liver"], why: "Silymarin, one of the better-studied liver-support herbs." },
  { asin: "B0009F3PJA", name: "Nature's Way Echinacea Purpurea Herb 400mg", category: "herb", helps: ["immune", "cold-and-flu"], why: "First few days of a cold; standardized aerial parts." },
  { asin: "B00018QC30", name: "Nature's Answer Elderberry Liquid Extract", category: "herb", helps: ["immune"], why: "Black elderberry liquid; a winter household staple." },
  { asin: "B000WU1JMS", name: "Gaia Herbs Rhodiola Rosea", category: "herb", helps: ["energy", "mental endurance"], why: "Adaptogen for fatigue and focus during demanding stretches." },
  { asin: "B007LRGAXG", name: "Gaia Herbs Reishi Mushroom", category: "herb", helps: ["sleep", "immunity"], why: "Calm mushroom; evening cup or capsule." },
  { asin: "B07J9FW43N", name: "Host Defense Lion's Mane Capsules", category: "herb", helps: ["focus", "memory", "nerves"], why: "Whole-mushroom lion's mane for cognitive support." },
  { asin: "B00NK1A5XE", name: "Nature's Answer Holy Basil (Tulsi)", category: "herb", helps: ["stress", "blood sugar"], why: "Tulsi tincture; gentle nervous-system tonic." },
  { asin: "B07TDLSJ7H", name: "Pukka Herbs Three Tulsi Tea", category: "herb", helps: ["stress", "calm"], why: "A daily tulsi tea is the lowest-effort way to use it." },
  { asin: "B005ZBZX86", name: "Nature's Way St. John's Wort Standardized 300mg", category: "herb", helps: ["mood"], why: "Standardized extract; talk to a clinician if you're on medications." },
  { asin: "B0019LRY8A", name: "Now Foods Valerian Root 500mg", category: "herb", helps: ["sleep"], why: "Old-school sleep herb; the smell is real, the effect is real." },
  { asin: "B00028MCYS", name: "Nature's Answer Passionflower Liquid Extract", category: "herb", helps: ["sleep", "anxiety"], why: "Passionflower for sleep and racing thoughts; pairs with valerian." },
  { asin: "B00014F8VG", name: "Now Foods Dandelion Root", category: "herb", helps: ["liver", "digestion"], why: "Bitter root for digestion and liver support; drink as tea." },
  { asin: "B003B3CVRK", name: "Gaia Herbs Hawthorn Supreme", category: "herb", helps: ["heart", "circulation"], why: "Hawthorn berry and leaf, classic heart herb." },
  { asin: "B0019GW3WS", name: "NOW Foods Saw Palmetto 320mg", category: "herb", helps: ["prostate"], why: "Standard saw palmetto if it applies." },
  { asin: "B0019LV56G", name: "Gaia Herbs Black Cohosh", category: "herb", helps: ["menopause"], why: "Standardized black cohosh, the most studied non-hormonal option." },

  // ── TCM ──
  { asin: "B00FT0LRSM", name: "Plum Flower Astragalus Bupleurum Combination", category: "tcm", helps: ["immune", "energy"], why: "Classic huang qi formula for daily wei qi (defensive energy) support." },
  { asin: "B00JW86X1C", name: "Health Concerns Astra 8 Tablets", category: "tcm", helps: ["energy", "immunity"], why: "Astragalus-based qi tonic, a Bay Area TCM staple." },
  { asin: "B07L9N6V6D", name: "Plum Flower Shi Quan Da Bu Wan (Ten-Flavor Tea)", category: "tcm", helps: ["fatigue", "qi and blood"], why: "Classic ten-herb tonic for qi and blood deficiency." },
  { asin: "B00EZL0X18", name: "Plum Flower Liu Wei Di Huang Wan (Six-Flavor Rehmanni)", category: "tcm", helps: ["yin tonic", "menopause"], why: "The most prescribed yin tonic in China; gentle, daily." },
  { asin: "B00EZL0RVK", name: "Plum Flower Xiao Yao Wan (Free and Easy Wanderer)", category: "tcm", helps: ["stress", "mood", "PMS"], why: "Liver-qi-moving classic for irritability and emotional stagnation." },
  { asin: "B00JM4GZ0G", name: "Plum Flower Bao He Wan", category: "tcm", helps: ["digestion", "food stagnation"], why: "After a heavy meal — old-school remedy for that stuck feeling." },
  { asin: "B00JM4GA86", name: "Plum Flower Yin Qiao Jie Du Pian", category: "tcm", helps: ["early cold", "sore throat"], why: "Day-one cold formula, take at the first tickle." },
  { asin: "B00JM4G1KQ", name: "Plum Flower Jia Wei Xiao Yao Wan (Bupleurum & Peony)", category: "tcm", helps: ["mood", "PMS", "stress"], why: "Free-and-easy wanderer plus mu dan pi and zhi zi for heat." },
  { asin: "B00FT0LSC6", name: "Plum Flower Suan Zao Ren Tang", category: "tcm", helps: ["sleep", "anxious thoughts"], why: "Classic sleep formula with sour jujube seed; for the mind that won't quiet." },
  { asin: "B00JM4FWWC", name: "Plum Flower Tian Wang Bu Xin Dan", category: "tcm", helps: ["sleep", "memory", "heart yin"], why: "For palpitations, restless sleep, and dry-mouth nervous types." },
  { asin: "B00JM4F0J0", name: "Plum Flower Si Wu Tang", category: "tcm", helps: ["blood tonic", "menstrual support"], why: "Four-substance decoction; the most-used blood tonic in TCM." },
  { asin: "B00JM4G8FK", name: "Plum Flower Gui Pi Wan", category: "tcm", helps: ["fatigue", "anxiety", "blood and qi"], why: "Spleen-and-heart support for thinkers who run themselves down." },
  { asin: "B00JM4FOWO", name: "Plum Flower Bu Zhong Yi Qi Wan", category: "tcm", helps: ["energy", "digestion"], why: "Center-tonifying classic for low daytime energy." },
  { asin: "B00JM4FYK0", name: "Plum Flower Du Huo Ji Sheng Wan", category: "tcm", helps: ["joints", "lower back"], why: "For aching, cold, damp lower back and knees." },
];

const CATS = [
  { id: "all", label: "All" },
  { id: "supplement", label: "Supplements" },
  { id: "herb", label: "Western herbs" },
  { id: "tcm", label: "Chinese (TCM)" },
];

export default function Supplements() {
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = PICKS;
    if (filter !== "all") list = list.filter((p) => p.category === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.why.toLowerCase().includes(q) ||
          p.helps.some((h) => h.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [filter, query]);

  return (
    <div className="container py-12">
      <header className="max-w-3xl">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/65">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Curated, plant-relevant
        </span>
        <h1 className="font-serif text-4xl mt-2">
          Supplements, herbs &amp; TCM that actually help
        </h1>
        <p className="mt-3 text-lg text-foreground/75 leading-relaxed">
          Fifty verified picks across vegan-relevant supplements, western herbs,
          and traditional Chinese formulas. Each is matched to what it actually
          helps with. Affiliate links are marked &quot;(paid link)&quot;. None of
          this replaces a clinician — it is curation, not prescription.
        </p>
      </header>

      <div className="mt-8 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="inline-flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={
                "rounded-full px-4 py-2 text-sm border transition-colors " +
                (filter === c.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground/75 border-border hover:bg-primary/5")
              }
            >
              {c.label}
            </button>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2">
          <Search className="h-4 w-4 text-foreground/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or symptom"
            className="bg-transparent outline-none text-sm w-full md:w-64"
          />
        </label>
      </div>

      <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => (
          <li
            key={p.asin}
            className="rounded-2xl border border-border bg-card p-5 pc-shadow flex flex-col"
          >
            <p className="text-xs uppercase tracking-wide text-secondary-foreground/80">
              {p.category === "supplement"
                ? "Supplement"
                : p.category === "herb"
                  ? "Western herb"
                  : "Traditional Chinese"}
            </p>
            <h3 className="font-serif text-lg mt-1 leading-snug">{p.name}</h3>
            <p className="text-sm text-foreground/75 mt-2 flex-1">{p.why}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {p.helps.map((h) => (
                <li
                  key={h}
                  className="text-[11px] uppercase tracking-wide rounded-full bg-primary/10 text-primary px-2 py-0.5"
                >
                  {h}
                </li>
              ))}
            </ul>
            <a
              href={`https://www.amazon.com/dp/${p.asin}/?tag=spankyspinola-20`}
              rel="nofollow sponsored noopener"
              target="_blank"
              className="mt-4 inline-flex items-center text-primary text-sm underline"
            >
              See on Amazon (paid link)
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-xs text-foreground/55 max-w-3xl">
        Editorial note: this curation is independent. Affiliate links cost you
        nothing extra. Talk to your clinician about anything you take, especially
        if you are pregnant, on medications, or planning surgery. Some herbs
        interact with prescription drugs.
      </p>
    </div>
  );
}
