import { z } from 'zod';

export const aiInputValidateSchema = z.object({
	keyword: z.string().regex(/^[\w가-힣, ]+$/, '한글·영문·공백·콤마만 허용'),
	use_robots: z.boolean().optional(),
	use_organization: z.boolean().optional(),
});

export type aiInputValidateSchemaType = z.infer<typeof aiInputValidateSchema>;
