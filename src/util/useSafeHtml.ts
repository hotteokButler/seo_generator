'use client';
import DOMPurify from 'dompurify';
import { useEffect } from 'react';

export function useSafeHTMLPolicy() {
	useEffect(() => {
		if (typeof window !== 'undefined' && window.trustedTypes?.createPolicy) {
			window.trustedTypes.createPolicy('safeHTML', {
				createHTML: (input) =>
					DOMPurify.sanitize(input, {
						USE_PROFILES: { html: true },
						ALLOWED_TAGS: ['title', 'meta', 'link'], // 반드시 필요한 태그만 허용
						ALLOWED_ATTR: ['name', 'content', 'property', 'href', 'rel', 'charset'],
						RETURN_TRUSTED_TYPE: false,
					}),
			});
		}
	}, []);
}
