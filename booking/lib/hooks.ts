import { useDispatch, useSelector, useStore } from "react-redux";

// Use throughout the app instead of plain 'useDispatch' and 'useSelector'
export const useAppDispatch = useDispatch
export const useAppSelector = useSelector
export const useAppStore = useStore
