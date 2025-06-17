'use client';

import { App, Button, Form, Input, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { NextResponse } from 'next/server';
import React, { useState } from 'react';
import { z } from 'zod';

import style from '@/asset/css/custom.module.css';
import { inputToolTip } from '@/store/input-toolTip-text';
import { IAiFormValues } from '@/store/type/ai-form-value-type';
import { isError, isZodError } from '@/store/type/error';
import { aiInputValidateSchema } from '@/util/ai-input-validate';
import safetyHtml from '@/util/safety-html';

import Loading from './loading';
import CustomizeRequiredMark from './required-mark';

interface IAiInputField {
	onGenerate: (tags: string) => void;
}

function stripMarkdown(code: string): string {
	return code
		.replace(/^```html\s*/, '') //  ```html 삭제
		.replace(/\s*```$/, '');
}

export default function AIInputField({ onGenerate }: IAiInputField) {
	const { message } = App.useApp();
	const [form] = Form.useForm<IAiFormValues>();
	const [loading, setLoading] = useState(false);

	const validateField = <K extends keyof typeof aiInputValidateSchema.shape>(field: K) => {
		const fieldSchema = aiInputValidateSchema.shape[field] as z.ZodTypeAny;

		return async (_: unknown, value: unknown) => {
			const result = fieldSchema.safeParse(value);
			if (!result.success) {
				throw new Error(result.error.errors[0].message);
			}
		};
	};

	const onFinish = async (fieldsValue: IAiFormValues) => {
		try {
			aiInputValidateSchema.parse(fieldsValue);
		} catch (e: unknown) {
			if (isZodError(e)) {
				console.error('Validation error:', e.errors);
				return NextResponse.json({ error: '잘못된 요청데이터', details: e.errors }, { status: 400 });
			}
			return message.error('알 수 없는 오류');
		}

		setLoading(true); // loading

		try {
			const res = await fetch('/api/seo-suggestion', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					keyword: safetyHtml(fieldsValue.keyword),
					use_organization: fieldsValue.use_organization,
					use_robots: fieldsValue.use_robots,
					additional_req: safetyHtml(fieldsValue.additional_req),
				}),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || '생성 실패');
			const code = json.code as string;
			console.log(code);
			onGenerate(stripMarkdown(code));

			//
		} catch (e: unknown) {
			if (isError(e)) {
				message.error(e.message);
			} else {
				message.error(String(e));
			}
			//
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{loading && <Loading />}
			<Form layout='vertical' form={form} onFinish={onFinish} requiredMark={CustomizeRequiredMark}>
				<Form.Item name='keyword' label='Keyword' rules={[{ required: true, message: '키워드를 콤마(,)로 구분하여 입력해 주세요' }, { validator: validateField('keyword') }]}>
					<Input placeholder='콤마(,) 로 구분해서 작성해주세요 예: 키워드1, 키워드2,' />
				</Form.Item>
				<Form.Item name='additional_req' label='추가요청사항' rules={[{ required: false }, { validator: validateField('additional_req') }]} tooltip={inputToolTip.additional_req}>
					<TextArea
						rows={3}
						placeholder='추가요청사항을 간단히 입력해 주세요'
						count={{
							show: true,
							max: 150,
						}}
					/>
				</Form.Item>

				<Form.Item name='use_robots' label='Use robots'>
					<Switch />
				</Form.Item>

				<Form.Item name='use_organization' label='Get Organization Schema Form'>
					<Switch />
				</Form.Item>

				{/* submit */}
				<Form.Item>
					<Button type='primary' htmlType='submit' className={style.submit_btn}>
						제안받기
					</Button>
				</Form.Item>
			</Form>
		</>
	);
}
