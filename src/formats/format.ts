export abstract class CodFormat {
	public abstract readonly config: ICodFormatConfig;
	public abstract investigate(rawValue: string): ICodFormatInvestigation;
}

export interface ICodFormatConfig {
	displayLabel?: string;
	displayType?: ICodFormatConfigDisplayType;
}

export enum ICodFormatConfigDisplayType {
	TwoDee = '2D',
	ThreeDee = '3D',
}

export interface ICodFormatInvestigation {
	representations?: ICodFormatInvestigationRepresentation[];
	informations?: ICodFormatInvestigationInformation[];
}

export interface ICodFormatInvestigationRepresentation {
	type: ICodFormatInvestigationRepresentationType;
	displayValue: string;
	actualValue: string;
}

export enum ICodFormatInvestigationRepresentationType {
	String = 'STRING',
	Int = 'INT',
	Hex = 'HEX',
}

export interface ICodFormatInvestigationInformation {
	label: string;
	value: string;
}
