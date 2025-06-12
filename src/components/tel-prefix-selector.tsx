import { Select } from 'antd';

import { countryCodeMap } from '@/store/county_code';

export function TelPreFix() {
	return (
		<Select defaultValue={'+82'}>
			{countryCodeMap.map(({ country, code }) => (
				<Select.Option value={code} key={code}>
					{country} &#40;{code} &#41;
				</Select.Option>
			))}
		</Select>
	);
}
