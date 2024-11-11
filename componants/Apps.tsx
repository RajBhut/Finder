import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {PhotoProvider} from './FileContex';
import CameraScreen from '../Screens/CameraScreen';
import Test from '../Screens/Test';

const stack = createNativeStackNavigator();

export default function Apps() {
  return (
    <PhotoProvider>
      <NavigationContainer>
        <stack.Navigator initialRouteName="Home">
          <stack.Screen name="Home" component={CameraScreen} />
          <stack.Screen name="Gallery" component={Test} />
        </stack.Navigator>
      </NavigationContainer>
    </PhotoProvider>
  );
}
