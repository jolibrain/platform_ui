let assert = require("assert");

Feature("ServiceCardList");

Scenario("display current training service", async I => {
  I.amOnPage("/#/training");
  I.waitForElement(".main-view");

  const [currentTrainingServices, archiveTrainingServices] = await within(
    ".main-view",
    async () => {
      const currentTrainingServices = await I.grabNumberOfVisibleElements(
        ".serviceList.current .card"
      );
      const archiveTrainingServices = await I.grabNumberOfVisibleElements(
        ".serviceList.archive .card"
      );

      return [currentTrainingServices, archiveTrainingServices];
    }
  );

  I.say("Current Training Services: " + currentTrainingServices);
  I.say("Archive Training Services: " + archiveTrainingServices);

  if (currentTrainingServices > 0) {
    within(".main-view", () => {
      I.see("Current Training Services");
    });

    within(".serviceList.current .card:first-child", async () => {
      const title = await I.grabTextFrom("h5.card-title .title");
      const mltype = await I.grabTextFrom("h5.card-title .badge-secondary");

      I.seeElement(".card-title");
      I.seeElement("h5.card-title .badge-secondary");

      // TODO what is wrong on this line ?
      I.seeElement("h5.card-title .badge-success");

      I.seeElement("p.card-text");

      I.seeElement("ul");

      I.see("Train Loss");
      I.see("Iterations");
      I.see("Time remaining");

      switch (mltype) {
        case "segmentation":
          I.see("Mean IOU");
          I.seeNumberOfElements("ul li", 4);
          break;
        case "detection":
          I.see("MAP");
          I.seeNumberOfElements("ul li", 4);
          break;
        case "ctc":
          I.see("Accuracy");
          I.seeNumberOfElements("ul li", 4);
          break;
        case "classification":
          I.see("Accuracy");
          I.see("F1");
          I.see("mcll");
          I.seeNumberOfElements("ul li", 6);
          break;
        case "regression":
          I.see("Eucll");
          I.seeNumberOfElements("ul li", 4);
          break;
      }

      I.see("Monitor", ".btn-outline-primary");

      const monitorUrl = await I.grabAttributeFrom(
        ".btn-outline-primary",
        "href"
      );
      const serviceMonitored = monitorUrl.split("/").pop();

      assert.equal(serviceMonitored, title);
    });
  } else {
    I.see("No training service running");
  }
});
