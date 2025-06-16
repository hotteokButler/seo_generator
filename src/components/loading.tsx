import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

import style from '@/asset/css/custom.module.css';

export default function Loading() {
	return (
		<div className={style.loading_wrap}>
			<div>
				<LoadingOutlined />
			</div>
		</div>
	);
}
