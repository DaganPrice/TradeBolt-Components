<script>
	export let website;
	export let pb;
	export let data;
	export let embed = false;

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

	function getImageUrl(imageRef) {
		if (!imageRef?.id || !imageRef?.file || !pb?.files?.getURL) return null;
		try {
			return pb.files.getURL(
				{ id: imageRef.id, collectionId: 'images', collectionName: 'images' },
				imageRef.file,
				{ thumb: '800x800' }
			);
		} catch (err) {
			console.error('Error generating about image URL:', err);
			return null;
		}
	}

	$: imageUrl = getImageUrl(data?.image);
</script>

<section id="about" class="py-20 bg-white">
	<div class="container mx-auto px-4">
		<div class="max-w-6xl mx-auto">
			<div class="grid grid-cols-1 gap-10 items-start md:grid-cols-2 md:items-center">
				<div>
					<h2 class="text-4xl font-bold {colors.text} mb-6 text-center md:text-left">
						{data.heading || 'About Us'}
					</h2>
					<div class="prose prose-lg max-w-none">
						<p class="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap tb-content-with-links">
							{@html data.content || ''}
						</p>
					</div>
				</div>

				<div class="flex justify-center md:justify-end">
					<div class="w-full max-w-md">
						{#if imageUrl}
							<img
								src={imageUrl}
								alt={data.image_alt || `${website.business_name} - About`}
								class="w-full aspect-square object-cover rounded-2xl shadow-lg border border-gray-200"
								loading="lazy"
								decoding="async"
							/>
						{:else}
							<div class="w-full aspect-square rounded-2xl bg-gray-100 border border-gray-200" />
						{/if}
					</div>
				</div>
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
