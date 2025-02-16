import { Buffer } from 'buffer';

import {
	CodFormat,
	ICodFormatConfig,
	ICodFormatConfigDisplayType,
	ICodFormatInvestigation,
	ICodFormatInvestigationRepresentation,
	ICodFormatInvestigationRepresentationType,
} from './format';

export class CodDatamatrixFormat extends CodFormat {
	public static printableRegex = /^[a-z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]*$/i;

	public readonly config: ICodFormatConfig = {
		displayLabel: 'DataMatrix',
		displayType: ICodFormatConfigDisplayType.ThreeDee,
	};

	public investigate(rawValue: string): ICodFormatInvestigation {
		const representations: ICodFormatInvestigationRepresentation[] = [];

		const isPrintable = rawValue.match(CodDatamatrixFormat.printableRegex);
		if (isPrintable)
			representations.push({
				type: ICodFormatInvestigationRepresentationType.String,
				displayValue: rawValue,
				actualValue: rawValue,
			});

		const rawBuffer = Buffer.from(rawValue, 'binary');
		representations.push({
			type: ICodFormatInvestigationRepresentationType.Hex,
			displayValue: rawBuffer.toString('hex'),
			actualValue: rawBuffer.toString('hex'),
		});

		return {
			representations,
			informations: [],
		};
	}
}
