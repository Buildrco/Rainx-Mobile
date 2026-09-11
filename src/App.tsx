import 'react-native-gesture-handler';
import React,{useEffect,useState}from'react';
import {ActivityIndicator,AppState,Image,StyleSheet,Text,View}from'react-native';
import {NavigationContainer,DefaultTheme as NavLight,DarkTheme as NavDark} from'@react-navigation/native';
import {createNativeStackNavigator} from'@react-navigation/native-stack';
import {createBottomTabNavigator} from'@react-navigation/bottom-tabs';
import {House,ChartLine,UsersThree,DotsThreeCircle} from'phosphor-react-native';
import {StatusBar} from'expo-status-bar';
import {ThemeProvider,useTheme} from'./theme/ThemeProvider';
import {supabase} from'./services/supabase';
import {securityConfig,clearUnlocked,wasUnlocked} from'./services/security';
import {registerPush} from'./services/notifications';
import AuthScreen from'./screens/AuthScreen';
import LockScreen from'./screens/LockScreen';
import HomeScreen from'./screens/HomeScreen';
import SpaceCoinsScreen from'./screens/SpaceCoinsScreen';
import TradeScreen from'./screens/TradeScreen';
import WalletScreen from'./screens/WalletScreen';
import CommunityScreen from'./screens/CommunityScreen';
import MoreScreen from'./screens/MoreScreen';
import {SecurityScreen,NotificationsScreen,SettingsScreen,ProfileScreen,CreatorScreen,RewardsScreen} from'./screens/UtilityScreens';
import {HistoryScreen,SignalsScreen,ReferralScreen,GamesScreen,ChatScreen} from'./screens/ExtraScreens';
import CreatorNative from './screens/CreatorNative';
const Stack=createNativeStackNavigator();const Tabs=createBottomTabNavigator();
function TabsApp({onSignOut}:any){const{colors,isDark}=useTheme();return <Tabs.Navigator screenOptions={({route})=>({headerShown:false,tabBarStyle:{height:72,paddingTop:8,paddingBottom:12,backgroundColor:colors.card,borderTopColor:colors.border},tabBarActiveTintColor:'#F4D35E',tabBarInactiveTintColor:colors.muted,tabBarLabelStyle:{fontSize:10,fontWeight:'800'},tabBarIcon:({color,size})=>{const I=route.name==='Home'?House:route.name==='Markets'?ChartLine:route.name==='Community'?UsersThree:DotsThreeCircle;return <I color={color} size={size} weight={route.name==='Home'?'fill':'regular'}/>}})}><Tabs.Screen name="Home" component={HomeScreen}/><Tabs.Screen name="Markets" component={SpaceCoinsScreen}/><Tabs.Screen name="Community" component={CommunityScreen}/><Tabs.Screen name="More" children={(p)=><MoreScreen {...p} onSignOut={onSignOut}/>} /></Tabs.Navigator>}
function AppContent(){const{colors,isDark}=useTheme();const[session,setSession]=useState<any>(null),[ready,setReady]=useState(false),[locked,setLocked]=useState(false);useEffect(()=>{let mounted=true;supabase.auth.getSession().then(async({data})=>{if(!mounted)return;setSession(data.session);if(data.session){const st=await securityConfig(data.session.user.id);setLocked(st.appLock && !(await wasUnlocked(data.session.user.id)));registerPush().catch(()=>{})}setReady(true)});const {data:l}=supabase.auth.onAuthStateChange(async(_e,s)=>{setSession(s);if(s){const st=await securityConfig(s.user.id);setLocked(st.appLock);registerPush().catch(()=>{})}else setLocked(false)});return()=>{mounted=false;l.subscription.unsubscribe()}},[]);useEffect(()=>{if(!session)return;const sub=AppState.addEventListener('change',async state=>{if(state==='active'){const st=await securityConfig(session.user.id);if(st.appLock){await clearUnlocked(session.user.id);setLocked(true)}}});return()=>sub.remove()},[session]);if(!ready)return <View style={[styles.boot,{backgroundColor:colors.bg}]}><Image source={require('../assets/rainx-logo-transparent.png')} style={styles.logo}/><ActivityIndicator color="#F4D35E"/><Text style={{color:colors.muted,marginTop:10,fontWeight:'700'}}>RAINX</Text></View>;if(!session)return <AuthScreen/>;if(locked)return <LockScreen userId={session.user.id} onUnlock={()=>setLocked(false)}/>;return <NavigationContainer theme={isDark?NavDark:NavLight}><Stack.Navigator screenOptions={{headerShown:false,animation:'slide_from_right',contentStyle:{backgroundColor:colors.bg}}}><Stack.Screen name="Main">{(p)=><TabsApp {...p} onSignOut={async()=>{await supabase.auth.signOut()}}/>}</Stack.Screen><Stack.Screen name="Trade" component={TradeScreen}/><Stack.Screen name="SpaceCoins" component={SpaceCoinsScreen}/><Stack.Screen name="Security" component={SecurityScreen}/><Stack.Screen name="Notifications" component={NotificationsScreen}/><Stack.Screen name="Settings" component={SettingsScreen}/><Stack.Screen name="Profile" component={ProfileScreen}/><Stack.Screen name="Creator" component={CreatorNative}/><Stack.Screen name="Rewards" component={RewardsScreen}/><Stack.Screen name="Wallet" component={WalletScreen}/><Stack.Screen name="History" component={HistoryScreen}/><Stack.Screen name="Signals" component={SignalsScreen}/><Stack.Screen name="Referrals" component={ReferralScreen}/><Stack.Screen name="Games" component={GamesScreen}/><Stack.Screen name="Chat" component={ChatScreen}/></Stack.Navigator></NavigationContainer>}
export default function App(){return <ThemeProvider><StatusBar style="auto"/><AppContent/></ThemeProvider>};const styles=StyleSheet.create({boot:{flex:1,alignItems:'center',justifyContent:'center'},logo:{width:68,height:68,resizeMode:'contain',marginBottom:18}});
