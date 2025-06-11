'use client';

import { ExclamationCircleOutlined, MessageOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import style from '@/asset/css/main-layout.module.css';
type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
	{
		label: '생성하기',
		key: 'with_plan',
		icon: <ExclamationCircleOutlined />,
	},
	{
		label: '제안받기',
		key: 'ask_ai',
		icon: <MessageOutlined />,
	},
];
export default function Header() {
	const [current, setCurrent] = useState('with_plan');
	const router = useRouter();

	const onClick: MenuProps['onClick'] = (e) => {
		const { key } = e;
		if (key === 'with_plan') {
			router.push('/');
		} else if (key === 'ask_ai') {
			router.push('/ask_ai');
		}
		setCurrent(key);
	};

	return (
		<>
			<header className={style.main_header}>
				<Link href='/'>Generate SEO meta tags</Link>
				<Menu mode='horizontal' defaultSelectedKeys={[current]} items={items} className={style.main_nav} onClick={onClick} />
			</header>
		</>
	);
}
