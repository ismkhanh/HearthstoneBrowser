import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export const Routes = {
  CardList: 'CardList',
  CardDetails: 'CardDetails',
} as const;

export type RootStackParamList = {
  [Routes.CardList]: undefined;
  [Routes.CardDetails]: { slug: string; name: string };
};

export type RootStackScreenProps<TRoute extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  TRoute
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
