import React, {useCallback} from 'react';
import {View, Text, FlatList} from 'react-native';
import {normal} from '../../Assets/lottie';
import SelectionHeader from '../../components/SelectionHeader';
import {keyExtractor} from '../../utils/helper';
import useSoundSelect from './useSoundSelect';
import ListCard from '../../components/ListCard';
import {styles} from './styles';
import Switch from '../../components/Switch';
import AnimatedBackground from '../../components/AnimatedBackground';
import EmptyComponent from '../../components/EmptyComponent';

const SoundSelect = ({navigation, route}) => {
  const {
    data,
    marked,
    setMarked,
    backFunction,
    active,
    toggle,
    onRefresh,
    ringTone,
  } = useSoundSelect(navigation, route);

  const renderItem = useCallback(
    ({item}) => <ListCard {...{item, marked, onPress: setMarked}} />,
    [marked, active],
  );

  return (
    <AnimatedBackground animation={normal}>
      <SelectionHeader {...{navigation, backButton: true, backFunction}} />
      <View style={styles.container}>
        <Text style={styles.title}>{data?.header}</Text>
        <View style={styles.switch}>
          <Switch
            {...{
              status: active,
              isDetails: false,
              setDisabled: toggle,
            }}
          />
        </View>
      </View>
      <View style={styles.subContainer}>
        <FlatList
          data={ringTone}
          // data={bellsData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{flexGrow: 1, paddingVertical: 10}}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyComponent
              title="Ooopss!"
              description="Ringtons"
              onRefresh={onRefresh}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.seperator} />}
        />
      </View>
    </AnimatedBackground>
  );
};

export default React.memo(SoundSelect);
