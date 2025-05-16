describe("template spec", () => {
  it("페이지에 접속해야 함.", () => {
    cy.visit("http://localhost:5173");
  });

  it("페이지 접속 시 기본 페이지와 input이 나타나야 함", () => {
    cy.visit("http://localhost:5173");
    cy.wait(1000);
    cy.get("h1").should("contain", "AI를 활용한 뇌출혈 예측");
    cy.get("input").should("have.attr", "type", "file");
  });
});
