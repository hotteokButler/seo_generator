import { z } from 'zod';

export const aiInputValidateSchema = z.object({
	keyword: z.string().regex(/^[\w가-힣, ]+$/, '한글·영문·공백·콤마만 허용'),
	use_robots: z.boolean().optional(),
	use_organization: z.boolean().optional(),
	additional_req: z
		.string()
		.max(150, {
			message: '최대 150자 이내로 작성해주세요.',
		}) //길이 제한
		.regex(/^[\p{Script=Hangul}\p{Script=Latin}\p{Script=Hiragana}\p{Script=Katakana}\p{Nd} ,~.\|'"\-!?]+$/u, {
			message: '허용된 문자(,"~\'-!?)만 입력할 수 있습니다.',
		})
		.optional(),
});

export type aiInputValidateSchemaType = z.infer<typeof aiInputValidateSchema>;
