import React from 'react';
import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu';
import { FiDroplet } from 'react-icons/fi';
import { MdAir } from 'react-icons/md';
import { ImMeter } from 'react-icons/im'

export interface WeatherDetailProps {
    visibility: string;
    humidity: string;
    windSpeed: string;
    airPressure: string;
    sunrise: string;
    sunset: string;
}

export default function WeatherDetails(props: WeatherDetailProps) {
    const {
        visibility = "25km",
        humidity = '61%',
        windSpeed = "7 km/h",
        airPressure = "1012 hPa",
        sunrise = "6.20",
        sunset = "18.48",
    } = props;
    return (
        <>
            <SingleWeatherDetail
                icon={<LuEye />}
                information={'visibility'}
                value={visibility}
            />
            <SingleWeatherDetail
                icon={<FiDroplet />}
                information={'humidity'}
                value={humidity}
            />
            <SingleWeatherDetail
                icon={<MdAir />}
                information={'windSpeed'}
                value={windSpeed}
            />
            <SingleWeatherDetail
                icon={<ImMeter />}
                information={'airPressure'}
                value={airPressure}
            />
            <SingleWeatherDetail
                icon={<LuSunrise />}
                information={'sunrise'}
                value={sunrise}
            />
            <SingleWeatherDetail
                icon={<LuSunset />}
                information={'sunset'}
                value={sunset}
            />
        </>
    )
}

export interface SingleWeatherDetailProps {
    information: string;
    icon: React.ReactNode;
    value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
    return (
        <div className='flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
            <p className='whitespace-nowrap'> {props.information} </p>
            <div className='text-3xl'> {props.icon} </div>
            <p> {props.value} </p>
        </div>
    );
}