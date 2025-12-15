<script>
	export let website;
	export let pb;
	export let data = {};

	// Get color scheme classes based on the selected color
	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: { gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-700' },
			red: { gradient: 'from-red-500 to-red-600', bg: 'bg-red-700' },
			blue: { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-700' },
			green: { gradient: 'from-green-500 to-green-600', bg: 'bg-green-700' },
			yellow: { gradient: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-700' },
			purple: { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-700' },
			pink: { gradient: 'from-pink-500 to-pink-600', bg: 'bg-pink-700' },
			gray: { gradient: 'from-gray-500 to-gray-600', bg: 'bg-gray-700' }
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
	<div class="tb-hero2-pad container mx-auto px-4 py-16">
		<div class="max-w-4xl mx-auto text-center">
			<h1 class="tb-hero2-title text-4xl font-bold mb-4">
				{data.heading || website.business_name}
			</h1>
			{#if data.subheading}
				<p class="tb-hero2-subheading text-lg text-white/90 max-w-2xl mx-auto">
					{data.subheading}
				</p>
			{/if}
		</div>
	</div>
</section>

<style>
	@container (min-width: 768px) {
		.tb-hero2-pad {
			padding-top: 6rem;
			padding-bottom: 6rem;
		}

		.tb-hero2-title {
			font-size: 3rem;
			line-height: 1;
		}
	}

	@container (min-width: 1024px) {
		.tb-hero2-title {
			font-size: 3.75rem;
			line-height: 1;
		}
	}
</style>
