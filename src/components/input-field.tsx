'use client';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Space, Switch, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import { z } from 'zod';

import style from '@/asset/css/custom.module.css';
import { inputToolTip } from '@/store/input-toolTip-text';
import type { IFormValues } from '@/store/type/form-value-type';
import generateTags from '@/util/generate-tags';
import { validateSchema, ValidateSchemaType } from '@/util/validate';

import CustomizeRequiredMark from './required-mark';
import { TelPreFix } from './tel-prefix-selector';

interface IInputField {
	onGenerate: (tags: string) => void;
}

export default function InputField({ onGenerate }: IInputField) {
	const [form] = Form.useForm<ValidateSchemaType>();
	const [componentDisabled, setComponentDisabled] = useState<boolean>(true);

	const validateField = <K extends keyof typeof validateSchema.shape>(field: K) => {
		const fieldSchema = validateSchema.shape[field] as z.ZodTypeAny;

		return async (_: unknown, value: unknown) => {
			const result = fieldSchema.safeParse(value);
			if (!result.success) {
				throw new Error(result.error.errors[0].message);
			}
		};
	};

	const onFinish = (fieldsValue: IFormValues) => {
		const generated = generateTags(fieldsValue);
		onGenerate(generated);
	};

	return (
		<Form layout='vertical' form={form} onFinish={onFinish} requiredMark={CustomizeRequiredMark}>
			<Form.Item name='title' label='Title' rules={[{ required: true, message: '홈페이지 타이틀을 입력해 주세요' }, { validator: validateField('title') }]} tooltip={inputToolTip.title}>
				<Input
					placeholder='홈페이지 타이틀'
					count={{
						show: true,
						max: 60,
					}}
				/>
			</Form.Item>
			<Form.Item
				name='description'
				label='Description'
				rules={[{ required: true, message: '홈페이지 설명을 입력해 주세요' }, { validator: validateField('description') }]}
				tooltip={inputToolTip.description}
			>
				<TextArea
					rows={3}
					placeholder='홈페이지 설명'
					count={{
						show: true,
						max: 150,
					}}
				/>
			</Form.Item>
			<Form.Item name='keyword' label='Keyword' tooltip={inputToolTip.keyword}>
				<Input placeholder='콤마(,) 로 구분해서 작성해주세요 예: 키워드1, 키워드2,' />
			</Form.Item>
			<Alert message='Google에서는 더 이상 keyword meta tag를 수집하지 않습니다.' style={{ marginBottom: '1.8em' }} />
			<Form.Item
				name='url'
				label='URL'
				required={true}
				rules={[{ required: true, message: '홈페이지 대표 링크를 프로토콜(http, https)과 함께 입력해 주세요' }, { validator: validateField('url') }]}
				tooltip={inputToolTip.url}
			>
				<Input placeholder='홈페이지 대표링크' />
			</Form.Item>
			<Form.Item
				name='thumb'
				label='Thumbnail'
				rules={[{ required: false, message: '홈페이지 대표 썸네일 이미지 링크를 입력해 주세요' }, { validator: validateField('thumb') }]}
				tooltip={inputToolTip.thumbnail}
			>
				<Input placeholder='홈페이지 썸네일 이미지' />
			</Form.Item>
			<Form.Item name='use_robots' label='Robots meta tag' layout='horizontal'>
				<Switch />
			</Form.Item>
			<ul>
				<li>
					<Form.Item name='use_organization' label='Organization schema(필요시)' layout='horizontal'>
						<Switch onChange={() => setComponentDisabled((prev) => !prev)} />
					</Form.Item>
				</li>
				<li className={[style.org_input_con, !componentDisabled && style.org_view].join(' ')}>
					<Typography.Title level={4}>Organization schema 추가 </Typography.Title>
					<Form.Item name='logo' label='Logo' tooltip={inputToolTip.logo} rules={[{ required: false }, { validator: validateField('logo') }]}>
						<Input placeholder='로고 링크' disabled={componentDisabled} />
					</Form.Item>

					<Form.Item label='전화번호' tooltip={inputToolTip.url} rules={[{ required: false }]}>
						<Space.Compact style={{ width: '100%' }}>
							<TelPreFix disabled={componentDisabled} />
							<Form.Item name='tel' label='전화번호' rules={[{ required: false }, { validator: validateField('tel') }]} noStyle>
								<Input disabled={componentDisabled} />
							</Form.Item>
						</Space.Compact>
					</Form.Item>

					<Typography.Text className={style.input_label}>{CustomizeRequiredMark('SNS 링크', { required: false })}</Typography.Text>
					<Form.List name='sns_link'>
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, ...restField }) => (
									<Space key={key} align='baseline' style={{ width: '100%' }}>
										<Form.Item
											{...restField}
											name={[name, `sns_link_${key + 1}`]}
											style={{ width: '100%' }}
											rules={[{ required: false }, { validator: validateField('sns') }]}
											tooltip={inputToolTip.url}
										>
											<Input placeholder='SNS 링크' style={{ width: '100%' }} disabled={componentDisabled} />
										</Form.Item>
										<MinusCircleOutlined
											onClick={() => {
												remove(name);
											}}
										/>
									</Space>
								))}
								{fields.length < 4 && (
									<Form.Item>
										<Button type='dashed' color='cyan' onClick={() => add()} block icon={<PlusOutlined />} disabled={componentDisabled}>
											SNS 링크 추가하기
										</Button>
									</Form.Item>
								)}
							</>
						)}
					</Form.List>
				</li>
			</ul>
			{/* submit */}
			<Form.Item>
				<Button type='primary' htmlType='submit' className={style.submit_btn}>
					생성하기
				</Button>
			</Form.Item>
		</Form>
	);
}
