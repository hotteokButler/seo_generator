import { IFormValues } from '@/store/type/form-value-type';

//하이픈, 언더바 연속 제거
const filterHyphenAndUnderScore = (str: string): string => {
	return str.replace(/[-_]/g, (s) => s[0]);
};

// XXS 기본 방지 추가
const escapeHtmlElem = (str: string): string => {
	return str
		.replace(/&/g, '&amp') //
		.replace(/</g, '&lt;') //
		.replace(/>/g, '&gt;') //
		.replace(/'/g, '&#39;') //
		.replace(/"/g, '&quot;'); //
};

// 보안 필터
const safetyHtml = (val: string): string => {
	if (!val) return '';
	return escapeHtmlElem(filterHyphenAndUnderScore(val));
};

const generateTags = (vals: IFormValues): string => {
	const { title, description, keyword, url, thumb, use_robots, use_organization, logo, telPrefix, tel, sns_link } = vals;

	const defaultTags: string[] = [];
	const ogTags: string[] = [];
	const organizationTag: string[] = [];

	// title
	const t = safetyHtml(title);
	if (t) {
		defaultTags.push(`<title>${t}</title>`);
		ogTags.push(`<meta property="og:title" content="${t}" />`);
	}
	// description
	const desc = safetyHtml(description);
	if (desc) {
		defaultTags.push(`<meta name="description" content="${desc}" />`);
		ogTags.push(`<meta property="og:description" content="${desc}" />`);
	}
	// keywords
	const kw = keyword ? safetyHtml(keyword) : null;
	if (kw) {
		defaultTags.push(`<meta name="keywords" content="${kw}" />`);
	}
	// 대표 url
	const u = url ? safetyHtml(url) : null;
	if (u) {
		defaultTags.push(`<link rel="canonical" href="${u}" />`);
		ogTags.push(`<meta property="og:url" content="${u}" />`);
	}
	// 썸네일
	const thumbUrl = thumb ? safetyHtml(thumb) : null;
	if (thumbUrl) {
		defaultTags.push(`<meta property="og:image" content="${thumbUrl}" />`);
		defaultTags.push(`<meta property="og:logo" content="${thumbUrl}" />`);
	}
	//  robots
	if (use_robots) {
		defaultTags.push(use_robots ? `<meta name="robots" content="index,follow" />` : `<meta name="robots" content="noindex,nofollow" />`);
	}
	// OrganizationTag 사용시에만 활성화
	if (use_organization) {
		const org: Record<string, string | string[]> = {
			'@@context': 'https://schema.org',
			'@type': 'Organization',
		};

		if (t) org.name = t; //title
		if (u) org.url = u; //url
		if (logo) org.logo = logo; //logo
		if (tel && telPrefix) org.telephone = `${telPrefix.trim()}-${tel.trim()}`; //tel
		if (Array.isArray(sns_link)) {
			org.sameAs = sns_link.map((elem) => Object.values(elem)[0]);
		}
		const jsonLD = JSON.stringify(org, null, 2);

		organizationTag.push(`<script type="application/ld+json">\n${jsonLD}\n</srcipt>`);
	}

	return defaultTags.concat(ogTags, organizationTag).join('\n');
};

export default generateTags;
