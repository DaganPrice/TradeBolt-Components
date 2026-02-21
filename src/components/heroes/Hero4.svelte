<script>
	export let website;
	export let pb;
	export let data = {};
	export let embed = false;

	function safeText(value, fallback = '') {
		if (value == null) return fallback;
		return String(value);
	}

	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: { accentText: 'text-orange-400', accentBg: 'bg-orange-400 text-black', accentHover: 'hover:bg-orange-300' },
			red: { accentText: 'text-red-400', accentBg: 'bg-red-500 text-white', accentHover: 'hover:bg-red-400' },
			blue: { accentText: 'text-blue-400', accentBg: 'bg-blue-500 text-white', accentHover: 'hover:bg-blue-400' },
			green: { accentText: 'text-emerald-400', accentBg: 'bg-emerald-500 text-white', accentHover: 'hover:bg-emerald-400' },
			yellow: { accentText: 'text-yellow-400', accentBg: 'bg-yellow-400 text-black', accentHover: 'hover:bg-yellow-300' },
			purple: { accentText: 'text-purple-400', accentBg: 'bg-purple-500 text-white', accentHover: 'hover:bg-purple-400' },
			pink: { accentText: 'text-pink-400', accentBg: 'bg-pink-500 text-white', accentHover: 'hover:bg-pink-400' },
			gray: { accentText: 'text-gray-300', accentBg: 'bg-gray-200 text-gray-900', accentHover: 'hover:bg-white' }
		};
		return colorMap[colorScheme] || colorMap.yellow;
	}

	function getBackgroundStyle(backgroundImage, overlayOpacity) {
		if (!backgroundImage) return '';
		try {
			const imageUrl =
				typeof backgroundImage === 'string'
					? backgroundImage
					: pb.files.getURL(
							{ id: backgroundImage.id, collectionId: 'images', collectionName: 'images' },
							backgroundImage.file
						);
			const opacity = Math.max(0, Math.min(100, Number(overlayOpacity ?? 60))) / 100;
			return `background-image: linear-gradient(rgba(10,14,20,${opacity}), rgba(10,14,20,${opacity})), url('${imageUrl}'); background-size: cover; background-position: center;`;
		} catch (err) {
			console.error('Error generating hero background image URL:', err);
			return '';
		}
	}

	function handleLinkClick(e) {
		if (embed) e.preventDefault();
	}

	$: colors = getColorClasses(website?.color_scheme);
	$: heading = safeText(data?.heading, website?.business_name || 'Your Business');
	$: subheading = safeText(data?.subheading, 'Domestic, Commercial & Industrial');
	$: primaryCtaLabel = safeText(data?.primary_button_label, 'Our Services');
	$: primaryCtaHref = safeText(data?.primary_button_href, '#services');
	$: secondaryCtaLabel = safeText(data?.secondary_button_label, 'Contact Us');
	$: secondaryCtaHref = safeText(data?.secondary_button_href, '/contact');
	$: callbackLabel = safeText(data?.callback_button_label, 'Request Callback');
	$: namePlaceholder = safeText(data?.name_placeholder, 'Name');
	$: phonePlaceholder = safeText(data?.phone_placeholder, 'Phone');
	$: descriptionPlaceholder = safeText(data?.description_placeholder, 'Brief Description');
	$: backgroundStyle = getBackgroundStyle(data?.background_image, data?.overlay_opacity);
</script>

<section id="hero" class="tb-hero4 relative overflow-hidden bg-[#0f1116] text-white" style={backgroundStyle}>
	<div class="tb-hero4-overlay absolute inset-0"></div>

	<div class="relative mx-auto flex min-h-[680px] max-w-7xl items-center justify-center px-4 pb-36 pt-32 text-center">
		<div class="w-full max-w-4xl">
			{#if subheading}
				<p class={`mb-4 text-2xl font-semibold ${colors.accentText}`}>{subheading}</p>
			{/if}

			<h1 class="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
				{heading}
			</h1>

			<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
				<a
					href={primaryCtaHref}
					on:click={handleLinkClick}
					class={`inline-flex min-w-44 items-center justify-center rounded-md px-6 py-3 text-base font-semibold transition-colors ${colors.accentBg} ${colors.accentHover}`}
				>
					{primaryCtaLabel}
				</a>
				<a
					href={secondaryCtaHref}
					on:click={handleLinkClick}
					class="inline-flex min-w-44 items-center justify-center rounded-md border border-white/60 bg-black/35 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-black/50"
				>
					{secondaryCtaLabel}
				</a>
			</div>
		</div>
	</div>

	<div class="absolute inset-x-0 bottom-0 px-4 pb-6">
		<div class={`mx-auto max-w-6xl rounded-lg p-4 shadow-xl ${colors.accentBg}`}>
			<form class="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1.2fr_auto]" on:submit|preventDefault>
				<input
					type="text"
					placeholder={namePlaceholder}
					class="h-12 rounded border border-black/25 bg-white/95 px-4 text-base text-gray-900 outline-none focus:border-black/40"
				/>
				<input
					type="tel"
					placeholder={phonePlaceholder}
					class="h-12 rounded border border-black/25 bg-white/95 px-4 text-base text-gray-900 outline-none focus:border-black/40"
				/>
				<input
					type="text"
					placeholder={descriptionPlaceholder}
					class="h-12 rounded border border-black/25 bg-white/95 px-4 text-base text-gray-900 outline-none focus:border-black/40"
				/>
				<button
					type="submit"
					class="inline-flex h-12 items-center justify-center gap-2 rounded bg-[#0D1117] px-6 text-base font-semibold text-white transition-colors hover:bg-black"
				>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1l-1.3 1.3a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9z" />
					</svg>
					{callbackLabel}
				</button>
			</form>
		</div>
	</div>
</section>

<style>
	.tb-hero4-overlay {
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.38), rgba(0, 0, 0, 0.5));
	}

	@container (max-width: 768px) {
		.tb-hero4 {
			min-height: 620px;
		}
	}
</style>
