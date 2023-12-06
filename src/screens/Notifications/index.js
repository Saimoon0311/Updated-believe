import React, {useCallback} from 'react';
import {View, FlatList} from 'react-native';
import {normal} from '../../Assets/lottie';
import useNotifications from './useNotifications';
import PageHeading from '../../components/PageHeading';
import NotificationsCard from '../../components/NotificationsCard';
import {styles} from './styles';
import EmptyComponent from '../../components/EmptyComponent';
import {randomNanoIdGenerator} from '../../utils/helper';
import AnimatedBackground from '../../components/AnimatedBackground';

const Notifications = ({navigation, route}) => {
  const {data, onRefresh} = useNotifications({navigation, route});

  const renderItem = useCallback(
    ({item}) => <NotificationsCard {...{item, image: data?.image}} />,
    [data],
  );

  return (
    <AnimatedBackground animation={normal}>
      <PageHeading {...{title: data?.title, navigation, backButton: true}} />
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={randomNanoIdGenerator}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          onRefresh={onRefresh}
          refreshing={false}
          ListEmptyComponent={
            <EmptyComponent
              title="Ooopss!"
              fullScreen={true}
              description="Notifications"
              onRefresh={onRefresh}
            />
          }
        />
      </View>
    </AnimatedBackground>
  );
};

export default React.memo(Notifications);
