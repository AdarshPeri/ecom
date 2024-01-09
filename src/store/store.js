import {
  compose,
  legacy_createStore as createStore,
  applyMiddleware,
} from 'redux';
import logger from 'redux-logger';
import { rootReducer } from './root-reducer';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const middleWares = [logger];

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['user']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const composedEnhancer = compose(applyMiddleware(...middleWares));

export const store = createStore(persistedReducer, undefined, composedEnhancer);

export const persistor = persistStore(store);