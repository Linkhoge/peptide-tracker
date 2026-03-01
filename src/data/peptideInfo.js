export const PEPTIDE_INFO_DATABASE = {
  'BPC-157': {
    fullName: 'Body Protection Compound-157',
    category: 'Healing & Tissue Repair',
    description: 'Synthetic peptide derived from gastric juice protein BPC. Promotes healing of various tissues including tendons, ligaments, muscles, and gut.',
    dosage: {
      standard: '250-500 mcg',
      range: '200-800 mcg',
      timing: 'Once or twice daily',
      administration: 'Subcutaneous or intramuscular injection'
    },
    protocol: {
      duration: '4-8 weeks typical cycle',
      frequency: 'Daily',
      notes: 'Can be used near injury site for localized healing or abdomen for systemic effects'
    },
    halfLife: '~4 hours',
    uses: ['Tendon/ligament repair', 'Muscle healing', 'Gut health', 'Inflammation reduction', 'Joint protection'],
    references: 'Research dosing based on animal studies scaled to human use'
  },
  'TB-500': {
    fullName: 'Thymosin Beta-4 Fragment',
    category: 'Healing & Recovery',
    description: 'Synthetic version of naturally occurring peptide. Promotes cell migration, angiogenesis, and tissue regeneration.',
    dosage: {
      standard: '2-2.5 mg',
      range: '2-10 mg',
      timing: 'Twice weekly',
      administration: 'Subcutaneous injection'
    },
    protocol: {
      duration: '4-6 weeks loading, then maintenance',
      frequency: '2x per week loading, 1x per week maintenance',
      notes: 'Higher doses (5-10mg) used for acute injuries'
    },
    halfLife: '~10 days',
    uses: ['Injury recovery', 'Flexibility improvement', 'Inflammation reduction', 'Hair growth (experimental)'],
    references: 'Athletic and veterinary use guidelines'
  },
  'GHK-Cu': {
    fullName: 'Copper Peptide (Glycyl-L-Histidyl-L-Lysine-Copper)',
    category: 'Cosmetic & Hair Growth',
    description: 'Naturally occurring copper complex that promotes collagen synthesis, wound healing, and hair follicle stimulation.',
    dosage: {
      standard: '1-2 mg',
      range: '0.5-3 mg',
      timing: 'Daily or every other day',
      administration: 'Subcutaneous injection or topical application'
    },
    protocol: {
      duration: '3-6 months for hair growth',
      frequency: 'Daily to 3x per week',
      notes: 'Topical: 1-3% concentration. Injectable shows better systemic effects'
    },
    halfLife: '~24 hours',
    uses: ['Hair growth and thickness', 'Skin regeneration', 'Wound healing', 'Anti-aging', 'Collagen production'],
    references: 'Dermatological research and hair restoration protocols'
  },
  'Retatrutide': {
    fullName: 'LY3437943 (GIP/GLP-1/Glucagon Triple Agonist)',
    category: 'Metabolic & Weight Loss',
    description: 'Novel triple agonist targeting GIP, GLP-1, and glucagon receptors for weight management and metabolic health.',
    dosage: {
      standard: '4-12 mg weekly (titrated)',
      range: '0.5-12 mg weekly',
      timing: 'Once weekly',
      administration: 'Subcutaneous injection'
    },
    protocol: {
      duration: '12-48 weeks',
      frequency: 'Once per week',
      notes: 'Titration schedule: 0.5mg→1mg→2mg→4mg→8mg→12mg over 16 weeks'
    },
    halfLife: '~5-7 days',
    uses: ['Weight loss', 'Metabolic syndrome', 'Type 2 diabetes management', 'Appetite suppression'],
    references: 'Phase 2/3 clinical trial protocols (SURMOUNT trials)'
  },
  'Semaglutide': {
    fullName: 'GLP-1 Receptor Agonist',
    category: 'Metabolic & Weight Loss',
    description: 'Long-acting GLP-1 analog approved for diabetes and weight management (Ozempic/Wegovy).',
    dosage: {
      standard: '1-2.4 mg weekly',
      range: '0.25-2.4 mg weekly',
      timing: 'Once weekly',
      administration: 'Subcutaneous injection'
    },
    protocol: {
      duration: 'Long-term maintenance',
      frequency: 'Once per week',
      notes: 'Titration: 0.25mg→0.5mg→1mg→1.7mg→2.4mg (4 weeks each step)'
    },
    halfLife: '~7 days',
    uses: ['Weight loss', 'Type 2 diabetes', 'Cardiovascular risk reduction', 'Appetite control'],
    references: 'FDA-approved prescribing information'
  },
  'Tirzepatide': {
    fullName: 'GIP/GLP-1 Dual Agonist',
    category: 'Metabolic & Weight Loss',
    description: 'Dual incretin agonist approved as Mounjaro/Zepbound for diabetes and weight management.',
    dosage: {
      standard: '5-15 mg weekly',
      range: '2.5-15 mg weekly',
      timing: 'Once weekly',
      administration: 'Subcutaneous injection'
    },
    protocol: {
      duration: 'Long-term maintenance',
      frequency: 'Once per week',
      notes: 'Titration: 2.5mg→5mg→7.5mg→10mg→12.5mg→15mg (4 weeks each)'
    },
    halfLife: '~5 days',
    uses: ['Weight loss', 'Type 2 diabetes', 'Improved insulin sensitivity', 'Metabolic health'],
    references: 'FDA-approved prescribing information (SURPASS/SURMOUNT trials)'
  },
  'Ipamorelin': {
    fullName: 'Growth Hormone Secretagogue',
    category: 'Performance & Recovery',
    description: 'Selective growth hormone secretagogue with minimal effects on cortisol and prolactin.',
    dosage: {
      standard: '200-300 mcg',
      range: '100-500 mcg',
      timing: '1-3 times daily (morning, post-workout, before bed)',
      administration: 'Subcutaneous injection'
    },
    protocol: {
      duration: '8-12 weeks, then 4 weeks off',
      frequency: '1-3x daily',
      notes: 'Best on empty stomach. Often stacked with CJC-1295'
    },
    halfLife: '~2 hours',
    uses: ['Growth hormone release', 'Recovery', 'Muscle growth', 'Fat loss', 'Sleep quality'],
    references: 'Research and athletic community protocols'
  },
  'CJC-1295': {
    fullName: 'Growth Hormone Releasing Hormone Analog',
    category: 'Performance & Longevity',
    description: 'GHRH analog available with (DAC) or without (No DAC) Drug Affinity Complex for extended release.',
    dosage: {
      standard: '1-2 mg per week (with DAC) or 100 mcg 1-3x daily (no DAC)',
      range: '0.5-2 mg (DAC) or 50-200 mcg (No DAC)',
      timing: 'Weekly (DAC) or 1-3x daily (No DAC)',
      administration: 'Subcutaneous injection'
    },
    protocol: {
      duration: '8-12 weeks on, 4 weeks off',
      frequency: 'Depends on version (DAC vs No DAC)',
      notes: 'No DAC often paired with Ipamorelin for synergy'
    },
    halfLife: '~6-8 days (DAC), ~30 min (No DAC)',
    uses: ['Growth hormone elevation', 'Anti-aging', 'Recovery', 'Body composition', 'Sleep improvement'],
    references: 'Clinical and research protocols'
  },
  'PT-141': {
    fullName: 'Bremelanotide (Melanocortin Receptor Agonist)',
    category: 'Sexual Health',
    description: 'Melanocortin receptor agonist FDA-approved for hypoactive sexual desire disorder in women.',
    dosage: {
      standard: '1.75 mg',
      range: '0.5-2 mg',
      timing: 'As needed, 45 min before activity',
      administration: 'Subcutaneous injection'
    },
    protocol: {
      duration: 'As needed basis',
      frequency: 'No more than 8 doses per month',
      notes: 'Effects last 6-12 hours. May cause nausea initially'
    },
    halfLife: '~2-3 hours',
    uses: ['Libido enhancement', 'Sexual dysfunction treatment', 'Arousal support'],
    references: 'FDA-approved (Vyleesi) prescribing information'
  },
  'Melanotan II': {
    fullName: 'Melanocortin Receptor Agonist',
    category: 'Cosmetic & Tanning',
    description: 'Synthetic analog of alpha-MSH that stimulates melanogenesis and tanning.',
    dosage: {
      standard: '0.5-1 mg',
      range: '0.25-2 mg',
      timing: 'Daily or every other day',
      administration: 'Subcutaneous injection'
    },
    protocol: {
      duration: 'Loading: 2-4 weeks, Maintenance: as needed',
      frequency: 'Daily loading, 2-3x weekly maintenance',
      notes: 'Start low to assess tolerance. Use with UV exposure for tanning'
    },
    halfLife: '~33 minutes',
    uses: ['Skin tanning', 'Libido enhancement (side effect)', 'Appetite suppression'],
    references: 'Research use and cosmetic protocols'
  },
  'Selank': {
    fullName: 'Synthetic Anxiolytic Nootropic Peptide',
    category: 'Nootropic & Mood',
    description: 'Russian-developed synthetic peptide based on tuftsin with anxiolytic and cognitive effects.',
    dosage: {
      standard: '250-500 mcg',
      range: '150-3000 mcg',
      timing: '1-3 times daily',
      administration: 'Intranasal or subcutaneous injection'
    },
    protocol: {
      duration: '2-4 weeks, cycling recommended',
      frequency: 'Daily',
      notes: 'Intranasal preferred for cognitive effects. No withdrawal reported'
    },
    halfLife: '~20 minutes',
    uses: ['Anxiety reduction', 'Cognitive enhancement', 'Stress management', 'Focus improvement'],
    references: 'Russian clinical research'
  },
  'Semax': {
    fullName: 'Cognitive Enhancement Peptide (ACTH Fragment)',
    category: 'Nootropic & Cognitive',
    description: 'Russian nootropic derived from ACTH(4-10) that enhances learning, memory, and neuroprotection.',
    dosage: {
      standard: '300-600 mcg',
      range: '200-3000 mcg',
      timing: 'Once or twice daily (morning)',
      administration: 'Intranasal spray or subcutaneous'
    },
    protocol: {
      duration: '2-8 weeks, cycle off for equal time',
      frequency: 'Daily',
      notes: 'Higher potency versions: N-Acetyl Semax, Semax Amidate available'
    },
    halfLife: '~10 minutes',
    uses: ['Cognitive enhancement', 'Memory improvement', 'Neuroprotection', 'Focus', 'Stroke recovery'],
    references: 'Russian pharmaceutical research'
  },
  'Epithalon': {
    fullName: 'Epitalon (Telomerase Activator)',
    category: 'Longevity & Anti-Aging',
    description: 'Synthetic tetrapeptide that may activate telomerase and extend cellular lifespan.',
    dosage: {
      standard: '5-10 mg',
      range: '5-20 mg',
      timing: 'Daily or divided doses',
      administration: 'Subcutaneous or intramuscular injection'
    },
    protocol: {
      duration: '10-20 days per cycle, 2-4 cycles per year',
      frequency: 'Daily during cycle',
      notes: 'Often used in short intensive bursts rather than continuous use'
    },
    halfLife: 'Unknown (likely short)',
    uses: ['Cellular longevity', 'Sleep regulation', 'Antioxidant effects', 'Immune support'],
    references: 'Russian anti-aging research (Khavinson et al.)'
  },
  'Thymosin Alpha-1': {
    fullName: 'Thymosin α1 (Immune Modulator)',
    category: 'Immune System',
    description: 'Naturally occurring peptide that enhances T-cell function and immune response.',
    dosage: {
      standard: '0.9-1.6 mg',
      range: '0.8-3.2 mg',
      timing: 'Twice weekly',
      administration: 'Subcutaneous injection'
    },
    protocol: {
      duration: '4-12 weeks or longer for chronic conditions',
      frequency: '2-3x per week',
      notes: 'FDA-approved in some countries (Zadaxin). Used for hepatitis, cancer support'
    },
    halfLife: '~2 hours',
    uses: ['Immune enhancement', 'Viral infection support', 'Cancer adjuvant therapy', 'Chronic fatigue'],
    references: 'Clinical use in immunotherapy'
  },
  'LL-37': {
    fullName: 'Cathelicidin Antimicrobial Peptide',
    category: 'Immune & Antimicrobial',
    description: 'Human antimicrobial peptide with broad-spectrum activity against bacteria, viruses, and fungi.',
    dosage: {
      standard: '2-5 mg',
      range: '1-10 mg',
      timing: 'Daily or as needed',
      administration: 'Subcutaneous injection or nasal spray'
    },
    protocol: {
      duration: '1-4 weeks for acute, longer for chronic',
      frequency: 'Daily',
      notes: 'Experimental. Nasal spray effective for sinus/respiratory infections'
    },
    halfLife: '~6 hours',
    uses: ['Antimicrobial defense', 'Wound healing', 'Immune support', 'Biofilm disruption'],
    references: 'Research and experimental use'
  },
  'DSIP': {
    fullName: 'Delta Sleep-Inducing Peptide',
    category: 'Sleep & Recovery',
    description: 'Neuropeptide that promotes deep sleep and may have stress-protective effects.',
    dosage: {
      standard: '100-200 mcg',
      range: '50-500 mcg',
      timing: 'Before bed',
      administration: 'Subcutaneous or intramuscular injection'
    },
    protocol: {
      duration: '1-4 weeks as needed',
      frequency: 'Nightly or as needed',
      notes: 'Effects on sleep architecture. May reduce stress hormones'
    },
    halfLife: '~15 minutes',
    uses: ['Sleep improvement', 'Stress reduction', 'Pain management', 'Mood support'],
    references: 'European research and clinical use'
  },
  'AOD-9604': {
    fullName: 'Anti-Obesity Drug Fragment 176-191',
    category: 'Metabolic & Fat Loss',
    description: 'Modified fragment of human growth hormone C-terminus that promotes lipolysis without affecting blood sugar.',
    dosage: {
      standard: '300 mcg',
      range: '250-500 mcg',
      timing: 'Once daily on empty stomach',
      administration: 'Subcutaneous injection'
    },
    protocol: {
      duration: '8-12 weeks',
      frequency: 'Daily',
      notes: 'Best taken in morning before cardio or at night before bed'
    },
    halfLife: '~2 hours',
    uses: ['Fat loss', 'Body recomposition', 'Metabolism boost'],
    references: 'Clinical obesity trials'
  },
  'MOTS-c': {
    fullName: 'Mitochondrial-Derived Peptide',
    category: 'Metabolic & Longevity',
    description: 'Mitochondrial open reading frame peptide that regulates metabolism and insulin sensitivity.',
    dosage: {
      standard: '5-10 mg',
      range: '5-15 mg',
      timing: '2-3 times per week',
      administration: 'Subcutaneous or intramuscular injection'
    },
    protocol: {
      duration: '4-8 weeks',
      frequency: '2-3x per week',
      notes: 'May be cycled. Effects on exercise capacity notable'
    },
    halfLife: 'Unknown (emerging research)',
    uses: ['Metabolic health', 'Insulin sensitivity', 'Exercise performance', 'Longevity'],
    references: 'Emerging longevity research'
  },
  'PP405': {
    fullName: 'Experimental Hair Growth Peptide',
    category: 'Hair Growth',
    description: 'Novel peptide being researched for hair follicle stimulation and hair loss reversal.',
    dosage: {
      standard: 'Dosing not yet established',
      range: 'Research phase',
      timing: 'Not yet determined',
      administration: 'Likely subcutaneous or topical'
    },
    protocol: {
      duration: 'Research ongoing',
      frequency: 'Unknown',
      notes: 'Experimental peptide. Limited public data available'
    },
    halfLife: 'Unknown',
    uses: ['Hair growth', 'Hair follicle regeneration', 'Androgenic alopecia treatment'],
    references: 'Preliminary research phase'
  },
  'IGF-1 LR3': {
    fullName: 'Insulin-like Growth Factor-1 Long R3',
    category: 'Performance & Muscle Growth',
    description: 'Extended half-life variant of IGF-1 that promotes muscle growth and recovery.',
    dosage: {
      standard: '20-50 mcg',
      range: '20-100 mcg',
      timing: 'Post-workout or daily',
      administration: 'Subcutaneous or intramuscular injection'
    },
    protocol: {
      duration: '4-6 weeks',
      frequency: 'Daily',
      notes: 'More potent than regular IGF-1. Can cause hypoglycemia'
    },
    halfLife: '~20-30 hours',
    uses: ['Muscle hypertrophy', 'Recovery', 'Fat loss', 'Hyperplasia promotion'],
    references: 'Athletic and bodybuilding research'
  },
  'Sermorelin': {
    fullName: 'Growth Hormone Releasing Hormone Analog',
    category: 'Performance & Anti-Aging',
    description: 'GHRH(1-29) analog that stimulates natural growth hormone release from the pituitary.',
    dosage: {
      standard: '200-300 mcg',
      range: '100-500 mcg',
      timing: 'Before bed',
      administration: 'Subcutaneous injection'
    },
    protocol: {
      duration: '3-6 months or longer',
      frequency: 'Daily (typically nightly)',
      notes: 'Often used long-term for anti-aging. Prescription required in US'
    },
    halfLife: '~10 minutes',
    uses: ['Growth hormone optimization', 'Anti-aging', 'Body composition', 'Sleep quality'],
    references: 'FDA-approved for growth hormone deficiency'
  }
}

export const getPeptideInfo = (peptideName) => {
  return PEPTIDE_INFO_DATABASE[peptideName] || null
}