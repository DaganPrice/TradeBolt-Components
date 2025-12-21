<script>
	export let website;
	export let pb;
	export let data;
	export let embed = false;

	// Get color scheme classes based on the selected color
	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: { text: 'text-orange-600', bg: 'bg-orange-600', hoverBg: 'hover:bg-orange-700' },
			red: { text: 'text-red-600', bg: 'bg-red-600', hoverBg: 'hover:bg-red-700' },
			blue: { text: 'text-blue-600', bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-700' },
			green: { text: 'text-green-600', bg: 'bg-green-600', hoverBg: 'hover:bg-green-700' },
			yellow: { text: 'text-yellow-600', bg: 'bg-yellow-600', hoverBg: 'hover:bg-yellow-700' },
			purple: { text: 'text-purple-600', bg: 'bg-purple-600', hoverBg: 'hover:bg-purple-700' },
			pink: { text: 'text-pink-600', bg: 'bg-pink-600', hoverBg: 'hover:bg-pink-700' },
			gray: { text: 'text-gray-600', bg: 'bg-gray-800', hoverBg: 'hover:bg-gray-900' }
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

	$: legacyHasCtaConfig =
		(data && typeof data.cta_label === 'string' && data.cta_label.trim()) ||
		(data && typeof data.cta_href === 'string' && data.cta_href.trim()) ||
		data?.show_cta_button === true;

	$: showCta =
		(typeof data?.show_contact_button === 'boolean' ? data.show_contact_button : legacyHasCtaConfig) &&
		data?.show_cta_button !== false;

	const ctaLabel = 'Contact Us';
	const ctaHref = '/contact';

	function handleCtaClick(e) {
		if (embed) {
			e.preventDefault();
		}
	}
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

					{#if showCta}
						<div class="mt-8 flex justify-center md:justify-start">
							<a
								href={ctaHref}
								on:click={handleCtaClick}
								class="inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold text-white shadow-sm transition-colors {colors.bg} {colors.hoverBg}"
							>
								{ctaLabel}
							</a>
						</div>
					{/if}
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
