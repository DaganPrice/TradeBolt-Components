<script>
	export let website;
	export let data = {};

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
		return colorMap[colorScheme] || colorMap.yellow;
	}

	function fallbackDescription(title) {
		const label = (title || 'services').toString().trim().toLowerCase();
		return `Professional ${label} delivered with reliable workmanship, clear communication, and high standards.`;
	}

	function normalizeItems(items) {
		const raw = Array.isArray(items) ? items : [];
		return raw
			.map((item) => {
				if (typeof item === 'string') {
					const title = item.trim();
					return title ? { title, description: fallbackDescription(title) } : null;
				}
				const title = (item?.title || '').toString().trim();
				if (!title) return null;
				const description = (item?.description || '').toString().trim() || fallbackDescription(title);
				return { title, description };
			})
			.filter(Boolean);
	}

	$: colors = getColorClasses(website?.color_scheme);
	$: kicker = (data?.kicker || '').toString().trim() || 'What We Do';
	$: heading = (data?.heading || '').toString().trim() || 'Our Services';
	$: services = normalizeItems(data?.items);
</script>

<section id="services" class="bg-[#f3f3f3] px-4 py-16 sm:py-20">
	<div class="mx-auto max-w-7xl">
		<div class="text-center">
			<p class={`text-lg font-semibold ${colors.accentText}`}>{kicker}</p>
			<h2 class="mt-1 text-4xl font-bold text-[#0F172A] sm:text-5xl">{heading}</h2>
		</div>

		{#if services.length > 0}
			<div class="tb-services2-grid mt-14 grid grid-cols-1 gap-x-8 gap-y-10">
				{#each services as service}
					<article class="flex items-start gap-4">
						<div class={`mt-1 text-4xl ${colors.accentText}`} aria-hidden="true">
							<i class="fa-solid fa-bolt"></i>
						</div>
						<div>
							<h3 class="text-2xl font-bold text-[#0F172A]">{service.title}</h3>
							<p class="mt-3 text-lg leading-relaxed text-slate-700">
								{service.description}
							</p>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<p class="mt-10 text-center text-slate-600">No services added yet.</p>
		{/if}
	</div>
</section>

<style>
	@container (min-width: 768px) {
		.tb-services2-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@container (min-width: 1200px) {
		.tb-services2-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
