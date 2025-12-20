<script>
	export let website;
	export let pb;
	export let data;
	export let embed = false;

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

	function handleLinkClick(e) {
		if (embed) {
			e.preventDefault();
		}
	}

	function getImageUrl(imageRef) {
		if (!imageRef?.id || !imageRef?.file || !pb?.files?.getURL) return null;
		try {
			return pb.files.getURL(
				{ id: imageRef.id, collectionId: 'images', collectionName: 'images' },
				imageRef.file,
				{ thumb: '800x600' }
			);
		} catch (err) {
			console.error('Error generating service image URL:', err);
			return null;
		}
	}

	$: itemsRaw = Array.isArray(data?.items) ? data.items : [];
	$: items = itemsRaw.map((item) => (typeof item === 'string' ? { title: item } : item));
</script>

<section id="services" class="py-20 bg-gray-50">
	<div class="container mx-auto px-4">
		<div class="max-w-6xl mx-auto">
			<h2 class="text-4xl font-bold {colors.text} mb-12 text-center">{data.heading || 'Our Services'}</h2>

			<div class="tb-services-grid grid grid-cols-1 gap-6">
				{#each items as item}
					{@const title = item?.title || 'Service'}
					{@const description = item?.description || ''}
					{@const href = item?.href || ''}
					{@const imageUrl = getImageUrl(item?.image)}

					<div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden flex flex-col">
						<div class="w-full aspect-[4/3] bg-gray-100">
							{#if imageUrl}
								<img
									src={imageUrl}
									alt={item?.image_alt || `${website.business_name} - ${title}`}
									class="w-full h-full object-cover"
									loading="lazy"
									decoding="async"
								/>
							{:else}
								<div class="w-full h-full flex items-center justify-center">
									<div class="w-14 h-14 {colors.bg} rounded-xl flex items-center justify-center">
										<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
									</div>
								</div>
							{/if}
						</div>

						<div class="p-6 flex-1 flex flex-col">
							<h3 class="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

							{#if description}
								<p class="text-gray-700 leading-relaxed mb-4">{description}</p>
							{/if}

							{#if href}
								<a
									href={href}
									on:click={handleLinkClick}
									class="mt-auto inline-flex items-center font-semibold {colors.text} hover:opacity-80 transition-opacity"
								>
									View service
									<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
									</svg>
								</a>
							{/if}
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
