import React, {useState} from 'react';
import {View, Text, StyleSheet, processColor, Platform} from 'react-native';
import {BarChart} from 'react-native-charts-wrapper';
import {Colors, FontFamily} from '../../theme/Variables';
import {widthPercentageToDP} from 'react-native-responsive-screen';

const WHITE = processColor(Colors.blurWhite);
const GREEN = processColor(Colors.graphBlue);
const DARKGREEN = processColor(Colors.darkGreen);
let format1 = n => `${(n / 60) ^ 0}Hr ${n % 60}Min`;
/**
 * The ChartStats function is a React component that displays a bar chart with statistics data,
 * including total time and daily values, and formats the data for the chart.
 * @returns The code is returning a React component that renders a chart with statistics. The component
 * takes two props, `total_minutes` and `stats`. It uses these props to calculate and display the total
 * time and a bar chart representing the statistics.
 **/
const ChartStats = ({total_minutes, stats}) => {
  const [barTimeMins, setBarTimeMins] = useState(0);
  var values =
    stats == undefined ? [] : stats?.map(obj => ({y: obj.duration / 3600}));
  // : stats?.map(obj => ({y: Math.floor(obj.duration / 1440)}));
  // : stats?.map(obj => ({y: Math.floor(obj.duration)}));
  console.log('aaa123', values);

  // --------------

  /* The code `dataPoint => ({ y: dataPoint.y * 60 })` is a function that takes a data point as input
  and returns an object with a modified `y` value. In this case, it multiplies the `y` value of each
  data point by 60. This is done to convert the `y` values from hours to minutes. */
  values = values.map(dataPoint => ({
    y: dataPoint.y * 60,
  }));

  console.log('testss', values);

  // find max value

  let max_value = Number.NEGATIVE_INFINITY;

  /* The `for...of` loop is iterating over each item in the `values` array. It assigns each item to the
  variable `item` and executes the code block inside the loop for each item. */
  for (const item of values) {
    if ('y' in item) {
      max_value = Math.max(max_value, item.y);
      console.log(1 + 1, max_value);
    }
  }

  const max_value_rounded = max_value.toFixed(2);

  // --------------

  /* The `data` object is used to configure the data for the BarChart component. */
  const data = {
    dataSets: [
      {
        values,
        label: 'Zero line dataset',
        config: {
          colors: [GREEN],
          drawValues: false,
        },
      },
    ],
    config: {
      barWidth: 0.25,
    },
  };
  console.log('stats', stats, data.dataSets[0].values);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>Total Time</Text>
        <Text style={styles.title}>{format1(total_minutes)}</Text>
      </View>
      <Text style={styles.hr}>(mins)</Text>
      <BarChart
        data={data}
        style={styles.chart}
        drawValueAboveBar={true}
        chartDescription={{text: ''}}
        xAxis={{
          enabled: false,
          drawLabels: false,
        }}
        // xAxis={{
        //   enabled: true,
        //   drawLabels: true,
        //   axisLineWidth: 2,
        //   drawAxisLines: true,
        //   axisLineColor: DARKGREEN,
        //   centerAxisLabels: true,
        //   enabled: false,
        // }}
        yAxis={{
          left: {
            // valueFormatter: max_value_rounded + ' hr',
            labelCount: 6,
            yOffset: 1,
            drawLabels: true,
            drawAxisLine: true,
            drawGridLines: false,
            axisMaximum: max_value_rounded,
            axisMinimum: 0,
            // valueFormatter: max_value_rounded,
            axisLineWidth: 1.5,
            labelCountForce: true,
            axisLineColor: DARKGREEN,
            fontFamily: FontFamily.medium,
            position: 'OUTSIDE_CHART',
            textSize: 10,
            textColor: WHITE,
            zeroLine: {
              enabled: true,
              lineWidth: 1.5,
              lineColor: DARKGREEN,
            },
          },
          right: {
            enabled: false,
          },
        }}
        pinchZoom={false}
        scaleYEnabled={false}
        doubleTapToZoomEnabled={false}
        animation={{
          durationX: 1000,
          durationY: 1000,
          easingX: 'EaseOutBounce',
          easingY: 'EaseOutBounce',
        }}
        highlightPerTapEnabled={false}
        highlightFullBarEnabled={false}
        highlightPerDragEnabled={false}
        legend={{enabled: false}}
      />

      <View style={styles.line} />
      <View style={styles.xAxisLabel}>
        {stats?.map((obj, ind) => (
          <Text key={ind} style={styles.day}>
            {obj?.day}
            {/* {/ {moment(obj?.date).format('dddd')} /}
            {/ {moment(obj?.date).format('ddd').substring(0, 3)} /} */}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default React.memo(ChartStats);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.transparent,
    paddingBottom: 90,
  },
  chart: {
    height: 200,
    // height: '35%',
    width: '95%',
  },
  button: {
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.fadedGray,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,
    color: Colors.black,
  },
  row: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  title: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: FontFamily.medium,
  },
  line: {
    // borderTopWidth: 2,
    // borderTopColor: Colors.darkGreen,
    width: '85%',
    marginTop: -14,
  },
  xAxisLabel: {
    width: '74%',
    paddingTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.blurWhite,
    textTransform: 'uppercase',
    fontFamily: FontFamily.medium,
    paddingRight:
      Platform.OS == 'ios'
        ? widthPercentageToDP('4.8')
        : widthPercentageToDP('5.2'),
  },
  hr: {
    textAlign: 'left',
    color: Colors.blurWhite,
    alignSelf: 'flex-start',
    marginLeft: 1,
    fontFamily: FontFamily.medium,
    textColor: WHITE,
    fontSize: 12,
  },
});
