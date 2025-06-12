'use client';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Space, Switch, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';

import style from '@/asset/css/custom.module.css';
import { inputToolTip } from '@/store/input-toolTip-text';

import CustomizeRequiredMark from './required-mark';
import { TelPreFix } from './tel-prefix-selector';

export default function InputField() {
	const [form] = Form.useForm();
	const [componentDisabled, setComponentDisabled] = useState<boolean>(true);

	return (
		<Form layout='vertical' form={form} requiredMark={CustomizeRequiredMark}>
			<Form.Item name='title' label='Title' rules={[{ required: true, message: '홈페이지 타이틀을 입력해 주세요' }]} tooltip={inputToolTip.title}>
				<Input placeholder='홈페이지 타이틀' />
			</Form.Item>
			<Form.Item name='description' label='Description' rules={[{ required: true, message: '홈페이지 설명을 입력해 주세요' }]} tooltip={inputToolTip.description}>
				<TextArea rows={3} placeholder='홈페이지 설명' />
			</Form.Item>
			<Form.Item name='keyword' label='Keyword' tooltip={inputToolTip.keyword}>
				<Input placeholder='콤마(,) 로 구분해서 작성해주세요 예: 키워드1, 키워드2,' />
			</Form.Item>
			<Alert message='Google에서는 더 이상 keyword meta tag를 수집하지 않습니다.' style={{ marginBottom: '1.8em' }} />
			<Form.Item name='url' label='URL' required={true} rules={[{ required: true, message: '홈페이지 대표 링크를 프로토콜(http, https)과 함께 입력해 주세요' }]} tooltip={inputToolTip.url}>
				<Input placeholder='홈페이지 대표링크' />
			</Form.Item>
			<Form.Item name='thumb' label='Thumbnail' required={true} tooltip={inputToolTip.thumbnail}>
				<Input placeholder='홈페이지 썸네일 이미지' />
			</Form.Item>
			<div>
				<Switch defaultChecked />
				&nbsp; Robots meta tag
			</div>
			<ul>
				<li>
					<Switch onChange={() => setComponentDisabled((prev) => !prev)} />
					&nbsp; Organization schema(필요시)
				</li>
				<li className={[style.org_input_con, !componentDisabled && style.org_view].join(' ')}>
					<Typography.Title level={4}>Organization schema 추가 </Typography.Title>
					<Form.Item name='logo' label='Logo' tooltip={inputToolTip.logo}>
						<Input placeholder='로고 링크' disabled={componentDisabled} />
					</Form.Item>
					<Form.Item name='tel' label='전화번호' rules={[{ required: false, message: '전화번호를 입력해 주세요' }]} tooltip={inputToolTip.url}>
						<Input addonBefore={<TelPreFix />} style={{ width: '100%' }} disabled={componentDisabled} />
					</Form.Item>
					<Typography.Text className={style.input_label}>{CustomizeRequiredMark('SNS 링크', { required: false })}</Typography.Text>
					<Form.List name='sns_link'>
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, ...restField }) => (
									<Space key={key} align='baseline' style={{ width: '100%' }}>
										<Form.Item {...restField} name={[name, `sns_link_${key + 1}`]} style={{ width: '100%' }} tooltip={inputToolTip.url}>
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
				<Button type='primary' className={style.submit_btn}>
					생성하기
				</Button>
			</Form.Item>
		</Form>
	);
}
