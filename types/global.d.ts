// Add OneSignal types to the global Window interface
interface Window {
  OneSignalDeferred?: ((OneSignal: any) => void)[]
  OneSignal?: {
    // Common methods for subdomain approach
    init: (options: any) => Promise<any>
    isPushNotificationsEnabled?: () => Promise<boolean>
    registerForPushNotifications?: () => void
    setSubscription?: (enabled: boolean) => void
    sendTag?: (key: string, value: string) => void
    getUserId?: () => Promise<string>
    getSubscription?: () => Promise<boolean>
  }
}

