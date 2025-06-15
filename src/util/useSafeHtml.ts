'use client';
import DOMPurify from 'dompurify';
import { useEffect } from 'react';

export function useSafeHTMLPolicy() {
	useEffect(() => {
		if (typeof window !== 'undefined' && window.trustedTypes?.createPolicy) {
			window.trustedTypes.createPolicy('safeHTML', {
				createHTML: (input: string) => {
					// 1) DOMPurify로 모든 스크립트 제거
					const cleanHtml = DOMPurify.sanitize(input, {
						USE_PROFILES: { html: true },
						ALLOWED_TAGS: ['title', 'meta', 'link'],
						ALLOWED_ATTR: ['name', 'content', 'property', 'href', 'rel', 'charset'],
						RETURN_TRUSTED_TYPE: false,
					});

					// 2) input에서 JSON‑LD만 추출
					const ldMatch = input.match(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i);
					const ldScript = ldMatch ? ldMatch[0] : '';

					// 3) cleanHtml + JSON‑LD 스크립트 조합
					return cleanHtml + ldScript;
				},
			});
		}
	}, []);
}
