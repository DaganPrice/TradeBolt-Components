export function getColorClasses(colorScheme = 'orange') {
	const colorMap = {
		orange: { text: 'text-orange-600', bg: 'bg-orange-600', hoverBg: 'hover:bg-orange-700', ring: 'ring-orange-600', border: 'border-orange-600' },
		red: { text: 'text-red-600', bg: 'bg-red-600', hoverBg: 'hover:bg-red-700', ring: 'ring-red-600', border: 'border-red-600' },
		blue: { text: 'text-blue-600', bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-700', ring: 'ring-blue-600', border: 'border-blue-600' },
		green: { text: 'text-green-600', bg: 'bg-green-600', hoverBg: 'hover:bg-green-700', ring: 'ring-green-600', border: 'border-green-600' },
		yellow: { text: 'text-yellow-600', bg: 'bg-yellow-600', hoverBg: 'hover:bg-yellow-700', ring: 'ring-yellow-600', border: 'border-yellow-600' },
		purple: { text: 'text-purple-600', bg: 'bg-purple-600', hoverBg: 'hover:bg-purple-700', ring: 'ring-purple-600', border: 'border-purple-600' },
		pink: { text: 'text-pink-600', bg: 'bg-pink-600', hoverBg: 'hover:bg-pink-700', ring: 'ring-pink-600', border: 'border-pink-600' },
		gray: { text: 'text-gray-700', bg: 'bg-gray-800', hoverBg: 'hover:bg-gray-900', ring: 'ring-gray-700', border: 'border-gray-700' }
	};
	return colorMap[colorScheme] || colorMap.orange;
}

export function getImageUrl(pb, imageRef, opts = {}) {
	if (!imageRef?.id || !imageRef?.file || !pb?.files?.getURL) return null;
	try {
		return pb.files.getURL(
			{ id: imageRef.id, collectionId: 'images', collectionName: 'images' },
			imageRef.file,
			opts
		);
	} catch {
		return null;
	}
}
