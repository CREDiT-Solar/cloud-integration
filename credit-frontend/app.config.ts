import 'dotenv/config';
import { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
    name: 'CREDiT-Frontend',
    slug: 'credit-frontend',
    version: '1.0.0',
    extra: {
        apiUrl: process.env.API_URL || 'http://localhost:5000',
    },
};

export default config;
