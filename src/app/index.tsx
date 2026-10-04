import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { APP_BRANDING, WELCOME_STEPS } from "@/constants/branding";
import { cn } from "@/lib/utils";

const lastStepIndex = WELCOME_STEPS.length - 1;

export default function HomeRoute() {
  const insets = useSafeAreaInsets();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const currentStep = WELCOME_STEPS[activeStepIndex] ?? WELCOME_STEPS[0];
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === lastStepIndex;

  function goToNextStep() {
    setActiveStepIndex((stepIndex) => Math.min(stepIndex + 1, lastStepIndex));
  }

  function goToPreviousStep() {
    setActiveStepIndex((stepIndex) => Math.max(stepIndex - 1, 0));
  }

  function skipToLastStep() {
    setActiveStepIndex(lastStepIndex);
  }

  return (
    <ScrollView
      className="flex-1 bg-primary"
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row justify-end px-6">
        {!isLastStep && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip welcome screens"
            className="min-h-11 min-w-16 items-center justify-center rounded-full px-4"
            onPress={skipToLastStep}
          >
            <Text className="text-sm font-semibold text-primary-foreground">
              Skip
            </Text>
          </Pressable>
        )}
      </View>

      <Animated.View
        key={currentStep.id}
        entering={FadeInDown.duration(260)}
        exiting={FadeOutUp.duration(160)}
        className="flex-1 items-center justify-center px-7 py-6"
      >
        <View className="relative mb-10 h-48 w-48 items-center justify-center rounded-full border-4 border-secondary bg-primary-foreground p-2">
          <Image
            source={require("../../assets/logo.png")}
            accessibilityLabel={APP_BRANDING.logoAccessibilityLabel}
            contentFit="contain"
            style={styles.logo}
          />
          <View
            accessibilityElementsHidden
            className="absolute right-2 top-5 h-4 w-4 rounded-full border-2 border-primary bg-secondary"
          />
        </View>

        <Text className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-primary-foreground/80">
          {currentStep.eyebrow}
        </Text>
        <Text className="max-w-sm text-center text-3xl font-bold leading-10 text-primary-foreground">
          {currentStep.title}
        </Text>
        <Text
          className="mt-4 max-w-xs text-center text-base leading-7 text-primary-foreground/90"
          accessibilityLanguage={
            currentStep.id === "identity" ? "ne-NP" : undefined
          }
        >
          {currentStep.description}
        </Text>
      </Animated.View>

      <View className="items-center px-6 pb-3">
        <View className="mb-5 flex-row items-center justify-center">
          {WELCOME_STEPS.map((step, index) => {
            const isActive = index === activeStepIndex;

            return (
              <Pressable
                key={step.id}
                accessibilityRole="button"
                accessibilityLabel={`Go to step ${index + 1}`}
                accessibilityState={{ selected: isActive }}
                className="min-h-11 min-w-11 items-center justify-center"
                onPress={() => setActiveStepIndex(index)}
              >
                <View
                  className={cn(
                    "h-2 rounded-full",
                    isActive
                      ? "w-7 bg-secondary"
                      : "w-2 bg-primary-foreground/50",
                  )}
                />
              </Pressable>
            );
          })}
        </View>

        <View className="w-full flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous welcome step"
            accessibilityState={{ disabled: isFirstStep }}
            className={cn(
              "min-h-12 min-w-28 items-center justify-center rounded-full border border-primary-foreground/40 px-5",
              isFirstStep && "opacity-40",
            )}
            disabled={isFirstStep}
            onPress={goToPreviousStep}
          >
            <Text className="text-sm font-semibold text-primary-foreground">
              Back
            </Text>
          </Pressable>

          {!isLastStep && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue to next welcome step"
              className="min-h-12 min-w-32 items-center justify-center rounded-full bg-secondary px-6"
              onPress={goToNextStep}
            >
              <Text className="text-sm font-bold text-secondary-foreground">
                Continue
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1 },
  logo: { width: 160, height: 160, borderRadius: 80 },
});
