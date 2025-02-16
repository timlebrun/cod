export function mapVideoCoordinatesToContainer(
	videoElement: HTMLVideoElement,
	videoBoundingBox: DOMRect,
): DOMRect {
	// 1. Get video dimensions and container dimensions
	const videoWidth = videoElement.videoWidth;
	const videoHeight = videoElement.videoHeight;
	const containerWidth = videoElement.offsetWidth;
	const containerHeight = videoElement.offsetHeight;

	// 2. Calculate aspect ratios
	const videoAspectRatio = videoWidth / videoHeight;
	const containerAspectRatio = containerWidth / containerHeight;

	// 3. Determine how the video is scaled (fit or fill)
	let scaledWidth, scaledHeight;
	if (videoAspectRatio > containerAspectRatio) {
		// Video is wider, so it's scaled to fit the container's width
		scaledWidth = containerHeight * videoAspectRatio;
		scaledHeight = containerHeight;
	} else {
		// Video is taller or same aspect ratio, scaled to fit container's height
		scaledWidth = containerWidth;
		scaledHeight = containerWidth / videoAspectRatio;
	}

	// 4. Calculate the offset (padding) of the video within the container
	const offsetX = (containerWidth - scaledWidth) / 2;
	const offsetY = (containerHeight - scaledHeight) / 2;

	const videoLeftRatio = videoBoundingBox.left / videoElement.videoWidth;
	const videoTopRatio = videoBoundingBox.top / videoElement.videoHeight;
	const videoWidthRatio = videoBoundingBox.width / videoElement.videoWidth;
	const videoHeightRatio = videoBoundingBox.height / videoElement.videoHeight;

	return new DOMRect(
		videoLeftRatio * scaledWidth + offsetX,
		videoTopRatio * scaledHeight + offsetY,
		videoWidthRatio * scaledWidth,
		videoHeightRatio * scaledHeight,
	);
}

export function setAnimationFrameLoop(callback: () => any) {
	callback();

	requestAnimationFrame(() => setAnimationFrameLoop(callback));
}

const byteToHex: string[] = [];

for (let n = 0; n <= 0xff; ++n) {
	const hexOctet = n.toString(16).padStart(2, '0');
	byteToHex.push(hexOctet);
}

export function arrayBufferToHex(arrayBuffer: ArrayBuffer): string {
	const buff = new Uint8Array(arrayBuffer);
	const hexOctets = []; // new Array(buff.length) is even faster (preallocates necessary array size), then use hexOctets[i] instead of .push()

	for (let i = 0; i < buff.length; ++i) hexOctets.push(byteToHex[buff[i]]);

	return hexOctets.join('');
}
