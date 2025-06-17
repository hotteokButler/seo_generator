import { IFormValues } from '@/store/type/form-value-type';

import safetyHtml from './safety-html';

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
	// 전화번호 링크 인식 방지
	defaultTags.push(`<meta name="format-detection" content="telephone=no" />`);

	// OrganizationTag 사용시에만 활성화
	if (use_organization) {
		const org: Record<string, string | string[]> = {
			'@context': 'https://schema.org',
			'@type': 'Organization',
		};

		if (t) org.name = t; //title
		if (u) org.url = u; //url
		if (logo) org.logo = logo; //logo
		if (tel && telPrefix) org.telephone = `${telPrefix.trim()}-${tel.trim()}`; //tel
		if (Array.isArray(sns_link)) {
			org.sameAs = sns_link.map((elem) => {
				const url = Object.values(elem)[0];
				if (url) {
					return url;
				} else {
					return '';
				}
			});

			org.sameAs.filter((elem) => elem !== '');
		}
		const jsonLD = JSON.stringify(org, null, 2).replace(/</g, '\\u003C').replace(/>/g, '\\u003E');

		organizationTag.push(`<script type="application/ld+json">\n${jsonLD}\n</script>`);
	}

	return defaultTags.concat(ogTags, organizationTag).join('\n');
};

export default generateTags;
