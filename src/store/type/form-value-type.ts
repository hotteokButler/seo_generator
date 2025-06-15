export interface IFormValues {
	title: string;
	description: string;
	keyword?: string;
	url: string;
	thumb?: string;
	use_robots?: boolean;
	use_organization?: boolean;
	logo?: string;
	telPrefix?: string;
	tel?: string;
	sns_link?: Array<string>;
}
