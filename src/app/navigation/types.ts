import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  CardList: undefined;
  CardDetails: { slug: string; name: string };
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
