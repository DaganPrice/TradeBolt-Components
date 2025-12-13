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
			<div class="grid gap-6" style="grid-template-columns: repeat({columns}, minmax(0, 1fr));">
				{#each images as image}
					<div class="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
						<img
							src={pb.files.getURL({id: image.id, collectionId: 'images', collectionName: 'images'}, image.file, {thumb: '800x600'})}
							alt={image.alt_text || image.title}
							class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
							loading="lazy"
						/>
						{#if image.title}
							<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
								<p class="text-white font-semibold">{image.title}</p>
							</div>
						{/if}
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
