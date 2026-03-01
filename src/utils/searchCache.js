const CACHE_PREFIX = 'peptide_search_'
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000

const COMPREHENSIVE_PEPTIDE_DB = [
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
  { name: 'NAD+ precursors', description: 'Cellular energy and longevity', category: 'longevity' },
  { name: 'Epitalon', description: 'Telomerase activator - Longevity', category: 'longevity' },
  { name: 'GHK', description: 'Copper-binding peptide - Tissue repair', category: 'healing' },
  { name: 'Matrixyl (Palmitoyl Pentapeptide)', description: 'Collagen synthesis - Skin anti-aging', category: 'cosmetic' },
  { name: 'Argireline', description: 'Anti-wrinkle peptide', category: 'cosmetic' },
  { name: 'Copper Peptide GHK-Cu', description: 'Skin regeneration and hair growth', category: 'cosmetic' },
  { name: 'PTD-DBM', description: 'Myostatin inhibitor peptide', category: 'performance' },
  { name: 'Gonadorelin', description: 'GnRH analog - Hormone regulation', category: 'hormone' },
  { name: 'Kisspeptin', description: 'Reproductive hormone regulator', category: 'hormone' },
  { name: 'Oxytocin', description: 'Social bonding hormone peptide', category: 'wellness' },
  { name: 'Vasopressin', description: 'Water retention and blood pressure', category: 'wellness' },
  { name: 'Insulin', description: 'Glucose metabolism peptide hormone', category: 'metabolic' },
  { name: 'Glucagon', description: 'Glucose raising peptide', category: 'metabolic' },
  { name: 'Amylin', description: 'Glucose control peptide', category: 'metabolic' },
  { name: 'Exenatide', description: 'GLP-1 receptor agonist - Diabetes', category: 'metabolic' },
  { name: 'Liraglutide', description: 'GLP-1 agonist - Weight management', category: 'metabolic' },
  { name: 'Dulaglutide', description: 'GLP-1 receptor agonist', category: 'metabolic' },
  { name: 'Pramlintide', description: 'Amylin analog - Diabetes', category: 'metabolic' },
  { name: 'Leptin', description: 'Satiety hormone peptide', category: 'metabolic' },
  { name: 'Ghrelin', description: 'Hunger hormone peptide', category: 'metabolic' },
  { name: 'Orexin', description: 'Wakefulness peptide', category: 'nootropic' },
  { name: 'Substance P', description: 'Pain and inflammation peptide', category: 'wellness' },
  { name: 'Vasoactive Intestinal Peptide', description: 'VIP - Multiple functions', category: 'wellness' },
  { name: 'Calcitonin', description: 'Bone metabolism peptide', category: 'bone' },
  { name: 'PTH (Parathyroid Hormone)', description: 'Calcium regulation', category: 'bone' },
  { name: 'Teriparatide', description: 'PTH analog - Osteoporosis', category: 'bone' },
  { name: 'Abaloparatide', description: 'PTH-related peptide - Bone density', category: 'bone' },
  { name: 'Angiotensin II', description: 'Blood pressure regulation', category: 'cardiovascular' },
  { name: 'Bradykinin', description: 'Vasodilation peptide', category: 'cardiovascular' },
  { name: 'Atrial Natriuretic Peptide', description: 'ANP - Blood pressure', category: 'cardiovascular' },
  { name: 'Brain Natriuretic Peptide', description: 'BNP - Heart failure marker', category: 'cardiovascular' },
  { name: 'Endothelin', description: 'Vasoconstriction peptide', category: 'cardiovascular' },
  { name: 'Neuropeptide Y', description: 'Appetite and stress peptide', category: 'nootropic' },
  { name: 'Galanin', description: 'Neurotransmitter peptide', category: 'nootropic' },
  { name: 'Somatostatin', description: 'Growth hormone inhibitor', category: 'hormone' },
  { name: 'Octreotide', description: 'Somatostatin analog', category: 'hormone' },
  { name: 'Lanreotide', description: 'Somatostatin analog', category: 'hormone' },
  { name: 'Pasireotide', description: 'Somatostatin receptor agonist', category: 'hormone' },
  { name: 'Desmopressin', description: 'Vasopressin analog - Water retention', category: 'hormone' },
  { name: 'Terlipressin', description: 'Vasopressin analog', category: 'cardiovascular' },
  { name: 'Carbetocin', description: 'Oxytocin analog', category: 'hormone' },
  { name: 'Atosiban', description: 'Oxytocin receptor antagonist', category: 'hormone' },
  { name: 'Leuprolide', description: 'GnRH agonist - Hormone therapy', category: 'hormone' },
  { name: 'Goserelin', description: 'GnRH agonist', category: 'hormone' },
  { name: 'Triptorelin', description: 'GnRH agonist', category: 'hormone' },
  { name: 'Degarelix', description: 'GnRH antagonist', category: 'hormone' },
  { name: 'Cetrorelix', description: 'GnRH antagonist', category: 'hormone' },
  { name: 'Ganirelix', description: 'GnRH antagonist', category: 'hormone' },
  { name: 'Buserelin', description: 'GnRH agonist', category: 'hormone' },
  { name: 'Nafarelin', description: 'GnRH agonist', category: 'hormone' },
  { name: 'Histrelin', description: 'GnRH agonist implant', category: 'hormone' },
  { name: 'Enfuvirtide', description: 'HIV fusion inhibitor peptide', category: 'antiviral' },
  { name: 'Gramicidin', description: 'Antimicrobial peptide', category: 'antimicrobial' },
  { name: 'Polymyxin B', description: 'Antibiotic peptide', category: 'antimicrobial' },
  { name: 'Colistin', description: 'Polymyxin E - Antibiotic', category: 'antimicrobial' },
  { name: 'Bacitracin', description: 'Topical antibiotic peptide', category: 'antimicrobial' },
  { name: 'Vancomycin', description: 'Glycopeptide antibiotic', category: 'antimicrobial' },
  { name: 'Teicoplanin', description: 'Glycopeptide antibiotic', category: 'antimicrobial' },
  { name: 'Daptomycin', description: 'Lipopeptide antibiotic', category: 'antimicrobial' },
  { name: 'Nisin', description: 'Antimicrobial lantibiotic', category: 'antimicrobial' },
  { name: 'Defensins', description: 'Antimicrobial peptides', category: 'immune' },
  { name: 'Cathelicidins', description: 'Antimicrobial peptides', category: 'immune' },
  { name: 'Magainin', description: 'Antimicrobial peptide', category: 'antimicrobial' },
  { name: 'Cecropin', description: 'Antimicrobial peptide', category: 'antimicrobial' },
  { name: 'Melittin', description: 'Bee venom antimicrobial peptide', category: 'antimicrobial' },
  { name: 'Protamine', description: 'Heparin antidote peptide', category: 'cardiovascular' },
  { name: 'Glucagon-like Peptide-1', description: 'GLP-1 - Insulin secretion', category: 'metabolic' },
  { name: 'Glucagon-like Peptide-2', description: 'GLP-2 - Intestinal growth', category: 'metabolic' },
  { name: 'Teduglutide', description: 'GLP-2 analog - Short bowel syndrome', category: 'metabolic' },
  { name: 'Cholecystokinin', description: 'CCK - Digestive peptide', category: 'metabolic' },
  { name: 'Secretin', description: 'Pancreatic secretion peptide', category: 'metabolic' },
  { name: 'Gastrin', description: 'Gastric acid secretion', category: 'metabolic' },
  { name: 'Motilin', description: 'GI motility peptide', category: 'metabolic' },
  { name: 'Ghrelin analog', description: 'Appetite stimulation', category: 'metabolic' },
  { name: 'Neuropeptide FF', description: 'Pain modulation peptide', category: 'wellness' },
  { name: 'Dynorphin', description: 'Opioid peptide', category: 'wellness' },
  { name: 'Endorphin', description: 'Opioid peptide - Pain relief', category: 'wellness' },
  { name: 'Enkephalin', description: 'Opioid peptide', category: 'wellness' },
  { name: 'ACTH (Adrenocorticotropic Hormone)', description: 'Cortisol stimulation', category: 'hormone' },
  { name: 'Cosyntropin', description: 'ACTH analog - Diagnostic', category: 'hormone' },
  { name: 'Alpha-MSH', description: 'Melanocyte-stimulating hormone', category: 'hormone' },
  { name: 'Beta-MSH', description: 'Melanocyte-stimulating hormone', category: 'hormone' },
  { name: 'Gamma-MSH', description: 'Melanocyte-stimulating hormone', category: 'hormone' },
  { name: 'PACAP', description: 'Pituitary adenylate cyclase-activating peptide', category: 'nootropic' },
  { name: 'VIP (Vasoactive Intestinal Peptide)', description: 'Neuropeptide', category: 'nootropic' },
  { name: 'Bombesin', description: 'Satiety peptide', category: 'metabolic' },
  { name: 'Neurotensin', description: 'Neuromodulator peptide', category: 'nootropic' },
  { name: 'Somatotropin', description: 'Human growth hormone', category: 'performance' },
  { name: 'Mecasermin', description: 'Recombinant IGF-1', category: 'performance' },
  { name: 'Pegvisomant', description: 'GH receptor antagonist', category: 'hormone' },
  { name: 'Somapacitan', description: 'Long-acting growth hormone', category: 'performance' },
  { name: 'Lonapegsomatropin', description: 'Long-acting GH analog', category: 'performance' },
  { name: 'Erenumab', description: 'CGRP receptor antagonist - Migraine', category: 'wellness' },
  { name: 'Fremanezumab', description: 'CGRP antibody - Migraine', category: 'wellness' },
  { name: 'Galcanezumab', description: 'CGRP antibody - Migraine', category: 'wellness' },
  { name: 'Eptinezumab', description: 'CGRP antibody - Migraine', category: 'wellness' },
  { name: 'Calcitonin Gene-Related Peptide', description: 'CGRP - Pain and vasodilation', category: 'wellness' },
  { name: 'Adrenomedullin', description: 'Vasodilator peptide', category: 'cardiovascular' },
  { name: 'Urotensin II', description: 'Vasoconstrictor peptide', category: 'cardiovascular' },
  { name: 'Apelin', description: 'Cardiovascular peptide', category: 'cardiovascular' },
  { name: 'Ghrelin Mimetics', description: 'Appetite stimulation', category: 'metabolic' },
  { name: 'Anamorelin', description: 'Ghrelin receptor agonist', category: 'metabolic' },
  { name: 'Macimorelin', description: 'Ghrelin receptor agonist - GH test', category: 'hormone' },
  { name: 'Pralmorelin', description: 'GHRP analog', category: 'performance' },
  { name: 'Tabimorelin', description: 'GHRP analog', category: 'performance' },
  { name: 'Capromorelin', description: 'Ghrelin receptor agonist', category: 'metabolic' },
  { name: 'Examorelin', description: 'GHRP analog', category: 'performance' },
  { name: 'Alexamorelin', description: 'GHRP analog', category: 'performance' },
  { name: 'Ulimorelin', description: 'Ghrelin receptor agonist', category: 'metabolic' },
  { name: 'Ibutamoren (MK-677)', description: 'GH secretagogue (not peptide but related)', category: 'performance' },
  { name: 'Bremelanotide (PT-141)', description: 'Melanocortin receptor agonist', category: 'wellness' },
  { name: 'Setmelanotide', description: 'MC4R agonist - Obesity', category: 'metabolic' },
  { name: 'Afamelanotide', description: 'Alpha-MSH analog - Skin protection', category: 'cosmetic' },
  { name: 'Melanotan I', description: 'Alpha-MSH analog - Tanning', category: 'cosmetic' },
  { name: 'NDP-MSH', description: 'Melanocortin agonist', category: 'hormone' },
  { name: 'MTII', description: 'Melanotan II variant', category: 'cosmetic' },
  { name: 'Angiotensin-Converting Enzyme Inhibitors', description: 'ACE peptide fragments', category: 'cardiovascular' },
  { name: 'Bradykinin Analogs', description: 'Vasodilation peptides', category: 'cardiovascular' },
  { name: 'Natriuretic Peptides', description: 'ANP/BNP family', category: 'cardiovascular' },
  { name: 'Nesiritide', description: 'BNP analog - Heart failure', category: 'cardiovascular' },
  { name: 'Cenderitide', description: 'Chimeric natriuretic peptide', category: 'cardiovascular' },
  { name: 'Carperitide', description: 'ANP analog', category: 'cardiovascular' },
  { name: 'Ularitide', description: 'Urodilatin - ANP variant', category: 'cardiovascular' },
  { name: 'Ziconotide', description: 'N-type calcium channel blocker - Pain', category: 'wellness' },
  { name: 'Contulakin-G', description: 'Neurotensin analog - Pain', category: 'wellness' },
  { name: 'Exenatide LAR', description: 'Long-acting exenatide', category: 'metabolic' },
  { name: 'Lixisenatide', description: 'GLP-1 receptor agonist', category: 'metabolic' },
  { name: 'Albiglutide', description: 'GLP-1 receptor agonist', category: 'metabolic' },
  { name: 'Semaglutide (oral)', description: 'Oral GLP-1 agonist', category: 'metabolic' },
  { name: 'Taspoglutide', description: 'GLP-1 receptor agonist', category: 'metabolic' },
  { name: 'Efpeglenatide', description: 'Long-acting GLP-1 agonist', category: 'metabolic' },
  { name: 'Polyarginine (R9)', description: 'Cell-penetrating peptide', category: 'research' },
  { name: 'TAT peptide', description: 'Cell-penetrating peptide', category: 'research' },
  { name: 'Penetratin', description: 'Cell-penetrating peptide', category: 'research' },
  { name: 'Transportan', description: 'Cell-penetrating peptide', category: 'research' },
  { name: 'pVEC', description: 'Cell-penetrating peptide', category: 'research' },
  { name: 'MAP (Model Amphipathic Peptide)', description: 'Cell-penetrating peptide', category: 'research' },
  { name: 'Pep-1', description: 'Cell-penetrating peptide', category: 'research' },
  { name: 'SynB peptides', description: 'Cell-penetrating peptides', category: 'research' },
  { name: 'RGD peptide', description: 'Integrin-binding peptide', category: 'research' },
  { name: 'YIGSR', description: 'Laminin-derived peptide', category: 'research' },
  { name: 'Collagen peptides', description: 'Hydrolyzed collagen', category: 'cosmetic' },
  { name: 'Elastin peptides', description: 'Skin elasticity peptides', category: 'cosmetic' },
  { name: 'Keratin peptides', description: 'Hair and nail peptides', category: 'cosmetic' },
  { name: 'Biotin peptides', description: 'Hair growth peptides', category: 'cosmetic' },
  { name: 'Palmitoyl Tripeptide-1', description: 'Collagen production', category: 'cosmetic' },
  { name: 'Palmitoyl Tripeptide-5', description: 'Collagen synthesis', category: 'cosmetic' },
  { name: 'Palmitoyl Tetrapeptide-7', description: 'Anti-inflammatory cosmetic peptide', category: 'cosmetic' },
  { name: 'Palmitoyl Oligopeptide', description: 'Skin firming peptide', category: 'cosmetic' },
  { name: 'Acetyl Hexapeptide-8', description: 'Argireline - Wrinkle reduction', category: 'cosmetic' },
  { name: 'Acetyl Tetrapeptide-5', description: 'Anti-aging eye peptide', category: 'cosmetic' },
  { name: 'Dipeptide-2', description: 'Anti-puffiness peptide', category: 'cosmetic' },
  { name: 'Tripeptide-10 Citrulline', description: 'Collagen peptide', category: 'cosmetic' },
  { name: 'Hexapeptide-11', description: 'Skin regeneration', category: 'cosmetic' },
  { name: 'Myristoyl Pentapeptide-17', description: 'Eyelash growth peptide', category: 'cosmetic' },
  { name: 'Biotinoyl Tripeptide-1', description: 'Hair follicle peptide', category: 'cosmetic' },
  { name: 'Copper Tripeptide-1', description: 'GHK-Cu variant', category: 'cosmetic' },
  { name: 'PP405', description: 'Experimental hair growth peptide', category: 'cosmetic' },
  { name: 'Finasteride peptide conjugates', description: 'Hair loss treatment enhancers', category: 'cosmetic' },
  { name: 'Minoxidil peptide conjugates', description: 'Hair growth enhancers', category: 'cosmetic' }
]

export const searchPeptides = async (query) => {
  try {
    const response = await fetch(`https://api.peppyhq.com/peptides/search?q=${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      const localResults = filterLocalDatabase(query)
      setCachedResults(query, localResults)
      return localResults
    }

    const data = await response.json()
    const results = data.results || data.peptides || []
    setCachedResults(query, results)
    return results
  } catch (error) {
    console.error('Peptide search error:', error)
    const localResults = filterLocalDatabase(query)
    setCachedResults(query, localResults)
    return localResults
  }
}

const filterLocalDatabase = (query) => {
  const searchTerm = query.toLowerCase()
  return COMPREHENSIVE_PEPTIDE_DB
    .filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    )
    .slice(0, 20)
}

export const getCachedResults = (query) => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + query.toLowerCase())
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_PREFIX + query.toLowerCase())
      return null
    }

    return data
  } catch {
    return null
  }
}

const setCachedResults = (query, data) => {
  try {
    localStorage.setItem(
      CACHE_PREFIX + query.toLowerCase(),
      JSON.stringify({ data, timestamp: Date.now() })
    )
  } catch (error) {
    console.error('Cache storage error:', error)
  }
}