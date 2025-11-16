import {waitForElement} from "../utils/observer";
import {mhWidget} from "../utils/constants/custom-elements.constants";
import {isPageBackBtn} from "../utils/constants/common.constants";
import {Nullable} from "../models/common.model";
import {backBtnSelectors, burgerSelectors} from "../utils/constants/selectors.constants";

export async function updatePage(path: string): Promise<void> {
  try {
    const isBackBtn = isPageBackBtn[path];
    const haTargetEl: Nullable<HTMLElement> = await waitForElement(isBackBtn ? backBtnSelectors : burgerSelectors);

    document.body.insertAdjacentHTML('beforeend', mhWidget(isBackBtn));
    const proxyBtn = document.body.querySelector(isBackBtn ? '#mhBack' : '#mhBurger');
    proxyBtn?.addEventListener('click', () => haTargetEl?.click());

    const mhQuickLink = document.body.querySelector('#mhQuickLink');
    mhQuickLink?.addEventListener('click', () => window.location.href = '/lovelace');
  } catch (e) {
    console.error(e);
  }
}