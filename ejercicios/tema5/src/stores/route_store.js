import { Store } from 'flux/utils';
import Dispatcher from '../app_dispatcher';
import history from '../lib/history';

import { PAGE_SET, CART_ADD, ORDER_SAVE, LOGIN } from '../action_types';
import CartStore from './cart_store';
import OrderStore from './order_store';
import SessionStore from './session_store';

const cartStoreToken = CartStore.getDispatchToken();
const orderStoreToken = OrderStore.getDispatchToken();
const sessionStoreToken = SessionStore.getDispatchToken();

var __page = 'catalog';

function changePage(newPage){
  __page = newPage;
  history.push(newPage);
}


class RouteStore extends Store {
  getCurrentPage(){
    return __page;
  }

  __onDispatch(action){
    var dispatcher = this.getDispatcher();

    switch(action.type){
      case PAGE_SET:
        changePage(action.page);
        this.__emitChange();
        break;

      case CART_ADD:
        //wait until CartStore has added the product
        dispatcher.waitFor([cartStoreToken]);
        changePage('/cart');
        this.__emitChange();
        break;

      case ORDER_SAVE:
        dispatcher.waitFor([orderStoreToken]);
        changePage('/thankyou');
        this.__emitChange();
        break;

      case LOGIN:
        dispatcher.waitFor([sessionStoreToken]);
        //changePage(action.returnPath);
        history.replace(action.returnPath);
        //this.__emitChange();
        break;

      default:
        return;
    }
  }
}

export default new RouteStore(Dispatcher);