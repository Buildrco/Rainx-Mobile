import React,{createContext,useContext,useMemo,useState} from 'react';
import {useColorScheme} from 'react-native';
import {dark,light,ThemeMode} from './theme';
const C=createContext<any>(null);
export function ThemeProvider({children}:{children:React.ReactNode}){const system=useColorScheme(); const [mode,setMode]=useState<ThemeMode>('system'); const colors=mode==='dark'||(mode==='system'&&system==='dark')?dark:light; return <C.Provider value={{mode,setMode,colors,isDark:colors===dark}}>{children}</C.Provider>}
export const useTheme=()=>useContext(C);
