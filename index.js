import { AppRegistry } from 'react-native';
import App from './App';
import { StackNavigator } from 'react-navigation';

const Nav =  StackNavigator({
  Home: {
    screen: App,
  },
},{headerMode : 'none'});
AppRegistry.registerComponent('ListMovie', () => Nav);
