import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import { aiInputValidateSchema } from '@/util/ai-input-validate';

export async function POST(req: Request) {
	// 요청 body 파싱
	let json;
	try {
		json = await req.json();
	} catch {
		return NextResponse.json({ error: 'JSON 파싱 실패' }, { status: 400 });
	}

	//  safeParse
	const parsed = aiInputValidateSchema.safeParse(json);
	if (!parsed.success) {
		console.error('Validation errors:', parsed.error.errors);
		console.error('Raw body:', json);
		return NextResponse.json({ error: '잘못된 요청 데이터', details: parsed.error.errors }, { status: 400 });
	}
	const body = parsed.data;

	//  OpenAI 호출
	const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
	const prompt = `
키워드: ${body.keyword}
Organization 포함: ${body.use_organization ? '예' : '아니오'}
robots 태그: ${body.use_robots ? 'index,follow' : 'noindex,nofollow'}

[지침]
1. 키워드를 자연스럽게 포함한 SEO 최적화 메타 태그를 <head> 형태로 생성하세요.
2. <title>은 50~60자, <meta name="description">은 140~160자로 유지하세요.
3. 'and' 사용, '&'는 사용하지 마세요.
4. <link rel="canonical">과 <meta name="robots"> 태그 포함하세요.
5. [대표 url], [썸네일 이미지 링크], [로고링크], [이름], [대표전화번호], [sns링크1] 등은 대괄호로 표기하세요.
6. Organization 포함이면 <script type="application/ld+json"> 내 Organization 스키마 포함하세요.
7. 출력은 **오직 HTML 코드 문자열**로만 해주세요.
`;

	try {
		let resp;
		for (let i = 0; i < 3; i++) {
			try {
				resp = await openai.chat.completions.create({
					model: 'gpt-4o',
					messages: [{ role: 'user', content: prompt }],
					max_tokens: 400,
					temperature: 0.7,
				});
				break;
			} catch (err: unknown) {
				if (err instanceof OpenAI.APIError && err.status >= 500) {
					await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
					continue;
				}
				throw err;
			}
		}
		if (!resp) throw new Error('100% 실패');

		const content = resp.choices?.[0]?.message?.content;
		if (!content) {
			console.error('GPT 응답이 없습니다.', resp);
			return NextResponse.json({ error: 'GPT 응답 없음' }, { status: 500 });
		}

		const code = content.trim();
		return NextResponse.json({ code });
	} catch (e) {
		if (e instanceof Error) {
			console.error(e.message);
		} else {
			console.error(String(e));
		}
		return NextResponse.json({ error: 'GPT 호출 실패' }, { status: 500 });
	}
}
