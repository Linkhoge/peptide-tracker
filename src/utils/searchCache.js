// In-memory cache (replaces localStorage which is blocked in sandboxed iframes)
const memoryCache = new Map()
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

const PEPTIDE_DB = [
  { name: 'BPC-157', description: 'Body Protection Compound - Healing and tissue repair', category: 'healing' },
  { name: 'TB-500', description: 'Thymosin Beta-4 - Tissue regeneration and recovery', category: 'healing' },
  { name: 'GHK-Cu', description: 'Copper Peptide - Hair growth, skin regeneration, wound healing', category: 'cosmetic' },
  { name: 'Retatrutide', description: 'GIP/GLP-1/Glucagon triple agonist - Weight management', category: 'metabolic' },
  { name: 'Semaglutide', description: 'GLP-1 agonist - Weight loss and glucose control', category: 'metabolic' },
  { name: 'Tirzepatide', description: 'GIP/GLP-1 dual agonist - Metabolic health', category: 'metabolic' },
  { name: 'Ipamorelin', description: 'Growth hormone secretagogue - GH release', category: 'performance' },
  { name: 'CJC-1295', description: 'GHRH analog - Growth hormone release', category: 'performance' },
  { name: 'PT-141 (Bremelanotide)', description: 'Melanocortin agonist - Sexual health', category: 'wellness' },
  { name: 'Melanotan II', description: 'Melanocortin receptor agonist - Tanning', category: 'cosmetic' },
  { name: 'Selank', description: 'Anxiolytic nootropic peptide', category: 'nootropic' },
  { name: 'Semax', description: 'Cognitive enhancement peptide', category: 'nootropic' },
  { name: 'Epithalon', description: 'Telomerase activator - Anti-aging', category: 'longevity' },
  { name: 'DSIP', description: 'Delta sleep-inducing peptide - Sleep regulation', category: 'wellness' },
  { name: 'Thymosin Alpha-1', description: 'Immune system modulator', category: 'immune' },
  { name: 'LL-37', description: 'Antimicrobial peptide - Immune defense', category: 'immune' },
  { name: 'Cerebrolysin', description: 'Neuroprotective peptide complex', category: 'nootropic' },
  { name: 'P21', description: 'Neuroprotective and cognitive enhancer', category: 'nootropic' },
  { name: 'Dihexa', description: 'Cognitive enhancement - BDNF modulator', category: 'nootropic' },
  { name: 'AOD-9604', description: 'Fat burning fragment - Weight loss', category: 'metabolic' },
  { name: 'Fragment 176-191', description: 'HGH fragment - Fat loss', category: 'metabolic' },
  { name: 'GHRP-6', description: 'Growth hormone releasing peptide', category: 'performance' },
  { name: 'GHRP-2', description: 'Growth hormone secretagogue', category: 'performance' },
  { name: 'Hexarelin', description: 'Growth hormone secretagogue', category: 'performance' },
  { name: 'Sermorelin', description: 'GHRH analog - GH stimulation', category: 'performance' },
  { name: 'Tesamorelin', description: 'GHRH analog - Visceral fat reduction', category: 'metabolic' },
  { name: 'IGF-1 LR3', description: 'Insulin-like growth factor - Muscle growth', category: 'performance' },
  { name: 'IGF-1 DES', description: 'Short-acting IGF-1 variant', category: 'performance' },
  { name: 'MGF (PEG-MGF)', description: 'Mechano growth factor - Muscle repair', category: 'performance' },
  { name: 'Follistatin 344', description: 'Myostatin inhibitor - Muscle growth', category: 'performance' },
  { name: 'ACE-031', description: 'Myostatin inhibitor', category: 'performance' },
  { name: 'Adipotide', description: 'Fat tissue targeting peptide', category: 'metabolic' },
  { name: 'MOTS-c', description: 'Mitochondrial peptide - Metabolic health', category: 'metabolic' },
  { name: 'Humanin', description: 'Mitochondrial peptide - Neuroprotection', category: 'longevity' },
  { name: 'SS-31 (Elamipretide)', description: 'Mitochondrial-targeting peptide', category: 'longevity' },
  { name: 'Epitalon', description: 'Telomerase activator - Longevity', category: 'longevity' },
  { name: 'GHK', description: 'Copper-binding peptide - Tissue repair', category: 'healing' },
  { name: 'Matrixyl', description: 'Collagen synthesis - Skin anti-aging', category: 'cosmetic' },
  { name: 'Argireline', description: 'Anti-wrinkle peptide', category: 'cosmetic' },
  { name: 'PTD-DBM', description: 'Myostatin inhibitor peptide', category: 'performance' },
  { name: 'Gonadorelin', description: 'GnRH analog - Hormone regulation', category: 'hormone' },
  { name: 'Kisspeptin', description: 'Reproductive hormone regulator', category: 'hormone' },
  { name: 'Oxytocin', description: 'Social bonding hormone peptide', category: 'wellness' },
  { name: 'Somatostatin', description: 'Growth hormone inhibitor', category: 'hormone' },
  { name: 'Ibutamoren (MK-677)', description: 'GH secretagogue', category: 'performance' },
  { name: 'Setmelanotide', description: 'MC4R agonist - Obesity', category: 'metabolic' },
  { name: 'Afamelanotide', description: 'Alpha-MSH analog - Skin protection', category: 'cosmetic' },
  { name: 'Melanotan I', description: 'Alpha-MSH analog - Tanning', category: 'cosmetic' },
  { name: 'Collagen peptides', description: 'Hydrolyzed collagen', category: 'cosmetic' },
  { name: 'Elastin peptides', description: 'Skin elasticity peptides', category: 'cosmetic' },
  { name: 'GLP-1 (Glucagon-like Peptide-1)', description: 'Insulin secretion', category: 'metabolic' },
  { name: 'Liraglutide', description: 'GLP-1 agonist - Weight management', category: 'metabolic' },
  { name: 'Exenatide', description: 'GLP-1 receptor agonist - Diabetes', category: 'metabolic' },
  { name: 'Pramlintide', description: 'Amylin analog - Diabetes', category: 'metabolic' },
  { name: 'Teduglutide', description: 'GLP-2 analog - Short bowel syndrome', category: 'metabolic' },
  { name: 'Ziconotide', description: 'N-type calcium channel blocker - Pain', category: 'wellness' },
  { name: 'Dynorphin', description: 'Opioid peptide', category: 'wellness' },
  { name: 'Endorphin', description: 'Opioid peptide - Pain relief', category: 'wellness' },
  { name: 'ACTH', description: 'Adrenocorticotropic Hormone - Cortisol stimulation', category: 'hormone' },
  { name: 'Alpha-MSH', description: 'Melanocyte-stimulating hormone', category: 'hormone' },
  { name: 'Calcitonin', description: 'Bone metabolism peptide', category: 'bone' },
  { name: 'Teriparatide', description: 'PTH analog - Osteoporosis', category: 'bone' },
  { name: 'Neuropeptide Y', description: 'Appetite and stress peptide', category: 'nootropic' },
  { name: 'Orexin', description: 'Wakefulness peptide', category: 'nootropic' },
  { name: 'PACAP', description: 'Pituitary adenylate cyclase-activating peptide', category: 'nootropic' },
  { name: 'Anamorelin', description: 'Ghrelin receptor agonist', category: 'metabolic' },
  { name: 'Macimorelin', description: 'Ghrelin receptor agonist - GH test', category: 'hormone' },
  { name: 'Leuprolide', description: 'GnRH agonist - Hormone therapy', category: 'hormone' },
  { name: 'Goserelin', description: 'GnRH agonist', category: 'hormone' },
  { name: 'Somatotropin', description: 'Human growth hormone', category: 'performance' },
  { name: 'IGF-1 (Mecasermin)', description: 'Recombinant IGF-1', category: 'performance' },
  { name: 'Defensins', description: 'Antimicrobial peptides', category: 'immune' },
  { name: 'Cathelicidins', description: 'Antimicrobial peptides', category: 'immune' },
  { name: 'Vancomycin', description: 'Glycopeptide antibiotic', category: 'antimicrobial' },
  { name: 'Daptomycin', description: 'Lipopeptide antibiotic', category: 'antimicrobial' },
  { name: 'RGD peptide', description: 'Integrin-binding peptide', category: 'research' },
  { name: 'TAT peptide', description: 'Cell-penetrating peptide', category: 'research' },
  { name: 'Penetratin', description: 'Cell-penetrating peptide', category: 'research' },
]

const filterLocal = (query) => {
  const q = query.toLowerCase()
  return PEPTIDE_DB
    .filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    .slice(0, 20)
}

export const getCachedResults = (query) => {
  const key = query.toLowerCase()
  const entry = memoryCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    memoryCache.delete(key)
    return null
  }
  return entry.data
}

const setCachedResults = (query, data) => {
  memoryCache.set(query.toLowerCase(), { data, timestamp: Date.now() })
}

export const searchPeptides = async (query) => {
  try {
    const res = await fetch(`https://api.peppyhq.com/peptides/search?q=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    const results = data.results || data.peptides || []
    setCachedResults(query, results)
    return results
  } catch {
    const local = filterLocal(query)
    setCachedResults(query, local)
    return local
  }
}
