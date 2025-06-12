'use client';
import '@ant-design/v5-patch-for-react-19';

import { unstableSetRender } from 'antd';
import { Col, Row } from 'antd';
import { createRoot } from 'react-dom/client';

import styles from '@/asset/css/custom.module.css';
import InputField from '@/components/input-field';
import OutputCode from '@/components/output-code';

unstableSetRender((node, container) => {
	const cont = container as any;
	cont._reactRoot ||= createRoot(cont);
	const root = cont._reactRoot;
	root.render(node);
	return async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		root.unmount();
	};
});

const demoCode = '<meat name="title" content="demoTitle"/>';

export default function Home() {
	return (
		<div className={styles.main_wrapper}>
			<Row wrap={true} gutter={[8, 8]} style={{ flex: 'auto', gap: '2%' }}>
				<Col xs={{ flex: '100%' }} md={{ flex: '39%' }}>
					<InputField />
				</Col>
				<Col xs={{ flex: '100%' }} md={{ flex: '59%' }}>
					<OutputCode code={demoCode} />
				</Col>
			</Row>
		</div>
	);
}
