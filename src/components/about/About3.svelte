<script>
	export let website;
	export let pb;
	export let data = {};
	export let embed = false;

	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: { accentText: 'text-orange-500', accentBg: 'bg-orange-500 text-white', accentHover: 'hover:bg-orange-600' },
			red: { accentText: 'text-red-500', accentBg: 'bg-red-500 text-white', accentHover: 'hover:bg-red-600' },
			blue: { accentText: 'text-blue-500', accentBg: 'bg-blue-500 text-white', accentHover: 'hover:bg-blue-600' },
			green: { accentText: 'text-emerald-500', accentBg: 'bg-emerald-500 text-white', accentHover: 'hover:bg-emerald-600' },
			yellow: { accentText: 'text-yellow-500', accentBg: 'bg-yellow-400 text-black', accentHover: 'hover:bg-yellow-300' },
			purple: { accentText: 'text-purple-500', accentBg: 'bg-purple-500 text-white', accentHover: 'hover:bg-purple-600' },
			pink: { accentText: 'text-pink-500', accentBg: 'bg-pink-500 text-white', accentHover: 'hover:bg-pink-600' },
			gray: { accentText: 'text-gray-600', accentBg: 'bg-gray-800 text-white', accentHover: 'hover:bg-gray-900' }
		};
		return colorMap[colorScheme] || colorMap.yellow;
	}

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

	function getImageUrl(imageRef) {
		if (!imageRef?.id || !imageRef?.file || !pb?.files?.getURL) return null;
		try {
			return pb.files.getURL(
				{ id: imageRef.id, collectionId: 'images', collectionName: 'images' },
				imageRef.file,
				{ thumb: '1600x1200' }
			);
		} catch (err) {
			console.error('Error generating about image URL:', err);
			return null;
		}
	}

	function handleCtaClick(e) {
		if (embed) e.preventDefault();
	}

	$: colors = getColorClasses(website?.color_scheme);
	$: imageUrl = getImageUrl(data?.image);
	$: kicker = (data?.kicker || '').toString().trim() || 'About Us';
	$: heading = (data?.heading || '').toString().trim() || 'Professional domestic & commercial services';
	$: content =
		(data?.lead || data?.content || '').toString().trim() ||
		`${website?.business_name || 'We'} provide trusted, reliable workmanship with clear communication and excellent customer care.`;
	$: bulletPoints = coerceArray(data?.bullet_points)
		.map((item) => (item == null ? '' : String(item)).trim())
		.filter(Boolean)
		.slice(0, 6);

	$: showCta = data?.show_contact_button !== false;
	$: ctaLabel = (data?.cta_label || '').toString().trim() || 'Read More';
	$: ctaHref = (data?.cta_href || '').toString().trim() || '/contact';
</script>

<section id="about" class="bg-[#f0f0f0] px-4 py-16 sm:py-20">
	<div class="mx-auto max-w-7xl">
		<div class="tb-about3-layout relative">
			<div class="tb-about3-image-wrap overflow-hidden rounded-sm shadow-lg">
				{#if imageUrl}
					<img
						src={imageUrl}
						alt={data?.image_alt || `${website?.business_name || 'Business'} - About`}
						class="h-full w-full object-cover"
						loading="lazy"
						decoding="async"
					/>
				{:else}
					<div class="h-full min-h-[360px] w-full bg-gray-300"></div>
				{/if}
			</div>

			<div class="tb-about3-card bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.16)] sm:p-10">
				<p class={`text-lg font-semibold ${colors.accentText}`}>{kicker}</p>
				<h2 class="mt-2 text-4xl font-bold leading-tight text-[#0F172A] sm:text-5xl">
					{heading}
				</h2>

				<p class="mt-5 text-lg leading-relaxed text-slate-700">
					{@html content}
				</p>

				{#if bulletPoints.length}
					<ul class="mt-7 space-y-3">
						{#each bulletPoints as point}
							<li class="flex items-start gap-3 text-lg font-semibold text-slate-900">
								<span
									class={`mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full ${colors.accentText}`}
									aria-hidden="true"
								>
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" class="h-4 w-4">
										<path d="M20 6L9 17l-5-5" />
									</svg>
								</span>
								<span>{point}</span>
							</li>
						{/each}
					</ul>
				{/if}

				{#if showCta}
					<div class="mt-8 flex justify-end">
						<a
							href={ctaHref}
							on:click={handleCtaClick}
							class={`inline-flex items-center gap-2 rounded px-6 py-3 text-base font-semibold transition-colors ${colors.accentBg} ${colors.accentHover}`}
						>
							{ctaLabel}
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M5 12h14M13 5l7 7-7 7" />
							</svg>
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.tb-about3-layout {
		display: grid;
		gap: 24px;
	}

	.tb-about3-image-wrap {
		min-height: 420px;
	}

	@container (min-width: 1024px) {
		.tb-about3-layout {
			grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
			align-items: center;
		}

		.tb-about3-image-wrap {
			min-height: 560px;
		}

		.tb-about3-card {
			margin-left: -64px;
		}
	}
</style>
