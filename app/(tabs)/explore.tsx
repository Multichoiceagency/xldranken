import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  const dynamicTitle = 'Discover'; // Dynamische titel
  const description = 'This app is built with reusable components to help you scale easily.';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E0E0E0', dark: '#2E2F30' }}
      headerImage={
        <IconSymbol
          size={300}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{dynamicTitle}</ThemedText>
      </ThemedView>
      <ThemedText>{description}</ThemedText>
      
      <Collapsible title="File-based Routing">
        <ThemedText>
          This app uses file-based routing for pages such as{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more about routing</ThemedText>
        </ExternalLink>
      </Collapsible>
      
      <Collapsible title="Platform-Specific Features">
        <ThemedText>
          This app supports Android, iOS, and web. Use{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal to start the web
          version.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">ParallaxScrollView</ThemedText> component
              provides a parallax effect for iOS.
            </ThemedText>
          ),
        })}
      </Collapsible>
      
      <Collapsible title="Images">
        <ThemedText>
          This app supports static and dynamic images. Use the{' '}
          <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes for screen density.
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ alignSelf: 'center', height: 100, width: 100 }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more about images</ThemedText>
        </ExternalLink>
      </Collapsible>
      
      <Collapsible title="Dark Mode">
        <ThemedText>
          This template supports light and dark mode. Use the{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook to adjust the
          colors dynamically.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more about color themes</ThemedText>
        </ExternalLink>
      </Collapsible>
      
      <Collapsible title="Custom Animations">
        <ThemedText>
          Animations are handled using{' '}
          <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText>. Check out{' '}
          <ThemedText type="defaultSemiBold">HelloWave</ThemedText> for an animated example.
        </ThemedText>
        <ExternalLink href="https://docs.swmansion.com/react-native-reanimated/">
          <ThemedText type="link">Learn more about animations</ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
