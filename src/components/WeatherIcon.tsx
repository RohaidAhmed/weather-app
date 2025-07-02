import React from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';

type Props = {}

export default function WeatherIcon(props: React.HTMLProps<HTMLDivElement> & { iconname: string }) {
    return (
        <div title={props.iconname} {...props} className={cn('relative h-20 w-20')}>
            <Image
                src={`https://openweathermap.org/img/wn/${props.iconname}@4x.png`}
                width={100}
                height={100}
                alt='weather-icon'
                className='absolute h-full w-full'
            />
        </div>
    )
}