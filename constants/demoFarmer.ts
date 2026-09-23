export const DEMO_MODE_ENABLED = true;

export const DEMO_CREDENTIALS = {
    email: 'farmer.demo@agrisense.rw',
    password: 'Demo@2026',
} as const;

export const DEMO_FARMER = {
    id: 'demo-farmer-001',
    firstName: 'Jean Baptiste',
    lastName: 'Habimana',
    displayName: 'Jean Baptiste Habimana',
    email: DEMO_CREDENTIALS.email,
    phoneNumber: '+250 788 234 561',
    role: 'farmer',
    status: 'active',
    isEmailVerified: true,
    onboardingCompleted: true,
    nationalIdVerified: true,
    farmsCount: 1,
    hasFarm: true,
    activeFarmId: 'demo-farm-001',
    joinedAt: '2026-02-12T09:20:00.000Z',
} as const;

export const DEMO_FARM = {
    id: 'demo-farm-001',
    name: 'Green Hills Farm',
    district: 'Musanze',
    sector: 'Kinigi',
    village: 'Kaguhu',
    size: '2.4 hectares',
    primaryCrop: 'Irish potatoes',
    coordinates: '-1.4386, 29.5894',
} as const;

export type DemoRecommendation = {
    id: string;
    date: string;
    displayDate: string;
    title: string;
    crop: string;
    confidence: number;
    status: 'Completed';
    soil: {
        moisture: string;
        temperature: string;
        ph: string;
        nitrogen: string;
        phosphorus: string;
        potassium: string;
        texture: string;
    };
    fertilizer: string;
    irrigation: string;
    pestAdvice: string;
    summary: string;
};

export const DEMO_RECOMMENDATIONS: DemoRecommendation[] = [
    {
        id: 'soil-run-2026-09-18',
        date: '2026-09-18T08:42:00.000Z',
        displayDate: '18 Sep 2026, 10:42 AM',
        title: 'Season A soil analysis',
        crop: 'Irish potatoes',
        confidence: 92,
        status: 'Completed',
        soil: {
            moisture: '64%',
            temperature: '19.8 °C',
            ph: '5.8',
            nitrogen: '42 mg/kg',
            phosphorus: '31 mg/kg',
            potassium: '168 mg/kg',
            texture: 'Sandy loam',
        },
        fertilizer: 'Apply NPK 17-17-17 at 300 kg/ha during planting, followed by CAN after 4–5 weeks.',
        irrigation: 'Soil moisture is adequate. Irrigate lightly in 3 days if there is no rainfall.',
        pestAdvice: 'Inspect leaves twice weekly for late blight. Remove affected leaves and avoid overhead watering.',
        summary: 'The cool conditions, slightly acidic soil, and balanced nutrients make this field highly suitable for Irish potatoes.',
    },
    {
        id: 'soil-run-2026-08-27',
        date: '2026-08-27T13:15:00.000Z',
        displayDate: '27 Aug 2026, 3:15 PM',
        title: 'Pre-planting soil check',
        crop: 'Maize',
        confidence: 84,
        status: 'Completed',
        soil: {
            moisture: '51%',
            temperature: '21.2 °C',
            ph: '6.1',
            nitrogen: '33 mg/kg',
            phosphorus: '27 mg/kg',
            potassium: '142 mg/kg',
            texture: 'Loam',
        },
        fertilizer: 'Use compost before planting and apply DAP at 100 kg/ha. Top-dress with urea at knee height.',
        irrigation: 'Water after planting and maintain moderate moisture during germination.',
        pestAdvice: 'Monitor young plants for fall armyworm and hand-remove egg masses during early infestation.',
        summary: 'The field is suitable for maize. Improving nitrogen with compost and timely top-dressing should increase yield.',
    },
    {
        id: 'soil-run-2026-07-09',
        date: '2026-07-09T07:35:00.000Z',
        displayDate: '9 Jul 2026, 9:35 AM',
        title: 'Post-harvest field check',
        crop: 'Bush beans',
        confidence: 79,
        status: 'Completed',
        soil: {
            moisture: '47%',
            temperature: '20.5 °C',
            ph: '5.5',
            nitrogen: '29 mg/kg',
            phosphorus: '22 mg/kg',
            potassium: '134 mg/kg',
            texture: 'Sandy loam',
        },
        fertilizer: 'Mix well-decomposed manure into the soil and apply a small amount of DAP at planting.',
        irrigation: 'Water the field before sowing and use mulch to reduce moisture loss.',
        pestAdvice: 'Rotate away from potatoes and monitor for bean fly during the first three weeks.',
        summary: 'Bush beans are a good rotation crop for this field, but the soil needs organic matter and a small pH correction.',
    },
];

export const LATEST_DEMO_RECOMMENDATION = DEMO_RECOMMENDATIONS[0];

