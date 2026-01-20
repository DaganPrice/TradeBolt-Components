<script>
	export let website;
	export let pb;
	export let data;
	export let embed = false;

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

	$: colors = getColorClasses(website?.color_scheme);
	$: flipLayout = data?.flip_layout === true;

	function getImageUrl(imageRef) {
		if (!imageRef?.id || !imageRef?.file || !pb?.files?.getURL) return null;
		try {
			return pb.files.getURL(
				{ id: imageRef.id, collectionId: 'images', collectionName: 'images' },
				imageRef.file,
				{ thumb: '1200x1200' }
			);
		} catch (err) {
			console.error('Error generating about image URL:', err);
			return null;
		}
	}

	$: imageUrl = getImageUrl(data?.image);

	function coerceArray(value) {
		if (Array.isArray(value)) return value;
		if (typeof value === 'string') {
			try {
				const parsed = JSON.parse(value);
				return Array.isArray(parsed) ? parsed : [];
			} catch {
				return [];
			}
		}
		return [];
	}

	$: bulletPoints = coerceArray(data?.bullet_points)
		.map((v) => (v == null ? '' : String(v)).trim())
		.filter(Boolean)
		.slice(0, 8);

	$: legacyHasCtaConfig =
		(data && typeof data.cta_label === 'string' && data.cta_label.trim()) ||
		(data && typeof data.cta_href === 'string' && data.cta_href.trim()) ||
		data?.show_cta_button === true;

	$: showCta =
		(typeof data?.show_contact_button === 'boolean' ? data.show_contact_button : legacyHasCtaConfig) &&
		data?.show_cta_button !== false;

	$: ctaLabel = (data?.cta_label || '').toString().trim() || 'Contact Us';
	$: ctaHref = (data?.cta_href || '').toString().trim() || '/contact';

	function handleCtaClick(e) {
		if (embed) e.preventDefault();
	}
</script>

<section id="about" class="py-10 sm:py-14 bg-white">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-6xl">
			<div class="overflow-hidden rounded-2xl border border-gray-200 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
				<div class="grid grid-cols-1 lg:grid-cols-2">
					<div class="relative bg-slate-50 {flipLayout ? 'lg:order-2' : ''}">
						{#if imageUrl}
							<img
								src={imageUrl}
								alt={data?.image_alt || `${website?.business_name || 'Business'} - About`}
								class="h-full w-full object-cover lg:min-h-[560px]"
								loading="lazy"
								decoding="async"
							/>
						{:else}
							<div class="h-72 w-full bg-slate-100 lg:min-h-[560px]" />
						{/if}

						{#if data?.badge_value && data?.badge_label}
							<div
								class="absolute bottom-4 right-4 rounded-xl px-4 py-3 text-center text-white shadow-[0_14px_28px_rgba(249,115,22,0.35)] sm:bottom-6 sm:right-6 {colors.bg}"
							>
								<div class="text-3xl font-extrabold leading-none tracking-tight sm:text-4xl">
									{data.badge_value}
								</div>
								<div class="mt-1 text-xs font-semibold tracking-wide opacity-95">
									{data.badge_label}
								</div>
							</div>
						{/if}
					</div>

					<div class="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 {flipLayout ? 'lg:order-1' : ''}">
						{#if data?.kicker}
							<p class="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] {colors.text}">
								{data.kicker}
							</p>
						{/if}

						<h2 class="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
							{data?.heading || 'About Us'}
						</h2>

						{#if data?.lead || data?.content}
							<p class="mt-4 text-base leading-relaxed text-slate-600 sm:text-[16px] sm:leading-7">
								{@html data?.lead || data?.content || ''}
							</p>
						{/if}

						{#if data?.sub}
							<p class="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[14.5px] sm:leading-7">
								{@html data.sub}
							</p>
						{/if}

						{#if bulletPoints.length}
							<ul class="mt-7 grid list-none grid-cols-1 gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
								{#each bulletPoints as point}
									<li class="flex items-start gap-3 text-[14.5px] leading-snug text-slate-900">
										<span
											class="mt-0.5 grid h-[18px] w-[18px] flex-none place-items-center rounded-full bg-[rgba(249,115,22,0.12)]"
											aria-hidden="true"
										>
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												class="h-3 w-3 {colors.text}"
											>
												<path d="M20 6L9 17l-5-5" />
											</svg>
										</span>
										<span>{point}</span>
									</li>
								{/each}
							</ul>
						{/if}

						{#if showCta}
							<div class="mt-8">
								<a
									href={ctaHref}
									on:click={handleCtaClick}
									class="inline-flex w-fit items-center justify-center rounded-xl px-6 py-3 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(249,115,22,0.28)] transition-colors {colors.bg} {colors.hoverBg}"
								>
									{ctaLabel}
								</a>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
