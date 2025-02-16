const UPC_SYSTEM_WEIGHT = '2';
const UPC_SYSTEM_WEIGHT_MASS = '0';
const UPC_SYSTEM_WEIGHT_PRICE = '1';
const UPC_SYSTEM_DRUG = '3';
const UPC_SYSTEM_LOYALTY = '4';
const UPC_SYSTEM_COUPON = '5';

export function parseUpcBarcode(rawValue: string): ICodUpcContent {
	if (rawValue[0] === UPC_SYSTEM_WEIGHT) {
		const itemNumberString = rawValue.substring(1, 5);
		const weightTypeString = rawValue[5];

		const weightString = rawValue.substring(6, 11);

		if (weightTypeString === UPC_SYSTEM_WEIGHT_MASS)
			return {
				type: ICodUpcContentType.Weight,
				itemNumber: +itemNumberString,
				weightMass: +weightString,
			};

		if (weightTypeString === UPC_SYSTEM_WEIGHT_PRICE)
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

    const manufacturerCodeString = rawValue.substring(1, 5);
    const itemNumberString = rawValue.substring(5, 11);

    return {
        type: ICodUpcContentType.Product,
        manufacturerCode: +manufacturerCodeString,
        itemNumber: +itemNumberString,
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
