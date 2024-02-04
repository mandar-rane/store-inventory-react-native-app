import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../redux/store/store";

const RootLayout = () => {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false, statusBarHidden: true }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="otpScreen" />
        <Stack.Screen name="ordersScreen" />
        <Stack.Screen name="orderDetails" />
        <Stack.Screen name="productDetail" />
        <Stack.Screen name="productScreen" />
        <Stack.Screen name="addProductScreen" />
        <Stack.Screen name="shopDetailsScreen" />
        <Stack.Screen name="updateShopScreen" />
        <Stack.Screen name="updateLocationScreen" />
        
        
      </Stack>
    </Provider>
  );
};

export default RootLayout;
