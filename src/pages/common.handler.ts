import {waitForElement} from "../utils/observer";
import {mhWidget} from "../utils/constants/custom-elements.constants";
import {showMenuBtn} from "../utils/constants/paths.constants";
import {Nullable} from "../models/common.model";
import {getBurgerVariants} from "../utils/helpers";

export async function updatePage(path: string): Promise<void> {
  try {
    console.log('Starting...');
    const hasBurger = showMenuBtn[path];
    console.log(`Page hasBurger: ${hasBurger}`);
    const haTargetEl: Nullable<HTMLElement> = hasBurger ? await waitForElement(getBurgerVariants) : null

    console.log('Target burger element:', haTargetEl)
    document.body.insertAdjacentHTML('beforeend', mhWidget(hasBurger));
    console.log('Widget inserted.')

    if (hasBurger) {
      console.log('Add Burger event...');
      const proxyBurger = document.body.querySelector('#mhBurger');
      proxyBurger?.addEventListener('click', () => {
        console.log('Proxy burger clicked!');
        haTargetEl?.click();
      });
    }

    const mhQuickLink = document.body.querySelector('#mhQuickLink');
    mhQuickLink?.addEventListener('click', () => {
      history.pushState(null, "", "/lovelace");
      window.dispatchEvent(new Event("location-changed"));
    });
  } catch (e) {
    console.error(e);
  }
}