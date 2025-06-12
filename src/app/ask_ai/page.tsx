'use client';

import { Col, Row } from 'antd';
import React from 'react';

import styles from '@/asset/css/custom.module.css';
import AIInputField from '@/components/ai-input-field';

export default function Page() {
	return (
		<div className={styles.main_wrapper}>
			<Row wrap={true} gutter={[8, 8]} style={{ flex: 'auto' }}>
				<Col xs={{ flex: '100%' }} md={{ flex: '39%' }}>
					<AIInputField />
				</Col>
				<Col xs={{ flex: '100%' }} md={{ flex: '59%' }}>
					output
				</Col>
			</Row>
		</div>
	);
}
