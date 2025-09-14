#!/usr/bin/env ts-node

import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.local if it exists
function loadEnvironmentVariables() {
    const envPath = path.join(__dirname, '..', '.env.local');

    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        let loadedCount = 0;

        envConfig.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value && key.trim() && !key.startsWith('#')) {
                if (!process.env[key.trim()]) {
                    process.env[key.trim()] = value.trim();
                    loadedCount++;
                }
            }
        });

    } else {
        console.log('⚠️  No .env.local file found');
    }
}

function testFirebaseConfig() {

    loadEnvironmentVariables();

    // Check different authentication methods
    const authMethods = [
        {
            name: 'Service Account Key File',
            env: 'GOOGLE_APPLICATION_CREDENTIALS',
            value: process.env.GOOGLE_APPLICATION_CREDENTIALS
        },
        {
            name: 'Service Account JSON',
            env: 'FIREBASE_SERVICE_ACCOUNT_KEY',
            value: process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? '[SET]' : undefined
        },
        {
            name: 'Project ID (Public)',
            env: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
            value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        },
        {
            name: 'Project ID (Private)',
            env: 'FIREBASE_PROJECT_ID',
            value: process.env.FIREBASE_PROJECT_ID
        }
    ];

    authMethods.forEach(method => {
        const status = method.value ? '✅ SET' : '❌ NOT SET';
        if (method.value && method.value !== '[SET]') {
            console.log(`    Value: ${method.value}`);
        }
    });



}

testFirebaseConfig();