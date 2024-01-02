describe("Login", () => {
  it("should successfully login", () => {
    cy.visit("http://localhost:3000/"); // Adjust the URL to match your login page

    // Fill in email and password fields
    cy.get("#email").type("ali@gmail.com");
    cy.get("#password").type("123456789");

    // Submit the form
    cy.get("form").submit();

    // Validate the navigation or any success messages after login
    cy.url().should("include", "/grid"); // Adjust this assertion based on your expected redirect URL
  });
});
