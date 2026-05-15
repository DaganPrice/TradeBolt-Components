<script>
	import { getColorClasses, getImageUrl } from './colors.js';

	export let website;
	export let pb;
	export let caseStudies = [];
	export let heading = 'Case Studies';

	$: colors = getColorClasses(website?.color_scheme);
	$: featured = caseStudies[0];
	$: rest = caseStudies.slice(1);
</script>

<section class="py-16 bg-white">
	<div class="max-w-6xl mx-auto px-4">
		<div class="text-center mb-10">
			<h1 class="text-3xl md:text-4xl font-bold text-gray-900">{heading}</h1>
			<div class="w-16 h-1 mx-auto mt-4 {colors.bg}"></div>
		</div>

		{#if caseStudies.length === 0}
			<p class="text-center text-gray-500">No case studies to show yet.</p>
		{:else}
			{#if featured}
				{@const img = getImageUrl(pb, featured.cover_image, { thumb: '1600x900' })}
				<a
					href={`/case-studies/${featured.slug}`}
					class="group block mb-12 relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-200"
				>
					{#if img}
						<img src={img} alt={featured.title} class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
					{/if}
					<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
					<div class="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
						<p class="text-xs uppercase tracking-widest mb-2 opacity-90">Featured case study</p>
						<h2 class="text-2xl md:text-4xl font-bold mb-3">{featured.title}</h2>
						{#if featured.summary}
							<p class="text-base md:text-lg max-w-2xl opacity-90 line-clamp-2">{featured.summary}</p>
						{/if}
						<span class="inline-flex items-center gap-2 mt-4 px-5 py-2.5 {colors.bg} {colors.hoverBg} text-white rounded-md font-semibold">
							Read case study
							<i class="fa-solid fa-arrow-right text-xs"></i>
						</span>
					</div>
				</a>
			{/if}

			{#if rest.length > 0}
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each rest as cs}
						{@const img = getImageUrl(pb, cs.cover_image, { thumb: '600x400' })}
						<a
							href={`/case-studies/${cs.slug}`}
							class="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
						>
							<div class="aspect-[3/2] bg-gray-100 overflow-hidden">
								{#if img}
									<img src={img} alt={cs.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
								{:else}
									<div class="w-full h-full flex items-center justify-center text-gray-300">
										<i class="fa-solid fa-image text-4xl"></i>
									</div>
								{/if}
							</div>
							<div class="p-5">
								{#if cs.related_service || cs.related_location}
									<p class="text-xs uppercase tracking-wider {colors.text} mb-2">
										{cs.related_service || ''}{cs.related_service && cs.related_location ? ' • ' : ''}{cs.related_location || ''}
									</p>
								{/if}
								<h3 class="text-lg font-semibold text-gray-900">{cs.title}</h3>
								{#if cs.summary}
									<p class="mt-2 text-sm text-gray-600 line-clamp-2">{cs.summary}</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</section>
