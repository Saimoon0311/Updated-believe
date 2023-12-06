import Types from '../saga-types';

export const toggleControls = payload => ({
  type: Types.ControlToggel,
  payload,
});
