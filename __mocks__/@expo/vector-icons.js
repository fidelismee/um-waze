const React = require('react');

const createIconSet = () => {
  const Icon = (props) => React.createElement('Text', props, props.name || '');
  Icon.displayName = 'Icon';
  return Icon;
};

const createIconSetFromIcoMoon = createIconSet;
const createIconSetFromFontello = createIconSet;
const createIconSetFromFontAwesome = createIconSet;

module.exports = {
  Ionicons: createIconSet(),
  MaterialIcons: createIconSet(),
  MaterialCommunityIcons: createIconSet(),
  FontAwesome: createIconSet(),
  FontAwesome5: createIconSet(),
  createIconSet,
  createIconSetFromIcoMoon,
  createIconSetFromFontello,
  createIconSetFromFontAwesome,
};
