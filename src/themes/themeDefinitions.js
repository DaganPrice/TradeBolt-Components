const DEFAULT_BUSINESS_HOURS = [
	{ day: 'Mon - Fri', time: '8:00 AM - 6:00 PM' },
	{ day: 'Saturday', time: '9:00 AM - 2:00 PM' },
	{ day: 'Sunday', time: 'Closed' }
];

export const themeDefinitions = [
	{
		id: 'classic-local',
		name: 'Classic Local',
		category: 'Traditional',
		description: 'A familiar local-business layout with clear service and contact sections.',
		bestFor: 'Established local trades and service businesses',
		tags: ['Traditional', 'Simple', 'Trust'],
		preview: {
			gradient: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #ffffff 100%)',
			accent: '#f97316',
			accentAlt: '#1f2937',
			surface: '#fff7ed'
		},
		websitePatch: {
			color_scheme: 'orange',
			website_style: 'traditional',
			theme_tokens: {
				style: 'classic-local',
				density: 'comfortable',
				emphasis: 'trust'
			}
		},
		pageBlueprints: {
			home: [
				{ section_type: 'header', variant: 'Header1', data: { show_cta_button: true, cta_label: 'Get a Free Quote' } },
				{
					section_type: 'hero',
					variant: 'Hero1',
					data: {
						heading: 'Trusted local tradespeople',
						subheading: 'Friendly service, clear pricing and workmanship you can rely on.',
						show_phone_button: true,
						background_type: 'gradient',
						background_style: 'gradient',
						overlay_opacity: 34
					}
				},
				{
					section_type: 'about',
					variant: 'About1',
					data: {
						heading: 'About Us',
						content: 'We provide dependable local service with honest advice and tidy workmanship.'
					}
				},
				{
					section_type: 'services',
					variant: 'Services1',
					data: {
						heading: 'Our Services',
						items: ['Installations', 'Repairs', 'Maintenance', 'Emergency Callouts']
					}
				},
				{
					section_type: 'locations',
					variant: 'Locations1',
					data: {
						heading: 'Areas We Cover',
						items: ['Town Centre', 'Nearby Villages', 'Surrounding Areas']
					}
				},
				{
					section_type: 'contact',
					variant: 'Contact2',
					data: {
						heading: 'Get In Touch',
						description: 'Call, email or send a message and we will get back to you quickly.'
					}
				},
				{
					section_type: 'footer',
					variant: 'Footer1',
					data: {
						show_tradebolt_badge: false,
						business_hours: DEFAULT_BUSINESS_HOURS
					}
				}
			],
			about: [
				{ section_type: 'header', variant: 'Header1', data: { show_cta_button: true, cta_label: 'Get a Free Quote' } },
				{
					section_type: 'hero',
					variant: 'Hero2',
					data: {
						heading: 'About Us',
						subheading: 'A reliable local business focused on quality workmanship.'
					}
				},
				{ section_type: 'about', variant: 'About1', data: { heading: 'Why customers choose us' } },
				{ section_type: 'contact', variant: 'Contact1', data: { heading: 'Need advice?' } },
				{ section_type: 'footer', variant: 'Footer1', data: { show_tradebolt_badge: false, business_hours: DEFAULT_BUSINESS_HOURS } }
			],
			servicesIndex: [
				{ section_type: 'header', variant: 'Header1', data: { show_cta_button: true, cta_label: 'Get a Free Quote' } },
				{ section_type: 'hero', variant: 'Hero2', data: { heading: 'Our Services', subheading: 'Professional work tailored to your needs.' } },
				{ section_type: 'services', variant: 'Services1', data: { heading: 'What we offer' } },
				{ section_type: 'contact', variant: 'Contact1', data: { heading: 'Request a quote' } },
				{ section_type: 'footer', variant: 'Footer1', data: { show_tradebolt_badge: false, business_hours: DEFAULT_BUSINESS_HOURS } }
			],
			serviceDetail: [
				{ section_type: 'header', variant: 'Header1', data: { show_cta_button: true, cta_label: 'Request a Quote' } },
				{ section_type: 'hero', variant: 'Hero2', data: { heading: 'Service Details', subheading: 'Clear advice and quality workmanship from start to finish.' } },
				{ section_type: 'about', variant: 'About1', data: { heading: 'How we help' } },
				{ section_type: 'contact', variant: 'Contact1', data: { heading: 'Book this service' } },
				{ section_type: 'footer', variant: 'Footer1', data: { show_tradebolt_badge: false, business_hours: DEFAULT_BUSINESS_HOURS } }
			],
			locationsIndex: [
				{ section_type: 'header', variant: 'Header1', data: { show_cta_button: true, cta_label: 'Get a Free Quote' } },
				{ section_type: 'hero', variant: 'Hero2', data: { heading: 'Areas We Cover', subheading: 'Local coverage with fast response times.' } },
				{ section_type: 'locations', variant: 'Locations1', data: { heading: 'Coverage Areas' } },
				{ section_type: 'contact', variant: 'Contact1', data: { heading: 'Check availability' } },
				{ section_type: 'footer', variant: 'Footer1', data: { show_tradebolt_badge: false, business_hours: DEFAULT_BUSINESS_HOURS } }
			],
			locationDetail: [
				{ section_type: 'header', variant: 'Header1', data: { show_cta_button: true, cta_label: 'Check Availability' } },
				{ section_type: 'hero', variant: 'Hero2', data: { heading: 'Local Service Area', subheading: 'Reliable help in your area.' } },
				{ section_type: 'about', variant: 'About1', data: { heading: 'Local expertise' } },
				{ section_type: 'contact', variant: 'Contact1', data: { heading: 'Request service' } },
				{ section_type: 'footer', variant: 'Footer1', data: { show_tradebolt_badge: false, business_hours: DEFAULT_BUSINESS_HOURS } }
			],
			contact: [
				{ section_type: 'header', variant: 'Header1', data: { show_cta_button: true, cta_label: 'Call Now' } },
				{ section_type: 'hero', variant: 'Hero2', data: { heading: 'Contact Us', subheading: 'Get in touch for a quote or advice.' } },
				{ section_type: 'contact', variant: 'Contact2', data: { heading: 'Send us a message' } },
				{ section_type: 'footer', variant: 'Footer1', data: { show_tradebolt_badge: false, business_hours: DEFAULT_BUSINESS_HOURS } }
			],
			generic: [
				{ section_type: 'header', variant: 'Header1', data: { show_cta_button: true, cta_label: 'Get a Free Quote' } },
				{ section_type: 'hero', variant: 'Hero2', data: { heading: 'Our Page', subheading: 'Helpful information about our business and services.' } },
				{ section_type: 'about', variant: 'About1', data: { heading: 'Helpful information' } },
				{ section_type: 'contact', variant: 'Contact1', data: { heading: 'Need help?' } },
				{ section_type: 'footer', variant: 'Footer1', data: { show_tradebolt_badge: false, business_hours: DEFAULT_BUSINESS_HOURS } }
			]
		}
	},
	{
		id: 'bold-conversion',
		name: 'Bold Conversion',
		category: 'Lead Generation',
		description: 'A higher-impact layout with stronger CTAs, visual sections and enquiry-first flow.',
		bestFor: 'Trades businesses focused on conversion and a more modern feel',
		tags: ['Modern', 'Bold', 'Leads'],
		preview: {
			gradient: 'linear-gradient(135deg, #0f172a 0%, #111827 35%, #ea580c 100%)',
			accent: '#fb923c',
			accentAlt: '#e5e7eb',
			surface: '#111827'
		},
		websitePatch: {
			color_scheme: 'orange',
			website_style: 'bold',
			theme_tokens: {
				style: 'bold-conversion',
				density: 'compact',
				emphasis: 'leads'
			}
		},
		pageBlueprints: {
			home: [
				{ section_type: 'header', variant: 'Header4', data: { show_cta_button: true, cta_label: 'Request Callback' } },
				{
					section_type: 'hero',
					variant: 'Hero4',
					data: {
						heading: 'Fast quotes. Clean work. Reliable results.',
						subheading: 'Trusted local experts for homes and businesses.',
						primary_button_label: 'Our Services',
						primary_button_href: '/services',
						secondary_button_label: 'Get In Touch',
						secondary_button_href: '/contact',
						callback_button_label: 'Request Callback',
						overlay_opacity: 62
					}
				},
				{
					section_type: 'about',
					variant: 'About3',
					data: {
						kicker: 'Why clients choose us',
						heading: 'Built around speed, trust and clear communication',
						badge_value: '5*',
						badge_label: 'Rated Service',
						show_contact_button: true
					}
				},
				{
					section_type: 'services',
					variant: 'Services2',
					data: {
						kicker: 'What We Do',
						heading: 'Popular Services',
						items: ['Installations', 'Repairs', 'Maintenance', 'Emergency Response']
					}
				},
				{
					section_type: 'gallery',
					variant: 'Gallery2',
					data: {
						kicker: 'Gallery',
						heading: 'Recent Work',
						subheading: 'Examples of the quality and finish our customers expect.'
					}
				},
				{
					section_type: 'faq',
					variant: 'Faq1',
					data: {
						heading: 'Questions we hear all the time',
						subheading: 'A few quick answers before you get in touch.'
					}
				},
				{
					section_type: 'cta',
					variant: 'Cta1',
					data: {
						heading: 'Need help with your next',
						highlight_text: 'project',
						heading_suffix: '?',
						content: 'Tell us what you need and we will come back with a fast, straightforward response.',
						primary_button_label: 'Contact Us',
						primary_button_href: '/contact',
						secondary_button_label: 'View Services',
						secondary_button_href: '/services',
						overlay_opacity: 62
					}
				},
				{
					section_type: 'footer',
					variant: 'Footer2',
					data: {
						show_tradebolt_badge: false,
						business_hours: DEFAULT_BUSINESS_HOURS
					}
				}
			],
			about: [
				{ section_type: 'header', variant: 'Header4', data: { show_cta_button: true, cta_label: 'Request Callback' } },
				{ section_type: 'hero', variant: 'Hero2', data: { heading: 'About Us', subheading: 'Clear communication, reliable workmanship, and honest advice.' } },
				{ section_type: 'about', variant: 'About3', data: { heading: 'Built for busy customers who want the job done properly' } },
				{ section_type: 'gallery', variant: 'Gallery2', data: { heading: 'See our work' } },
				{ section_type: 'cta', variant: 'Cta1', data: { heading: 'Ready to discuss your', highlight_text: 'job', heading_suffix: '?' } },
				{ section_type: 'footer', variant: 'Footer2', data: { show_tradebolt_badge: false, business_hours: DEFAULT_BUSINESS_HOURS } }
			],
			servicesIndex: [
				{ section_type: 'header', variant: 'Header4', data: { show_cta_button: true, cta_label: 'Request Callback' } },
				{ section_type: 'hero', variant: 'Hero2', data: { heading: 'Our Services', subheading: 'Professional work tailored to the job in front of you.' } },
				{ section_type: 'services', variant: 'Services2', data: { heading: 'Services we offer' } },
				{ section_type: 'cta', variant: 'Cta1', data: { heading: 'Need a quote for this', highlight_text: 'service', heading_suffix: '?' } },
				{ section_type: 'footer', variant: 'Footer2', data: { show_tradebolt_badge: false, business_hours: DEFAULT_BUSINESS_HOURS } }
			],
			serviceDetail: [
				{ section_type: 'header', variant: 'Header4', data: { show_cta_button: true, cta_label: 'Get a Quote' } },
				{ section_type: 'hero', variant: 'Hero2', data: { heading: 'Service Details', subheading: 'A straightforward approach with quality workmanship.' } },
				{ section_type: 'about', variant: 'About2', data: { heading: 'What this service includes', kicker: 'Service Overview' } },
				{ section_type: 'cta', variant: 'Cta1', data: { heading: 'Ready to book this', highlight_text: 'service', heading_suffix: '?' } },
				{ section_type: 'footer', variant: 'Footer2', data: { show_tradebolt_badge: false, business_hours: DEFAULT_BUSINESS_HOURS } }
			],
			locationsIndex: [
				{ section_type: 'header', variant: 'Header4', data: { show_cta_button: true, cta_label: 'Check Availability' } },
				{ section_type: 'hero', variant: 'Hero2', data: { heading: 'Areas We Cover', subheading: 'Fast response across our local service area.' } },
				{ section_type: 'locations', variant: 'Locations1', data: { heading: 'Coverage areas' } },
				{ section_type: 'cta', variant: 'Cta1', data: { heading: 'Need help in your', highlight_text: 'area', heading_suffix: '?' } },
				{ section_type: 'footer', variant: 'Footer2', data: { show_tradebolt_badge: false, business_hours: DEFAULT_BUSINESS_HOURS } }
			],
			locationDetail: [
				{ section_type: 'header', variant: 'Header4', data: { show_cta_button: true, cta_label: 'Check Availability' } },
				{ section_type: 'hero', variant: 'Hero2', data: { heading: 'Local Service Area', subheading: 'Reliable, responsive work in your location.' } },
				{ section_type: 'about', variant: 'About2', data: { heading: 'How we work locally', kicker: 'Local Coverage' } },
				{ section_type: 'cta', variant: 'Cta1', data: { heading: 'Need a fast response in your', highlight_text: 'area', heading_suffix: '?' } },
				{ section_type: 'footer', variant: 'Footer2', data: { show_tradebolt_badge: false, business_hours: DEFAULT_BUSINESS_HOURS } }
			],
			contact: [
				{ section_type: 'header', variant: 'Header4', data: { show_cta_button: true, cta_label: 'Call Today' } },
				{ section_type: 'hero', variant: 'Hero2', data: { heading: 'Contact Us', subheading: 'Tell us what you need and we will respond quickly.' } },
				{ section_type: 'contact', variant: 'Contact2', data: { heading: 'Send us a message' } },
				{ section_type: 'cta', variant: 'Cta1', data: { heading: 'Prefer to talk through the', highlight_text: 'job', heading_suffix: '?' } },
				{ section_type: 'footer', variant: 'Footer2', data: { show_tradebolt_badge: false, business_hours: DEFAULT_BUSINESS_HOURS } }
			],
			generic: [
				{ section_type: 'header', variant: 'Header4', data: { show_cta_button: true, cta_label: 'Get a Quote' } },
				{ section_type: 'hero', variant: 'Hero2', data: { heading: 'Our Page', subheading: 'Clear information and a fast route to get in touch.' } },
				{ section_type: 'about', variant: 'About2', data: { heading: 'Helpful information', kicker: 'Overview' } },
				{ section_type: 'cta', variant: 'Cta1', data: { heading: 'Need help with this', highlight_text: 'project', heading_suffix: '?' } },
				{ section_type: 'footer', variant: 'Footer2', data: { show_tradebolt_badge: false, business_hours: DEFAULT_BUSINESS_HOURS } }
			]
		}
	}
];
