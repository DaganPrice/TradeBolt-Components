<script>
	export let website;
	export let pb;
	export let data;
	export let embed = false;

	// Get color scheme classes based on the selected color
	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: {
				text: 'text-orange-600',
				bgLight: 'bg-orange-50',
				border: 'border-orange-200',
				hoverBg: 'hover:bg-orange-100'
			},
			red: { text: 'text-red-600', bgLight: 'bg-red-50', border: 'border-red-200', hoverBg: 'hover:bg-red-100' },
			blue: { text: 'text-blue-600', bgLight: 'bg-blue-50', border: 'border-blue-200', hoverBg: 'hover:bg-blue-100' },
			green: { text: 'text-green-600', bgLight: 'bg-green-50', border: 'border-green-200', hoverBg: 'hover:bg-green-100' },
			yellow: { text: 'text-yellow-600', bgLight: 'bg-yellow-50', border: 'border-yellow-200', hoverBg: 'hover:bg-yellow-100' },
			purple: { text: 'text-purple-600', bgLight: 'bg-purple-50', border: 'border-purple-200', hoverBg: 'hover:bg-purple-100' },
			pink: { text: 'text-pink-600', bgLight: 'bg-pink-50', border: 'border-pink-200', hoverBg: 'hover:bg-pink-100' },
			gray: { text: 'text-gray-600', bgLight: 'bg-gray-50', border: 'border-gray-200', hoverBg: 'hover:bg-gray-100' }
		};
		return colorMap[colorScheme] || colorMap.orange;
	}

	$: colors = getColorClasses(website.color_scheme);

	function handleLinkClick(e) {
		if (embed) {
			e.preventDefault();
		}
	}

	$: itemsRaw = Array.isArray(data?.items) ? data.items : [];
	$: items = itemsRaw.map((item) =>
		typeof item === 'string' ? { title: item } : item
	);
</script>

<section id="locations" class="py-20 bg-white">
	<div class="container mx-auto px-4">
		<div class="max-w-4xl mx-auto">
			<h2 class="text-4xl font-bold {colors.text} mb-12 text-center">{data.heading || 'Areas We Cover'}</h2>

			<div class="flex flex-wrap justify-center gap-4">
				{#each items as item}
					{@const title = item?.title || 'Location'}
					{@const href = item?.href || ''}

					<svelte:element
						this={href ? 'a' : 'div'}
						href={href || undefined}
						on:click={handleLinkClick}
						class="inline-flex items-center px-6 py-3 {colors.bgLight} border-2 {colors.border} rounded-full transition-colors {href
							? colors.hoverBg + ' cursor-pointer'
							: ''}"
					>
						<svg class="w-5 h-5 {colors.text} mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						<span class="text-lg font-medium text-gray-800">{title}</span>
					</svelte:element>
				{/each}
			</div>
		</div>
	</div>
</section>
