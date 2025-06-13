'use client';

import { Col, Row } from 'antd';
import React from 'react';

import styles from '@/asset/css/custom.module.css';
import AIInputField from '@/components/ai-input-field';
import OutputCode from '@/components/output-code';

export default function Page() {
	return (
		<div className={styles.ai_page_wrap}>
			<Row wrap={true} gutter={[8, 8]} style={{ flex: 'auto', gap: '2%' }}>
				<Col xs={{ flex: '100%' }} md={{ flex: '39%' }}>
					<AIInputField />
				</Col>
				<Col xs={{ flex: '100%' }} md={{ flex: '59%' }}>
					<OutputCode />
				</Col>
			</Row>
		</div>
	);
}
