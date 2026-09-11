import * as SecureStore from 'expo-secure-store';import * as LocalAuthentication from 'expo-local-authentication';import {supabase} from './supabase';
const unlockKey=(id:string)=>`rainx_native_unlocked_${id}`;
export async function securityConfig(userId:string){const [{data:pin}, {data:settings}]=await Promise.all([supabase.rpc('get_my_pin_status'),supabase.from('account_settings').select('security_prefs').eq('user_id',userId).maybeSingle()]);const prefs=settings?.security_prefs||{};return {pinEnabled:!!pin?.pin_exists,pinLength:Number(pin?.pin_length)||4,appLock:prefs.appLock===true||prefs.app_lock===true,biometricEnabled:prefs.biometricEnabled===true||prefs.biometric_enabled===true};}
export async function verifyExistingPin(pin:string){const {data,error}=await supabase.rpc('verify_my_pin',{p_pin:pin});if(error)throw error;return !!data;}
export async function markUnlocked(id:string){await SecureStore.setItemAsync(unlockKey(id),'1');}
export async function clearUnlocked(id:string){await SecureStore.deleteItemAsync(unlockKey(id));}
export async function wasUnlocked(id:string){return (await SecureStore.getItemAsync(unlockKey(id)))==='1';}
export async function biometricUnlock(){const has=await LocalAuthentication.hasHardwareAsync();const enrolled=await LocalAuthentication.isEnrolledAsync();if(!has||!enrolled)return false;const r=await LocalAuthentication.authenticateAsync({promptMessage:'Unlock RainX',cancelLabel:'Use PIN',disableDeviceFallback:true});return r.success;}
