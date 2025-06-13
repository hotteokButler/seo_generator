import { z } from 'zod';

export const validateSchema = z.object({
	title: z
		.string()
		.min(2, {
			message: '최소 2자 이상 작성해주세요.',
		})
		.max(60, {
			message: '60자 이내로 작성해주세요.',
		}) //길이 제한
		.regex(/^[\w\s\p{Script=Hangul}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}.?!|\-:,'"[\]]+$/u, {
			message: '허용된 문자(특수문자는 . ? ! ,"\'|-:[]만)만 입력할 수 있습니다.',
		}),
	description: z
		.string()
		.min(5, {
			message: '최소 5자 이상 작성해주세요.',
		})
		.max(150, {
			message: '최대 150자 이내로 작성해주세요.',
		}) //길이 제한
		.regex(/^[\p{Script=Hangul}\p{Script=Latin}\p{Script=Hiragana}\p{Script=Katakana}\p{Nd} ,~.\|\[\]\-:!?]+$/u, {
			message: '허용된 문자(특수문자는 ,"~\'|-:!?[]만)만 입력할 수 있습니다.',
		}),
	keyword: z
		.string()
		.regex(/^[A-Za-z0-9가-힣, ]*$/, { message: '콤마로 구분된 키워드만 입력 가능합니다' })
		.optional()
		.or(z.literal('')),
	url: z.string().url({ message: '정확한 URL이어야 합니다.' }),
	thumb: z
		.string()
		.url({ message: '정확한 이미지 URL이어야 합니다.' })
		.regex(/\.(jpe?g|png|gif)$/i, { message: '이미지 URL만 허용됩니다.' })
		.optional(),

	logo: z
		.string()
		.url({ message: '정확한 로고 이미지 URL이어야 합니다.' })
		.regex(/\.(jpe?g|png|gif)$/i, { message: '이미지 URL만 허용됩니다.' })
		.optional(),
	tel: z
		.string()
		.regex(/^[0-9]{2,4}(?:-[0-9]{3,4}){1,2}$/, "전화번호는 '000-0000-0000' 형태여야 합니다")
		.optional(),
	sns: z.string().url({ message: '정확한 URL이어야 합니다.' }).optional(),
});

export type ValidateSchemaType = z.infer<typeof validateSchema>;
