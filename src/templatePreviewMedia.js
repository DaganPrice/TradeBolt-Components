const previewAssets = import.meta.glob('./template-preview-assets/**/*.{png,jpg,jpeg,webp}', {
	eager: true,
	import: 'default'
});

function getPreviewAsset(relativePath) {
	return previewAssets[`./template-preview-assets/${relativePath}`] || '';
}

function createTradeImageRef(id, file, title) {
	return { id, file, title, alt_text: title };
}

function createRepeatedImageRefs(prefix, file, titlePrefix, count) {
	return Array.from({ length: count }, (_, index) =>
		createTradeImageRef(
			`${prefix}-${index + 1}`,
			file,
			`${titlePrefix} ${index + 1}`
		)
	);
}

const SITE_TRADE_SLUGS = ['electrician', 'plumber', 'builder', 'landscaper'];

function createTradeMediaSet(templateSlug, templateLabel, tradeSlug) {
	const label = templateLabel || 'Template';
	const basePath = `site/${templateSlug}/${tradeSlug}`;
	const templateLogoPreview = getPreviewAsset(`site/${templateSlug}/logo.png`);

	return {
		logoPreview: getPreviewAsset(`${basePath}/logo.png`) || templateLogoPreview,
		hero: createTradeImageRef(
			`${label}-${tradeSlug}-hero`,
			getPreviewAsset(`${basePath}/hero.png`),
			`${label} ${tradeSlug} hero`
		),
		about: createTradeImageRef(
			`${label}-${tradeSlug}-about`,
			getPreviewAsset(`${basePath}/about.png`),
			`${label} ${tradeSlug} about`
		),
		serviceImages: createRepeatedImageRefs(
			`${label}-${tradeSlug}-service`,
			getPreviewAsset(`${basePath}/service.png`),
			`${label} ${tradeSlug} service`,
			3
		),
		galleryImages: createRepeatedImageRefs(
			`${label}-${tradeSlug}-gallery`,
			getPreviewAsset(`${basePath}/gallery.png`),
			`${label} ${tradeSlug} gallery`,
			4
		)
	};
}

function buildAllTradeMedia(templateSlug, templateLabel) {
	return Object.fromEntries(
		SITE_TRADE_SLUGS.map((tradeSlug) => [tradeSlug, createTradeMediaSet(templateSlug, templateLabel, tradeSlug)])
	);
}

function createSiteTemplateEntry(templateSlug, templateLabel) {
	return {
		cardPreview: getPreviewAsset(`site/${templateSlug}/card.png`),
		logoPreview: getPreviewAsset(`site/${templateSlug}/logo.png`),
		trades: buildAllTradeMedia(templateSlug, templateLabel)
	};
}

function createDashboardEntryFromSiteTemplate(templateSlug, templateLabel, tradeSlug = 'electrician') {
	const template = createSiteTemplateEntry(templateSlug, templateLabel);
	const tradeMedia = template.trades[tradeSlug] || template.trades.electrician;

	return {
		cardPreview: template.cardPreview,
		logoPreview: tradeMedia?.logoPreview || template.logoPreview,
		media: {
			heroBackground: tradeMedia?.hero?.file || '',
			aboutImage: tradeMedia?.about?.file || '',
			serviceImages: tradeMedia?.serviceImages || [],
			galleryImages: tradeMedia?.galleryImages || []
		}
	};
}

// Edit site template previews here:
// - each template has its own folder at `template-preview-assets/site/<template-slug>/`
// - each trade has its own subfolder at `template-preview-assets/site/<template-slug>/<trade-slug>/`
export const SITE_TEMPLATE_PREVIEW_MEDIA = {
	'lead-engine': createSiteTemplateEntry('lead-engine', 'Lead Engine'),
	'portfolio-showcase': createSiteTemplateEntry('portfolio-showcase', 'Portfolio Showcase'),
	'elite-contractor': createSiteTemplateEntry('elite-contractor', 'Elite Contractor'),
	'local-authority': createSiteTemplateEntry('local-authority', 'Local Authority')
};

// Dashboard theme previews reuse the site template preview assets above.
export const DASHBOARD_THEME_PREVIEW_MEDIA = {
	'lead-engine': createDashboardEntryFromSiteTemplate('lead-engine', 'Lead Engine'),
	'portfolio-showcase': createDashboardEntryFromSiteTemplate('portfolio-showcase', 'Portfolio Showcase'),
	'elite-contractor': createDashboardEntryFromSiteTemplate('elite-contractor', 'Elite Contractor'),
	'local-authority': createDashboardEntryFromSiteTemplate('local-authority', 'Local Authority')
};

export function getSiteTemplateCardPreview(templateSlug) {
	return SITE_TEMPLATE_PREVIEW_MEDIA[templateSlug]?.cardPreview || '';
}

export function getSiteTemplateLogoPreview(templateSlug, tradeSlug = 'electrician') {
	const template = SITE_TEMPLATE_PREVIEW_MEDIA[templateSlug] || null;
	if (!template) return '';

	return template.trades[tradeSlug]?.logoPreview || template.trades.electrician?.logoPreview || template.logoPreview || '';
}

export function getSiteTemplatePreviewMedia(templateSlug, tradeSlug = 'electrician') {
	const template = SITE_TEMPLATE_PREVIEW_MEDIA[templateSlug] || null;
	if (!template) return null;
	return template.trades[tradeSlug] || template.trades.electrician || null;
}

export function getDashboardThemePreviewMedia(themeId, tradeSlug = 'electrician') {
	const theme = DASHBOARD_THEME_PREVIEW_MEDIA[themeId] || null;
	if (!theme) return null;

	if (tradeSlug === 'electrician') return theme;

	switch (themeId) {
		case 'lead-engine':
			return createDashboardEntryFromSiteTemplate('lead-engine', 'Lead Engine', tradeSlug);
		case 'portfolio-showcase':
			return createDashboardEntryFromSiteTemplate('portfolio-showcase', 'Portfolio Showcase', tradeSlug);
		case 'elite-contractor':
			return createDashboardEntryFromSiteTemplate('elite-contractor', 'Elite Contractor', tradeSlug);
		case 'local-authority':
			return createDashboardEntryFromSiteTemplate('local-authority', 'Local Authority', tradeSlug);
		default:
			return theme;
	}
}
