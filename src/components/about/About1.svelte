<script>
	export let website;
	export let data;

	// Get color scheme classes based on the selected color
	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: { text: 'text-orange-600' },
			red: { text: 'text-red-600' },
			blue: { text: 'text-blue-600' },
			green: { text: 'text-green-600' },
			yellow: { text: 'text-yellow-600' },
			purple: { text: 'text-purple-600' },
			pink: { text: 'text-pink-600' },
			gray: { text: 'text-gray-600' }
		};
		return colorMap[colorScheme] || colorMap.orange;
	}

	$: colors = getColorClasses(website.color_scheme);
</script>

<section id="about" class="py-20 bg-white">
	<div class="container mx-auto px-4">
		<div class="max-w-3xl mx-auto">
			<h2 class="text-4xl font-bold {colors.text} mb-8 text-center">{data.heading || 'About Us'}</h2>
			<div class="prose prose-lg max-w-none">
				<p class="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap tb-content-with-links">
					{@html data.content || ''}
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	:global(.tb-content-with-links a) {
		color: currentColor;
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: opacity 0.2s;
	}

	:global(.tb-content-with-links a:hover) {
		opacity: 0.7;
	}
</style>
