<script>
	export let website;
	export let pb;
	export let data = {};
	export let embed = false;

	let lightboxOpen = false;
	let lightboxIndex = 0;

	function getImageUrl(imageRef, thumb = '1600x1200') {
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

	function openLightbox(index) {
		if (embed) return;
		lightboxIndex = index;
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
	}

	function previousImage() {
		if (!images.length) return;
		lightboxIndex = (lightboxIndex - 1 + images.length) % images.length;
	}

	function nextImage() {
		if (!images.length) return;
		lightboxIndex = (lightboxIndex + 1) % images.length;
	}

	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: { accentText: 'text-orange-500' },
			red: { accentText: 'text-red-500' },
			blue: { accentText: 'text-blue-500' },
			green: { accentText: 'text-emerald-500' },
			yellow: { accentText: 'text-yellow-500' },
			purple: { accentText: 'text-purple-500' },
			pink: { accentText: 'text-pink-500' },
			gray: { accentText: 'text-gray-600' }
		};
		return colorMap[colorScheme] || colorMap.orange;
	}

	$: colors = getColorClasses(website?.color_scheme);
	$: kicker = (data?.kicker || '').toString().trim() || 'Gallery';
	$: heading = (data?.heading || '').toString().trim() || 'Our Work';
	$: images = Array.isArray(data?.images) ? data.images : [];
	$: activeImage = images[lightboxIndex] || null;
	$: activeImageUrl = activeImage ? getImageUrl(activeImage, '2200x1600') : '';
</script>

<section id="gallery" class="bg-[#f3f3f3] px-4 py-16 sm:py-20">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8 text-center">
			<p class={`text-lg font-semibold ${colors.accentText}`}>{kicker}</p>
			<h2 class="mt-1 text-4xl font-bold text-[#0F172A] sm:text-5xl">{heading}</h2>
		</div>

		{#if images.length > 0}
			<div class="tb-gallery2-masonry">
				{#each images as image, i}
					<button
						type="button"
						on:click={() => openLightbox(i)}
						class="tb-gallery2-masonry-item group block w-full overflow-hidden bg-gray-200 text-left"
						aria-label={`Open image ${i + 1}`}
					>
						{#if getImageUrl(image)}
							<img
								src={getImageUrl(image)}
								alt={image?.alt_text || image?.title || 'Gallery image'}
								class="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
								loading="lazy"
								decoding="async"
							/>
						{:else}
							<div class="h-[200px] w-full bg-gray-300"></div>
						{/if}
					</button>
				{/each}
			</div>
		{:else}
			<p class="py-10 text-center text-slate-600">No images to display.</p>
		{/if}
	</div>
</section>

{#if lightboxOpen && !embed && activeImage}
	<div
		class="tb-gallery2-lightbox fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
		on:click={closeLightbox}
	>
		<button
			type="button"
			on:click|stopPropagation={closeLightbox}
			class="absolute right-4 top-4 rounded bg-black/60 px-3 py-2 text-white transition hover:bg-black/80"
			aria-label="Close lightbox"
		>
			<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M6 6l12 12M18 6L6 18" />
			</svg>
		</button>

		<button
			type="button"
			on:click|stopPropagation={previousImage}
			class="absolute left-4 top-1/2 -translate-y-1/2 rounded bg-black/60 px-3 py-2 text-white transition hover:bg-black/80"
			aria-label="Previous image"
		>
			<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M15 18l-6-6 6-6" />
			</svg>
		</button>

		<div class="max-h-[90vh] max-w-[92vw]" on:click|stopPropagation>
			{#if activeImageUrl}
				<img
					src={activeImageUrl}
					alt={activeImage?.alt_text || activeImage?.title || 'Gallery image'}
					class="max-h-[86vh] max-w-[92vw] object-contain"
				/>
			{/if}
			{#if activeImage?.title}
				<p class="mt-3 text-center text-sm text-white/90">{activeImage.title}</p>
			{/if}
		</div>

		<button
			type="button"
			on:click|stopPropagation={nextImage}
			class="absolute right-4 top-1/2 -translate-y-1/2 rounded bg-black/60 px-3 py-2 text-white transition hover:bg-black/80"
			aria-label="Next image"
		>
			<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M9 6l6 6-6 6" />
			</svg>
		</button>
	</div>
{/if}

<style>
	.tb-gallery2-masonry {
		display: block;
		column-count: 1;
		column-gap: 8px;
	}

	.tb-gallery2-masonry-item {
		break-inside: avoid;
		margin-bottom: 8px;
	}

	@media (min-width: 640px) {
		.tb-gallery2-masonry {
			column-count: 2;
		}
	}

	@media (min-width: 1024px) {
		.tb-gallery2-masonry {
			column-count: 3;
		}
	}

	@media (min-width: 1400px) {
		.tb-gallery2-masonry {
			column-count: 4;
		}
	}
</style>
