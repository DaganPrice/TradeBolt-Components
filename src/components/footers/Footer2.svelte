<script>
	export let website;
	export let pb;
	export let data = {};

	const currentYear = new Date().getFullYear();

	function normalizeUrl(input) {
		const raw = (input || '').toString().trim();
		if (!raw) return '';
		if (/^https?:\/\//i.test(raw)) return raw;
		if (/^www\./i.test(raw)) return `https://${raw}`;
		if (raw.includes('.') && !raw.includes(' ')) return `https://${raw}`;
		return raw;
	}

	function firstAddressChunk(address) {
		const raw = (address || '').toString().trim();
		if (!raw) return '';
		return raw.split(/[\n,]+/g).map((part) => part.trim()).filter(Boolean)[0] || '';
	}

	function parseBusinessHours(value) {
		if (Array.isArray(value)) {
			return value
				.map((row) => {
					const day = (row?.day || '').toString().trim();
					const time = (row?.time || '').toString().trim();
					return day && time ? { day, time } : null;
				})
				.filter(Boolean);
		}
		return [];
	}

	function getMapEmbedUrl() {
		const fromData = (data?.map_embed_url || '').toString().trim();
		if (fromData) return fromData;
		const query = encodeURIComponent((website?.business_name || 'Local business').toString().trim());
		return `https://www.google.com/maps?q=${query}&output=embed`;
	}

	$: logoUrl = getLogoUrl();
	$: aboutText =
		(data?.about_text || '').toString().trim() ||
		(website?.about_business || '').toString().trim() ||
		`${website?.business_name || 'We'} offer trusted workmanship, fast response times, and clear communication from first quote to final sign-off.`;
	$: areaText =
		(data?.area_text || '').toString().trim() ||
		`Serving ${firstAddressChunk(website?.contact_details?.address) || 'your local area'} and surrounding locations.`;
	$: services = (Array.isArray(website?.services_offered) ? website.services_offered : [])
		.map((item) => (item == null ? '' : String(item)).trim())
		.filter(Boolean)
		.slice(0, 6);
	$: phone = (website?.contact_details?.phone || '').toString().trim();
	$: email = (website?.contact_details?.email || '').toString().trim();
	$: location = firstAddressChunk(website?.contact_details?.address) || 'Local Service Area';
	$: openingHours = parseBusinessHours(data?.business_hours);
	$: mapEmbedUrl = getMapEmbedUrl();
	$: copyrightText =
		(data?.copyright_text || '').toString().trim() ||
		`© ${currentYear} ${website?.business_name || 'Business'}. All rights reserved.`;
	$: designerCredit = (data?.designer_credit || '').toString().trim() || 'Web Design by TradeBolt';
	$: websiteUrl = normalizeUrl(website?.contact_details?.website);
</script>

<footer id="footer" class="bg-[#0B0D12] px-4 py-12 text-gray-200">
	<div class="mx-auto max-w-7xl">
		<div class="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.9fr]">
			<div>
				<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr]">
					<div class="flex items-start">
						{#if logoUrl}
							<img
								src={logoUrl}
								alt={`${website?.business_name || 'Business'} logo`}
								class="h-20 w-20 rounded-full border border-yellow-400/70 bg-white object-cover"
								loading="lazy"
								decoding="async"
							/>
						{:else}
							<div class="grid h-20 w-20 place-items-center rounded-full bg-white text-2xl font-bold text-gray-900">
								{(website?.business_name || 'B').charAt(0)}
							</div>
						{/if}
					</div>
					<div>
						<p class="text-base leading-relaxed text-white/85">{aboutText}</p>
						<p class="mt-3 text-base text-white/70">{areaText}</p>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr]">
					<div class="grid grid-cols-2 gap-x-6 gap-y-2 sm:col-span-2 lg:col-span-2">
						{#each services as service}
							<p class="inline-flex items-center gap-2 text-lg font-semibold text-white">
								<span class="text-yellow-400" aria-hidden="true">
									<i class="fa-solid fa-chevron-right"></i>
								</span>
								{service}
							</p>
						{/each}
					</div>

					<div class="space-y-3">
						{#if phone}
							<a href={`tel:${phone}`} class="flex items-center gap-3 text-lg text-white transition hover:text-yellow-400">
								<i class="fa-solid fa-phone text-yellow-400"></i>
								{phone}
							</a>
						{/if}
						{#if email}
							<a href={`mailto:${email}`} class="flex items-center gap-3 text-lg text-white transition hover:text-yellow-400">
								<i class="fa-regular fa-envelope text-yellow-400"></i>
								{email}
							</a>
						{/if}
						<div class="flex items-center gap-3 text-lg text-white">
							<i class="fa-solid fa-location-dot text-yellow-400"></i>
							{location}
						</div>
						{#if openingHours.length > 0}
							{#each openingHours as row, i}
								<div class="flex items-center gap-3 text-lg text-white/90">
									{#if i === 0}
										<i class="fa-regular fa-clock text-yellow-400"></i>
									{:else}
										<span class="inline-block w-[18px]"></span>
									{/if}
									{row.day}: {row.time}
								</div>
							{/each}
						{/if}
						{#if websiteUrl}
							<a
								href={websiteUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-3 text-lg text-white/80 transition hover:text-yellow-400"
							>
								<i class="fa-solid fa-globe text-yellow-400"></i>
								{website?.contact_details?.website}
							</a>
						{/if}
					</div>
				</div>
			</div>

			<div>
				<iframe
					src={mapEmbedUrl}
					title="Business location map"
					class="h-[320px] w-full border-0"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
			</div>
		</div>

		<div class="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-white/70 md:flex-row md:items-center md:justify-between">
			<div class="flex items-center gap-6 text-sm">
				<a href="#locations" class="transition hover:text-white">Locations</a>
				<a href="#footer" class="transition hover:text-white">Sitemap</a>
			</div>
			<div class="text-sm text-white/70">{designerCredit}</div>
		</div>

		<div class="mt-4 text-sm text-white/50">{copyrightText}</div>
	</div>
</footer>
	function getLogoUrl() {
		if (!website?.logo || !pb?.files?.getURL) return '';
		try {
			return pb.files.getURL(website, website.logo, { thumb: '256x256' });
		} catch {
			return '';
		}
	}
