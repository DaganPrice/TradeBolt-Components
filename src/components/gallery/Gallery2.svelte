<script>
	export let website;
	export let pb;
	export let data = {};

	$: columns = data.columns || 3;
	$: images = data.images || [];
</script>

<section class="py-16 px-4 bg-gray-50">
	<div class="container mx-auto">
		{#if data.heading}
			<h2 class="text-4xl font-bold text-center mb-4 text-gray-900">{data.heading}</h2>
		{/if}
		{#if data.subheading}
			<p class="text-xl text-center text-gray-600 mb-12">{data.subheading}</p>
		{/if}

		{#if images.length > 0}
			<div class="gap-6" style="column-count: {columns}; column-gap: 1.5rem;">
				{#each images as image}
					<div class="mb-6 break-inside-avoid group">
						<div class="overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
							<img
								src={pb.files.getURL({id: image.id, collectionId: 'images', collectionName: 'images'}, image.file)}
								alt={image.alt_text || image.title}
								class="w-full group-hover:scale-105 transition-transform duration-300"
								loading="lazy"
							/>
							{#if image.title}
								<div class="bg-white p-3 border-t border-gray-200">
									<p class="text-gray-800 font-medium text-sm">{image.title}</p>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-12 text-gray-500">
				<p>No images to display</p>
			</div>
		{/if}
	</div>
</section>
