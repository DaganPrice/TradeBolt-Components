<script>
	import { getColorClasses, getImageUrl } from './colors.js';

	export let website;
	export let pb;
	export let caseStudies = [];
	export let heading = 'Case Studies';

	$: colors = getColorClasses(website?.color_scheme);
</script>

<section class="py-16 bg-white">
	<div class="max-w-5xl mx-auto px-4">
		<div class="text-center mb-12">
			<h1 class="text-3xl md:text-4xl font-bold text-gray-900">{heading}</h1>
			<div class="w-16 h-1 mx-auto mt-4 {colors.bg}"></div>
		</div>

		{#if caseStudies.length === 0}
			<p class="text-center text-gray-500">No case studies to show yet.</p>
		{:else}
			<div class="space-y-12">
				{#each caseStudies as cs, i}
					{@const img = getImageUrl(pb, cs.cover_image, { thumb: '800x600' })}
					{@const flip = i % 2 === 1}
					<article class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
						<div class="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden {flip ? 'md:order-2' : ''}">
							{#if img}
								<img src={img} alt={cs.title} class="w-full h-full object-cover" />
							{:else}
								<div class="w-full h-full flex items-center justify-center text-gray-300">
									<i class="fa-solid fa-image text-5xl"></i>
								</div>
							{/if}
						</div>
						<div class={flip ? 'md:order-1' : ''}>
							{#if cs.related_service || cs.related_location}
								<p class="text-xs uppercase tracking-wider {colors.text} mb-2">
									{cs.related_service || ''}{cs.related_service && cs.related_location ? ' • ' : ''}{cs.related_location || ''}
								</p>
							{/if}
							<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{cs.title}</h2>
							{#if cs.client_name}
								<p class="text-sm text-gray-500 mb-3">Client: {cs.client_name}</p>
							{/if}
							{#if cs.summary}
								<p class="text-gray-700 leading-relaxed mb-4">{cs.summary}</p>
							{/if}
							{#if cs.results}
								<div class="p-4 rounded-md bg-gray-50 border-l-4 {colors.border} mb-4">
									<p class="text-sm text-gray-700"><span class="font-semibold">Result: </span>{cs.results}</p>
								</div>
							{/if}
							<a
								href={`/case-studies/${cs.slug}`}
								class="inline-flex items-center gap-2 {colors.text} font-semibold hover:underline"
							>
								Read the full story
								<i class="fa-solid fa-arrow-right text-xs"></i>
							</a>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>
