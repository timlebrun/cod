import { ICodCountryCode } from '../data';
import { CodUpcFormat, ICodUpcContent } from './upc.format';

import {
	CodFormat,
	ICodFormatConfig,
	ICodFormatConfigDisplayType,
	ICodFormatInvestigation,
	ICodFormatInvestigationInformation,
	ICodFormatInvestigationRepresentationType,
} from './format';

const regionNames = new Intl.DisplayNames(navigator.languages, { type: 'region' });

export class CodEanFormat extends CodFormat {
	public readonly config: ICodFormatConfig = {
		displayLabel: 'EAN 13',
		displayType: ICodFormatConfigDisplayType.TwoDee,
	};

	public investigate(rawValue: string): ICodFormatInvestigation {
		const informations: ICodFormatInvestigationInformation[] = [];

		const parsedContent = CodEanFormat.parse(rawValue);

        console.debug({ parsedContent });

		if (parsedContent.audience)
			informations.push({ label: 'AUDIENCE', value: parsedContent.audience });

		if (parsedContent.domain)
			informations.push({ label: 'DOMAIN', value: parsedContent.domain });

		if (parsedContent.countryGsCode) {
			let outputValue = `${parsedContent.countryGsCode}`;

			if (parsedContent.countryIsoCode) {
				const regionName =
					regionNames.of(parsedContent.countryIsoCode) ??
					parsedContent.countryIsoCode;
				outputValue += ` (${regionName})`;
			}

			informations.push({ label: 'COUNTRY', value: outputValue });
		}

		if (parsedContent.itemNumber)
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

	public static parse(rawValue: string): ICodEan13Content {
		if (rawValue.startsWith('0000000'))
			return {
				audience: ICodEan13Audience.Internal,
				itemNumber: +rawValue.substring(7),
			};

		if (rawValue.startsWith('00000'))
			return {
				audience: ICodEan13Audience.Unused,
			};

		const gsDomainCode = rawValue.substring(0, 3);
		const isoCountryCode = gs1CountryCodeMap[gsDomainCode];
		if (isoCountryCode) {
			const itemNumberString = rawValue.substring(3);
			return {
				audience: ICodEan13Audience.National,
				countryGsCode: +gsDomainCode,
				countryIsoCode: isoCountryCode,
				itemNumber: +itemNumberString,
			};
		}

		if (rawValue[0] === '0') {
			const rest = rawValue.substring(1);
			const upcParsedContent = CodUpcFormat.parse(rest);

			return {
				domain: ICodEan13Domain.UniversalProductCode,
				upcContent: upcParsedContent,
			};
		}

		return {};
	}
}

export interface ICodEan13Content {
	domain?: ICodEan13Domain;
	audience?: ICodEan13Audience;
	itemNumber?: number;

	countryGsCode?: number | null;
	countryIsoCode?: ICodCountryCode | null;

	manufacturerCode?: string | null;

	upcContent?: ICodUpcContent;
}

enum ICodEan13Audience {
	Reserved = 'RESERVED',
	National = 'NATIONAL',
	Internal = 'INTERNAL',
	Unused = 'UNUSED',
}

enum ICodEan13Domain {
	Book = 'BOOK',
	Music = 'MUSIC',
	Serial = 'SERIAL',
	UniversalProductCode = 'UPC',
}

const gs1CountryCodeMap: Record<string, ICodCountryCode> = {
	// 001 – 019 	GS1 US
	'001': ICodCountryCode.UnitedStates,
	'002': ICodCountryCode.UnitedStates,
	'003': ICodCountryCode.UnitedStates,
	'004': ICodCountryCode.UnitedStates,
	'005': ICodCountryCode.UnitedStates,
	'006': ICodCountryCode.UnitedStates,
	'007': ICodCountryCode.UnitedStates,
	'008': ICodCountryCode.UnitedStates,
	'009': ICodCountryCode.UnitedStates,
	'010': ICodCountryCode.UnitedStates,
	'011': ICodCountryCode.UnitedStates,
	'012': ICodCountryCode.UnitedStates,
	'013': ICodCountryCode.UnitedStates,
	'014': ICodCountryCode.UnitedStates,
	'015': ICodCountryCode.UnitedStates,
	'016': ICodCountryCode.UnitedStates,
	'017': ICodCountryCode.UnitedStates,
	'018': ICodCountryCode.UnitedStates,
	'019': ICodCountryCode.UnitedStates,
	// 020 - 029 	Used to issue Restricted Circulation Numbers within a geographic region (MO defined)
	// 030 - 039 	GS1 US
	'030': ICodCountryCode.UnitedStates,
	'031': ICodCountryCode.UnitedStates,
	'032': ICodCountryCode.UnitedStates,
	'033': ICodCountryCode.UnitedStates,
	'034': ICodCountryCode.UnitedStates,
	'035': ICodCountryCode.UnitedStates,
	'036': ICodCountryCode.UnitedStates,
	'037': ICodCountryCode.UnitedStates,
	'038': ICodCountryCode.UnitedStates,
	'039': ICodCountryCode.UnitedStates,
	// 040 - 049 	Used to issue GS1 Restricted Circulation Numbers within a company
	// 050 - 059 	GS1 US reserved for future use
	// 060 - 139 	GS1 US
	'060': ICodCountryCode.UnitedStates,
	'061': ICodCountryCode.UnitedStates,
	'062': ICodCountryCode.UnitedStates,
	'063': ICodCountryCode.UnitedStates,
	'064': ICodCountryCode.UnitedStates,
	'065': ICodCountryCode.UnitedStates,
	'066': ICodCountryCode.UnitedStates,
	'067': ICodCountryCode.UnitedStates,
	'068': ICodCountryCode.UnitedStates,
	'069': ICodCountryCode.UnitedStates,
	'070': ICodCountryCode.UnitedStates,
	'071': ICodCountryCode.UnitedStates,
	'072': ICodCountryCode.UnitedStates,
	'073': ICodCountryCode.UnitedStates,
	'074': ICodCountryCode.UnitedStates,
	'075': ICodCountryCode.UnitedStates,
	'076': ICodCountryCode.UnitedStates,
	'077': ICodCountryCode.UnitedStates,
	'078': ICodCountryCode.UnitedStates,
	'079': ICodCountryCode.UnitedStates,
	'080': ICodCountryCode.UnitedStates,
	'081': ICodCountryCode.UnitedStates,
	'082': ICodCountryCode.UnitedStates,
	'083': ICodCountryCode.UnitedStates,
	'084': ICodCountryCode.UnitedStates,
	'085': ICodCountryCode.UnitedStates,
	'086': ICodCountryCode.UnitedStates,
	'087': ICodCountryCode.UnitedStates,
	'088': ICodCountryCode.UnitedStates,
	'089': ICodCountryCode.UnitedStates,
	'090': ICodCountryCode.UnitedStates,
	'091': ICodCountryCode.UnitedStates,
	'092': ICodCountryCode.UnitedStates,
	'093': ICodCountryCode.UnitedStates,
	'094': ICodCountryCode.UnitedStates,
	'095': ICodCountryCode.UnitedStates,
	'096': ICodCountryCode.UnitedStates,
	'097': ICodCountryCode.UnitedStates,
	'098': ICodCountryCode.UnitedStates,
	'099': ICodCountryCode.UnitedStates,
	'100': ICodCountryCode.UnitedStates,
	'101': ICodCountryCode.UnitedStates,
	'102': ICodCountryCode.UnitedStates,
	'103': ICodCountryCode.UnitedStates,
	'104': ICodCountryCode.UnitedStates,
	'105': ICodCountryCode.UnitedStates,
	'106': ICodCountryCode.UnitedStates,
	'107': ICodCountryCode.UnitedStates,
	'108': ICodCountryCode.UnitedStates,
	'109': ICodCountryCode.UnitedStates,
	'110': ICodCountryCode.UnitedStates,
	'111': ICodCountryCode.UnitedStates,
	'112': ICodCountryCode.UnitedStates,
	'113': ICodCountryCode.UnitedStates,
	'114': ICodCountryCode.UnitedStates,
	'115': ICodCountryCode.UnitedStates,
	'116': ICodCountryCode.UnitedStates,
	'117': ICodCountryCode.UnitedStates,
	'118': ICodCountryCode.UnitedStates,
	'119': ICodCountryCode.UnitedStates,
	'120': ICodCountryCode.UnitedStates,
	'121': ICodCountryCode.UnitedStates,
	'122': ICodCountryCode.UnitedStates,
	'123': ICodCountryCode.UnitedStates,
	'124': ICodCountryCode.UnitedStates,
	'125': ICodCountryCode.UnitedStates,
	'126': ICodCountryCode.UnitedStates,
	'127': ICodCountryCode.UnitedStates,
	'128': ICodCountryCode.UnitedStates,
	'129': ICodCountryCode.UnitedStates,
	'130': ICodCountryCode.UnitedStates,
	'131': ICodCountryCode.UnitedStates,
	'132': ICodCountryCode.UnitedStates,
	'133': ICodCountryCode.UnitedStates,
	'134': ICodCountryCode.UnitedStates,
	'135': ICodCountryCode.UnitedStates,
	'136': ICodCountryCode.UnitedStates,
	'137': ICodCountryCode.UnitedStates,
	'138': ICodCountryCode.UnitedStates,
	'139': ICodCountryCode.UnitedStates,
	// 200 - 299 	Used to issue GS1 Restricted Circulation Numbers within a geographic region (MO defined)
	// 300 - 379 	GS1 France
	'300': ICodCountryCode.France,
	'301': ICodCountryCode.France,
	'302': ICodCountryCode.France,
	'303': ICodCountryCode.France,
	'304': ICodCountryCode.France,
	'305': ICodCountryCode.France,
	'306': ICodCountryCode.France,
	'307': ICodCountryCode.France,
	'308': ICodCountryCode.France,
	'309': ICodCountryCode.France,
	'310': ICodCountryCode.France,
	'311': ICodCountryCode.France,
	'312': ICodCountryCode.France,
	'313': ICodCountryCode.France,
	'314': ICodCountryCode.France,
	'315': ICodCountryCode.France,
	'316': ICodCountryCode.France,
	'317': ICodCountryCode.France,
	'318': ICodCountryCode.France,
	'319': ICodCountryCode.France,
	'320': ICodCountryCode.France,
	'321': ICodCountryCode.France,
	'322': ICodCountryCode.France,
	'323': ICodCountryCode.France,
	'324': ICodCountryCode.France,
	'325': ICodCountryCode.France,
	'326': ICodCountryCode.France,
	'327': ICodCountryCode.France,
	'328': ICodCountryCode.France,
	'329': ICodCountryCode.France,
	'330': ICodCountryCode.France,
	'331': ICodCountryCode.France,
	'332': ICodCountryCode.France,
	'333': ICodCountryCode.France,
	'334': ICodCountryCode.France,
	'335': ICodCountryCode.France,
	'336': ICodCountryCode.France,
	'337': ICodCountryCode.France,
	'338': ICodCountryCode.France,
	'339': ICodCountryCode.France,
	'340': ICodCountryCode.France,
	'341': ICodCountryCode.France,
	'342': ICodCountryCode.France,
	'343': ICodCountryCode.France,
	'344': ICodCountryCode.France,
	'345': ICodCountryCode.France,
	'346': ICodCountryCode.France,
	'347': ICodCountryCode.France,
	'348': ICodCountryCode.France,
	'349': ICodCountryCode.France,
	'350': ICodCountryCode.France,
	'351': ICodCountryCode.France,
	'352': ICodCountryCode.France,
	'353': ICodCountryCode.France,
	'354': ICodCountryCode.France,
	'355': ICodCountryCode.France,
	'356': ICodCountryCode.France,
	'357': ICodCountryCode.France,
	'358': ICodCountryCode.France,
	'359': ICodCountryCode.France,
	'360': ICodCountryCode.France,
	'361': ICodCountryCode.France,
	'362': ICodCountryCode.France,
	'363': ICodCountryCode.France,
	'364': ICodCountryCode.France,
	'365': ICodCountryCode.France,
	'366': ICodCountryCode.France,
	'367': ICodCountryCode.France,
	'368': ICodCountryCode.France,
	'369': ICodCountryCode.France,
	'370': ICodCountryCode.France,
	'371': ICodCountryCode.France,
	'372': ICodCountryCode.France,
	'373': ICodCountryCode.France,
	'374': ICodCountryCode.France,
	'375': ICodCountryCode.France,
	'376': ICodCountryCode.France,
	'377': ICodCountryCode.France,
	'378': ICodCountryCode.France,
	'379': ICodCountryCode.France,
	// 380 	GS1 Bulgaria
	'380': ICodCountryCode.Bulgaria,
	// 383 	GS1 Slovenija
	'383': ICodCountryCode.Slovenia,
	// 385 	GS1 Croatia
	'385': ICodCountryCode.Croatia,
	// 387 	GS1 BIH (Bosnia-Herzegovina)
	'387': ICodCountryCode.BosniaAndHerzegovina,
	// 389 	GS1 Montenegro
	'389': ICodCountryCode.Montenegro,
	// 400 - 440 	GS1 Germany
	'400': ICodCountryCode.Germany,
	'401': ICodCountryCode.Germany,
	'402': ICodCountryCode.Germany,
	'403': ICodCountryCode.Germany,
	'404': ICodCountryCode.Germany,
	'405': ICodCountryCode.Germany,
	'406': ICodCountryCode.Germany,
	'407': ICodCountryCode.Germany,
	'408': ICodCountryCode.Germany,
	'409': ICodCountryCode.Germany,
	'410': ICodCountryCode.Germany,
	'411': ICodCountryCode.Germany,
	'412': ICodCountryCode.Germany,
	'413': ICodCountryCode.Germany,
	'414': ICodCountryCode.Germany,
	'415': ICodCountryCode.Germany,
	'416': ICodCountryCode.Germany,
	'417': ICodCountryCode.Germany,
	'418': ICodCountryCode.Germany,
	'419': ICodCountryCode.Germany,
	'420': ICodCountryCode.Germany,
	'421': ICodCountryCode.Germany,
	'422': ICodCountryCode.Germany,
	'423': ICodCountryCode.Germany,
	'424': ICodCountryCode.Germany,
	'425': ICodCountryCode.Germany,
	'426': ICodCountryCode.Germany,
	'427': ICodCountryCode.Germany,
	'428': ICodCountryCode.Germany,
	'429': ICodCountryCode.Germany,
	'430': ICodCountryCode.Germany,
	'431': ICodCountryCode.Germany,
	'432': ICodCountryCode.Germany,
	'433': ICodCountryCode.Germany,
	'434': ICodCountryCode.Germany,
	'435': ICodCountryCode.Germany,
	'436': ICodCountryCode.Germany,
	'437': ICodCountryCode.Germany,
	'438': ICodCountryCode.Germany,
	'439': ICodCountryCode.Germany,
	'440': ICodCountryCode.Germany,
	// 450 - 459 & 490 - 499 	GS1 Japan
	'450': ICodCountryCode.Japan,
	'451': ICodCountryCode.Japan,
	'452': ICodCountryCode.Japan,
	'453': ICodCountryCode.Japan,
	'454': ICodCountryCode.Japan,
	'455': ICodCountryCode.Japan,
	'456': ICodCountryCode.Japan,
	'457': ICodCountryCode.Japan,
	'458': ICodCountryCode.Japan,
	'459': ICodCountryCode.Japan,
	// 460 - 469 	GS1 Russia
	'460': ICodCountryCode.RussianFederation,
	'461': ICodCountryCode.RussianFederation,
	'462': ICodCountryCode.RussianFederation,
	'463': ICodCountryCode.RussianFederation,
	'464': ICodCountryCode.RussianFederation,
	'465': ICodCountryCode.RussianFederation,
	'466': ICodCountryCode.RussianFederation,
	'467': ICodCountryCode.RussianFederation,
	'468': ICodCountryCode.RussianFederation,
	'469': ICodCountryCode.RussianFederation,
	// 470 	GS1 Kyrgyzstan
	'470': ICodCountryCode.Kyrgyzstan,
	// 471 	GS1 Chinese Taipei
	'471': ICodCountryCode.China,
	// 474 	GS1 Estonia
	'474': ICodCountryCode.Estonia,
	// 475 	GS1 Latvia
	'475': ICodCountryCode.Latvia,
	// 476 	GS1 Azerbaijan
	'476': ICodCountryCode.Azerbaijan,
	// 477 	GS1 Lithuania
	'477': ICodCountryCode.Lithuania,
	// 478 	GS1 Uzbekistan
	'478': ICodCountryCode.Uzbekistan,
	// 479 	GS1 Sri Lanka
	'479': ICodCountryCode.SriLanka,
	// 480 	GS1 Philippines
	'480': ICodCountryCode.Philippines,
	// 481 	GS1 Belarus
	'481': ICodCountryCode.Belarus,
	// 482 	GS1 Ukraine
	'482': ICodCountryCode.Ukraine,
	// 483 	GS1 Turkmenistavn
	'483': ICodCountryCode.Turkmenistan,
	// 484 	GS1 Moldova
	'484': ICodCountryCode.Moldova,
	// 485 	GS1 Armenia
	'485': ICodCountryCode.Armenia,
	// 486 	GS1 Georgia
	'486': ICodCountryCode.Georgia,
	// 487 	GS1 Kazakstan
	'487': ICodCountryCode.Kazakhstan,
	// 488 	GS1 Tajikistan
	'488': ICodCountryCode.Tajikistan,
	// 489 	GS1 Hong Kong, China
	'489': ICodCountryCode.HongKong,
	// 490 - 499 & 450 - 459 	GS1 Japan
	'490': ICodCountryCode.Japan,
	'491': ICodCountryCode.Japan,
	'492': ICodCountryCode.Japan,
	'493': ICodCountryCode.Japan,
	'494': ICodCountryCode.Japan,
	'495': ICodCountryCode.Japan,
	'496': ICodCountryCode.Japan,
	'497': ICodCountryCode.Japan,
	'498': ICodCountryCode.Japan,
	'499': ICodCountryCode.Japan,
	// 500 - 509 	GS1 UK
	'500': ICodCountryCode.UnitedKingdom,
	'501': ICodCountryCode.UnitedKingdom,
	'502': ICodCountryCode.UnitedKingdom,
	'503': ICodCountryCode.UnitedKingdom,
	'504': ICodCountryCode.UnitedKingdom,
	'505': ICodCountryCode.UnitedKingdom,
	'506': ICodCountryCode.UnitedKingdom,
	'507': ICodCountryCode.UnitedKingdom,
	'508': ICodCountryCode.UnitedKingdom,
	'509': ICodCountryCode.UnitedKingdom,
	// 520 - 521 	GS1 Association Greece
	'520': ICodCountryCode.Greece,
	'521': ICodCountryCode.Greece,
	// 528 	GS1 Lebanon
	'528': ICodCountryCode.Lebanon,
	// 529 	GS1 Cyprus
	'529': ICodCountryCode.Cyprus,
	// 530 	GS1 Albania
	'530': ICodCountryCode.Albania,
	// 531 	GS1 Macedonia
	'531': ICodCountryCode.Macedonia,
	// 535 	GS1 Malta
	'535': ICodCountryCode.Malta,
	// 539 	GS1 Ireland
	'539': ICodCountryCode.Ireland,
	// 540 - 549 	GS1 Belgium & Luxembourg
	'540': ICodCountryCode.Belgium,
	'541': ICodCountryCode.Belgium,
	'542': ICodCountryCode.Belgium,
	'543': ICodCountryCode.Belgium,
	'544': ICodCountryCode.Belgium,
	'545': ICodCountryCode.Belgium,
	'546': ICodCountryCode.Belgium,
	'547': ICodCountryCode.Belgium,
	'548': ICodCountryCode.Belgium,
	'549': ICodCountryCode.Belgium,
	// 560 	GS1 Portugal
	'560': ICodCountryCode.Portugal,
	// 569 	GS1 Iceland
	'569': ICodCountryCode.Iceland,
	// 570 - 579 	GS1 Denmark
	'570': ICodCountryCode.Denmark,
	'571': ICodCountryCode.Denmark,
	'572': ICodCountryCode.Denmark,
	'573': ICodCountryCode.Denmark,
	'574': ICodCountryCode.Denmark,
	'575': ICodCountryCode.Denmark,
	'576': ICodCountryCode.Denmark,
	'577': ICodCountryCode.Denmark,
	'578': ICodCountryCode.Denmark,
	'579': ICodCountryCode.Denmark,
	// 590 	GS1 Poland
	'590': ICodCountryCode.Poland,
	// 594 	GS1 Romania
	'594': ICodCountryCode.Romania,
	// 599 	GS1 Hungary
	'599': ICodCountryCode.Hungary,
	// 600 - 601 	GS1 South Africa
	'600': ICodCountryCode.SouthAfrica,
	'601': ICodCountryCode.SouthAfrica,
	// 603 	GS1 Ghana
	'603': ICodCountryCode.Ghana,
	// 604 	GS1 Senegal
	'604': ICodCountryCode.Senegal,
	// 605 	GS1 Uganda
	'605': ICodCountryCode.Uganda,
	// 606 	GS1 Angola
	'606': ICodCountryCode.Angola,
	// 607 	GS1 Oman
	'607': ICodCountryCode.Oman,
	// 608 	GS1 Bahrain
	'608': ICodCountryCode.Bahrain,
	// 609 	GS1 Mauritius
	'609': ICodCountryCode.Mauritius,
	// 610 	Managed by GS1 Global Office for future MO
	// 611 	GS1 Morocco
	'611': ICodCountryCode.Morocco,
	// 613 	GS1 Algeria
	'613': ICodCountryCode.Algeria,
	// 614 	Managed by GS1 Global Office for future MO
	// 615 	GS1 Nigeria
	'615': ICodCountryCode.Nigeria,
	// 616 	GS1 Kenya
	'616': ICodCountryCode.Kenya,
	// 617 	GS1 Cameroon
	'617': ICodCountryCode.Cameroon,
	// 618 	GS1 Côte d'Ivoire
	'618': ICodCountryCode.CoteDIvoire,
	// 619 	GS1 Tunisia
	'619': ICodCountryCode.Tunisia,
	// 620 	GS1 Tanzania
	'620': ICodCountryCode.Tanzania,
	// 621 	GS1 Syria
	'621': ICodCountryCode.SyrianArabRepublic,
	// 622 	GS1 Egypt
	'622': ICodCountryCode.Egypt,
	// 623 	Managed by GS1 Global Office for future MO
	// 624 	GS1 Libya
	'624': ICodCountryCode.LibyanArabJamahiriya,
	// 625 	GS1 Jordan
	'625': ICodCountryCode.Jordan,
	// 626 	GS1 Iran
	'626': ICodCountryCode.Iran,
	// 627 	GS1 Kuwait
	'627': ICodCountryCode.Kuwait,
	// 628 	GS1 Saudi Arabia
	'628': ICodCountryCode.SaudiArabia,
	// 629 	GS1 Emirates
	'629': ICodCountryCode.UnitedArabEmirates,
	// 630 	GS1 Qatar
	'630': ICodCountryCode.Qatar,
	// 631 	GS1 Namibia
	'631': ICodCountryCode.Namibia,
	// 632 	GS1 Rwanda
	'632': ICodCountryCode.Rwanda,
	// 640 - 649 	GS1 Finland
	'640': ICodCountryCode.Finland,
	'641': ICodCountryCode.Finland,
	'642': ICodCountryCode.Finland,
	'643': ICodCountryCode.Finland,
	'644': ICodCountryCode.Finland,
	'645': ICodCountryCode.Finland,
	'646': ICodCountryCode.Finland,
	'647': ICodCountryCode.Finland,
	'648': ICodCountryCode.Finland,
	'649': ICodCountryCode.Finland,
	// 680 - 681 & 690 - 699 	GS1 China
	'680': ICodCountryCode.China,
	'681': ICodCountryCode.China,
	'690': ICodCountryCode.China,
	'691': ICodCountryCode.China,
	'692': ICodCountryCode.China,
	'693': ICodCountryCode.China,
	'694': ICodCountryCode.China,
	'695': ICodCountryCode.China,
	'696': ICodCountryCode.China,
	'697': ICodCountryCode.China,
	'698': ICodCountryCode.China,
	'699': ICodCountryCode.China,
	// 700 - 709 	GS1 Norway
	'700': ICodCountryCode.China,
	'701': ICodCountryCode.China,
	'702': ICodCountryCode.China,
	'703': ICodCountryCode.China,
	'704': ICodCountryCode.China,
	'705': ICodCountryCode.China,
	'706': ICodCountryCode.China,
	'707': ICodCountryCode.China,
	'708': ICodCountryCode.China,
	'709': ICodCountryCode.China,
	// 729 	GS1 Israel
	'729': ICodCountryCode.Israel,
	// 730 - 739 	GS1 Sweden
	'730': ICodCountryCode.China,
	'731': ICodCountryCode.China,
	'732': ICodCountryCode.China,
	'733': ICodCountryCode.China,
	'734': ICodCountryCode.China,
	'735': ICodCountryCode.China,
	'736': ICodCountryCode.China,
	'737': ICodCountryCode.China,
	'738': ICodCountryCode.China,
	'739': ICodCountryCode.China,
	// 740 	GS1 Guatemala
	'740': ICodCountryCode.Guatemala,
	// 741 	GS1 El Salvador
	'741': ICodCountryCode.ElSalvador,
	// 742 	GS1 Honduras
	'742': ICodCountryCode.Honduras,
	// 743 	GS1 Nicaragua
	'743': ICodCountryCode.Nicaragua,
	// 744 	GS1 Costa Rica
	'744': ICodCountryCode.CostaRica,
	// 745 	GS1 Panama
	'745': ICodCountryCode.Panama,
	// 746 	GS1 Republica Dominicana
	'746': ICodCountryCode.DominicanRepublic,
	// 750 	GS1 Mexico
	'750': ICodCountryCode.Mexico,
	// 754 - 755 	GS1 Canada
	'754': ICodCountryCode.Canada,
	'755': ICodCountryCode.Canada,
	// 758 	Managed by GS1 Global Office for future MO
	// 759 	GS1 Venezuela
	'759': ICodCountryCode.Venezuela,
	// 760 - 769 	GS1 Switzerland
	'760': ICodCountryCode.Switzerland,
	'761': ICodCountryCode.Switzerland,
	'762': ICodCountryCode.Switzerland,
	'763': ICodCountryCode.Switzerland,
	'764': ICodCountryCode.Switzerland,
	'765': ICodCountryCode.Switzerland,
	'766': ICodCountryCode.Switzerland,
	'767': ICodCountryCode.Switzerland,
	'768': ICodCountryCode.Switzerland,
	'769': ICodCountryCode.Switzerland,
	// 770 - 771 	GS1 Colombia
	'770': ICodCountryCode.Colombia,
	'771': ICodCountryCode.Colombia,
	// 773 	GS1 Uruguay
	'773': ICodCountryCode.Uruguay,
	// 775 	GS1 Peru
	'775': ICodCountryCode.Peru,
	// 777 	GS1 Bolivia
	'777': ICodCountryCode.Bolivia,
	// 778 - 779 	GS1 Argentina
	// 780 	GS1 Chile
	'780': ICodCountryCode.Chile,
	// 784 	GS1 Paraguay
	'784': ICodCountryCode.Paraguay,
	// 786 	GS1 Ecuador
	'786': ICodCountryCode.Ecuador,
	// 789 - 790 	GS1 Brasil
	'789': ICodCountryCode.Brazil,
	'790': ICodCountryCode.Brazil,
	// 800 - 839 	GS1 Italy
	'800': ICodCountryCode.Italy,
	'801': ICodCountryCode.Italy,
	'802': ICodCountryCode.Italy,
	'803': ICodCountryCode.Italy,
	'804': ICodCountryCode.Italy,
	'805': ICodCountryCode.Italy,
	'806': ICodCountryCode.Italy,
	'807': ICodCountryCode.Italy,
	'808': ICodCountryCode.Italy,
	'809': ICodCountryCode.Italy,
	'810': ICodCountryCode.Italy,
	'811': ICodCountryCode.Italy,
	'812': ICodCountryCode.Italy,
	'813': ICodCountryCode.Italy,
	'814': ICodCountryCode.Italy,
	'815': ICodCountryCode.Italy,
	'816': ICodCountryCode.Italy,
	'817': ICodCountryCode.Italy,
	'818': ICodCountryCode.Italy,
	'819': ICodCountryCode.Italy,
	'820': ICodCountryCode.Italy,
	'821': ICodCountryCode.Italy,
	'822': ICodCountryCode.Italy,
	'823': ICodCountryCode.Italy,
	'824': ICodCountryCode.Italy,
	'825': ICodCountryCode.Italy,
	'826': ICodCountryCode.Italy,
	'827': ICodCountryCode.Italy,
	'828': ICodCountryCode.Italy,
	'829': ICodCountryCode.Italy,
	'830': ICodCountryCode.Italy,
	'831': ICodCountryCode.Italy,
	'832': ICodCountryCode.Italy,
	'833': ICodCountryCode.Italy,
	'834': ICodCountryCode.Italy,
	'835': ICodCountryCode.Italy,
	'836': ICodCountryCode.Italy,
	'837': ICodCountryCode.Italy,
	'838': ICodCountryCode.Italy,
	'839': ICodCountryCode.Italy,
	// 840 - 849 	GS1 Spain
	'840': ICodCountryCode.Spain,
	'841': ICodCountryCode.Spain,
	'842': ICodCountryCode.Spain,
	'843': ICodCountryCode.Spain,
	'844': ICodCountryCode.Spain,
	'845': ICodCountryCode.Spain,
	'846': ICodCountryCode.Spain,
	'847': ICodCountryCode.Spain,
	'848': ICodCountryCode.Spain,
	'849': ICodCountryCode.Spain,
	// 850 	GS1 Cuba
	'850': ICodCountryCode.Cuba,
	// 858 	GS1 Slovakia
	'858': ICodCountryCode.Slovakia,
	// 859 	GS1 Czech
	'859': ICodCountryCode.CzechRepublic,
	// 860 	GS1 Serbia
	'860': ICodCountryCode.Serbia,
	// 865 	GS1 Mongolia
	'865': ICodCountryCode.Mongolia,
	// 867 	GS1 North Korea
	'867': ICodCountryCode.KoreaDemocraticPeoplesRepublic,
	// 868 - 869 	GS1 Türkiye
	'868': ICodCountryCode.Turkey,
	'869': ICodCountryCode.Turkey,
	// 870 - 879 	GS1 Netherlands
	'870': ICodCountryCode.Netherlands,
	'871': ICodCountryCode.Netherlands,
	'872': ICodCountryCode.Netherlands,
	'873': ICodCountryCode.Netherlands,
	'874': ICodCountryCode.Netherlands,
	'875': ICodCountryCode.Netherlands,
	'876': ICodCountryCode.Netherlands,
	'877': ICodCountryCode.Netherlands,
	'878': ICodCountryCode.Netherlands,
	'879': ICodCountryCode.Netherlands,
	// 880 - 881 	GS1 South Korea
	'880': ICodCountryCode.Korea,
	'881': ICodCountryCode.Korea,
	// 883 	GS1 Myanmar
	'883': ICodCountryCode.Myanmar,
	// 884 	GS1 Cambodia
	'884': ICodCountryCode.Cambodia,
	// 885 	GS1 Thailand
	'885': ICodCountryCode.Thailand,
	// 888 	GS1 Singapore
	'888': ICodCountryCode.Singapore,
	// 890 	GS1 India
	'890': ICodCountryCode.India,
	// 893 	GS1 Vietnam
	'893': ICodCountryCode.Vietnam,
	// 894 	Managed by GS1 Global Office for future MO
	// 896 	GS1 Pakistan
	'896': ICodCountryCode.Pakistan,
	// 899 	GS1 Indonesia
	'899': ICodCountryCode.Indonesia,
	// 900 - 919 	GS1 Austria
	'900': ICodCountryCode.Austria,
	'901': ICodCountryCode.Austria,
	'902': ICodCountryCode.Austria,
	'903': ICodCountryCode.Austria,
	'904': ICodCountryCode.Austria,
	'905': ICodCountryCode.Austria,
	'906': ICodCountryCode.Austria,
	'907': ICodCountryCode.Austria,
	'908': ICodCountryCode.Austria,
	'909': ICodCountryCode.Austria,
	'910': ICodCountryCode.Austria,
	'911': ICodCountryCode.Austria,
	'912': ICodCountryCode.Austria,
	'913': ICodCountryCode.Austria,
	'914': ICodCountryCode.Austria,
	'915': ICodCountryCode.Austria,
	'916': ICodCountryCode.Austria,
	'917': ICodCountryCode.Austria,
	'918': ICodCountryCode.Austria,
	'919': ICodCountryCode.Austria,
	// 930 - 939 	GS1 Australia
	'930': ICodCountryCode.Australia,
	'931': ICodCountryCode.Australia,
	'932': ICodCountryCode.Australia,
	'933': ICodCountryCode.Australia,
	'934': ICodCountryCode.Australia,
	'935': ICodCountryCode.Australia,
	'936': ICodCountryCode.Australia,
	'937': ICodCountryCode.Australia,
	'938': ICodCountryCode.Australia,
	'939': ICodCountryCode.Australia,
	// 940 - 949 	GS1 New Zealand
	'940': ICodCountryCode.NewZealand,
	'941': ICodCountryCode.NewZealand,
	'942': ICodCountryCode.NewZealand,
	'943': ICodCountryCode.NewZealand,
	'944': ICodCountryCode.NewZealand,
	'945': ICodCountryCode.NewZealand,
	'946': ICodCountryCode.NewZealand,
	'947': ICodCountryCode.NewZealand,
	'948': ICodCountryCode.NewZealand,
	'949': ICodCountryCode.NewZealand,
	// 950 	GS1 Global Office
	// 951 	Global Office - General Manager Number, see Note 2
	// 952 	Used for demonstrations and examples of the GS1 system
	// 955 	GS1 Malaysia
	'955': ICodCountryCode.Malaysia,
	// 958 	GS1 Macau, China
	'958': ICodCountryCode.Macao,
	// 960-969 	Global Office - GTIN-8, see note 3
	// 977 	Serial publications (ISSN)
	// 978 - 979 	Bookland (ISBN)
	// 980 	Refund receipts
	// 981 - 983 	GS1 coupon identification for common currency areas
	// 99 	GS1 coupon identification
};
