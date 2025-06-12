'use client';

import 'highlight.js/styles/night-owl.css'; //styles

import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { App, Button, Space } from 'antd';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import xml from 'highlight.js/lib/languages/xml'; //언어 html 고정
import React, { useEffect, useRef, useState } from 'react';

import style from '@/asset/css/custom.module.css';
import { useSafeHTMLPolicy } from '@/util/useSafeHtml';

hljs.registerLanguage('html', xml);

interface ICodeBlockProps {
	code?: string;
}

export default function OutputCode({ code }: ICodeBlockProps) {
	useSafeHTMLPolicy();

	const preRef = useRef<HTMLPreElement>(null);
	const [copied, setCopied] = useState(false);
	const { message } = App.useApp();
	const getCode = code ? code : '<h1>SEO 코드를 생성해 보세요</h1>';

	useEffect(() => {
		if (!preRef.current || typeof getCode !== 'string') return;
		try {
			const result = hljs.highlight(getCode, { language: 'html' });
			const safeHtml = DOMPurify.sanitize(result.value, {
				USE_PROFILES: { html: true },
				ALLOWED_TAGS: ['title', 'meta', 'link'], // 반드시 필요한 태그만 허용
				ALLOWED_ATTR: ['name', 'content', 'property', 'href', 'rel', 'charset'],
				RETURN_TRUSTED_TYPE: false,
			});
			preRef.current.innerHTML = safeHtml;
		} catch (err) {
			console.error('Highlight.js error:', err);
			preRef.current.textContent = getCode;
		}
	}, [getCode]);

	const onCopy = async () => {
		try {
			await navigator.clipboard.writeText(getCode);
			setCopied(true);
			message.success('코드가 복사되었습니다!');
			setTimeout(() => setCopied(false), 2000);
		} catch {
			message.error('복사에 실패했습니다.');
		}
	};
	return (
		<div className={style.code_block_wrap}>
			<div className={style.code_block_con}>
				<pre ref={preRef} className='hljs' />
				<Space style={{ position: 'absolute', top: 8, right: 8 }}>
					<Button size='small' icon={copied ? <CheckOutlined /> : <CopyOutlined />} onClick={onCopy}>
						{copied ? 'Copied' : 'Copy'}
					</Button>
				</Space>
			</div>
		</div>
	);
}
