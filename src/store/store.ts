import {
  compose,
  legacy_createStore as createStore,
  applyMiddleware,
} from 'redux';
import { rootReducer } from './root-reducer';
import storage from 'redux-persist/lib/storage';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './root-saga';

export type RootState = ReturnType<typeof rootReducer>

type ExtendedPersistConfig = PersistConfig<RootState> & {
  whitelist: (keyof RootState)[];
}

const persistConfig: ExtendedPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'],
};

const sagaMiddleware = createSagaMiddleware();

const middleWares = [sagaMiddleware];

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composedEnhancer = compose(applyMiddleware(...middleWares));

export const store = createStore(persistedReducer, undefined, composedEnhancer);

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
