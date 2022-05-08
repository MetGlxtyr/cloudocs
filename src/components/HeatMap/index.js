import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import moment from 'moment';

export default function HeatMap({ style, data }) {
  const nodeRef = useRef(null)

  function echartInit(node, data) {
    const myChart = echarts.init(node)
    const year = new Date().getFullYear();
    const map = new Map();
    data.forEach(doc => {
      const ctime = moment(doc.created * 1000).format('yyyy-MM-DD');
      if (map.has(ctime)) {
        map.set(ctime, map.get(ctime) + 1);
      } else {
        map.set(ctime, 1);
      }
    });
    const docCount = [ ...map ];

    const option = {
      title: {
        top: 30,
        left: 'center',
        text: `${ year }年发布的文章`
      },
      tooltip: {},
      visualMap: {
        min: 0,
        max: 25,
        type: 'piecewise',
        orient: 'horizontal',
        inRange: {
          color: [ '#bae7ff', '#1890ff', '#003a8c' ],
          symbolSize: [ 0, 25, Infinity ]
        },
        left: 'center',
        top: 65,
        pieces: [
          { min: 15 },
          { min: 10, max: 15 },
          { min: 5, max: 10 },
          { min: 2, max: 5 },
          { max: 2 }
        ]
      },
      calendar: {
        top: 120,
        left: 30,
        right: 30,
        range: year,
        itemStyle: {
          borderWidth: 0.5
        },
        yearLabel: { show: false }
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: docCount
      }
    };

    myChart.setOption(option);
    window.onresize = function () {
      myChart.resize();
    };
  }
  useEffect(() => {
    echartInit(nodeRef.current, data);
  }, [ data ])

  return (
    <div ref={nodeRef} style={style}></div>
  )
}

