export const SCHEME_CATEGORIES = [
 "All", "Insurance", "Credit & Interest Subsidy", "Irrigation", "Equipment & Machinery", "Organic & Soil", "Direct Support"
];

export const SCHEMES = [
 {
 id: "pmfby",
 name: "PM Fasal Bima Yojana (PMFBY)",
 category: "Insurance",
 subsidy: "Up to 85% Premium Paid by Govt",
 ministry: "Ministry of Agriculture & Farmers Welfare, GoI",
 image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80",
 badge: "Most Important for Drought & Market Crash",
 blurb: "Comprehensive crop insurance against drought, dry spells, unseasonal floods, and post-harvest cyclone damage with rapid satellite-based claim settlement within 72 hours of loss reporting.",
 eligibility: "All farmers growing notified crops (sharecroppers and tenant farmers eligible with simple self-declaration).",
 deadline: "15 days before sowing season ends",
 linkText: "Apply via CSC / Bank Branch",
 benefitAmount: "Up to ₹35,000 / Acre Loss Relief",
 documentsRequired: ["Aadhaar Card", "Land Record (RoR) / Khatian", "Sowing Certificate / Declaration", "Bank Passbook"]
 },
 {
 id: "kcc",
 name: "Kisan Credit Card (KCC) with 3% Interest Subvention",
 category: "Credit & Interest Subsidy",
 subsidy: "Effective 4% p.a. Interest Rate",
 ministry: "NABARD & Reserve Bank of India",
 image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
 badge: "Low Interest Working Capital",
 blurb: "Flexible revolving credit up to ₹3,00,000 for purchasing high-quality seeds, fertilizers, pesticides, machinery rent, and meeting harvesting electricity expenses.",
 eligibility: "Individual farmers, joint borrowers, SHGs, and tenant cultivators.",
 deadline: "Open round the year",
 linkText: "Apply at Lead Bank / PACS",
 benefitAmount: "Collateral-free loan up to ₹1.60 Lakh (4% rate)",
 documentsRequired: ["Land Possession Certificate (LPC)", "Aadhaar Card", "Voter ID / PAN", "2 Passport Photos"]
 },
 {
 id: "pmksy",
 name: "PM Krishi Sinchayee Yojana (Per Drop More Crop)",
 category: "Irrigation",
 subsidy: "55% for Small/Marginal, 45% for Other Farmers",
 ministry: "Department of Agriculture & Farmers Welfare",
 image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80",
 badge: "Water & Power Saver",
 blurb: "Capital subsidy for installing micro-irrigation systems (Drip and Sprinkler) to achieve 40-50% water savings, 30% fertilizer efficiency boost, and higher crop yield in water-scarce regions.",
 eligibility: "Farmers with assured land title and ground/surface water source (borewell/pond/well).",
 deadline: "Quarterly batch allotment",
 linkText: "Apply via State Horticulture Portal",
 benefitAmount: "Up to ₹45,000 / Acre Subsidy",
 documentsRequired: ["Land RoR Copy", "Water Source Certificate", "Aadhaar Card", "Vendor Quotation"]
 },
 {
 id: "smam",
 name: "Sub-Mission on Agricultural Mechanization (SMAM)",
 category: "Equipment & Machinery",
 subsidy: "40% - 50% Subsidy on Farm Machinery",
 ministry: "Mechanization & Technology Division, MoA&FW",
 image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80",
 badge: "Tractor & Implement Subsidy",
 blurb: "Financial assistance for purchasing Rotavators, Power Tillers, Seed Drills, Boom Sprayers, and setting up Custom Hiring Centers (CHCs) in rural panchayats.",
 eligibility: "All registered farmers; priority to SC/ST/Women smallholders.",
 deadline: "Phase-wise online portal release",
 linkText: "Register on Agrico / SMAM Portal",
 benefitAmount: "₹40,000 to ₹1,50,000 subsidy on implements",
 documentsRequired: ["Aadhaar Card", "Bank Passbook", "Caste Certificate (if applicable)", "Dealer Proforma Invoice"]
 },
 {
 id: "pmkisan",
 name: "PM-KISAN Samman Nidhi (Direct Benefit Transfer)",
 category: "Direct Support",
 subsidy: "100% Direct Cash Support",
 ministry: "Government of India",
 image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
 badge: "Direct Bank Transfer ₹6,000/yr",
 blurb: "Direct annual income support of ₹6,000 in three equal four-monthly installments of ₹2,000 directly transferred into Aadhaar-linked bank accounts to procure agricultural inputs.",
 eligibility: "All landholding farmer families with cultivable land in their names.",
 deadline: "Continuous enrollment & eKYC",
 linkText: "Check Status / Register via PM-Kisan",
 benefitAmount: "₹6,000 per year directly to bank",
 documentsRequired: ["Aadhaar Linked Mobile Number", "Land Records (RoR)", "Active Bank Account"]
 },
 {
 id: "pkvy",
 name: "Paramparagat Krishi Vikas Yojana (PKVY)",
 category: "Organic & Soil",
 subsidy: "₹50,000 per Hectare for 3 Years",
 ministry: "Integrated Nutrient Management Division",
 image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80",
 badge: "Organic Soil Health Grant",
 blurb: "Support for organic cluster farming, bio-fertilizer procurement, PGS-India certification, and premium branding for chemical-free farm produce.",
 eligibility: "Farmer groups forming a minimum 20-hectare cluster.",
 deadline: "District cluster window open",
 linkText: "Apply via Block Agriculture Officer",
 benefitAmount: "₹50,000 / ha (31,000 for inputs, 19,000 for certification)",
 documentsRequired: ["Farmer Cluster Group Resolution", "Aadhaar Cards of Members", "Bank Account of Group"]
 },
 {
 id: "pmkusum",
 name: "PM-KUSUM (Solar Agriculture Pump Scheme)",
 category: "Irrigation",
 subsidy: "Up to 60% Govt Subsidy (Central + State)",
 ministry: "Ministry of New and Renewable Energy",
 image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=600&q=80",
 badge: "Zero Electricity Bill Irrigation",
 blurb: "Installation of standalone off-grid solar water pumps (3HP / 5HP / 7.5HP) for diesel replacement and reliable daytime solar irrigation.",
 eligibility: "Individual farmers and water user associations with water source.",
 deadline: "Annual state allocation batches",
 linkText: "Apply on State Renewable Energy Portal",
 benefitAmount: "Up to ₹1,20,000 Subsidy per Solar Pump",
 documentsRequired: ["Land Ownership Proof", "Borewell/Water Source NOC", "Aadhaar Card", "Bank Details"]
 }
];

