import { themeDefinitions } from './themeDefinitions.js';

function normalizeThemeId(value) {
	return (value || '').toString().trim().toLowerCase();
}

export function listThemeDefinitions() {
	return themeDefinitions.map((theme) => ({ ...theme }));
}

export function getThemeDefinition(themeId) {
	const normalized = normalizeThemeId(themeId);
	return themeDefinitions.find((theme) => normalizeThemeId(theme.id) === normalized) || null;
}

export function getThemeBlueprint(themeId, archetype = 'generic') {
	const theme = getThemeDefinition(themeId);
	if (!theme) return [];
	return theme.pageBlueprints?.[archetype] || theme.pageBlueprints?.generic || [];
}

export const TRADEBOLT_THEME_DEFINITIONS = themeDefinitions;
