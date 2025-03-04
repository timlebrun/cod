import { Buffer } from 'buffer';

import {
	CodFormat,
	ICodFormatConfig,
	ICodFormatConfigDisplayType,
	ICodFormatInvestigation,
	ICodFormatInvestigationRepresentation,
	ICodFormatInvestigationRepresentationType,
} from './format';

export class CodAztecFormat extends CodFormat {
	public static printableRegex = /^[a-z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]*$/i;

	public readonly config: ICodFormatConfig = {
		displayLabel: 'Aztec',
		displayType: ICodFormatConfigDisplayType.ThreeDee,
	};

	public investigate(rawValue: string): ICodFormatInvestigation {
		const representations: ICodFormatInvestigationRepresentation[] = [];

		const isPrintable = rawValue.match(CodAztecFormat.printableRegex);
		if (isPrintable)
			representations.push({
				type: ICodFormatInvestigationRepresentationType.String,
				displayValue: rawValue,
				actualValue: rawValue,
			});

		const rawBuffer = Buffer.from(rawValue, 'binary');
		representations.push({
			type: ICodFormatInvestigationRepresentationType.Hex,
			// @ts-expect-error
			displayValue: rawBuffer
				.toString('hex')
				.match(/.{1,2}/g)
				.join(' '),
			actualValue: rawBuffer.toString('hex'),
		});

		return {
			representations,
			informations: [],
		};
	}
}
