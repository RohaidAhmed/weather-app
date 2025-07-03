'use client';

import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import axios from 'axios';
import { format, fromUnixTime, parseISO, set } from 'date-fns';
import Container from "@/components/Container";
import { convertKelvinToCelcius } from "@/utils/convertKelvintoCelcius";
import WeatherIcon from "@/components/WeatherIcon";
import { getDayOrNightIcons } from "@/utils/getDayOrNightIcons";
import WeatherDetails from "@/components/WeatherDetails";
import { metersToKilometers } from "@/utils/metersToKilometers";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import ForcastWeatherDetail from "@/components/ForcastWeatherDetail";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";


// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={NEXT_PUBLIC_WEATHER_KEY}

// https://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={API_key}

type WeatherData = {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastEntry[];
  city: CityInfo;
};

type ForecastEntry = {
  dt: number;
  main: MainWeather;
  weather: WeatherCondition[];
  clouds: { all: number };
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: { "3h": number };
  sys: { pod: string };
  dt_txt: string;
};

type MainWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
};

type WeatherCondition = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

type Wind = {
  speed: number;
  deg: number;
  gust: number;
};

type CityInfo = {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
};



export default function Home() {

  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity, _] = useAtom(loadingCityAtom)

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    {
      queryKey: ['repoData'],
      queryFn: async () => {
        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`);
        // const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`);
        return data;
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [place, refetch])

  const firstData = data?.list[0];

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isLoading) return (
    <div className="flex items-center min-h-screen justify-center">
      <p className="animate-bounce">Loading...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* today data */}
        {loadingCity ? (
          <WeatherSkeleton />
        ) : (
          <>
            <section className="space-y-4">
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl items-end">
                  <p> {format(parseISO(firstData?.dt_txt ?? ''), 'EEEE')} </p>
                  <p className="text-lg"> ({format(parseISO(firstData?.dt_txt ?? ''), "dd.MM.yyy")}) </p>
                </h2>
                <Container className="gap-10 px-6 items-center">
                  <div className="flex flex-col px-4">
                    <span className="text-5xl">
                      {convertKelvinToCelcius(firstData?.main.temp ?? -273)}°
                    </span>
                    <p className="text-xs space--1 whitespace-nowrap">
                      <span>Feels like</span>
                      <span>
                        {convertKelvinToCelcius(firstData?.main.feels_like ?? -273)}°
                      </span>
                    </p>
                    <p className="text-xs space-x-2">
                      <span>
                        {" "}
                        {convertKelvinToCelcius(firstData?.main.temp_min ?? -273)}
                        °↓{" "}
                      </span>
                      <span>
                        {" "}
                        {convertKelvinToCelcius(firstData?.main.temp_max ?? -273)}
                        °↑
                      </span>
                    </p>
                  </div>
                  {/* time and weather icon */}
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                    {data?.list.map((d, i) => (
                      <div
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                        key={i}
                      >
                        <p className="whitespace-nowrap">
                          {format(parseISO(d.dt_txt), 'h.mm a')}
                        </p>

                        <WeatherIcon iconname={getDayOrNightIcons(d.weather[0].icon, d.dt_txt)} />
                        <p>
                          {convertKelvinToCelcius(d?.main.temp ?? -273)}°
                        </p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className="flex gap-4">
                {/* left */}
                <Container className="w-fit justify-center flex-col px-4 items-center">
                  <p className="capitalize text-center"> {firstData?.weather[0].description} </p>
                  <WeatherIcon iconname={getDayOrNightIcons(firstData?.weather[0].icon ?? "",
                    firstData?.dt_txt ?? ""
                  )}
                  />
                </Container>
                <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
                  <WeatherDetails
                    visibility={metersToKilometers(firstData?.visibility ?? 10000)}
                    airPressure={`${firstData?.main.pressure}hPa`}
                    humidity={`${firstData?.main.humidity}%`}
                    windSpeed={convertWindSpeed(firstData?.wind.speed ?? 0)}
                    sunrise={
                      format(
                        fromUnixTime(data?.city.sunrise ?? 0),
                        'H:m'
                      )
                    }
                    sunset={
                      format(
                        fromUnixTime(data?.city.sunset ?? 0),
                        'H:m'
                      )
                    }
                  />
                </Container>
                {/* right */}
              </div>
            </section>

            {/* 7 day forcast data */}
            <section className="flex w-full flex-col gap-4">
              <p className="text-2xl">7 day forcast</p>
              {firstDataForEachDate.map((d, i) => (
                <ForcastWeatherDetail key={i}
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={d?.weather[0].icon ?? ''}
                  date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
                  day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
                  feels_like={d?.main.feels_like ?? -273}
                  temp={d?.main.temp ?? -273}
                  temp_max={d?.main.temp_max ?? -273}
                  temp_min={d?.main.temp_min ?? -273}
                  airPressure={`${d?.main.pressure}hPa`}
                  humidity={`${d?.main.humidity}%`}
                  sunrise={
                    format(
                      fromUnixTime(data?.city.sunrise ?? 0),
                      "H:mm"
                    )
                  }
                  sunset={
                    format(
                      fromUnixTime(data?.city.sunset ?? 0),
                      "H:mm"
                    )
                  }
                  visibility={`${metersToKilometers(d?.visibility ?? 10000)}`}
                  windSpeed={`${convertWindSpeed(d?.wind.speed ?? 10000)}`}
                />
              ))}
            </section>
          </>
        )}


      </main>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4 animate-pulse">
      {/* today data */}
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2 items-end">
            <div className="h-6 w-24 bg-gray-300 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>

          <div className="flex items-center gap-10 px-6">
            <div className="flex flex-col px-4 gap-2">
              <div className="h-12 w-16 bg-gray-300 rounded" />
              <div className="h-3 w-28 bg-gray-200 rounded" />
              <div className="h-3 w-28 bg-gray-200 rounded" />
            </div>

            {/* time and weather icons */}
            <div className="flex gap-4 sm:gap-6 overflow-x-auto w-full pr-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="h-3 w-10 bg-gray-200 rounded" />
                  <div className="h-8 w-8 bg-gray-300 rounded-full" />
                  <div className="h-3 w-6 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* bottom row: left + center containers */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-4 bg-gray-100 rounded-xl w-fit">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-10 w-10 bg-gray-300 rounded-full" />
          </div>

          <div className="flex gap-4 px-6 py-4 bg-gray-100 rounded-xl overflow-x-auto w-full">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 day forecast */}
      <section className="flex flex-col gap-4">
        <div className="h-6 w-40 bg-gray-300 rounded" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center px-4 py-3 bg-gray-100 rounded-xl"
          >
            <div className="flex flex-col gap-2">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
            <div className="flex gap-4 items-center">
              <div className="h-8 w-8 bg-gray-300 rounded-full" />
              <div className="h-3 w-10 bg-gray-200 rounded" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </section>
    </main>

  );
}
