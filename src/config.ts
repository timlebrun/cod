import { parseEan13Barcode } from './formats/ean.format';
import { parseUpcBarcode } from './formats/upc.format';

const regionNames = new Intl.DisplayNames(navigator.languages, { type: 'region' });

export const barcodeFormatConfig: Record<string, ICodConfigBarcodeFormatOptions> = {
	upc_a: {
		label: 'UPC-A',
		displayInt: true,

		displayInfoExtractor: (rawValue: string) => {
			const output: ICodConfigBarcodeFormatInfo[] = [];

			const parsedUpcContent = parseUpcBarcode(rawValue);

			output.push({ type: 'TYPE', value: parsedUpcContent.type });

			if (parsedUpcContent.manufacturerCode)
				output.push({
					type: 'MANUFACTURER',
					value: parsedUpcContent.manufacturerCode + '',
				});

			output.push({ type: 'ITEM NUMBER', value: parsedUpcContent.itemNumber + '' });

			return output;
		},
	},
	upc_e: {
		label: 'UPC-E',
		displayInt: true,
	},
	ean_8: {
		label: 'EAN 8',
		displayInt: true,
	},
	ean_13: {
		label: 'EAN 13',
		displayInt: true,
		displayInfoExtractor: (rawValue: string) => {
			const output: ICodConfigBarcodeFormatInfo[] = [];

			const parsedEanContent = parseEan13Barcode(rawValue);

            if (parsedEanContent.audience)
				output.push({ type: 'AUDIENCE', value: parsedEanContent.audience });

            if (parsedEanContent.domain)
				output.push({ type: 'DOMAIN', value: parsedEanContent.domain });

			if (parsedEanContent.countryGsCode) {
                let outputValue = `${parsedEanContent.countryGsCode}`;

                if (parsedEanContent.countryIsoCode) {
                    const regionName = regionNames.of(parsedEanContent.countryIsoCode) ?? parsedEanContent.countryIsoCode;
                    outputValue += ` (${regionName})`;
                }

				output.push({ type: 'COUNTRY', value: outputValue });
            }

			if (parsedEanContent.itemNumber)
				output.push({ type: 'ITEM NUMBER', value: parsedEanContent.itemNumber + '' });

			return output;
		},
	},
	aztec: {
		label: 'Aztec',
		displayHex: true,
		displaySize: true,
	},
	data_matrix: {
		label: 'DataMatrix',
		displayHex: true,
		displaySize: true,
	},
};

export interface ICodConfigBarcodeFormatOptions {
	label: string;

	displaySize?: boolean;
	displayHex?: boolean;
	displayInt?: boolean;

	displayContentTransformer?: (rawValue: string) => ICodConfigBarcodeFormatDisplay;

	displayInfoExtractor?: (rawValue: string) => ICodConfigBarcodeFormatInfo[];
}

export interface ICodConfigBarcodeFormatDisplay {
	type: ICodConfigBarcodeFormatDisplayType;
	value: string;
}

export enum ICodConfigBarcodeFormatDisplayType {
	String = 'STRING',
	Int = 'INT',
	Hex = 'HEX',
}

export interface ICodConfigBarcodeFormatInfo {
	type: string;
	value: string;
}
