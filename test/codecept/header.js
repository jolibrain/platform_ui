Feature("Header");

Scenario("@content header title-container", I => {
  I.amOnPage("/");

  within(".title-container", () => {
    I.seeElement("h1");
    I.see("DeepDetect", "h1");

    I.seeElement(".navbar-sub-nav");
    I.see("Predict", ".navbar-sub-nav li a");
    I.see("Training", ".navbar-sub-nav li a");
    I.see("Jupyter", ".navbar-sub-nav li a");
    I.see("Data", ".navbar-sub-nav li a");
  });
});

Scenario("@content header navbar", I => {
  I.amOnPage("/");

  within(".navbar-collapse", () => {
    I.seeElement(".nav-item.server");
    I.see("Documentation", ".nav-item a");
  });
});

Scenario("@content header dropdown", I => {
  I.amOnPage("/");

  within(".navbar-collapse li.nav-item.dropdown", () => {
    I.see("About", "a.dropdown-toggle");
    I.dontSeeElement(".dropdown-menu");

    within(".dropdown-menu", () => {
      I.see("Gitlab", "a.dropdown-item");
      I.see("DeepDetect", "a.dropdown-item");
      I.see("Jolibrain", "a.dropdown-item");
    });
  });
});

xScenario("@toggle header dropdown hide when clicking on dropdown title", I => {
  I.amOnPage("/");

  within(".navbar-collapse li.nav-item.dropdown", () => {
    I.dontSeeElement(".dropdown-menu");

    I.click("a.dropdown-toggle");
    I.seeElement(".dropdown-menu");

    I.click("a.dropdown-toggle");
    I.dontSeeElement(".dropdown-menu");
  });
});
