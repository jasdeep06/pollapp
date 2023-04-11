import { Image, StyleSheet, Text, View } from 'react-native';

import CustomText from './CustomText';
import React from 'react';

const IconWithBadge = ({ icon, unreadCount }) => (
  <View style={styles.iconContainer}>
    <Image source={icon} style={styles.icon} />
    {unreadCount > 0 && (
      <View style={styles.badge}>
        <CustomText style={styles.badgeText}>{unreadCount}</CustomText>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  iconContainer: {
    alignSelf: 'center',
  },
  icon: {
    height: 35,
    width: 35,
  },
  iconFocused: {
    opacity: 1,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default IconWithBadge;
