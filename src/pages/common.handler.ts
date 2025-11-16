import {waitForElement} from "../utils/observer";
import {mhWidget} from "../utils/constants/custom-elements.constants";
import {showMenuBtn} from "../utils/constants/paths.constants";
import {Nullable} from "../models/common.model";
import {getBurgerVariants} from "../utils/helpers";

export async function updatePage(path: string): Promise<void> {
  try {
    const hasBurger = showMenuBtn[path];
    const haTargetEl: Nullable<HTMLElement> = hasBurger ? await waitForElement(getBurgerVariants) : null

    document.body.insertAdjacentHTML('beforeend', mhWidget(hasBurger));

    if (hasBurger) {
      const proxyBurger = document.body.querySelector('#mhBurger');
      proxyBurger?.addEventListener('click', () => haTargetEl?.click());
    }

    const mhQuickLink = document.body.querySelector('#mhQuickLink');
    mhQuickLink?.addEventListener('click', () => {
      history.pushState(null, "", "/lovelace");
      window.dispatchEvent(new Event("location-changed"));
    });

    setTimeout(() => {
      const mhWidgetEl = document.body.querySelector('#mhWidget') as HTMLElement;
      mhWidgetEl!.style.transform = 'scale(1)';
    }, 100);
  } catch (e) {
    console.error(e);
  }
}