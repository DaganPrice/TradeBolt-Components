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

	function getLogoUrl() {
		if (!website?.logo || !pb?.files?.getURL) return '';
		try {
			return pb.files.getURL(website, website.logo, { thumb: '256x256' });
		} catch {
			return '';
		}
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
									<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
										<path d="M9 6l6 6-6 6" />
									</svg>
								</span>
								{service}
							</p>
						{/each}
					</div>

					<div class="space-y-3">
						{#if phone}
							<a href={`tel:${phone}`} class="flex items-center gap-3 text-lg text-white transition hover:text-yellow-400">
								<svg class="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1l-1.3 1.3a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9z" />
								</svg>
								{phone}
							</a>
						{/if}
						{#if email}
							<a href={`mailto:${email}`} class="flex items-center gap-3 text-lg text-white transition hover:text-yellow-400">
								<svg class="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M4 6h16v12H4z" />
									<path d="M22 7l-10 7L2 7" />
								</svg>
								{email}
							</a>
						{/if}
						<div class="flex items-center gap-3 text-lg text-white">
							<svg class="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
							</svg>
							{location}
						</div>
						{#if openingHours.length > 0}
							{#each openingHours as row, i}
								<div class="flex items-center gap-3 text-lg text-white/90">
									{#if i === 0}
										<svg class="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<circle cx="12" cy="12" r="9" />
											<path d="M12 7v5l3 3" />
										</svg>
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
								<svg class="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<circle cx="12" cy="12" r="9" />
									<path d="M3.5 9h17M3.5 15h17M12 3a15 15 0 0 1 0 18" />
								</svg>
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
