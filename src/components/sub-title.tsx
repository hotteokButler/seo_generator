import { HighlightOutlined } from '@ant-design/icons';

import style from '@/asset/css/custom.module.css';

export default function SubTitle({ mainText, subText }: { mainText: string; subText?: string }) {
	return (
		<h2 className={style.main_subtitle}>
			<div>
				<HighlightOutlined />
				&nbsp;
				{mainText}
			</div>
			{subText && <span>{subText}</span>}
		</h2>
	);
}
