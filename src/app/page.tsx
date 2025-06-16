'use client';

import { unstableSetRender } from 'antd';
import { Col, Row } from 'antd';
import { useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import styles from '@/asset/css/custom.module.css';
import InputField from '@/components/input-field';
import OutputCode from '@/components/output-code';

unstableSetRender((node, container) => {
	const cont = container as Element & { _reactRoot?: Root };
	cont._reactRoot ||= createRoot(cont);
	const root = cont._reactRoot;
	root.render(node);
	return async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		root.unmount();
	};
});

export default function Home() {
	const [generatedCode, setGeneratedCode] = useState<string | undefined>(undefined);

	return (
		<div className={styles.main_wrapper}>
			<Row wrap={true} gutter={[8, 8]} style={{ flex: 'auto', gap: '2%' }}>
				<Col xs={{ flex: '100%' }} md={{ flex: '48%' }}>
					<InputField onGenerate={(generated) => setGeneratedCode(generated)} />
				</Col>
				<Col xs={{ flex: '100%' }} md={{ flex: '50%' }} className={styles.scroll_wrap}>
					<OutputCode code={generatedCode} />
				</Col>
			</Row>
		</div>
	);
}
