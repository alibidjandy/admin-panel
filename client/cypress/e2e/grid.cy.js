describe("Grid Component Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/"); // Adjust the URL to match your login page

    // Fill in email and password fields
    cy.get("#email").type("ali@gmail.com");
    cy.get("#password").type("123456789");

    // Submit the form
    cy.get("form").submit();

    // Validate the navigation or any success messages after login
    cy.url().should("include", "/grid").wait(3000); // Adjust this assertion based on your expected redirect URL
  });

  it("should successfully create a new shop", () => {
    cy.get("#create-new-shop").click();
    cy.get('input[name="id"]').type("654");
    cy.get('input[name="shopName"]').type("Cypress");
    cy.get('input[name="name"]').type("E2E");
    cy.get('input[name="price"]').type(123);
    cy.get('input[name="quantity"]').type(456);

    cy.contains("button", "Save").click();
  });
});
