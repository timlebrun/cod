import { CodDatamatrixFormat } from './formats/datamatrix.format';
import { CodAztecFormat } from './formats/aztec.format';
import { CodEanFormat } from './formats/ean.format';
import { CodUpcFormat } from './formats/upc.format';

import { CodFormat, ICodFormatConfig, ICodFormatInvestigation } from './formats/format';
import { CodQrFormat } from './formats/qr.format';

export class CodInvestigator {
	private static formatIndex: Record<string, CodFormat> = {};

	public static register(format: string, handler: CodFormat): typeof CodInvestigator {
		this.formatIndex[format] = handler;

		return CodInvestigator;
	}

	public static getConfig(format: string): ICodFormatConfig | null {
		return this.formatIndex[format]?.config ?? null;
	}

	public static investivate(format: string, rawValue: string): ICodFormatInvestigation {
		const formatHandler = this.formatIndex[format];
		if (!formatHandler) return {};

		return formatHandler.investigate(rawValue);
	}
}

CodInvestigator.register('aztec', new CodAztecFormat())
	.register('data_matrix', new CodDatamatrixFormat())
	.register('qr_code', new CodQrFormat())
	.register('ean_13', new CodEanFormat())
	.register('upc_a', new CodUpcFormat());
