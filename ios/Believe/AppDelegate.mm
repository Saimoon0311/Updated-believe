#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTRootView.h>

#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import "RNSplashScreen.h"
#import <React/RCTLinkingManager.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "Orientation.h"
#import <RNBranch/RNBranch.h>
#import <AVFoundation/AVFoundation.h>
#import <FBAEMKit/FBAEMKit-Swift.h>
#import <UIKit/UIKit.h>
//#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>
#import <AuthenticationServices/AuthenticationServices.h>
#import <SafariServices/SafariServices.h>
#import <FBSDKCoreKit/FBSDKCoreKit-swift.h>




#if RCT_NEW_ARCH_ENABLED
#import <React/CoreModulesPlugins.h>
#import <React/RCTCxxBridgeDelegate.h>
#import <React/RCTFabricSurfaceHostingProxyRootView.h>
#import <React/RCTSurfacePresenter.h>
#import <React/RCTSurfacePresenterBridgeAdapter.h>
#import <ReactCommon/RCTTurboModuleManager.h>
#import <react/config/ReactNativeConfig.h>


@interface AppDelegate () <RCTCxxBridgeDelegate, RCTTurboModuleManagerDelegate> {
  RCTTurboModuleManager *_turboModuleManager;
  RCTSurfacePresenterBridgeAdapter *_bridgeAdapter;
  std::shared_ptr<const facebook::react::ReactNativeConfig> _reactNativeConfig;
  facebook::react::ContextContainer::Shared _contextContainer;
}
@end
#endif


@implementation AppDelegate
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window { return [Orientation getOrientation]; }
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [[FBSDKApplicationDelegate sharedInstance] application:application
                         didFinishLaunchingWithOptions:launchOptions];


  // Configure the audio session
   AVAudioSession *audioSession = [AVAudioSession sharedInstance];
   NSError *setCategoryError = nil;
   [audioSession setCategory:AVAudioSessionCategoryPlayback error:&setCategoryError];
   
   if (setCategoryError) {
       NSLog(@"Error setting category for audio session: %@", setCategoryError);
   }
  
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil];
  [FIRApp configure];
  
  self.moduleName = @"Believe";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
    // Uncomment this line to use the test key instead of the live one.
//    [RNBranch useTestInstance];
  NSURL *jsCodeLocation;
RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

    [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
//  [FBSDKApplicationDelegate.sharedInstance initializeSDK];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
//     return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  [RNBranch application:app openURL:url options:options];
  if ([RCTLinkingManager application:app openURL:url options:options]) {
    return YES;
  }
    return [[FBSDKApplicationDelegate sharedInstance] application:app openURL:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey] annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];

   
//  if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
//    return YES;
//  }



  return NO;
}
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
   [RNBranch continueUserActivity:userActivity];
   return YES;
}
 
//- (BOOL)application:(UIApplication *)app
//            openURL:(NSURL *)url
//            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
//{
//  return [[FBSDKApplicationDelegate sharedInstance]application:app
//                                                      openURL:url
//                                                      options:options];
//}

@end
