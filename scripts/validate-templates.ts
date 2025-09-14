#!/usr/bin/env ts-node

import { templates } from './create-templates';
import { FirestoreTemplate } from '../src/types/firestore';

function validateTemplate(template: Omit<FirestoreTemplate, 'id' | 'createdAt' | 'updatedAt'>): boolean {
    const errors: string[] = [];

    // Basic validation
    if (!template.name || template.name.trim() === '') {
        errors.push('Name is required');
    }

    if (!template.description || template.description.trim() === '') {
        errors.push('Description is required');
    }

    if (!template.icon || template.icon.trim() === '') {
        errors.push('Icon is required');
    }

    if (!template.category || template.category.trim() === '') {
        errors.push('Category is required');
    }

    // Columns validation
    if (!template.columns || template.columns.length === 0) {
        errors.push('At least one column is required');
    } else {
        const columnIds = new Set();
        template.columns.forEach((column, index) => {
            if (!column.id || column.id.trim() === '') {
                errors.push(`Column ${index}: ID is required`);
            } else if (columnIds.has(column.id)) {
                errors.push(`Column ${index}: Duplicate column ID '${column.id}'`);
            } else {
                columnIds.add(column.id);
            }

            if (!column.title || column.title.trim() === '') {
                errors.push(`Column ${index}: Title is required`);
            }

            if (!column.badgeColor || !column.badgeColor.match(/^#[0-9a-fA-F]{6}$/)) {
                errors.push(`Column ${index}: Valid badge color is required`);
            }

            if (typeof column.order !== 'number' || column.order < 0) {
                errors.push(`Column ${index}: Valid order number is required`);
            }
        });
    }

    // Labels validation
    if (template.availableLabels) {
        const labelIds = new Set();
        template.availableLabels.forEach((label, index) => {
            if (!label.id || label.id.trim() === '') {
                errors.push(`Label ${index}: ID is required`);
            } else if (labelIds.has(label.id)) {
                errors.push(`Label ${index}: Duplicate label ID '${label.id}'`);
            } else {
                labelIds.add(label.id);
            }

            if (!label.name || label.name.trim() === '') {
                errors.push(`Label ${index}: Name is required`);
            }

            if (!label.color || !label.color.match(/^#[0-9a-fA-F]{6}$/)) {
                errors.push(`Label ${index}: Valid color is required`);
            }
        });
    }

    // Sample tasks validation
    if (template.sampleTasks) {
        const columnIds = new Set(template.columns.map(c => c.id));
        const labelIds = new Set(template.availableLabels?.map(l => l.id) || []);
        const taskIds = new Set();

        template.sampleTasks.forEach((task, index) => {
            if (!task.id || task.id.trim() === '') {
                errors.push(`Sample task ${index}: ID is required`);
            } else if (taskIds.has(task.id)) {
                errors.push(`Sample task ${index}: Duplicate task ID '${task.id}'`);
            } else {
                taskIds.add(task.id);
            }

            if (!task.title || task.title.trim() === '') {
                errors.push(`Sample task ${index}: Title is required`);
            }

            if (!columnIds.has(task.columnId)) {
                errors.push(`Sample task ${index}: Invalid column ID '${task.columnId}'`);
            }

            if (typeof task.position !== 'number' || task.position < 0) {
                errors.push(`Sample task ${index}: Valid position number is required`);
            }

            // Validate label references
            task.labels.forEach(labelId => {
                if (!labelIds.has(labelId)) {
                    errors.push(`Sample task ${index}: Invalid label ID '${labelId}'`);
                }
            });
        });
    }

    if (errors.length > 0) {
        console.error(`❌ Template '${template.name}' validation failed:`);
        errors.forEach(error => console.error(`  - ${error}`));
        return false;
    }

    return true;
}

function main() {

    let allValid = true;

    templates.forEach((template, index) => {

        const isValid = validateTemplate(template);
        if (isValid) {

            // Print summary
            console.log(`   - Columns: ${template.columns.length}`);
            console.log(`   - Labels: ${template.availableLabels.length}`);
            console.log(`   - Sample tasks: ${template.sampleTasks?.length || 0}`);
        } else {
            allValid = false;
        }
    });

    if (allValid) {
        console.log(`📊 Total templates: ${templates.length}`);
    } else {
        console.log('❌ Some templates have validation errors');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}