import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "@/components/Screen";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function SplashScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const scale = useSharedValue(0.92);
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.exp) });
    opacity.value = withTiming(1, { duration: 900 });

    const timer = setTimeout(() => {
      navigation.replace("MainTabs");
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigation, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }]
  }));

  return (
    <Screen>
      <View style={styles.container}>
        <Animated.Image
          source={require("../logo.png")}
          style={[styles.logo, animatedStyle]}
          resizeMode="contain"
        />
        <Animated.View style={[styles.copy, animatedStyle]}>
          <Text style={[styles.tagline, { color: colors.text }]}>Fresh headlines. Live coverage. Citizen voices.</Text>
        </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 20
  },
  copy: {
    alignItems: "center"
  },
  tagline: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 260
  }
});
