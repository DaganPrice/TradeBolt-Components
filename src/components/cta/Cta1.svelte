<script>
	export let website;
	export let pb;
	export let data = {};
	export let sections = [];
	export let embed = false;

	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: { bg: 'bg-orange-600', hoverBg: 'hover:bg-orange-700', text: 'text-orange-600' },
			red: { bg: 'bg-red-600', hoverBg: 'hover:bg-red-700', text: 'text-red-600' },
			blue: { bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-700', text: 'text-blue-600' },
			green: { bg: 'bg-emerald-600', hoverBg: 'hover:bg-emerald-700', text: 'text-emerald-600' },
			yellow: { bg: 'bg-yellow-500', hoverBg: 'hover:bg-yellow-600', text: 'text-yellow-600' },
			purple: { bg: 'bg-purple-600', hoverBg: 'hover:bg-purple-700', text: 'text-purple-600' },
			pink: { bg: 'bg-pink-600', hoverBg: 'hover:bg-pink-700', text: 'text-pink-600' },
			gray: { bg: 'bg-gray-700', hoverBg: 'hover:bg-gray-800', text: 'text-gray-700' }
		};
		return colorMap[colorScheme] || colorMap.orange;
	}

	function getImageUrl(imageRef) {
		if (!imageRef) return '';
		try {
			return typeof imageRef === 'string'
				? imageRef
				: pb.files.getURL(
						{ id: imageRef.id, collectionId: 'images', collectionName: 'images' },
						imageRef.file
					);
		} catch (err) {
			console.error('Error generating CTA background image URL:', err);
			return '';
		}
	}

	function getBackgroundStyle(backgroundImage, overlayOpacity) {
		const imageUrl = getImageUrl(backgroundImage);
		if (!imageUrl) return '';
		const opacity = Math.max(0, Math.min(100, Number(overlayOpacity ?? 58))) / 100;
		return `background-image: linear-gradient(rgba(10,14,20,${opacity}), rgba(10,14,20,${opacity})), url('${imageUrl}'); background-size: cover; background-position: center;`;
	}

	function imageRefFromValue(value) {
		if (!value) return null;
		if (typeof value === 'string') return value;
		if (value && typeof value === 'object' && value.file) return value;
		return null;
	}

	function findFallbackBackgroundImage(sectionList) {
		const sectionsToSearch = Array.isArray(sectionList) ? sectionList : [];
		const directFields = ['background_image', 'image'];

		for (const section of sectionsToSearch) {
			const data = section?.data || {};
			for (const field of directFields) {
				const image = imageRefFromValue(data[field]);
				if (image) return image;
			}

			if (Array.isArray(data.images)) {
				const galleryImage = data.images.map(imageRefFromValue).find(Boolean);
				if (galleryImage) return galleryImage;
			}

			if (Array.isArray(data.items)) {
				const itemImage = data.items.map((item) => imageRefFromValue(item?.image)).find(Boolean);
				if (itemImage) return itemImage;
			}
		}

		return null;
	}

	function handleLinkClick(e) {
		if (embed) e.preventDefault();
	}

	$: heading = (data?.heading || '').toString().trim() || 'Do You Have An';
	$: highlightText = (data?.highlight_text || '').toString().trim() || 'Electrical';
	$: headingSuffix = (data?.heading_suffix || '').toString().trim() || 'Project?';
	$: content =
		(data?.content || '').toString().trim() ||
		'We love everything electrical! No job is too small for us and our team can support domestic and commercial projects across the region.';
	$: primaryLabel = (data?.primary_button_label || '').toString().trim() || 'Contact Us';
	$: primaryHref = (data?.primary_button_href || '').toString().trim() || '/contact';
	$: secondaryLabel = (data?.secondary_button_label || '').toString().trim() || 'About Us';
	$: secondaryHref = (data?.secondary_button_href || '').toString().trim() || '/about';
	$: colors = getColorClasses(website?.color_scheme);
	$: backgroundImage = data?.background_image || findFallbackBackgroundImage(sections);
	$: backgroundStyle = getBackgroundStyle(backgroundImage, data?.overlay_opacity);
</script>

<section id="cta" class="tb-cta1 relative overflow-hidden bg-[#0B1017] px-4 py-16 sm:py-20" style={backgroundStyle}>
	<div class="absolute inset-0 bg-[#0B1017]/55"></div>

	<div class="relative mx-auto max-w-7xl">
		<div class="max-w-3xl bg-[#f7f7f7] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-12">
			<div class="flex items-start gap-4">
				<span class={`mt-1 inline-block h-20 w-1.5 ${colors.bg}`}></span>
				<div>
					<h2 class="text-4xl font-bold leading-tight text-[#0F172A] sm:text-5xl">
						{heading}<br />
						<span class={colors.text}>{highlightText}</span> {headingSuffix}
					</h2>
					<p class="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700">
						{content}
					</p>
				</div>
			</div>

			<div class="mt-8 flex flex-col gap-3 sm:flex-row">
				<a
					href={primaryHref}
					on:click={handleLinkClick}
					class={`inline-flex items-center justify-center gap-2 rounded px-6 py-3 text-base font-semibold text-white transition-colors ${colors.bg} ${colors.hoverBg}`}
				>
					{primaryLabel}
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
					</svg>
				</a>
				<a
					href={secondaryHref}
					on:click={handleLinkClick}
					class="inline-flex items-center justify-center gap-2 rounded bg-[#0F1117] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-black"
				>
					{secondaryLabel}
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M20 21a8 8 0 1 0-16 0" />
						<circle cx="12" cy="7" r="4" />
					</svg>
				</a>
			</div>
		</div>
	</div>
</section>
