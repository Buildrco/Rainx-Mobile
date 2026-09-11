import {createClient} from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
export const SUPABASE_URL='https://fsndqkacfizulovhfldz.supabase.co';
export const SUPABASE_ANON_KEY='sb_publishable_iRh4f9MF6ZDg43cSrA7zNQ_uIpi1eg9';
export const supabase=createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{auth:{storage:{getItem:key=>SecureStore.getItemAsync(key),setItem:(key,value)=>SecureStore.setItemAsync(key,value),removeItem:key=>SecureStore.deleteItemAsync(key)},autoRefreshToken:true,persistSession:true,detectSessionInUrl:false}});
export async function verifyPin(pin:string){const {data,error}=await supabase.rpc('verify_my_pin',{p_pin:pin}); if(error) throw error; return !!data;}
export async function pinStatus(){const {data,error}=await supabase.rpc('get_my_pin_status'); if(error) return null; return data;}
export async function accountMetrics(accountId:string){const {data,error}=await supabase.rpc('space_coin_account_metrics',{p_account_id:accountId}); if(error) return null; return data;}
export async function trade(accountId:string,coinId:string,side:'buy'|'sell',quantity:number){const {data,error}=await supabase.rpc('execute_space_coin_trade',{p_account_id:accountId,p_coin_id:coinId,p_side:side,p_quantity:quantity}); if(error) throw error; return data;}
export async function closeTrade(tradeId:string,quantity:number){const {data,error}=await supabase.rpc('close_space_coin_trade',{p_trade_id:tradeId,p_quantity:quantity}); if(error) throw error; return data;}
