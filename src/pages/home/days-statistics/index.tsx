import { useAsync } from "@codixjs/fetch"
import { PropsWithoutRef, useMemo } from "react"
import { getStatisticByDay, useBaseRequestConfigs } from "../../../service";
import { Line, LineConfig } from '@ant-design/plots';
import dayjs from 'dayjs';

export function DaysStatistic(props: PropsWithoutRef<{ day: number }>) {
  const configs = useBaseRequestConfigs();
  const { data } = useAsync('Statistic:day:' + props.day, () => getStatisticByDay(props.day, configs), [props.day]);
  const config = useMemo<LineConfig>(() => {
    const today = dayjs();
    const dates: string[] = Array(props.day);
    const values: number[] = Array(props.day).fill(0);
    const result: { date: string, total: number }[] = [];

    for (let i = 0; i < props.day; i++) {
      const _date = today.add(i * -1, 'day').format('YYYY-MM-DD');
      dates[props.day - i - 1] = _date;
      const index = data.findIndex(dat => dat.date === _date);
      if (index > -1) {
        const value = data[index].total;
        values[props.day - i - 1] = Number(value);
      }
    }

    for (let i = 0; i < dates.length; i++) {
      result.push({
        date: dates[i],
        total: values[i]
      })
    }

    return {
      data: result,
      xField: 'date',
      yField: 'total',
      smooth:true,
      meta: {
        total: {
          alias: '访问次数'
        }
      },
      point: {
        size: 5,
        shape: 'diamond',
        style: {
          fill: 'white',
          stroke: '#2593fc',
          lineWidth: 2,
        },
      },
      xAxis: {
        line: {
          style: {
            stroke: '#EBEEF5'
          }
        }
      },
      yAxis: {
        grid: {
          line: {
            style: {
              stroke: '#EBEEF5',
              lineDash: [4, 3],
            },
          },
        },
     },

    }
  }, [data])
  return <Line {...config} height={291} />
}