function clone(value) {
	return value == null ? value : JSON.parse(JSON.stringify(value));
}

function section(section_type, variant, data = {}) {
	return {
		section_type,
		variant,
		data,
		is_visible: true
	};
}

const SHARED_COPY = {
	classicLocations: ['Manchester', 'Salford', 'Stockport', 'Trafford'],
	boldLocations: ['Leeds', 'Harrogate', 'Wakefield', 'York'],
	classicFaq: [
		{
			question: 'Can I still edit this after applying the theme?',
			answer: 'Yes. The theme sets the section structure, but you can still edit every section in the builder.'
		},
		{
			question: 'Will my own website images stay in place?',
			answer: 'Yes. Theme application preserves existing website images rather than replacing them.'
		},
		{
			question: 'Is this suitable for local service businesses?',
			answer: 'Yes. The structure is designed around services, locations, and direct contact paths.'
		}
	],
	boldFaq: [
		{
			question: 'Can I customise this after applying it?',
			answer: 'Yes. The visual structure is a starting point and remains editable in the website builder.'
		},
		{
			question: 'Does the theme replace my uploaded images?',
			answer: 'No. The applied theme keeps user-selected website images in place.'
		},
		{
			question: 'Who is this theme best for?',
			answer: 'It works best for firms that want stronger contrast, bolder calls to action, and a more conversion-led feel.'
		}
	]
};

const THEME_DEFINITIONS = [
	{
		id: 'classic-local',
		name: 'Classic Local',
		description: 'A balanced theme for local trade businesses that need trust, clarity, and simple structure.',
		bestFor:
			'Best for dependable local-service websites that need a familiar layout, clear service coverage, and strong contact paths without feeling over-designed.',
		tags: ['Local trust', 'Balanced layout', 'Service coverage'],
		websitePatch: {
			color_scheme: 'green',
			website_style: 'traditional',
			theme_tokens: {}
		},
		pageBlueprints: {
			home: [
				section('header', 'Header1', { cta_label: 'Get a quote' }),
				section('hero', 'Hero1', {
					heading: 'Trusted local tradespeople',
					subheading: 'Friendly service, clear pricing and workmanship you can rely on.'
				}),
				section('about', 'About2', {
					kicker: 'About us',
					heading: 'A reliable local team with practical experience',
					lead:
						'This layout is built for everyday service businesses that want to feel approachable, established, and easy to contact.',
					sub:
						'It leaves plenty of room for service proof, local coverage, and contact details without becoming visually heavy.',
					bullet_points: [
						'Clear service hierarchy',
						'Strong local coverage section',
						'Simple enquiry path',
						'Easy to adapt across trades'
					],
					show_contact_button: true,
					cta_label: 'View services',
					cta_href: '/services'
				}),
				section('services', 'Services1', {
					heading: 'Popular services',
					items: []
				}),
				section('locations', 'Locations1', {
					heading: 'Areas we cover',
					items: SHARED_COPY.classicLocations
				}),
				section('contact', 'Contact1', {
					heading: 'Speak to our team'
				}),
				section('footer', 'Footer1', {})
			],
			about: [
				section('header', 'Header1', { cta_label: 'Get a quote' }),
				section('hero', 'Hero2', {
					heading: 'A straightforward team focused on quality work',
					subheading: 'Clear communication, dependable workmanship, and local knowledge.'
				}),
				section('about', 'About1', {
					heading: 'Why this theme works well for established local firms',
					content:
						'It gives enough structure to feel professional while still staying simple to browse on mobile and desktop.'
				}),
				section('cta', 'Cta1', {
					heading: 'Need a website that feels',
					highlight_text: 'trustworthy',
					heading_suffix: 'from the first visit?',
					content:
						'This theme keeps the layout practical, familiar, and easy to adapt as the website grows.'
				}),
				section('footer', 'Footer1', {})
			],
			servicesIndex: [
				section('header', 'Header1', { cta_label: 'Get a quote' }),
				section('hero', 'Hero2', {
					heading: 'Services presented clearly and without clutter',
					subheading: 'A strong fit for businesses that need a simple, dependable sales path.'
				}),
				section('services', 'Services1', {
					heading: 'Our services',
					items: []
				}),
				section('faq', 'Faq1', {
					heading: 'Common questions',
					subheading: 'Helpful answers for visitors before they get in touch.',
					items: SHARED_COPY.classicFaq,
					cta_label: 'Contact us',
					cta_href: '/contact'
				}),
				section('contact', 'Contact1', {
					heading: 'Request a quote'
				}),
				section('footer', 'Footer1', {})
			],
			contact: [
				section('header', 'Header1', { cta_label: 'Get a quote' }),
				section('hero', 'Hero2', {
					heading: 'Get in touch for honest advice and clear next steps',
					subheading: 'Tell us about the job and we will come back with a practical response.'
				}),
				section('contact', 'Contact1', {
					heading: 'Contact our team'
				}),
				section('footer', 'Footer1', {})
			],
			serviceDetail: [
				section('header', 'Header1', { cta_label: 'Get a quote' }),
				section('hero', 'Hero2', {
					heading: 'Detailed service information',
					subheading: 'Use this structure for individual service pages with a clear call to action.'
				}),
				section('about', 'About1', {
					heading: 'What to expect',
					content: 'A clean service detail layout with space for trust, scope, and next steps.'
				}),
				section('contact', 'Contact1', {
					heading: 'Ask about this service'
				}),
				section('footer', 'Footer1', {})
			],
			locationsIndex: [
				section('header', 'Header1', { cta_label: 'Get a quote' }),
				section('hero', 'Hero2', {
					heading: 'Location pages built for local visibility',
					subheading: 'Ideal for expanding coverage without rebuilding the site structure.'
				}),
				section('locations', 'Locations1', {
					heading: 'Coverage areas',
					items: SHARED_COPY.classicLocations
				}),
				section('contact', 'Contact1', {
					heading: 'Check coverage'
				}),
				section('footer', 'Footer1', {})
			],
			locationDetail: [
				section('header', 'Header1', { cta_label: 'Get a quote' }),
				section('hero', 'Hero2', {
					heading: 'A location page with clear service intent',
					subheading: 'Use this structure to support location-specific SEO and enquiries.'
				}),
				section('about', 'About1', {
					heading: 'Serving this area',
					content: 'A simple local landing page structure with room for trust and contact detail.'
				}),
				section('contact', 'Contact1', {
					heading: 'Book local work'
				}),
				section('footer', 'Footer1', {})
			],
			generic: [
				section('header', 'Header1', { cta_label: 'Get a quote' }),
				section('hero', 'Hero2', {
					heading: 'A reliable website structure for local service businesses',
					subheading: 'Simple, clear, and easy to adapt.'
				}),
				section('about', 'About1', {
					heading: 'A practical layout you can build on',
					content: 'This theme is designed to stay clear as more content and pages are added.'
				}),
				section('contact', 'Contact1', {
					heading: 'Get in touch'
				}),
				section('footer', 'Footer1', {})
			]
		}
	},
	{
		id: 'bold-conversion',
		name: 'Bold Conversion',
		description: 'A more aggressive conversion-led theme with stronger contrast and more visual energy.',
		bestFor:
			'Best for trade businesses that want a sharper first impression, stronger calls to action, and a more modern lead-generation feel across the whole website.',
		tags: ['High contrast', 'Lead generation', 'Premium feel'],
		websitePatch: {
			color_scheme: 'orange',
			website_style: 'bold',
			theme_tokens: {}
		},
		pageBlueprints: {
			home: [
				section('header', 'Header4', {
					cta_label: 'Book a call',
					location_label: 'Fast response across West Yorkshire',
					business_hours: 'Mon-Fri: 8:00am - 6:00pm'
				}),
				section('hero', 'Hero4', {
					heading: 'Fast quotes. Clean work. Reliable results.',
					subheading: 'Trusted local experts for homes and businesses.',
					primary_button_label: 'Get a quote',
					primary_button_href: '/contact',
					secondary_button_label: 'See services',
					secondary_button_href: '/services',
					callback_button_label: 'Request callback',
					background_type: 'image',
					overlay_opacity: 60
				}),
				section('about', 'About3', {
					kicker: 'Built to convert',
					heading: 'A stronger layout for firms that want more urgency and authority',
					lead:
						'This theme uses sharper framing, stronger CTA rhythm, and more contrast to keep attention high as users scroll.',
					bullet_points: [
						'Designed for faster enquiries',
						'Clear hero and CTA flow',
						'Works well with strong imagery',
						'Feels more premium from the first fold'
					],
					show_contact_button: true,
					cta_label: 'Start now',
					cta_href: '/contact'
				}),
				section('services', 'Services2', {
					kicker: 'What we do',
					heading: 'High-demand services',
					items: []
				}),
				section('gallery', 'Gallery2', {
					kicker: 'Selected work',
					heading: 'Projects customers remember',
					images: []
				}),
				section('faq', 'Faq1', {
					heading: 'Questions we hear before every quote',
					subheading: 'Short answers that remove friction before someone gets in touch.',
					items: SHARED_COPY.boldFaq,
					cta_label: 'Contact us',
					cta_href: '/contact'
				}),
				section('cta', 'Cta1', {
					heading: 'Need help with your next',
					highlight_text: 'project',
					heading_suffix: '?',
					content:
						'Use this theme when you want a more decisive visual style and a clearer route to enquiry.'
				}),
				section('contact', 'Contact2', {
					heading: 'Start the conversation'
				}),
				section('footer', 'Footer2', {})
			],
			about: [
				section('header', 'Header4', {
					cta_label: 'Book a call',
					location_label: 'Fast response across West Yorkshire',
					business_hours: 'Mon-Fri: 8:00am - 6:00pm'
				}),
				section('hero', 'Hero4', {
					heading: 'A modern trade website built around trust and momentum',
					subheading: 'Sharper sections, stronger contrast, and a confident sales path.',
					primary_button_label: 'Get in touch',
					primary_button_href: '/contact',
					secondary_button_label: 'See services',
					secondary_button_href: '/services',
					callback_button_label: 'Request callback',
					background_type: 'image',
					overlay_opacity: 60
				}),
				section('about', 'About3', {
					kicker: 'About this theme',
					heading: 'Designed to feel established and modern at the same time',
					lead:
						'This structure gives you stronger visual framing while still leaving room for credibility and proof.',
					bullet_points: [
						'High-contrast first impression',
						'Works well with premium positioning',
						'Supports galleries and proof',
						'Keeps the enquiry route obvious'
					],
					show_contact_button: true,
					cta_label: 'Discuss your site',
					cta_href: '/contact'
				}),
				section('gallery', 'Gallery1', {
					kicker: 'Visual proof',
					heading: 'Project imagery',
					images: []
				}),
				section('cta', 'Cta1', {
					heading: 'Want a site that feels',
					highlight_text: 'premium',
					heading_suffix: 'from the first click?',
					content: 'This theme is intended for businesses that want a stronger, more sales-led web presence.'
				}),
				section('footer', 'Footer2', {})
			],
			servicesIndex: [
				section('header', 'Header4', {
					cta_label: 'Book a call',
					location_label: 'Fast response across West Yorkshire',
					business_hours: 'Mon-Fri: 8:00am - 6:00pm'
				}),
				section('hero', 'Hero4', {
					heading: 'Services positioned to keep momentum high',
					subheading: 'Introduce the offer quickly, then direct the visitor toward a quote.',
					primary_button_label: 'Request a quote',
					primary_button_href: '/contact',
					secondary_button_label: 'Call now',
					secondary_button_href: '/contact',
					callback_button_label: 'Request callback',
					background_type: 'image',
					overlay_opacity: 60
				}),
				section('services', 'Services2', {
					kicker: 'Services',
					heading: 'What we help with',
					items: []
				}),
				section('faq', 'Faq1', {
					heading: 'Common pre-quote questions',
					subheading: 'Keep the decision path moving with short, practical answers.',
					items: SHARED_COPY.boldFaq,
					cta_label: 'Book a quote',
					cta_href: '/contact'
				}),
				section('contact', 'Contact2', {
					heading: 'Tell us about the job'
				}),
				section('footer', 'Footer2', {})
			],
			contact: [
				section('header', 'Header4', {
					cta_label: 'Book a call',
					location_label: 'Fast response across West Yorkshire',
					business_hours: 'Mon-Fri: 8:00am - 6:00pm'
				}),
				section('hero', 'Hero4', {
					heading: 'Let customers reach you quickly',
					subheading: 'Shorter paths, clearer contact detail, and stronger CTAs throughout.',
					primary_button_label: 'Send enquiry',
					primary_button_href: '#contact',
					secondary_button_label: 'View services',
					secondary_button_href: '/services',
					callback_button_label: 'Request callback',
					background_type: 'image',
					overlay_opacity: 60
				}),
				section('contact', 'Contact2', {
					heading: 'Start your enquiry'
				}),
				section('cta', 'Cta1', {
					heading: 'Prefer to speak',
					highlight_text: 'directly',
					heading_suffix: '?',
					content: 'Keep the final section clear and action-led so visitors know exactly what to do next.'
				}),
				section('footer', 'Footer2', {})
			],
			serviceDetail: [
				section('header', 'Header4', {
					cta_label: 'Book a call',
					location_label: 'Fast response across West Yorkshire',
					business_hours: 'Mon-Fri: 8:00am - 6:00pm'
				}),
				section('hero', 'Hero4', {
					heading: 'A service detail page built to convert',
					subheading: 'Use bold framing and tighter calls to action on each core service page.',
					primary_button_label: 'Request a quote',
					primary_button_href: '/contact',
					secondary_button_label: 'Contact us',
					secondary_button_href: '/contact',
					callback_button_label: 'Request callback',
					background_type: 'image',
					overlay_opacity: 60
				}),
				section('about', 'About3', {
					kicker: 'Service detail',
					heading: 'Explain the offer without losing urgency',
					lead: 'This layout gives room for proof and explanation while keeping the CTA visible.',
					bullet_points: [
						'Clear structure for service pages',
						'Room for proof and FAQs',
						'Strong CTA rhythm',
						'Consistent visual tone'
					]
				}),
				section('contact', 'Contact2', {
					heading: 'Ask about this service'
				}),
				section('footer', 'Footer2', {})
			],
			locationsIndex: [
				section('header', 'Header4', {
					cta_label: 'Book a call',
					location_label: 'Fast response across West Yorkshire',
					business_hours: 'Mon-Fri: 8:00am - 6:00pm'
				}),
				section('hero', 'Hero4', {
					heading: 'Location pages built to support local visibility',
					subheading: 'Add service-area coverage without breaking the overall conversion flow.',
					primary_button_label: 'Contact us',
					primary_button_href: '/contact',
					secondary_button_label: 'View services',
					secondary_button_href: '/services',
					callback_button_label: 'Request callback',
					background_type: 'image',
					overlay_opacity: 60
				}),
				section('locations', 'Locations1', {
					heading: 'Areas we cover',
					items: SHARED_COPY.boldLocations
				}),
				section('contact', 'Contact2', {
					heading: 'Check availability'
				}),
				section('footer', 'Footer2', {})
			],
			locationDetail: [
				section('header', 'Header4', {
					cta_label: 'Book a call',
					location_label: 'Fast response across West Yorkshire',
					business_hours: 'Mon-Fri: 8:00am - 6:00pm'
				}),
				section('hero', 'Hero4', {
					heading: 'A location landing page with stronger commercial intent',
					subheading: 'Use this structure when you want local relevance and a more forceful CTA style.',
					primary_button_label: 'Get a quote',
					primary_button_href: '/contact',
					secondary_button_label: 'Call now',
					secondary_button_href: '/contact',
					callback_button_label: 'Request callback',
					background_type: 'image',
					overlay_opacity: 60
				}),
				section('about', 'About3', {
					kicker: 'Local page',
					heading: 'Support local SEO without weakening the conversion path',
					lead: 'This structure keeps the page focused on place, service intent, and the next action.',
					bullet_points: [
						'Local relevance',
						'Strong call to action',
						'Fits the main theme style',
						'Easy to reuse across locations'
					]
				}),
				section('contact', 'Contact2', {
					heading: 'Request local work'
				}),
				section('footer', 'Footer2', {})
			],
			generic: [
				section('header', 'Header4', {
					cta_label: 'Book a call',
					location_label: 'Fast response across West Yorkshire',
					business_hours: 'Mon-Fri: 8:00am - 6:00pm'
				}),
				section('hero', 'Hero4', {
					heading: 'A stronger visual structure for conversion-led trade websites',
					subheading: 'Bold framing, clearer CTAs, and a premium feel.',
					primary_button_label: 'Get started',
					primary_button_href: '/contact',
					secondary_button_label: 'Contact us',
					secondary_button_href: '/contact',
					callback_button_label: 'Request callback',
					background_type: 'image',
					overlay_opacity: 60
				}),
				section('about', 'About3', {
					kicker: 'Flexible base',
					heading: 'A reusable structure you can expand later',
					lead: 'This gives extra visual energy without locking the site into a rigid page layout.',
					bullet_points: [
						'High-contrast framing',
						'Stronger CTA flow',
						'Reusable across pages',
						'Keeps editing simple'
					]
				}),
				section('contact', 'Contact2', {
					heading: 'Get in touch'
				}),
				section('footer', 'Footer2', {})
			]
		}
	}
];

const THEME_DEFINITIONS_BY_ID = Object.fromEntries(THEME_DEFINITIONS.map((theme) => [theme.id, theme]));

export function listThemeDefinitions() {
	return clone(THEME_DEFINITIONS);
}

export function getThemeDefinition(themeId) {
	return clone(THEME_DEFINITIONS_BY_ID[(themeId || '').toString().trim().toLowerCase()] || null);
}

export function getThemeBlueprint(themeId, blueprintKey = 'home') {
	const theme = THEME_DEFINITIONS_BY_ID[(themeId || '').toString().trim().toLowerCase()];
	if (!theme) return [];

	const key = (blueprintKey || 'home').toString().trim();
	const pageBlueprints = theme.pageBlueprints || {};
	return clone(pageBlueprints[key] || pageBlueprints.generic || pageBlueprints.home || []);
}

export const TRADEBOLT_THEME_DEFINITIONS = THEME_DEFINITIONS;
export const themeDefinitions = TRADEBOLT_THEME_DEFINITIONS;
