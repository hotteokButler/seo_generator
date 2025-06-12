import { Tag } from 'antd';

const CustomizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
	<>
		{required ? <Tag color='error'>Required</Tag> : <Tag color='warning'>optional</Tag>}
		{label}
	</>
);

export default CustomizeRequiredMark;
