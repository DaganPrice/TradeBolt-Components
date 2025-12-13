<script>
	export let website;
	export let pb;
	export let data = {};

	// Get color scheme classes based on the selected color
	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: { gradient: 'from-orange-500 to-orange-600', solid: 'bg-orange-600' },
			red: { gradient: 'from-red-500 to-red-600', solid: 'bg-red-600' },
			blue: { gradient: 'from-blue-500 to-blue-600', solid: 'bg-blue-600' },
			green: { gradient: 'from-green-500 to-green-600', solid: 'bg-green-600' },
			yellow: { gradient: 'from-yellow-500 to-yellow-600', solid: 'bg-yellow-600' },
			purple: { gradient: 'from-purple-500 to-purple-600', solid: 'bg-purple-600' },
			pink: { gradient: 'from-pink-500 to-pink-600', solid: 'bg-pink-600' },
			gray: { gradient: 'from-gray-500 to-gray-600', solid: 'bg-gray-600' }
		};
		return colorMap[colorScheme] || colorMap.orange;
	}

	$: colors = getColorClasses(website.color_scheme);
	$: backgroundStyle = data.background_style || 'gradient'; // 'gradient' or 'solid'
	$: pageTitle = data.page_title || 'Page Title';
</script>

<section
	class="relative text-white {backgroundStyle === 'gradient' ? `bg-gradient-to-br ${colors.gradient}` : colors.solid}"
>
	<div class="tb-hero2-pad container mx-auto px-4 py-16">
		<div class="max-w-4xl mx-auto text-center">
			<h1 class="tb-hero2-title text-4xl font-bold">
				{pageTitle}
			</h1>
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
