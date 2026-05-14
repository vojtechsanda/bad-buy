'use client';
import { createActionsheet } from '@gluestack-ui/core/actionsheet/creator';
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/core/icon/creator';
import { AnimatePresence, Motion } from '@legendapp/motion';
import { cssInterop } from 'nativewind';
import React from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  SectionList,
  Text,
  View,
  VirtualizedList,
} from 'react-native';

cssInterop(PrimitiveIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: 'classNameColor',
      stroke: true,
    },
  },
});

const UIActionsheet = createActionsheet({
  Root: View,
  Backdrop: Pressable,
  Item: Pressable,
  ItemText: Text,
  DragIndicator: View,
  IndicatorWrapper: View,
  Content: Motion.View,
  ScrollView,
  VirtualizedList: VirtualizedList as React.ComponentType<unknown>,
  FlatList: FlatList as React.ComponentType<unknown>,
  SectionList: SectionList as React.ComponentType<unknown>,
  SectionHeaderText: Text,
  Icon: UIIcon,
  AnimatePresence,
});

export { UIActionsheet };
