import { Button, Form, Input } from 'antd';
import React from 'react';

import style from '@/asset/css/custom.module.css';

import CustomizeRequiredMark from './required-mark';

export default function AIInputField() {
	const [form] = Form.useForm();

	return (
		<Form layout='vertical' form={form} requiredMark={CustomizeRequiredMark}>
			<Form.Item name='keyword' label='Keyword' rules={[{ required: true, message: '키워드를 콤마(,)로 구분하여 입력해 주세요' }]}>
				<Input placeholder='콤마(,) 로 구분해서 작성해주세요 예: 키워드1, 키워드2,' />
			</Form.Item>

			{/* submit */}
			<Form.Item>
				<Button type='primary' className={style.submit_btn}>
					제안받기
				</Button>
			</Form.Item>
		</Form>
	);
}
