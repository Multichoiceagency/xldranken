// Global type definitions
interface Window {
  OneSignal?: {
    isPushNotificationsSupported: () => Promise<boolean>
    isPushNotificationsEnabled: () => Promise<boolean>
    registerForPushNotifications: () => Promise<void>
    showSlidedownPrompt: () => Promise<void>
    showNativePrompt: () => Promise<void>
    getNotificationPermission: () => Promise<string>
    getUserId: () => Promise<string | null>
    setExternalUserId: (id: string) => Promise<void>
    logout: () => Promise<void>
    [key: string]: any
  }
  OneSignalDeferred?: any[]
  oneSignalInitialized?: boolean
}
interface Document {
  webkitHidden?: boolean
  msHidden?: boolean
  mozHidden?: boolean
  hidden?: boolean
}