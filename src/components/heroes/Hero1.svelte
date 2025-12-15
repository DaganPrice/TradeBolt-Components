<script>
	export let website;
	export let pb;
	export let data = {}; // Section data
	export let sections = []; // All sections

	// Get phone from contact section
	$: contactSection = sections.find(s => s.section_type === 'contact');
	$: phone = contactSection?.data?.phone || '';

	// Get color scheme classes based on the selected color
	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: { gradient: 'from-orange-500 to-orange-600', text: 'text-orange-600', bg: 'bg-orange-700', hoverBg: 'hover:bg-orange-800', textLight: 'text-orange-100' },
			red: { gradient: 'from-red-500 to-red-600', text: 'text-red-600', bg: 'bg-red-700', hoverBg: 'hover:bg-red-800', textLight: 'text-red-100' },
			blue: { gradient: 'from-blue-500 to-blue-600', text: 'text-blue-600', bg: 'bg-blue-700', hoverBg: 'hover:bg-blue-800', textLight: 'text-blue-100' },
			green: { gradient: 'from-green-500 to-green-600', text: 'text-green-600', bg: 'bg-green-700', hoverBg: 'hover:bg-green-800', textLight: 'text-green-100' },
			yellow: { gradient: 'from-yellow-500 to-yellow-600', text: 'text-yellow-600', bg: 'bg-yellow-700', hoverBg: 'hover:bg-yellow-800', textLight: 'text-yellow-100' },
			purple: { gradient: 'from-purple-500 to-purple-600', text: 'text-purple-600', bg: 'bg-purple-700', hoverBg: 'hover:bg-purple-800', textLight: 'text-purple-100' },
			pink: { gradient: 'from-pink-500 to-pink-600', text: 'text-pink-600', bg: 'bg-pink-700', hoverBg: 'hover:bg-pink-800', textLight: 'text-pink-100' },
			gray: { gradient: 'from-gray-500 to-gray-600', text: 'text-gray-600', bg: 'bg-gray-700', hoverBg: 'hover:bg-gray-800', textLight: 'text-gray-100' }
		};
		return colorMap[colorScheme] || colorMap.orange;
	}

	function getBackgroundStyle(backgroundType, backgroundImage, overlayOpacity) {
		if (backgroundType === 'image' && backgroundImage) {
			try {
				const imageUrl = pb.files.getURL(
					{id: backgroundImage.id, collectionId: 'images', collectionName: 'images'},
					backgroundImage.file
				);
				const opacity = (overlayOpacity || 50) / 100;
				return `background-image: linear-gradient(rgba(0,0,0,${opacity}), rgba(0,0,0,${opacity})), url('${imageUrl}'); background-size: cover; background-position: center;`;
			} catch (err) {
				console.error('Error generating background image URL:', err);
				return '';
			}
		}
		return '';
	}

	$: colors = getColorClasses(website.color_scheme);
	$: backgroundType = data.background_type || 'gradient';
	$: backgroundStyle = getBackgroundStyle(backgroundType, data.background_image, data.overlay_opacity);

	// Get background classes based on background type
	$: backgroundClasses = backgroundType === 'gradient'
		? `bg-gradient-to-br ${colors.gradient}`
		: backgroundType === 'color'
			? colors.bg
			: '';
</script>

<section
	class="relative text-white {backgroundClasses}"
	style={backgroundStyle}
>
	<div class="tb-hero-pad container mx-auto px-4 py-20">
		<div class="max-w-4xl mx-auto text-center">
			<!-- Page Heading -->
			<h1 class="tb-hero-title text-5xl font-bold mb-6">
				{data.heading || website.business_name}
			</h1>

			<!-- Subheading -->
			{#if data.subheading}
				<p class="tb-hero-tagline text-xl {colors.textLight} mb-10 max-w-2xl mx-auto font-medium">
					{data.subheading}
				</p>
			{/if}

			<!-- CTA Buttons -->
			<div class="tb-hero-cta flex flex-col gap-4 justify-center">
				<a
					href={data.cta_link || '#contact'}
					class="inline-flex items-center justify-center px-8 py-4 bg-white {colors.text} font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
				>
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
					{data.cta_text || 'Get in Touch'}
				</a>

				{#if data.show_phone_button && phone}
					<a
						href="tel:{phone}"
						class="inline-flex items-center justify-center px-8 py-4 {colors.bg} text-white font-bold rounded-lg {colors.hoverBg} transition-colors"
					>
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
						</svg>
						Call Now
					</a>
				{/if}
			</div>
		</div>
	</div>

	<!-- Decorative Wave -->
	<div class="absolute bottom-0 left-0 right-0">
		<svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
			<path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
		</svg>
	</div>
</section>

<style>
	@container (min-width: 640px) {
		.tb-hero-cta {
			flex-direction: row;
		}
	}

	@container (min-width: 768px) {
		.tb-hero-pad {
			padding-top: 8rem;
			padding-bottom: 8rem;
		}

		.tb-hero-title {
			font-size: 3.75rem;
			line-height: 1;
		}

		.tb-hero-tagline {
			font-size: 1.5rem;
			line-height: 2rem;
		}
	}
</style>
