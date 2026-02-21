<script>
	export let pb;
	export let data = {};

	function getImageUrl(imageRef, thumb = '1200x900') {
		if (!imageRef?.id || !imageRef?.file || !pb?.files?.getURL) return '';
		try {
			return pb.files.getURL(
				{ id: imageRef.id, collectionId: 'images', collectionName: 'images' },
				imageRef.file,
				{ thumb }
			);
		} catch (err) {
			console.error('Error generating gallery image URL:', err);
			return '';
		}
	}

	function tileClass(index) {
		const i = index % 10;
		if (i === 0 || i === 1) return 'lg:col-span-1 lg:row-span-1 aspect-[4/3]';
		if (i === 2) return 'lg:col-span-1 lg:row-span-1 aspect-[4/3]';
		if (i === 3) return 'lg:col-span-1 lg:row-span-1 aspect-[4/3]';
		if (i === 4) return 'lg:col-span-1 lg:row-span-1 aspect-[4/3]';
		if (i === 5 || i === 6) return 'lg:col-span-1 lg:row-span-1 aspect-[3/2]';
		if (i === 7) return 'lg:col-span-1 lg:row-span-1 aspect-[3/2]';
		if (i === 8) return 'lg:col-span-1 lg:row-span-1 aspect-[3/2]';
		return 'lg:col-span-1 lg:row-span-1 aspect-[3/2]';
	}

	$: kicker = (data?.kicker || '').toString().trim() || 'Gallery';
	$: heading = (data?.heading || '').toString().trim() || 'Our Work';
	$: images = Array.isArray(data?.images) ? data.images : [];
</script>

<section id="gallery" class="bg-[#f3f3f3] px-4 py-16 sm:py-20">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8 text-center">
			<p class="text-lg font-semibold text-yellow-500">{kicker}</p>
			<h2 class="mt-1 text-4xl font-bold text-[#0F172A] sm:text-5xl">{heading}</h2>
		</div>

		{#if images.length > 0}
			<div class="tb-gallery2-grid grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
				{#each images as image, i}
					<div class={`overflow-hidden bg-gray-200 ${tileClass(i)}`}>
						{#if getImageUrl(image)}
							<img
								src={getImageUrl(image)}
								alt={image?.alt_text || image?.title || 'Gallery image'}
								class="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
								loading="lazy"
								decoding="async"
							/>
						{:else}
							<div class="h-full min-h-[140px] w-full bg-gray-300"></div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<p class="py-10 text-center text-slate-600">No images to display.</p>
		{/if}
	</div>
</section>
