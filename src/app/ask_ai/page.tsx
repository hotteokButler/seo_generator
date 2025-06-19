'use client';
import '@ant-design/v5-patch-for-react-19';

import { Col, Row } from 'antd';
import React, { useState } from 'react';

import styles from '@/asset/css/custom.module.css';
import AIInputField from '@/components/ai-input-field';
import OutputCode from '@/components/output-code';

export default function Page() {
	const [generatedCode, setGeneratedCode] = useState<string>('');

	return (
		<div className={styles.ai_page_wrap}>
			<Row wrap={true} gutter={[8, 8]} style={{ flex: 'auto', gap: '2%', flexWrap: 'nowrap' }}>
				<Col xs={{ flex: '100%' }} md={{ flex: '39%' }}>
					<AIInputField onGenerate={setGeneratedCode} />
				</Col>
				<Col xs={{ flex: '100%' }} md={{ flex: '59%' }} style={{ overflowX: 'hidden' }}>
					<OutputCode code={generatedCode} />
				</Col>
			</Row>
		</div>
	);
}
