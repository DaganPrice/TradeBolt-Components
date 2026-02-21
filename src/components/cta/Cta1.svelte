<script>
	export let pb;
	export let data = {};
	export let embed = false;

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
	$: backgroundStyle = getBackgroundStyle(data?.background_image, data?.overlay_opacity);
</script>

<section id="cta" class="tb-cta1 relative overflow-hidden px-4 py-16 sm:py-20" style={backgroundStyle}>
	<div class="absolute inset-0 bg-[#0B1017]/55"></div>

	<div class="relative mx-auto max-w-7xl">
		<div class="max-w-3xl bg-[#f7f7f7] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-12">
			<div class="flex items-start gap-4">
				<span class="mt-1 inline-block h-20 w-1.5 bg-yellow-400"></span>
				<div>
					<h2 class="text-4xl font-bold leading-tight text-[#0F172A] sm:text-5xl">
						{heading}<br />
						<span class="text-yellow-400">{highlightText}</span> {headingSuffix}
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
					class="inline-flex items-center justify-center gap-2 rounded bg-yellow-400 px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-yellow-300"
				>
					{primaryLabel}
					<i class="fa-solid fa-comment"></i>
				</a>
				<a
					href={secondaryHref}
					on:click={handleLinkClick}
					class="inline-flex items-center justify-center gap-2 rounded bg-[#0F1117] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-black"
				>
					{secondaryLabel}
					<i class="fa-solid fa-user"></i>
				</a>
			</div>
		</div>
	</div>
</section>
