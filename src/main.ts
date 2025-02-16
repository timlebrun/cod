import './style.css';

import { BarcodeDetector, DetectedBarcode } from 'barcode-detector/ponyfill';

import {
	arrayBufferToHex,
	mapVideoCoordinatesToContainer,
	setAnimationFrameLoop,
} from './helpers';
import { CodInvestigator } from './config';

const overlayMargin = 10;

const textEncoder = new TextEncoder();

const barcodeDetectionRate = 100;
let barcodeIndex: Record<string, DetectedBarcode> = {};

let shouldBarcodeDetect = true;

async function init() {
	const videoElement = document.getElementById('cod-scanner-video') as HTMLVideoElement;

	const overlaysElement = document.getElementById('cod-overlay') as HTMLDivElement;

	const infoElement = document.getElementById('cod-info') as HTMLDivElement;
	infoElement.onclick = () => hideBarcodeInfo();
	const infoModalElement = document.getElementById('cod-info-modal') as HTMLDivElement;
	infoModalElement.onclick = (e) => e.preventDefault();

	const controlFlashlightElement = document.getElementById(
		'cod-controls-flashlight',
	) as HTMLInputElement;
	const controlAutoscanElement = document.getElementById(
		'cod-controls-autoscan',
	) as HTMLInputElement;

	const barcodeDetector = new BarcodeDetector();

	function draw() {
		const barcodeHashes = Object.keys(barcodeIndex);

		for (const barcodeHash of barcodeHashes) {
			const barcode = barcodeIndex[barcodeHash];
			const barcodeFormatConfig = CodInvestigator.getConfig(barcode.format) ?? {};

			const barcodeOverlayId = `cod-overlay-barcode-${barcodeHash}`;

			let overlayElement = document.getElementById(barcodeOverlayId);

			if (!overlayElement) {
				overlayElement = document.createElement('div');
				overlayElement.classList.add('cod-overlay-barcode');
				overlayElement.dataset.codBarcodeHash = barcodeHash;
				overlayElement.id = barcodeOverlayId;

				const overlayLabelElement = document.createElement('span');
				overlayLabelElement.classList.add('cod-overlay-barcode-label');
				overlayLabelElement.textContent =
					barcodeFormatConfig.displayLabel ?? barcode.format;

				overlayElement.append(overlayLabelElement);

				overlayElement.addEventListener('click', (event) => {
					event.preventDefault();

					displayBarcodeInfo(barcode);
				});

				overlaysElement.append(overlayElement);
			}

			const barcodeClientBoundingBox = mapVideoCoordinatesToContainer(
				videoElement,
				barcode.boundingBox,
			);

			overlayElement.style.top = `${barcodeClientBoundingBox.top - overlayMargin}px`;
			overlayElement.style.left = `${barcodeClientBoundingBox.left - overlayMargin}px`;
			overlayElement.style.height = `${barcodeClientBoundingBox.height + overlayMargin * 2}px`;
			overlayElement.style.width = `${barcodeClientBoundingBox.width + overlayMargin * 2}px`;
		}

		// Cleans up the ones that disapeared
		for (const child of overlaysElement.children) {
			if (!(child instanceof HTMLDivElement)) continue;
			if (!child.dataset.codBarcodeHash) continue;

			if (!barcodeHashes.includes(child.dataset.codBarcodeHash))
				overlaysElement.removeChild(child);
		}
	}

	function displayBarcodeInfo(barcode: DetectedBarcode) {
		shouldBarcodeDetect = false;
		barcodeIndex = {}; // we clear the screen until next time

		const barcodeFormatConfig = CodInvestigator.getConfig(barcode.format) ?? {};

		infoModalElement.innerHTML = '';

		const infoTitleElement = document.createElement('h2');
		infoTitleElement.textContent = barcodeFormatConfig.displayLabel ?? barcode.format;

		infoModalElement.append(infoTitleElement);

		const barcodeInvestigation = CodInvestigator.investivate(
			barcode.format,
			barcode.rawValue,
		);

		console.debug({ barcodeInvestigation });

		if (barcodeInvestigation.informations) {
			const infoTableElement = document.createElement('table') as HTMLTableElement;

			for (const barcodeInformation of barcodeInvestigation.informations) {
				const infoTableRowElement = document.createElement('tr');

				const infoTableRowHeaderElement = document.createElement('th');
				infoTableRowHeaderElement.textContent = barcodeInformation.label;

				const infoTableRowValueElement = document.createElement('td');
				infoTableRowValueElement.textContent = barcodeInformation.value;

				infoTableRowElement.append(infoTableRowHeaderElement, infoTableRowValueElement);

				infoTableElement.append(infoTableRowElement);
			}

			infoModalElement.append(infoTableElement);
		}

		if (barcodeInvestigation.representations) {
			for (const barcodeRepresentation of barcodeInvestigation.representations) {
				const infoRepresentationElement = document.createElement('code');

				infoRepresentationElement.textContent = barcodeRepresentation.displayValue;
				infoRepresentationElement.addEventListener('click', (event: Event) => {
					event.stopImmediatePropagation();
					navigator.clipboard.writeText(barcodeRepresentation.actualValue);
					infoRepresentationElement.classList.add('copied');
				});

				infoModalElement.append(infoRepresentationElement);
			}
		}

		infoElement.style.display = 'flex';
	}

	function hideBarcodeInfo() {
		infoElement.style.display = 'none';
		shouldBarcodeDetect = true;
	}

	navigator.mediaDevices
		.getUserMedia({
			video: {
				advanced: [
					{
						facingMode: 'environment',
					},
				],
			},
			audio: false,
		})
		.then((stream: MediaStream) => {
			// Changing the source of video to current stream.
			videoElement.srcObject = stream;

			const track = stream.getVideoTracks()[0];

			function updateFlashlight() {
				const torchEnabled = controlFlashlightElement.checked;

				track.applyConstraints({
					advanced: [
						// @ts-ignore
						{ torch: torchEnabled },
					],
				});
			}

			controlFlashlightElement.addEventListener('change', function () {
				updateFlashlight();
			});

			updateFlashlight();
		})
		.catch();

	setInterval(async () => {
		if (!shouldBarcodeDetect) return;
		if (!videoElement.videoHeight) return;

		const barcodes = await barcodeDetector.detect(videoElement);

		const newBarcodeIndex: Record<string, DetectedBarcode> = {};

		if (controlAutoscanElement.checked)
			if (barcodes.length === 1) {
				displayBarcodeInfo(barcodes[0]);
				return;
			}

		for (const barcode of barcodes) {
			const barcodeHashContent = textEncoder.encode(barcode.format + barcode.rawValue);
			const barcodeHashBuffer = await crypto.subtle.digest('SHA-1', barcodeHashContent);
			const barcodeHash = arrayBufferToHex(barcodeHashBuffer);

			newBarcodeIndex[barcodeHash] = barcode;
		}

		barcodeIndex = newBarcodeIndex;
	}, barcodeDetectionRate);

	const mediaSupportedContraints = navigator.mediaDevices.getSupportedConstraints();
	console.debug({ mediaSupportedContraints });

	// @ts-expect-error torch is not standard and therefore missing
	if (!mediaSupportedContraints.torch) {
		// If torch is not supported we hide the toggle
		const controlFlashlightLabelElement = document.querySelector(
			`label[for="${controlFlashlightElement.id}"`,
		) as HTMLLabelElement;
		if (controlFlashlightLabelElement) controlFlashlightLabelElement.style.display = 'none';
	}

	// Start the drawing loop
	setAnimationFrameLoop(draw);
}

document.addEventListener('DOMContentLoaded', init);
