#!/usr/bin/env ts-node

import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { FirestoreTemplate } from '../src/types/firestore';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.local if it exists
function loadEnvironmentVariables() {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value && !process.env[key]) {
                process.env[key] = value.trim();
            }
        });
    }
}

// Initialize Firebase Admin SDK with flexible authentication
function initializeFirebaseAdmin(): App {
    // Load env vars first
    loadEnvironmentVariables();

    // Check if already initialized
    if (getApps().length > 0) {
        return getApps()[0];
    }

    try {
        // Option 1: Use service account key file (via GOOGLE_APPLICATION_CREDENTIALS)
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            return initializeApp();
        }

        // Option 2: Use service account key from environment variable
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            return initializeApp({
                credential: cert(serviceAccount)
            });
        }

        // Option 3: Use explicit project ID with default credentials
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
        if (projectId) {
            return initializeApp({
                projectId: projectId
            });
        }

        // Option 4: Try default initialization (works in Google Cloud environments)
        return initializeApp();

    } catch (error) {
        console.error('Error details:', error);
        process.exit(1);
    }
}

const app = initializeFirebaseAdmin();
const db = getFirestore(app);

// Predefined template data
const templates: Omit<FirestoreTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
        name: 'Kanban Board',
        description: 'A simple Kanban board for managing tasks with To Do, In Progress, and Done columns.',
        icon: '⚡',
        category: 'General',
        isActive: true,
        columns: [
            {
                id: 'kanban-todo',
                title: 'To Do',
                badgeColor: '#6366f1',
                order: 0
            },
            {
                id: 'kanban-in-progress',
                title: 'In Progress',
                badgeColor: '#f59e0b',
                order: 1
            },
            {
                id: 'kanban-done',
                title: 'Done',
                badgeColor: '#10b981',
                order: 2
            }
        ],
        availableLabels: [
            {
                id: 'label-bug',
                name: 'Bug',
                color: '#ef4444'
            },
            {
                id: 'label-feature',
                name: 'Feature',
                color: '#3b82f6'
            },
            {
                id: 'label-urgent',
                name: 'Urgent',
                color: '#f97316'
            },
            {
                id: 'label-enhancement',
                name: 'Enhancement',
                color: '#8b5cf6'
            }
        ],
        sampleTasks: [
            {
                id: 'sample-task-1',
                title: 'Set up project structure',
                description: 'Create the basic folder structure and configuration files for the project.',
                columnId: 'kanban-todo',
                position: 0,
                labels: ['label-feature'],
                icon: '📁'
            },
            {
                id: 'sample-task-2',
                title: 'Design user interface',
                description: 'Create wireframes and mockups for the main user interface.',
                columnId: 'kanban-in-progress',
                position: 0,
                labels: ['label-feature', 'label-enhancement'],
                icon: '🎨'
            },
            {
                id: 'sample-task-3',
                title: 'Write documentation',
                description: 'Document the API endpoints and usage examples.',
                columnId: 'kanban-done',
                position: 0,
                labels: [],
                icon: '📝'
            }
        ]
    },
    {
        name: 'Sprint Planning',
        description: 'Agile sprint planning board with backlog, sprint, development, review, and done columns.',
        icon: '🏃',
        category: 'Agile',
        isActive: true,
        columns: [
            {
                id: 'sprint-backlog',
                title: 'Backlog',
                badgeColor: '#6b7280',
                order: 0
            },
            {
                id: 'sprint-current',
                title: 'Current Sprint',
                badgeColor: '#3b82f6',
                order: 1
            },
            {
                id: 'sprint-in-progress',
                title: 'In Progress',
                badgeColor: '#f59e0b',
                order: 2
            },
            {
                id: 'sprint-review',
                title: 'Review',
                badgeColor: '#8b5cf6',
                order: 3
            },
            {
                id: 'sprint-done',
                title: 'Done',
                badgeColor: '#10b981',
                order: 4
            }
        ],
        availableLabels: [
            {
                id: 'label-story',
                name: 'User Story',
                color: '#3b82f6'
            },
            {
                id: 'label-epic',
                name: 'Epic',
                color: '#8b5cf6'
            },
            {
                id: 'label-spike',
                name: 'Spike',
                color: '#f59e0b'
            },
            {
                id: 'label-high-priority',
                name: 'High Priority',
                color: '#ef4444'
            },
            {
                id: 'label-medium-priority',
                name: 'Medium Priority',
                color: '#f97316'
            },
            {
                id: 'label-low-priority',
                name: 'Low Priority',
                color: '#10b981'
            }
        ],
        sampleTasks: [
            {
                id: 'sprint-sample-1',
                title: 'User authentication system',
                description: 'Implement user login, registration, and password reset functionality.',
                columnId: 'sprint-backlog',
                position: 0,
                labels: ['label-epic', 'label-high-priority'],
                icon: '🔐'
            },
            {
                id: 'sprint-sample-2',
                title: 'Create login form',
                description: 'Design and implement the user login form with validation.',
                columnId: 'sprint-current',
                position: 0,
                labels: ['label-story', 'label-high-priority'],
                icon: '📝'
            },
            {
                id: 'sprint-sample-3',
                title: 'API integration research',
                description: 'Research and evaluate third-party authentication providers.',
                columnId: 'sprint-in-progress',
                position: 0,
                labels: ['label-spike', 'label-medium-priority'],
                icon: '🔍'
            }
        ]
    },
    {
        name: 'Project Tracker',
        description: 'Complete project management board with planning, development, testing, and deployment phases.',
        icon: '📊',
        category: 'Project Management',
        isActive: true,
        columns: [
            {
                id: 'project-planning',
                title: 'Planning',
                badgeColor: '#6366f1',
                order: 0
            },
            {
                id: 'project-development',
                title: 'Development',
                badgeColor: '#3b82f6',
                order: 1
            },
            {
                id: 'project-testing',
                title: 'Testing',
                badgeColor: '#f59e0b',
                order: 2
            },
            {
                id: 'project-deployment',
                title: 'Deployment',
                badgeColor: '#8b5cf6',
                order: 3
            },
            {
                id: 'project-completed',
                title: 'Completed',
                badgeColor: '#10b981',
                order: 4
            }
        ],
        availableLabels: [
            {
                id: 'label-frontend',
                name: 'Frontend',
                color: '#3b82f6'
            },
            {
                id: 'label-backend',
                name: 'Backend',
                color: '#10b981'
            },
            {
                id: 'label-database',
                name: 'Database',
                color: '#f59e0b'
            },
            {
                id: 'label-infrastructure',
                name: 'Infrastructure',
                color: '#8b5cf6'
            },
            {
                id: 'label-security',
                name: 'Security',
                color: '#ef4444'
            },
            {
                id: 'label-performance',
                name: 'Performance',
                color: '#f97316'
            }
        ],
        sampleTasks: [
            {
                id: 'project-sample-1',
                title: 'Define project requirements',
                description: 'Gather and document all project requirements and specifications.',
                columnId: 'project-planning',
                position: 0,
                labels: [],
                icon: '📋'
            },
            {
                id: 'project-sample-2',
                title: 'Implement user dashboard',
                description: 'Create the main user dashboard with data visualization.',
                columnId: 'project-development',
                position: 0,
                labels: ['label-frontend'],
                icon: '📊'
            },
            {
                id: 'project-sample-3',
                title: 'Unit testing',
                description: 'Write comprehensive unit tests for core functionality.',
                columnId: 'project-testing',
                position: 0,
                labels: ['label-backend', 'label-frontend'],
                icon: '🧪'
            }
        ]
    }
];

async function createTemplates() {

    try {
        const batch = db.batch();

        for (const template of templates) {
            const templateRef = db.collection('templates').doc();

            batch.set(templateRef, {
                ...template,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        await batch.commit();

        // Verify creation
        const templateSnapshot = await db.collection('templates').where('isActive', '==', true).get();

        templateSnapshot.forEach(doc => {
            const data = doc.data();
        });

    } catch (error) {
        console.error('❌ Error creating templates:', error);
        process.exit(1);
    }
}

async function clearExistingTemplates() {

    try {
        const templateSnapshot = await db.collection('templates').get();
        const batch = db.batch();

        templateSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        (`✅ Deleted ${templateSnapshot.size} existing templates`);
    } catch (error) {
        console.error('❌ Error clearing templates:', error);
        process.exit(1);
    }
}

async function main() {

    const shouldClear = process.argv.includes('--clear');

    if (shouldClear) {
        await clearExistingTemplates();
    }

    await createTemplates();

    process.exit(0);
}

// Run the script
if (require.main === module) {
    main().catch(error => {
        console.error('💥 Script failed:', error);
        process.exit(1);
    });
}

export { templates };