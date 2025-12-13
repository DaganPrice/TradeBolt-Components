<script>
	export let website;
	export let data;

	// Get color scheme classes based on the selected color
	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: { text: 'text-orange-600', bg: 'bg-orange-100' },
			red: { text: 'text-red-600', bg: 'bg-red-100' },
			blue: { text: 'text-blue-600', bg: 'bg-blue-100' },
			green: { text: 'text-green-600', bg: 'bg-green-100' },
			yellow: { text: 'text-yellow-600', bg: 'bg-yellow-100' },
			purple: { text: 'text-purple-600', bg: 'bg-purple-100' },
			pink: { text: 'text-pink-600', bg: 'bg-pink-100' },
			gray: { text: 'text-gray-600', bg: 'bg-gray-100' }
		};
		return colorMap[colorScheme] || colorMap.orange;
	}

	$: colors = getColorClasses(website.color_scheme);
</script>

<section id="services" class="py-20 bg-gray-50">
	<div class="container mx-auto px-4">
		<div class="max-w-6xl mx-auto">
			<h2 class="text-4xl font-bold {colors.text} mb-12 text-center">{data.heading || 'Our Services'}</h2>

			<div class="tb-services-grid grid grid-cols-1 gap-6">
				{#each data.items || [] as service}
					<div class="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-200">
						<div class="flex items-start space-x-4">
							<div class="flex-shrink-0">
								<div class="w-12 h-12 {colors.bg} rounded-lg flex items-center justify-center">
									<svg class="w-6 h-6 {colors.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
									</svg>
								</div>
							</div>
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-gray-900 mb-2">
									{service}
								</h3>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	@container (min-width: 768px) {
		.tb-services-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@container (min-width: 1024px) {
		.tb-services-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
