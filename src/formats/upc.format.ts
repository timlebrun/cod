import {
	CodFormat,
	ICodFormatConfig,
	ICodFormatConfigDisplayType,
	ICodFormatInvestigation,
	ICodFormatInvestigationInformation,
	ICodFormatInvestigationRepresentationType,
} from './format';

export class CodUpcFormat extends CodFormat {
	public static systemWeight = '2';
	public static systemWeightMass = '0';
	public static systemWeightPrice = '1';
	public static systemDrug = '3';
	public static systemLoyalty = '4';
	public static systemCoupon = '5';

	public readonly config: ICodFormatConfig = {
		displayLabel: 'UPC',
		displayType: ICodFormatConfigDisplayType.TwoDee,
	};

	public investigate(rawValue: string): ICodFormatInvestigation {
		const informations: ICodFormatInvestigationInformation[] = [];
		const parsedContent = CodUpcFormat.parse(rawValue);

		informations.push({ label: 'TYPE', value: parsedContent.type });

		if (parsedContent.manufacturerCode)
			informations.push({
				label: 'MANUFACTURER',
				value: parsedContent.manufacturerCode + '',
			});

		informations.push({ label: 'ITEM NUMBER', value: parsedContent.itemNumber + '' });

		return {
			representations: [
				{
					type: ICodFormatInvestigationRepresentationType.Int,
					displayValue: rawValue,
					actualValue: rawValue,
				},
			],
			informations,
		};
	}

	public static parse(rawValue: string): ICodUpcContent {
		if (rawValue[0] === CodUpcFormat.systemWeight) {
			const itemNumberString = rawValue.substring(1, 5);
			const weightTypeString = rawValue[5];

			const weightString = rawValue.substring(6, 11);

			if (weightTypeString === CodUpcFormat.systemWeightMass)
				return {
					type: ICodUpcContentType.Weight,
					itemNumber: +itemNumberString,
					weightMass: +weightString,
				};

			if (weightTypeString === CodUpcFormat.systemWeightPrice)
				return {
					type: ICodUpcContentType.Weight,
					itemNumber: +itemNumberString,
					weightPrice: +weightString,
				};

			return {
				type: ICodUpcContentType.Weight,
				itemNumber: +itemNumberString,
			};
		}

		if (rawValue[0] === CodUpcFormat.systemDrug) {
			const drugNumberString = rawValue.substring(1);
			return {
				type: ICodUpcContentType.Drug,
				itemNumber: +drugNumberString,
			};
		}

		if (rawValue[0] === CodUpcFormat.systemLoyalty) {
			const loyaltyNumberString = rawValue.substring(1);
			return {
				type: ICodUpcContentType.Loyalty,
				itemNumber: +loyaltyNumberString,
			};
		}

		if (rawValue[0] === CodUpcFormat.systemCoupon) {
			const couponNumberString = rawValue.substring(1);
			return {
				type: ICodUpcContentType.Coupon,
				itemNumber: +couponNumberString,
			};
		}

		const manufacturerCodeString = rawValue.substring(1, 5);
		const itemNumberString = rawValue.substring(5, 11);

		return {
			type: ICodUpcContentType.Product,
			manufacturerCode: +manufacturerCodeString,
			itemNumber: +itemNumberString,
		};
	}
}

export interface ICodUpcContent {
	type: ICodUpcContentType;

	itemNumber: number;

	manufacturerCode?: number;
	productCode?: number;

	weightPrice?: number;
	weightMass?: number;
}

enum ICodUpcContentType {
	Product = 'PRODUCT',
	Weight = 'WEIGHT',
	Loyalty = 'LOYALTY',
	Coupon = 'COUPON',
	Drug = 'DRUG',
}
