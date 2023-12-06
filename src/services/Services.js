import TrackPlayer from 'react-native-track-player';
import {number} from 'yup';

/** The code is exporting an asynchronous function that sets up event listeners for remote control
actions on a media player using the TrackPlayer library. **/
module.exports = async function () {
  TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
  TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
  TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.reset());
  TrackPlayer.addEventListener('remote-jump-forward', async ({interval}) => {
    const position = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(position);
  });
  TrackPlayer.addEventListener('remote-jump-backward', async ({interval}) => {
    const position = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(position);
  });
};
