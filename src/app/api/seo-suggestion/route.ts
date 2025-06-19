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
	const promptLines = [
		// 1. 역할 및 목적
		'당신은 최신 Google SEO에 최적화된 메타 태그를 생성하는 SEO 전문가입니다.',

		// 2. 사용자 입력
		`키워드 (최대 10개, 쉼표로 구분): ${body.keyword}`,
		`robots 사용: ${body.use_robots ? '예 (index,follow)' : '아니오 (noindex,nofollow)'}`,
		`Organization 스키마 사용: ${body.use_organization ? '예' : '아니오'}`,
		body.additional_req ? `추가 요청사항: ${body.additional_req}` : '추가 요청사항: 없음',

		'',
		'[지침]',

		// 3. 고정 출력 태그 골격 (항상 포함)
		'1. <title>은 50~60자 이내로 생성합니다.',
		'2. <meta name="description" content="…">은 140~160자 이내로 생성합니다.',
		'3. <meta name="keywords" content="키워드1,키워드2,…,키워드10"> (키워드 수 최대 10개)',
		'4. <link rel="canonical" href="[대표 링크]">',
		'5. <meta property="og:image" content="[썸네일 이미지 링크]">',
		'6. <meta property="og:logo" content="[로고 이미지 링크]">',
		'7. <meta name="format-detection" content="telephone=no">',
		'8. <meta property="og:title" content="…">',
		'9. <meta property="og:description" content="…">',
		'10. <meta property="og:url" content="[대표 링크]">',

		'',
		// 4. 옵션 선택 시에만 포함할 태그
		'[옵션 태그: robots 및 JSON-LD Organization 스키마]',
		'- robots 사용 예시: <meta name="robots" content="index,follow">',
		'- robots 미사용 예시: <meta name="robots" content="noindex,nofollow">',
		'- Organization 스키마 사용 예시:',
		'  <script type="application/ld+json">',
		'  {',
		'    "@context": "https://schema.org",',
		'    "@type": "Organization",',
		'    "name": "[이름]",',
		'    "url": "[대표 링크]",',
		'    "logo": "[로고 링크]",',
		'    "telephone": "[국제번호 포함 전화번호]",',
		'    "sameAs": [',
		'      "[sns링크1]",',
		'      "[sns링크2]"',
		'    ]',
		'  }',
		'  </script>',

		'',
		// 5. 출력 형식
		'출력은 **메타 태그 HTML 코드만**, `<head>` 태그 제외하여 문자열 형태로 내보내세요.',
		'사용자 입력 placeholder(대표 링크, 썸네일, 이름 등)는 반드시 `[]`로 감싸서 표기하세요.',
		'생성 후 필수로 마지막 라인에 []괄호 안은 복사 후 직접 변경해야 합니다.라는 문구 주석으로 추가하세요.',
	];

	const prompt = promptLines.filter(Boolean).join('\n');

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
