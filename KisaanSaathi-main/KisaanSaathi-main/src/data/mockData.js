import { FARMER_NDVI_PROFILES } from './ndviData';

export const FARMERS = [
 {
 id: 1,
 name: "Ramesh Nayak",
 mobile: "9876543212",
 aadhaar: "5432 1098 7654",
 village: "Balipatna",
 district: "Khurda",
 crop: "Tomato",
 score: 82, // Composite distress score
 ndviScore: 0.83,
 ndviRating: "Optimal Vigor",
 acres: 2.5,
 areaHa: 1.01,
 rainfallDeficit: 38,
 priceDrop: 45,
 loanDueDays: 5,
 ndviProfile: FARMER_NDVI_PROFILES[1],
 loans: [
 { id: "L-101", name: "KCC Crop Loan - Balipatna PGB", amount: 45000, dueDays: 5, rate: "4% (Subsidized)", status: "Critical" },
 { id: "L-102", name: "Drip Irrigation Loan - SBI", amount: 18000, dueDays: 45, rate: "7%", status: "Normal" }
 ],
 appliedSchemes: [
 {
 id: "app-pmfby-101",
 schemeId: "pmfby",
 schemeName: "PM Fasal Bima Yojana (PMFBY)",
 appliedDate: "12 Aug 2024",
 applicationNo: "PMFBY-OD-2024-88421",
 category: "Crop Insurance",
 status: "Under Field Verification",
 statusStep: 2,
 statusMessage: "Village Agriculture Worker (VAW) inspection scheduled for 28 Aug 2024.",
 claimAmount: "₹24,500 (Drought Deficit Loss Claim)",
 disbursedAmount: null,
 bankAccount: "Prathama Gramya Bank (A/C: ...4109)",
 documentChecklist: ["Aadhaar Copy ", "Land Record (RoR) ", "Sowing Certificate ", "Bank Passbook "]
 },
 {
 id: "app-kcc-102",
 schemeId: "kcc",
 schemeName: "Kisan Credit Card 3% Interest Subvention",
 appliedDate: "05 Jun 2024",
 applicationNo: "KCC-SUB-KHU-9921",
 category: "Credit & Interest Subsidy",
 status: "Approved & Active",
 statusStep: 4,
 statusMessage: "3% central subvention credited directly upon timely KCC repayment.",
 claimAmount: "₹1,350 Interest Savings",
 disbursedAmount: "₹1,350 Credited",
 bankAccount: "Prathama Gramya Bank (A/C: ...4109)",
 documentChecklist: ["KCC Card Copy ", "Aadhaar Card ", "LPC Certificate "]
 }
 ],
 rentedMachines: [
 {
 bookingId: "BK-7891",
 machineId: "m1",
 name: "Rotavator (6-feet Heavy Duty)",
 bookedOn: "24 Aug 2024",
 scheduledDate: "27 Aug 2024",
 durationDays: 1,
 totalCost: 550,
 provider: "Maa Tarini CHC (Balipatna)",
 phone: "9861001122",
 status: "Confirmed & Driver Assigned",
 lossAnalysis: "Highly Suggestable (Saves ₹1,200 vs manual tractor tillage)"
 }
 ]
 },
 {
 id: 2,
 name: "Sunita Behera",
 mobile: "9437123445",
 aadhaar: "6543 2109 8765",
 village: "Khurda",
 district: "Khurda",
 crop: "Onion",
 score: 71,
 ndviScore: 0.58,
 ndviRating: "Moderate Stress",
 acres: 3.0,
 areaHa: 1.21,
 rainfallDeficit: 22,
 priceDrop: 30,
 loanDueDays: 14,
 ndviProfile: FARMER_NDVI_PROFILES[2],
 loans: [
 { id: "L-201", name: "Kisan Credit Card - UCO Bank", amount: 35000, dueDays: 14, rate: "4%", status: "Warning" }
 ],
 appliedSchemes: [
 {
 id: "app-pmksy-201",
 schemeId: "pmksy",
 schemeName: "PM Krishi Sinchayee Yojana (Drip Irrigation)",
 appliedDate: "02 Jul 2024",
 applicationNo: "PMKSY-DRIP-2024-5519",
 category: "Micro Irrigation",
 status: "Technical Survey Approved",
 statusStep: 3,
 statusMessage: "55% subsidy approved. Drip system installation scheduled by empanelled vendor.",
 claimAmount: "₹38,500 Capital Subsidy",
 disbursedAmount: null,
 bankAccount: "UCO Bank Khurda (A/C: ...8821)",
 documentChecklist: ["Water Source Proof ", "Land Map ", "Quotation Approved "]
 }
 ],
 rentedMachines: []
 },
 {
 id: 3,
 name: "Manoj Sahoo",
 mobile: "9040987678",
 aadhaar: "7654 3210 9876",
 village: "Balipatna",
 district: "Khurda",
 crop: "Wheat",
 score: 34,
 ndviScore: 0.79,
 ndviRating: "High Density Canopy",
 acres: 5.0,
 areaHa: 2.02,
 rainfallDeficit: 8,
 priceDrop: 5,
 loanDueDays: 60,
 ndviProfile: FARMER_NDVI_PROFILES[3],
 loans: [
 { id: "L-301", name: "Tractor Term Loan - PNB", amount: 80000, dueDays: 60, rate: "8.5%", status: "Normal" }
 ],
 appliedSchemes: [
 {
 id: "app-smam-301",
 schemeId: "smam",
 schemeName: "Sub-Mission on Agricultural Mechanization (SMAM)",
 appliedDate: "10 Feb 2024",
 applicationNo: "SMAM-MACH-2024-1104",
 category: "Equipment & Machinery",
 status: "Subsidy Disbursed",
 statusStep: 4,
 statusMessage: "40% subsidy of ₹45,000 credited on Rotavator purchase.",
 claimAmount: "₹45,000 Purchase Subsidy",
 disbursedAmount: "₹45,000 Credited",
 bankAccount: "PNB Balipatna (A/C: ...1982)",
 documentChecklist: ["Dealer Invoice ", "Physical Inspection ", "RC Book "]
 }
 ],
 rentedMachines: []
 },
 {
 id: 4,
 name: "Laxmi Pradhan",
 mobile: "9123456723",
 aadhaar: "8765 4321 0987",
 village: "Tangi",
 district: "Khurda",
 crop: "Tomato",
 score: 58,
 ndviScore: 0.61,
 ndviRating: "Moderate Vigor",
 acres: 1.8,
 areaHa: 0.73,
 rainfallDeficit: 18,
 priceDrop: 28,
 loanDueDays: 21,
 ndviProfile: FARMER_NDVI_PROFILES[4],
 loans: [
 { id: "L-401", name: "KCC Crop Loan", amount: 28000, dueDays: 21, rate: "4%", status: "Normal" }
 ],
 appliedSchemes: [
 {
 id: "app-pmfby-401",
 schemeId: "pmfby",
 schemeName: "PM Fasal Bima Yojana",
 appliedDate: "19 Aug 2024",
 applicationNo: "PMFBY-OD-2024-91023",
 category: "Crop Insurance",
 status: "Application Submitted",
 statusStep: 1,
 statusMessage: "Application registered at CSC VLE. Awaiting bank verification.",
 claimAmount: "₹14,000 (Market Loss Relief)",
 disbursedAmount: null,
 bankAccount: "State Bank of India (A/C: ...6671)",
 documentChecklist: ["Aadhaar Copy ", "Sowing Self-Declaration "]
 }
 ],
 rentedMachines: []
 },
 {
 id: 5,
 name: "Bikash Rout",
 mobile: "9937876556",
 aadhaar: "9876 5432 1098",
 village: "Chilika",
 district: "Khurda",
 crop: "Paddy",
 score: 90,
 ndviScore: 0.33,
 ndviRating: "Critical Deficit",
 acres: 4.0,
 areaHa: 1.62,
 rainfallDeficit: 51,
 priceDrop: 12,
 loanDueDays: 3,
 ndviProfile: FARMER_NDVI_PROFILES[5],
 loans: [
 { id: "L-501", name: "Paddy Seed Loan - Gramya Bank", amount: 50000, dueDays: 3, rate: "4%", status: "Critical" }
 ],
 appliedSchemes: [
 {
 id: "app-pmfby-501",
 schemeId: "pmfby",
 schemeName: "PM Fasal Bima Yojana (Severe Drought)",
 appliedDate: "01 Aug 2024",
 applicationNo: "PMFBY-OD-2024-77182",
 category: "Crop Insurance",
 status: "Emergency Sanction in Progress",
 statusStep: 3,
 statusMessage: "Block severe drought index (>50% deficit) triggered automatic satellite loss assessment.",
 claimAmount: "₹42,000 Emergency Crop Compensation",
 disbursedAmount: null,
 bankAccount: "Odisha Gramya Bank (A/C: ...3392)",
 documentChecklist: ["Rainfall Deficit Report Attached ", "Aadhaar Card ", "Land Record "]
 }
 ],
 rentedMachines: []
 },
 {
 id: 6,
 name: "Anita Jena",
 mobile: "9778123489",
 aadhaar: "4321 0987 6543",
 village: "Khurda",
 district: "Khurda",
 crop: "Onion",
 score: 25,
 ndviScore: 0.87,
 ndviRating: "Optimal Health",
 acres: 2.0,
 areaHa: 0.81,
 rainfallDeficit: 4,
 priceDrop: 9,
 loanDueDays: 90,
 ndviProfile: FARMER_NDVI_PROFILES[6],
 loans: [
 { id: "L-601", name: "Solar Pump Loan", amount: 15000, dueDays: 90, rate: "6%", status: "Normal" }
 ],
 appliedSchemes: [
 {
 id: "app-pmkusum-601",
 schemeId: "pmkusum",
 schemeName: "PM-KUSUM (Solar Agriculture Pump Subsidy)",
 appliedDate: "14 Feb 2024",
 applicationNo: "KUSUM-SOLAR-OD-3391",
 category: "Renewable Energy",
 status: "Pump Installed & Commissioned",
 statusStep: 4,
 statusMessage: "60% Govt subsidy credited and 3HP Solar Pump connected successfully.",
 claimAmount: "₹1,05,000 Capital Grant",
 disbursedAmount: "₹1,05,000 (Subsidy Direct to Vendor)",
 bankAccount: "SBI Khurda (A/C: ...7731)",
 documentChecklist: ["Borewell Test Report ", "Electricity NOC ", "Aadhaar Copy "]
 }
 ],
 rentedMachines: []
 }
];

export const MANDI_TREND = [
 { day: "Mon", tomato: 18, onion: 22, wheat: 24, paddy: 21 },
 { day: "Tue", tomato: 17, onion: 21, wheat: 24, paddy: 21 },
 { day: "Wed", tomato: 15, onion: 23, wheat: 25, paddy: 22 },
 { day: "Thu", tomato: 12, onion: 20, wheat: 25, paddy: 22 },
 { day: "Fri", tomato: 11, onion: 19, wheat: 26, paddy: 22 },
 { day: "Sat", tomato: 10, onion: 18, wheat: 26, paddy: 23 },
 { day: "Sun", tomato: 9, onion: 17, wheat: 27, paddy: 23 }
];

export const MANDI_COMPARISON = [
 { mandi: "Balipatna APMC (Local)", distanceKm: 4, tomatoPrice: 9, onionPrice: 17, wheatPrice: 26 },
 { mandi: "Bhubaneswar Unit-1 Mandi", distanceKm: 18, tomatoPrice: 14, onionPrice: 21, wheatPrice: 27 },
 { mandi: "Jatni Wholesale Market", distanceKm: 14, tomatoPrice: 13, onionPrice: 20, wheatPrice: 28 },
 { mandi: "Cuttack Malgodown", distanceKm: 32, tomatoPrice: 16, onionPrice: 23, wheatPrice: 28 }
];
