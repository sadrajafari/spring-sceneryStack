// NOTE: brand.js needs to be the first import. This is because SceneryStack for sims needs a very specific loading
// order: init.ts => assert.ts => splash.ts => brand.ts => everything else (here)
import "./brand.js";

import { onReadyToLaunch, PhetMenu, Sim } from "scenerystack/sim";
import { Property, StringProperty } from "scenerystack/axon";
import { Tandem } from "scenerystack/tandem";
import { SimScreen } from "./screen-name/SimScreen.js";
import { MenuItem, openPopup } from "scenerystack";

onReadyToLaunch(() => {
  // The title, like most string-like things, is a StringProperty that can change to different values (e.g. for
  // different languages, see localeProperty from scenerystack/joist)
  const titleStringProperty = new StringProperty("PhysMath - Springs");

  const screens = [
    new SimScreen({ tandem: Tandem.ROOT.createTandem("simScreen") }),
  ];

  const sim = new Sim(titleStringProperty, screens);

  const adjustPhetMenuListener = () => {
    const popupNode = sim.topLayer.children[1]?.children[0];

    if (popupNode instanceof PhetMenu) {
      // Chose index 0, but can be inserted wherever
      popupNode.children[1].insertChild(
        0,
        new MenuItem(
          // Hide callback
          () => {
            popupNode.hide();
          },

          // String Property for the label
          new Property("PhysMath Website"), // Change to your desired label

          // Fire callback
          () => {
            openPopup("https://PhysMath.usu.edu"); // Replace with your actual URL
          },

          // present, and whether it should be hidden if links are not allowed
          true,
          true,
        ),
      );
      

      sim.topLayer.childrenChangedEmitter.removeListener(
        adjustPhetMenuListener,
      );
    }
  };
  sim.topLayer.childrenChangedEmitter.addListener(adjustPhetMenuListener);

  sim.start();
});
