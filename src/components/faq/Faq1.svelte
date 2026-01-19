<script>
	import { slide } from 'svelte/transition';

	export let website;
	export let data = {};
	export let embed = false;

	let openIndex = -1;

	function safeText(value, fallback = '') {
		if (value == null) return fallback;
		return String(value);
	}

	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: { bg: 'bg-orange-600', hoverBg: 'hover:bg-orange-700', text: 'text-orange-600' },
			red: { bg: 'bg-red-600', hoverBg: 'hover:bg-red-700', text: 'text-red-600' },
			blue: { bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-700', text: 'text-blue-600' },
			green: { bg: 'bg-green-600', hoverBg: 'hover:bg-green-700', text: 'text-green-600' },
			yellow: { bg: 'bg-yellow-600', hoverBg: 'hover:bg-yellow-700', text: 'text-yellow-600' },
			purple: { bg: 'bg-purple-600', hoverBg: 'hover:bg-purple-700', text: 'text-purple-600' },
			pink: { bg: 'bg-pink-600', hoverBg: 'hover:bg-pink-700', text: 'text-pink-600' },
			gray: { bg: 'bg-gray-700', hoverBg: 'hover:bg-gray-800', text: 'text-gray-600' }
		};
		return colorMap[colorScheme] || colorMap.orange;
	}

	$: colors = getColorClasses(website?.color_scheme);
	$: heading = safeText(data?.heading, 'Frequently asked questions');
	$: subheading = safeText(data?.subheading, '');
	$: columns = data?.columns === 2 ? 2 : 1;

	$: items = (Array.isArray(data?.items) ? data.items : [])
		.map((item, idx) => ({
			idx,
			question: safeText(item?.question).trim(),
			answer: safeText(item?.answer).trim()
		}))
		.filter((item) => item.question || item.answer);

	$: leftItems =
		columns === 2 ? items.filter((item) => item.idx % 2 === 0) : items;
	$: rightItems = columns === 2 ? items.filter((item) => item.idx % 2 === 1) : [];

	$: ctaLabel = safeText(data?.cta_label, 'Contact us');
	$: ctaHref = safeText(data?.cta_href, '/contact');

	function handleToggle(idx) {
		openIndex = openIndex === idx ? -1 : idx;
	}

	function handleLinkClick(e) {
		if (embed) e.preventDefault();
	}
</script>

<section class="py-20 bg-white text-gray-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-4xl text-center">
			<h2 class="text-4xl font-bold">{heading}</h2>
			{#if subheading}
				<p class="mt-4 text-lg text-gray-600">{subheading}</p>
			{/if}
		</div>

		{#if items.length}
			<div class="mx-auto mt-12 max-w-5xl">
				<div class="grid grid-cols-1 gap-6 lg:gap-8 {columns === 2 ? 'lg:grid-cols-2' : ''}">
					<div class="space-y-3">
						{#each leftItems as item (item.idx)}
							<div class="rounded-lg border border-gray-200 bg-white">
								<button
									type="button"
									class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
									aria-expanded={openIndex === item.idx}
									on:click={() => handleToggle(item.idx)}
								>
									<span class="text-base font-semibold text-gray-900">
										{item.question}
									</span>
									<svg
										class="h-5 w-5 flex-none text-gray-500 transition-transform {openIndex === item.idx ? 'rotate-180' : ''}"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										aria-hidden="true"
									>
										<path d="M6 9l6 6 6-6" />
									</svg>
								</button>

								{#if openIndex === item.idx}
									<div transition:slide class="px-5 pb-5 text-gray-700 whitespace-pre-wrap">
										{item.answer}
									</div>
								{/if}
							</div>
						{/each}
					</div>

					{#if columns === 2}
						<div class="space-y-3">
							{#each rightItems as item (item.idx)}
								<div class="rounded-lg border border-gray-200 bg-white">
									<button
										type="button"
										class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
										aria-expanded={openIndex === item.idx}
										on:click={() => handleToggle(item.idx)}
									>
										<span class="text-base font-semibold text-gray-900">
											{item.question}
										</span>
										<svg
											class="h-5 w-5 flex-none text-gray-500 transition-transform {openIndex === item.idx ? 'rotate-180' : ''}"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											aria-hidden="true"
										>
											<path d="M6 9l6 6 6-6" />
										</svg>
									</button>

									{#if openIndex === item.idx}
										<div transition:slide class="px-5 pb-5 text-gray-700 whitespace-pre-wrap">
											{item.answer}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>

				{#if ctaLabel}
					<div class="mt-12 flex justify-center">
						<a
							href={ctaHref}
							on:click={handleLinkClick}
							class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors {colors.bg} {colors.hoverBg}"
						>
							{ctaLabel}
						</a>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</section>
