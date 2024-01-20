import {SET_SHOP_DETAILS} from '../constants';


const initialShopState = {};

export const shopReducer = (state= initialShopState, action) =>{

    switch(action.type){
        case SET_SHOP_DETAILS:
            return {
                ...state,
                shopDetails: action.data
            }
            default:
                return state
    }

}

