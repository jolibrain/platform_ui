Feature("Home page");

Scenario("@content MainView title and description", async I => {
  const configReq = await I.sendGetRequest("/config.json");
  const config = JSON.parse(configReq.raw_body);

  I.amOnPage("/");
  I.waitForElement(".main-view");

  within(".main-view", () => {
    I.see(config.homeComponent.title);
    I.see(config.homeComponent.description);
  });
});

Scenario("@content MainView Predict Home link", I => {
  I.amOnPage("/");
  I.waitForElement(".main-view");

  within(".main-view", () => {
    I.see("Add Available Service", ".btn.btn-primary");

    I.click("Add Available Service");
    I.seeInCurrentUrl("/#/predict");
  });
});

Scenario("@content MainView Predict New link", I => {
  I.amOnPage("/");
  I.waitForElement(".main-view");

  within(".main-view", () => {
    I.see("New Service", ".btn.btn-outline-primary");

    I.click("New Service");
    I.seeInCurrentUrl("/#/predict/new");
  });
});

Scenario("@content @dynamic Left sidebar serviceList", I => {
  I.amOnPage("/");
  I.waitForElement(".left-sidebar");

  within(".left-sidebar", () => {
    I.seeElement(".serviceList");
  });
});
