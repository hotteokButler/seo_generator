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
const safetyHtml = (val: string | undefined): string => {
	if (!val) return '';
	return escapeHtmlElem(filterHyphenAndUnderScore(val));
};

export default safetyHtml;
