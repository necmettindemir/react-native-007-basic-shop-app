This is simple shop app with react native.

For authentication and storing data Google-firebase is used.
Hooks are used.
Redux is used deeply.

Steps:

1)
    #>expo init <prj-name>
      cd <prj-name>

    #> expo start

2) 
    #> yarn add redux react-redux 

    #> yarn add react-navigation 
    #> yarn add react-navigation-header-buttons@6
    
    #> yarn add react-native-gesture-handler 
    #> yarn add react-native-reanimated

    #> yarn add react-navigation-stack
    #> yarn add react-navigation-drawer
    #> yarn add react-navigation-tabs
    #> yarn add expo-app-loading
    #> yarn add expo-font 
    #> yarn add @expo/vector-icons
    #> yarn add react-navigation/native

    #> yarn add redux-devtools-extension

    #> yarn add @react-native-community/masked-view
    #> yarn add react-native-screens

    #> yarn add moment

3) For form validation valideteJS or formik could be used
 
4) 
   #> yarn add redux-thunk

   #> cancelled--yarn add @react-native-community/async-storage
      expo install @react-native-async-storage/async-storage

5) #> yarn add expo-linear-gradient

6) Authentication

   console.firebase.google.com/...

   Athentication > Sign in method > Email/pass
   (Now user can be created in firebase by firebase API)

   Send request to firebase UserAPI
   https://firebase.google.com/docs/reference/rest/auth
   https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
   https://firebase.google.com/docs/reference/rest/auth#section-create-email-password


7) in firebase > RealTime Db > Rules

    {
      "rules": {
        ".read": true,
        ".write": "auth != null"
      }
    }


8) Have a look at the link for firebase REST API usage with user token and API key
