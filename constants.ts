import { RetrievalMethod, EmbeddingModel, SynthesisModel, ResponseStyle, GroupLegend } from './types';

export const DEFAULT_TOPIC = "Artificial Intelligence History";

export const RETRIEVAL_OPTIONS = Object.values(RetrievalMethod);
export const EMBEDDING_OPTIONS = Object.values(EmbeddingModel);
export const SYNTHESIS_OPTIONS = Object.values(SynthesisModel);
export const STYLE_OPTIONS = Object.values(ResponseStyle);

export const GEMINI_MODEL_FAST = "gemini-2.5-flash";
// We will use the config to determine the model now, but keep this for default graph gen
export const GEMINI_MODEL_GRAPH_GEN = "gemini-2.5-flash"; 

export const INITIAL_NODES = [
  { id: "AI", label: "Artificial Intelligence", group: 1, val: 20 },
  { id: "ML", label: "Machine Learning", group: 2, val: 15 },
  { id: "DL", label: "Deep Learning", group: 2, val: 15 },
  { id: "NN", label: "Neural Networks", group: 2, val: 10 },
  { id: "Turing", label: "Alan Turing", group: 3, val: 12 },
];

export const INITIAL_LINKS = [
  { source: "AI", target: "ML", label: "includes" },
  { source: "ML", target: "DL", label: "evolved into" },
  { source: "DL", target: "NN", label: "uses" },
  { source: "AI", target: "Turing", label: "pioneered by" },
];

export const INITIAL_LEGEND: GroupLegend = {
  1: "Core Concept",
  2: "Subfield",
  3: "Person"
};

// --- DATASET 1: PrimeKG (Precision Medicine - Expanded) ---
export const PRIME_KG_LEGEND: GroupLegend = {
  1: "Disease (Condition)",
  2: "Drug (Treatment)",
  3: "Gene / Protein",
  4: "Phenotype (Symptom)",
  5: "Risk Factor"
};

export const PRIME_KG_SAMPLE = {
  nodes: [
    // Diseases
    { id: "D_ALZ", label: "Alzheimer's Disease", group: 1, val: 35, description: "Neurodegenerative disease causing memory loss." },
    { id: "D_T2D", label: "Type 2 Diabetes", group: 1, val: 35, description: "Chronic high blood sugar disorder." },
    { id: "D_HTN", label: "Hypertension", group: 1, val: 28, description: "High blood pressure." },
    { id: "D_OBS", label: "Obesity", group: 1, val: 28, description: "Excess body fat accumulation." },
    { id: "D_BC", label: "Breast Cancer", group: 1, val: 32, description: "Cancer developing from breast tissue." },
    { id: "D_LC", label: "Lung Cancer", group: 1, val: 30, description: "Malignant tumor in lungs." },
    { id: "D_MEL", label: "Melanoma", group: 1, val: 25, description: "Skin cancer pigment cells." },
    { id: "D_CKD", label: "Chronic Kidney Disease", group: 1, val: 25, description: "Loss of kidney function." },

    // Drugs
    { id: "RX_MET", label: "Metformin", group: 2, val: 20, description: "Antidiabetic medication." },
    { id: "RX_INS", label: "Insulin", group: 2, val: 20, description: "Hormone therapy." },
    { id: "RX_DON", label: "Donepezil", group: 2, val: 18, description: "Cognitive enhancer for Alzheimer's." },
    { id: "RX_LIS", label: "Lisinopril", group: 2, val: 18, description: "ACE inhibitor." },
    { id: "RX_TAM", label: "Tamoxifen", group: 2, val: 22, description: "Estrogen modulator for breast cancer." },
    { id: "RX_PEM", label: "Pembrolizumab", group: 2, val: 22, description: "Immunotherapy (PD-1 inhibitor)." },
    { id: "RX_DOX", label: "Doxorubicin", group: 2, val: 20, description: "Chemotherapy drug." },

    // Genes
    { id: "G_APOE", label: "APOE", group: 3, val: 25, description: "Lipid transport, Alzheimer's risk." },
    { id: "G_INS", label: "INS", group: 3, val: 15, description: "Insulin production." },
    { id: "G_ACE", label: "ACE", group: 3, val: 15, description: "Blood pressure regulation." },
    { id: "G_BRCA1", label: "BRCA1", group: 3, val: 28, description: "Tumor suppressor gene." },
    { id: "G_BRCA2", label: "BRCA2", group: 3, val: 25, description: "Tumor suppressor gene." },
    { id: "G_TP53", label: "TP53", group: 3, val: 25, description: "Guardian of the genome." },
    { id: "G_EGFR", label: "EGFR", group: 3, val: 20, description: "Cell growth factor." },
    { id: "G_PDL1", label: "PD-L1", group: 3, val: 20, description: "Immune checkpoint protein." },

    // Phenotypes / Effects
    { id: "P_MEM", label: "Memory Loss", group: 4, val: 15, description: "Cognitive decline." },
    { id: "P_HYPO", label: "Hypoglycemia", group: 4, val: 12, description: "Low blood sugar." },
    { id: "P_FAT", label: "Fatigue", group: 4, val: 10, description: "Extreme tiredness." },
    { id: "P_NAUS", label: "Nausea", group: 4, val: 10, description: "Side effect of chemo." },
    { id: "P_INFL", label: "Inflammation", group: 4, val: 18, description: "Immune response." },

    // Lifestyle / Risk Factors
    { id: "L_SMK", label: "Smoking", group: 5, val: 20, description: "Tobacco use." },
    { id: "L_SED", label: "Sedentary Lifestyle", group: 5, val: 18, description: "Lack of physical activity." },
    { id: "L_UV", label: "UV Radiation", group: 5, val: 15, description: "Sun exposure." },
  ],
  links: [
    // Metabolic Cluster
    { source: "D_T2D", target: "D_HTN", label: "high comorbidity" },
    { source: "D_T2D", target: "D_OBS", label: "strongly associated" },
    { source: "D_T2D", target: "D_ALZ", label: "metabolic link" },
    { source: "D_T2D", target: "D_CKD", label: "causes" },
    { source: "RX_MET", target: "D_T2D", label: "treats" },
    { source: "RX_MET", target: "P_NAUS", label: "causes" }, // Side effect
    { source: "RX_INS", target: "D_T2D", label: "hormone replacement" },
    { source: "RX_INS", target: "P_HYPO", label: "risk of" },
    
    // Cardiovascular Cluster
    { source: "D_HTN", target: "G_ACE", label: "pathway gene" },
    { source: "RX_LIS", target: "D_HTN", label: "treats" },
    { source: "RX_LIS", target: "G_ACE", label: "inhibits" },
    { source: "L_SED", target: "D_OBS", label: "contributes to" },
    { source: "L_SED", target: "D_HTN", label: "risk factor" },

    // Alzheimer Cluster
    { source: "D_ALZ", target: "G_APOE", label: "genetic driver" },
    { source: "RX_DON", target: "D_ALZ", label: "treats symptoms" },
    { source: "D_ALZ", target: "P_MEM", label: "manifests as" },

    // Oncology Cluster
    { source: "D_BC", target: "G_BRCA1", label: "germline mutation" },
    { source: "D_BC", target: "G_BRCA2", label: "germline mutation" },
    { source: "D_BC", target: "G_TP53", label: "somatic mutation" },
    { source: "RX_TAM", target: "D_BC", label: "hormone therapy" },
    { source: "RX_DOX", target: "D_BC", label: "chemotherapy" },
    { source: "RX_DOX", target: "P_FAT", label: "causes" },
    { source: "RX_DOX", target: "P_NAUS", label: "causes" },

    // Immunotherapy & Lung
    { source: "L_SMK", target: "D_LC", label: "major cause" },
    { source: "D_LC", target: "G_EGFR", label: "driver mutation" },
    { source: "D_LC", target: "G_PDL1", label: "expression" },
    { source: "RX_PEM", target: "G_PDL1", label: "binds to" },
    { source: "RX_PEM", target: "D_LC", label: "immunotherapy" },
    { source: "RX_PEM", target: "D_MEL", label: "treats" },
    { source: "L_UV", target: "D_MEL", label: "major cause" },

    // Cross-Domain
    { source: "D_OBS", target: "D_BC", label: "risk factor" }, // Obesity risks cancer
    { source: "L_SMK", target: "D_HTN", label: "exacerbates" },
    { source: "G_TP53", target: "P_INFL", label: "regulates" },
    { source: "D_OBS", target: "P_INFL", label: "chronic state" },
  ]
};

// --- DATASET 2: Movie KG (IMDB Subset) ---
export const MOVIE_KG_LEGEND: GroupLegend = {
  1: "Movie",
  2: "Person (Director/Actor)",
  3: "Genre",
  4: "Studio / Concept"
};

export const MOVIE_KG_SAMPLE = {
  nodes: [
    // Movies (Group 1)
    { id: "M_INC", label: "Inception", group: 1, val: 35, description: "Sci-Fi action film about dream theft." },
    { id: "M_TDK", label: "The Dark Knight", group: 1, val: 35, description: "Superhero film featuring Batman and Joker." },
    { id: "M_INT", label: "Interstellar", group: 1, val: 35, description: "Epic science fiction film about space travel." },
    { id: "M_TEN", label: "Tenet", group: 1, val: 30, description: "Sci-Fi action film involving time manipulation." },
    { id: "M_OPP", label: "Oppenheimer", group: 1, val: 35, description: "Biographical thriller about J. Robert Oppenheimer." },
    { id: "M_DUN", label: "Dune", group: 1, val: 30, description: "Epic science fiction film adapted from Frank Herbert's novel." },
    { id: "M_BR2049", label: "Blade Runner 2049", group: 1, val: 30, description: "Neo-noir science fiction film." },
    { id: "M_ARR", label: "Arrival", group: 1, val: 28, description: "Sci-Fi drama about linguistics and aliens." },

    // People (Group 2)
    { id: "P_NOLAN", label: "Christopher Nolan", group: 2, val: 30, description: "British-American film director known for complex plots." },
    { id: "P_ZIMMER", label: "Hans Zimmer", group: 2, val: 25, description: "German film score composer." },
    { id: "P_LEO", label: "Leonardo DiCaprio", group: 2, val: 25, description: "American actor and producer." },
    { id: "P_BALE", label: "Christian Bale", group: 2, val: 25, description: "English actor known for method acting." },
    { id: "P_MURPHY", label: "Cillian Murphy", group: 2, val: 25, description: "Irish actor." },
    { id: "P_VILL", label: "Denis Villeneuve", group: 2, val: 30, description: "Canadian filmmaker." },
    { id: "P_CHAL", label: "Timothée Chalamet", group: 2, val: 22, description: "American-French actor." },
    { id: "P_GOS", label: "Ryan Gosling", group: 2, val: 22, description: "Canadian actor." },

    // Genres (Group 3)
    { id: "G_SCIFI", label: "Science Fiction", group: 3, val: 20, description: "Speculative fiction genre." },
    { id: "G_ACT", label: "Action", group: 3, val: 20, description: "Genre featuring physical stunts and chases." },
    { id: "G_THR", label: "Thriller", group: 3, val: 20, description: "Genre focusing on suspense and excitement." },
    { id: "G_DRA", label: "Drama", group: 3, val: 20, description: "Genre focusing on emotional themes." },

    // Studios / Concepts (Group 4)
    { id: "S_WB", label: "Warner Bros.", group: 4, val: 18, description: "Major American film studio." },
    { id: "C_TIME", label: "Time Dilation", group: 4, val: 15, description: "Physics concept central to plot." },
    { id: "C_AI", label: "Artificial Intelligence", group: 4, val: 15, description: "Theme of synthetic life." },
    { id: "C_DREAM", label: "Lucid Dreaming", group: 4, val: 15, description: "Awareness during dreaming." },
  ],
  links: [
    // Directing
    { source: "P_NOLAN", target: "M_INC", label: "DIRECTED" },
    { source: "P_NOLAN", target: "M_TDK", label: "DIRECTED" },
    { source: "P_NOLAN", target: "M_INT", label: "DIRECTED" },
    { source: "P_NOLAN", target: "M_TEN", label: "DIRECTED" },
    { source: "P_NOLAN", target: "M_OPP", label: "DIRECTED" },
    { source: "P_VILL", target: "M_DUN", label: "DIRECTED" },
    { source: "P_VILL", target: "M_BR2049", label: "DIRECTED" },
    { source: "P_VILL", target: "M_ARR", label: "DIRECTED" },

    // Acting
    { source: "P_LEO", target: "M_INC", label: "ACTED_IN" },
    { source: "P_BALE", target: "M_TDK", label: "ACTED_IN" },
    { source: "P_MURPHY", target: "M_INC", label: "ACTED_IN" },
    { source: "P_MURPHY", target: "M_TDK", label: "ACTED_IN" },
    { source: "P_MURPHY", target: "M_OPP", label: "STARRED_AS_LEAD" },
    { source: "P_CHAL", target: "M_DUN", label: "STARRED_AS_LEAD" },
    { source: "P_CHAL", target: "M_INT", label: "ACTED_IN" },
    { source: "P_GOS", target: "M_BR2049", label: "STARRED_AS_LEAD" },

    // Music
    { source: "P_ZIMMER", target: "M_INC", label: "COMPOSED_SCORE" },
    { source: "P_ZIMMER", target: "M_TDK", label: "COMPOSED_SCORE" },
    { source: "P_ZIMMER", target: "M_INT", label: "COMPOSED_SCORE" },
    { source: "P_ZIMMER", target: "M_DUN", label: "COMPOSED_SCORE" },

    // Genres
    { source: "M_INC", target: "G_SCIFI", label: "BELONGS_TO" },
    { source: "M_INC", target: "G_ACT", label: "BELONGS_TO" },
    { source: "M_TDK", target: "G_ACT", label: "BELONGS_TO" },
    { source: "M_TDK", target: "G_THR", label: "BELONGS_TO" },
    { source: "M_INT", target: "G_SCIFI", label: "BELONGS_TO" },
    { source: "M_INT", target: "G_DRA", label: "BELONGS_TO" },
    { source: "M_BR2049", target: "G_SCIFI", label: "BELONGS_TO" },

    // Production / Themes
    { source: "M_INC", target: "S_WB", label: "PRODUCED_BY" },
    { source: "M_TDK", target: "S_WB", label: "PRODUCED_BY" },
    { source: "M_INT", target: "C_TIME", label: "EXPLORES_THEME" },
    { source: "M_TEN", target: "C_TIME", label: "EXPLORES_THEME" },
    { source: "M_INC", target: "C_DREAM", label: "EXPLORES_THEME" },
    { source: "M_BR2049", target: "C_AI", label: "EXPLORES_THEME" },
  ]
};

// --- DATASET 3: Mental Health (Biopsychosocial Model) ---
// Demonstrates complex causality where no single factor is the sole cause.
export const MENTAL_HEALTH_KG_LEGEND: GroupLegend = {
  1: "Disorder / Symptom",
  2: "Biological Factor (Neuro/Genetics)",
  3: "Psychological Factor (Cognitive/Trauma)",
  4: "Social/Environmental Factor"
};

export const MENTAL_HEALTH_KG_SAMPLE = {
  nodes: [
    // 1. Disorders & Symptoms (Group 1)
    { id: "MDD", label: "Major Depressive Disorder", group: 1, val: 45, description: "Clinical depression characterized by persistent low mood." },
    { id: "ANX", label: "Generalized Anxiety", group: 1, val: 35, description: "Excessive, uncontrollable worry." },
    { id: "PTSD", label: "PTSD", group: 1, val: 40, description: "Post-Traumatic Stress Disorder from severe trauma exposure." },
    { id: "BPD", label: "Borderline Personality", group: 1, val: 35, description: "Unstable relationships, self-image, and emotions." },
    { id: "BIPOLAR", label: "Bipolar Disorder", group: 1, val: 38, description: "Alternating episodes of mania and depression." },
    { id: "OCD", label: "OCD", group: 1, val: 30, description: "Obsessive-Compulsive Disorder with intrusive thoughts." },
    { id: "ADHD", label: "ADHD", group: 1, val: 32, description: "Attention-Deficit/Hyperactivity Disorder." },
    { id: "ANH", label: "Anhedonia", group: 1, val: 22, description: "Inability to feel pleasure." },
    { id: "INS", label: "Insomnia", group: 1, val: 22, description: "Sleep disturbance." },
    { id: "PANIC", label: "Panic Disorder", group: 1, val: 28, description: "Recurrent unexpected panic attacks." },
    { id: "SUD", label: "Substance Use Disorder", group: 1, val: 35, description: "Addiction to drugs or alcohol." },
    { id: "ED", label: "Eating Disorders", group: 1, val: 30, description: "Anorexia, Bulimia, Binge Eating." },

    // 2. Biological Factors (Group 2)
    { id: "B_SER", label: "Serotonin (5-HT)", group: 2, val: 28, description: "Neurotransmitter regulating mood and sleep." },
    { id: "B_DOPA", label: "Dopamine", group: 2, val: 28, description: "Reward and motivation neurotransmitter." },
    { id: "B_NORE", label: "Norepinephrine", group: 2, val: 25, description: "Alertness and arousal neurotransmitter." },
    { id: "B_GABA", label: "GABA", group: 2, val: 25, description: "Primary inhibitory neurotransmitter; calming effect." },
    { id: "B_GLUT", label: "Glutamate", group: 2, val: 24, description: "Primary excitatory neurotransmitter." },
    { id: "B_CORT", label: "Cortisol", group: 2, val: 28, description: "Primary stress hormone." },
    { id: "B_HPA", label: "HPA Axis", group: 2, val: 32, description: "Hypothalamic-Pituitary-Adrenal axis; controls stress response." },
    { id: "B_BDNF", label: "BDNF", group: 2, val: 24, description: "Brain-derived neurotrophic factor; neuronal health." },
    { id: "B_GENE", label: "5-HTTLPR Gene", group: 2, val: 22, description: "Serotonin transporter gene polymorphism." },
    { id: "B_INF", label: "Pro-inflammatory Cytokines", group: 2, val: 24, description: "Immune response markers (IL-6, TNF-α)." },
    { id: "B_AMYG", label: "Amygdala", group: 2, val: 30, description: "Brain region for fear and emotional processing." },
    { id: "B_PFC", label: "Prefrontal Cortex", group: 2, val: 30, description: "Executive function and emotional regulation." },
    { id: "B_HIPPO", label: "Hippocampus", group: 2, val: 28, description: "Memory formation and stress regulation." },
    { id: "B_ENDO", label: "Endocannabinoid System", group: 2, val: 22, description: "Regulates mood, stress, and reward." },
    { id: "B_OXY", label: "Oxytocin", group: 2, val: 22, description: "Social bonding and trust hormone." },
    { id: "B_MELA", label: "Melatonin", group: 2, val: 20, description: "Sleep-wake cycle regulation." },
    { id: "B_THYROID", label: "Thyroid Hormones", group: 2, val: 22, description: "T3/T4 affecting metabolism and mood." },

    // 3. Psychological Factors (Group 3)
    { id: "P_ACE", label: "Childhood Trauma (ACEs)", group: 3, val: 38, description: "Adverse Childhood Experiences altering brain development." },
    { id: "P_RUM", label: "Rumination", group: 3, val: 26, description: "Repetitive negative thinking." },
    { id: "P_HELP", label: "Learned Helplessness", group: 3, val: 26, description: "Belief that one has no control over outcomes." },
    { id: "P_SCH", label: "Negative Self-Schema", group: 3, val: 26, description: "Cognitive bias viewing self as inadequate." },
    { id: "P_ATTACH", label: "Insecure Attachment", group: 3, val: 30, description: "Anxious or avoidant attachment style from early relationships." },
    { id: "P_DISS", label: "Dissociation", group: 3, val: 25, description: "Disconnection from thoughts, feelings, or identity." },
    { id: "P_AVOID", label: "Avoidance Coping", group: 3, val: 24, description: "Escaping rather than addressing problems." },
    { id: "P_PERF", label: "Perfectionism", group: 3, val: 24, description: "Unrealistic standards leading to chronic stress." },
    { id: "P_SHAME", label: "Chronic Shame", group: 3, val: 26, description: "Persistent feeling of being fundamentally flawed." },
    { id: "P_EMREG", label: "Emotion Dysregulation", group: 3, val: 28, description: "Difficulty managing emotional responses." },
    { id: "P_HYPER", label: "Hypervigilance", group: 3, val: 24, description: "Constant scanning for threats." },
    { id: "P_FLASH", label: "Flashbacks", group: 3, val: 24, description: "Intrusive re-experiencing of traumatic events." },
    { id: "P_SELF", label: "Low Self-Esteem", group: 3, val: 26, description: "Negative evaluation of one's worth." },
    { id: "P_CATA", label: "Catastrophizing", group: 3, val: 22, description: "Expecting worst-case outcomes." },

    // 4. Social/Environmental Factors (Group 4)
    { id: "S_ISO", label: "Social Isolation", group: 4, val: 30, description: "Lack of social contact and support." },
    { id: "S_SES", label: "Low SES", group: 4, val: 28, description: "Low Socioeconomic Status / Financial stress." },
    { id: "S_LOSS", label: "Interpersonal Loss", group: 4, val: 32, description: "Death of loved one or breakup." },
    { id: "S_WORK", label: "Chronic Work Stress", group: 4, val: 26, description: "Long-term occupational pressure." },
    { id: "S_ABUSE", label: "Domestic Abuse", group: 4, val: 32, description: "Physical, emotional, or sexual abuse at home." },
    { id: "S_BULLY", label: "Bullying/Harassment", group: 4, val: 28, description: "Repeated mistreatment by peers or colleagues." },
    { id: "S_DISCRIM", label: "Discrimination", group: 4, val: 28, description: "Racism, sexism, or other systemic prejudice." },
    { id: "S_STIGMA", label: "Mental Health Stigma", group: 4, val: 26, description: "Societal shame preventing help-seeking." },
    { id: "S_URBAN", label: "Urban Environment", group: 4, val: 22, description: "City living with noise, crowding, pollution." },
    { id: "S_SOCIAL", label: "Social Media", group: 4, val: 26, description: "Comparison, cyberbullying, FOMO." },
    { id: "S_PARENT", label: "Dysfunctional Family", group: 4, val: 30, description: "Neglect, conflict, or enmeshment." },
    { id: "S_PEER", label: "Peer Rejection", group: 4, val: 26, description: "Social exclusion and lack of belonging." },
    { id: "S_UNEMP", label: "Unemployment", group: 4, val: 26, description: "Job loss and financial instability." },
    { id: "S_WAR", label: "War/Conflict Exposure", group: 4, val: 30, description: "Exposure to violence and displacement." },
  ],
  links: [
    // === Biological System Connections ===
    { source: "B_HPA", target: "B_CORT", label: "releases" },
    { source: "B_CORT", target: "B_SER", label: "downregulates" },
    { source: "B_CORT", target: "B_BDNF", label: "inhibits" },
    { source: "B_CORT", target: "B_HIPPO", label: "damages" },
    { source: "B_GENE", target: "B_SER", label: "regulates transport" },
    { source: "B_AMYG", target: "B_HPA", label: "activates" },
    { source: "B_PFC", target: "B_AMYG", label: "inhibits" },
    { source: "B_GABA", target: "B_AMYG", label: "reduces activity" },
    { source: "B_GLUT", target: "B_AMYG", label: "excites" },
    { source: "B_DOPA", target: "B_PFC", label: "modulates" },
    { source: "B_MELA", target: "INS", label: "deficiency causes" },
    { source: "B_THYROID", target: "MDD", label: "dysfunction mimics" },
    { source: "B_OXY", target: "S_ISO", label: "low levels worsen" },
    { source: "B_ENDO", target: "B_DOPA", label: "modulates" },

    // === Psychological ↔ Biological ===
    { source: "P_ACE", target: "B_HPA", label: "permanently sensitizes" },
    { source: "P_ACE", target: "B_AMYG", label: "enlarges" },
    { source: "P_ACE", target: "B_PFC", label: "impairs development" },
    { source: "P_ACE", target: "B_HIPPO", label: "reduces volume" },
    { source: "P_ACE", target: "B_INF", label: "increases baseline" },
    { source: "P_RUM", target: "B_CORT", label: "sustains elevation" },
    { source: "P_HYPER", target: "B_AMYG", label: "reflects overactivity" },
    { source: "P_DISS", target: "B_PFC", label: "involves shutdown" },
    { source: "P_EMREG", target: "B_PFC", label: "impaired by damage" },

    // === Social → Biological/Psychological ===
    { source: "S_ISO", target: "B_HPA", label: "activates" },
    { source: "S_ISO", target: "B_INF", label: "increases" },
    { source: "S_LOSS", target: "MDD", label: "precipitates" },
    { source: "S_WORK", target: "INS", label: "causes" },
    { source: "S_WORK", target: "B_CORT", label: "chronically elevates" },
    { source: "S_SES", target: "P_HELP", label: "reinforces" },
    { source: "S_ABUSE", target: "P_ACE", label: "constitutes" },
    { source: "S_ABUSE", target: "PTSD", label: "causes" },
    { source: "S_ABUSE", target: "BPD", label: "risk factor" },
    { source: "S_BULLY", target: "P_SHAME", label: "instills" },
    { source: "S_BULLY", target: "P_SELF", label: "damages" },
    { source: "S_DISCRIM", target: "B_CORT", label: "elevates" },
    { source: "S_DISCRIM", target: "MDD", label: "increases risk" },
    { source: "S_STIGMA", target: "S_ISO", label: "leads to" },
    { source: "S_SOCIAL", target: "P_SELF", label: "harms" },
    { source: "S_SOCIAL", target: "ANX", label: "worsens" },
    { source: "S_PARENT", target: "P_ATTACH", label: "creates" },
    { source: "S_PARENT", target: "P_ACE", label: "source of" },
    { source: "S_PEER", target: "P_SHAME", label: "causes" },
    { source: "S_UNEMP", target: "P_HELP", label: "reinforces" },
    { source: "S_UNEMP", target: "MDD", label: "risk factor" },
    { source: "S_WAR", target: "PTSD", label: "primary cause" },
    { source: "S_WAR", target: "P_FLASH", label: "triggers" },

    // === Converging on Disorders ===
    { source: "B_SER", target: "MDD", label: "deficiency linked" },
    { source: "B_BDNF", target: "MDD", label: "low levels in" },
    { source: "B_DOPA", target: "ANH", label: "deficiency causes" },
    { source: "B_DOPA", target: "SUD", label: "hijacked by" },
    { source: "B_DOPA", target: "ADHD", label: "dysregulated in" },
    { source: "B_NORE", target: "ADHD", label: "dysregulated in" },
    { source: "B_GABA", target: "ANX", label: "deficiency causes" },
    { source: "B_AMYG", target: "ANX", label: "hyperactive in" },
    { source: "B_AMYG", target: "PTSD", label: "hyperactive in" },
    { source: "P_SCH", target: "MDD", label: "vulnerability" },
    { source: "P_RUM", target: "MDD", label: "maintains" },
    { source: "P_ATTACH", target: "BPD", label: "core factor" },
    { source: "P_EMREG", target: "BPD", label: "core feature" },
    { source: "P_AVOID", target: "ANX", label: "maintains" },
    { source: "P_HYPER", target: "PTSD", label: "symptom of" },
    { source: "P_FLASH", target: "PTSD", label: "symptom of" },
    { source: "P_DISS", target: "PTSD", label: "symptom of" },
    { source: "P_PERF", target: "ED", label: "risk factor" },
    { source: "P_PERF", target: "OCD", label: "correlates with" },
    { source: "P_SHAME", target: "ED", label: "drives" },
    { source: "P_CATA", target: "PANIC", label: "triggers" },
    { source: "S_ISO", target: "MDD", label: "major risk" },

    // === Disorder Interactions ===
    { source: "MDD", target: "ANX", label: "comorbidity" },
    { source: "MDD", target: "ANH", label: "core symptom" },
    { source: "MDD", target: "INS", label: "symptom" },
    { source: "MDD", target: "SUD", label: "self-medication" },
    { source: "ANX", target: "PANIC", label: "can escalate to" },
    { source: "ANX", target: "INS", label: "causes" },
    { source: "PTSD", target: "MDD", label: "high comorbidity" },
    { source: "PTSD", target: "SUD", label: "self-medication" },
    { source: "BPD", target: "SUD", label: "comorbidity" },
    { source: "BPD", target: "ED", label: "comorbidity" },
    { source: "BIPOLAR", target: "SUD", label: "comorbidity" },
    { source: "ADHD", target: "SUD", label: "risk factor" },
    { source: "OCD", target: "ANX", label: "related to" },
    { source: "B_INF", target: "ANH", label: "sickness behavior" },
    { source: "B_INF", target: "MDD", label: "inflammatory pathway" },
  ]
};