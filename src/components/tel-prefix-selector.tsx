import { Form, Select } from 'antd';

import { countryCodeMap } from '@/store/county_code';

export function TelPreFix({ disabled }: { disabled: boolean }) {
	return (
		<Form.Item name='telPrefix' noStyle style={{ background: '#ccc' }}>
			<Select placeholder='국가코드' disabled={disabled}>
				{countryCodeMap.map(({ country, code }) => (
					<Select.Option value={code} key={code}>
						{country} &#40;{code} &#41;
					</Select.Option>
				))}
			</Select>
		</Form.Item>
	);
}
