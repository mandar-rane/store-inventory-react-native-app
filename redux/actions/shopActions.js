import { SET_SHOP_DETAILS } from "../constants";

export function setShopDetails(item) {
  return {
    type: SET_SHOP_DETAILS,
    data: item,
  };
}
